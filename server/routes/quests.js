const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

function normalizePublicSlots(value) {
  const slots = parseInt(value, 10) || 0;
  return Math.max(0, Math.min(slots, 4));
}

function normalizeFriendIds(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(Boolean).map(String))];
}

function calculateQuestXpParts(totalXp) {
  const total = Math.max(0, Number(totalXp) || 0);
  return {
    total_xp: total,
    immediate_xp: Number((total * 0.2).toFixed(4)),
    friend_xp: Number((total * 0.4).toFixed(4)),
    public_xp: Number((total * 0.4).toFixed(4)),
    fallback_xp: Number((total * 0.15).toFixed(4))
  };
}

async function attachOwnerNames(validations) {
  if (!validations.length) return [];
  const ownerIds = [...new Set(validations.map(item => item.owner_user_id))];
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('user_id, username')
    .in('user_id', ownerIds);
  const names = new Map((profiles || []).map(profile => [profile.user_id, profile.username]));
  return validations.map(item => ({
    ...item,
    owner_username: names.get(item.owner_user_id) || 'Joueur'
  }));
}

async function getVotesForUser(userId) {
  const { data, error } = await supabaseAdmin
    .from('quest_validation_votes')
    .select('validation_id')
    .eq('voter_user_id', userId);

  if (error) throw error;
  return new Set((data || []).map(vote => vote.validation_id));
}

router.post('/validations', async (req, res) => {
  const quests = Array.isArray(req.body.quests) ? req.body.quests : [];
  const friendValidatorIds = normalizeFriendIds(req.body.friend_validator_ids);
  const requestedPublicSlots = normalizePublicSlots(req.body.public_slots);
  const publicSlots = friendValidatorIds.length > 0 ? 0 : Math.max(1, requestedPublicSlots || 1);

  if (!quests.length) {
    return res.status(400).json({ error: 'Aucune quete a valider' });
  }

  const rows = quests
    .filter(quest => quest && quest.id && quest.text)
    .map((quest) => {
      const xpParts = calculateQuestXpParts(quest.total_xp || 5);
      return {
        owner_user_id: req.user.id,
        quest_id: String(quest.id),
        quest_text: String(quest.text).slice(0, 500),
        ...xpParts,
        public_slots: publicSlots,
        friend_validator_ids: friendValidatorIds,
        moderator_required: friendValidatorIds.length === 0,
        friend_status: friendValidatorIds.length ? 'pending' : 'none',
        public_status: publicSlots > 0 ? 'pending' : 'none',
        moderator_status: friendValidatorIds.length === 0 ? 'pending' : 'none',
        xp_awarded: xpParts.immediate_xp
      };
    });

  if (!rows.length) {
    return res.status(400).json({ error: 'Quetes invalides' });
  }

  const { data, error } = await supabaseAdmin
    .from('quest_validations')
    .insert(rows)
    .select('*');

  if (error) return res.status(500).json({ error: error.message });

  const immediateXp = data.reduce((sum, validation) => sum + Number(validation.immediate_xp || 0), 0);
  res.json({
    validations: data,
    immediate_xp: Number(immediateXp.toFixed(4))
  });
});

router.get('/friends', async (req, res) => {
  try {
    const votedIds = await getVotesForUser(req.user.id);
    const { data, error } = await supabaseAdmin
      .from('quest_validations')
      .select('*')
      .eq('status', 'pending')
      .eq('friend_status', 'pending')
      .contains('friend_validator_ids', [req.user.id])
      .neq('owner_user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ error: error.message });
    const items = (data || []).filter(item => !votedIds.has(item.id));
    res.json(await attachOwnerNames(items));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/public', async (req, res) => {
  try {
    const votedIds = await getVotesForUser(req.user.id);
    const { data, error } = await supabaseAdmin
      .from('quest_validations')
      .select('*')
      .eq('status', 'pending')
      .eq('public_status', 'pending')
      .gt('public_slots', 0)
      .neq('owner_user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ error: error.message });
    const items = (data || [])
      .filter(item => !votedIds.has(item.id))
      .filter(item => !Array.isArray(item.friend_validator_ids) || item.friend_validator_ids.length === 0);
    res.json(await attachOwnerNames(items));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/validations/:id/vote', async (req, res) => {
  const validationId = req.params.id;
  const scope = String(req.body.vote_scope || '');
  const value = req.body.vote_value === true;

  if (!['friend', 'public'].includes(scope)) {
    return res.status(400).json({ error: 'Type de vote invalide' });
  }

  const { data: validation, error: validationError } = await supabaseAdmin
    .from('quest_validations')
    .select('*')
    .eq('id', validationId)
    .eq('status', 'pending')
    .single();

  if (validationError || !validation) return res.status(404).json({ error: 'Quete introuvable' });
  if (validation.owner_user_id === req.user.id) return res.status(400).json({ error: 'Impossible de voter pour sa propre quete' });

  if (scope === 'friend') {
    const friendIds = Array.isArray(validation.friend_validator_ids) ? validation.friend_validator_ids : [];
    if (!friendIds.includes(req.user.id)) return res.status(403).json({ error: 'Vote ami non autorise' });
  }

  if (scope === 'public') {
    const friendIds = Array.isArray(validation.friend_validator_ids) ? validation.friend_validator_ids : [];
    if (friendIds.length > 0 || Number(validation.public_slots || 0) <= 0) {
      return res.status(403).json({ error: 'Vote public non autorise' });
    }
  }

  const { data: vote, error: voteError } = await supabaseAdmin
    .from('quest_validation_votes')
    .insert({
      validation_id: validationId,
      voter_user_id: req.user.id,
      vote_scope: scope,
      vote_value: value,
      vote_weight: 1
    })
    .select('*')
    .single();

  if (voteError) return res.status(500).json({ error: voteError.message });

  const { data: votes } = await supabaseAdmin
    .from('quest_validation_votes')
    .select('vote_value, vote_scope')
    .eq('validation_id', validationId)
    .eq('vote_scope', scope);

  const yes = (votes || []).filter(item => item.vote_value).length;
  const no = (votes || []).filter(item => !item.vote_value).length;
  const updates = {};

  if (scope === 'friend') {
    const needed = (validation.friend_validator_ids || []).length;
    if (yes + no >= needed) {
      updates.friend_status = yes > no ? 'accepted' : 'rejected';
    }
  }

  if (scope === 'public') {
    const needed = Number(validation.public_slots || 0);
    if (yes + no >= needed) {
      updates.public_status = yes > no ? 'accepted' : 'rejected';
    }
  }

  if (Object.keys(updates).length) {
    await supabaseAdmin
      .from('quest_validations')
      .update(updates)
      .eq('id', validationId);
  }

  res.json({ vote, tally: { yes, no }, updates });
});

module.exports = router;

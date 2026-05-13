const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

const FRIEND_UNLOCK_DELAY_MS = 48 * 60 * 60 * 1000;
const AUTO_CLOSE_DELAY_MS = 7 * 24 * 60 * 60 * 1000;
const MODERATOR_ACTIVE_DELAY_MS = 14 * 24 * 60 * 60 * 1000;
const MODERATOR_MIN_REPUTATION = 75;
const MODERATOR_MIN_ACTIONS = 5;
const MODERATOR_LEVEL_BELOW = 2;
const MODERATOR_LEVEL_ABOVE = 4;

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

function getReputationScore(reputation = {}) {
  if (!reputation || typeof reputation !== 'object') return 0;
  const judgeTotal = Number(reputation.judge_total || 0);
  if (judgeTotal <= 0) return 0;
  return Number(reputation.judge_score ?? reputation.score ?? 0) || 0;
}

function getReputationActionCount(reputation = {}) {
  if (!reputation || typeof reputation !== 'object') return 0;
  return Number(reputation.judge_total || 0);
}

function getXpToNextLevel(currentLevel) {
  return 100 + (currentLevel - 1) * 50;
}

function getPetXpNeeded(currentLevel) {
  return Math.floor(60 + currentLevel * 25 + currentLevel * currentLevel * 3);
}

function getHpXpMultiplier(hp) {
  const currentHP = parseInt(hp, 10) || 0;
  if (currentHP >= 80) return 1.1;
  if (currentHP <= 20) return 0.9;
  return 1;
}

function getPublicPercentShares(slots) {
  const count = Math.max(1, Math.min(parseInt(slots, 10) || 1, 4));
  const base = Math.floor(40 / count);
  const remainder = 40 - base * count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

function calculatePublicAwardXP(validation, publicVotes) {
  const shares = getPublicPercentShares(validation.public_slots);
  const totalXp = Number(validation.total_xp || 0);
  const percent = publicVotes
    .slice(0, shares.length)
    .reduce((sum, vote, index) => sum + (vote.vote_value ? shares[index] : 0), 0);
  return Number(((totalXp * percent) / 100).toFixed(4));
}

async function awardQuestXpToOwner(validation, amount) {
  const baseAmount = Math.max(0, Number(amount) || 0);
  if (!baseAmount) return null;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('xp, xp_buffer, level, hp, pets, equipped_pet, total_quest_xp')
    .eq('user_id', validation.owner_user_id)
    .single();

  if (profileError) throw profileError;

  const multiplier = getHpXpMultiplier(profile.hp);
  const modifiedAmount = Number((baseAmount * multiplier).toFixed(4));
  const pets = Array.isArray(profile.pets) ? profile.pets : [];
  const pet = pets.find(item => item && item.id === profile.equipped_pet && item.active !== false);
  const share = pet ? Math.max(0, Math.min(Number(pet.share || 0.1), 1)) : 0;
  const playerAmount = modifiedAmount * (1 - share);
  const totalBuffered = (parseFloat(profile.xp_buffer) || 0) + playerAmount;
  let xp = (parseInt(profile.xp, 10) || 0) + Math.floor(totalBuffered);
  const xpBuffer = Number((totalBuffered - Math.floor(totalBuffered)).toFixed(4));
  let level = parseInt(profile.level, 10) || 1;
  let xpNeeded = getXpToNextLevel(level);

  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    level += 1;
    xpNeeded = getXpToNextLevel(level);
  }

  if (pet) {
    pet.xp = (parseInt(pet.xp, 10) || 0) + Math.floor(modifiedAmount * share);
    pet.level = parseInt(pet.level, 10) || 1;
    let petNeeded = getPetXpNeeded(pet.level);
    while (pet.xp >= petNeeded && pet.level < 50) {
      pet.xp -= petNeeded;
      pet.level += 1;
      petNeeded = getPetXpNeeded(pet.level);
    }
  }

  const totalQuestXP = Math.floor((parseFloat(profile.total_quest_xp) || 0) + baseAmount);
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      xp,
      xp_buffer: xpBuffer,
      level,
      pets,
      total_quest_xp: totalQuestXP
    })
    .eq('user_id', validation.owner_user_id);

  if (error) throw error;
  return { base_xp: baseAmount, modified_xp: modifiedAmount, xp, xp_buffer: xpBuffer, level };
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function appendQuestHistory(userId, questText, statusLabel) {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('quest_history')
    .eq('user_id', userId)
    .single();

  if (profileError) throw profileError;

  const history = profile.quest_history && typeof profile.quest_history === 'object'
    ? profile.quest_history
    : {};
  const today = getTodayKey();
  const label = statusLabel ? `${questText} (${statusLabel})` : questText;
  history[today] = Array.isArray(history[today]) ? history[today] : [];
  history[today].push(label);

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ quest_history: history })
    .eq('user_id', userId);

  if (error) throw error;
  return history;
}

function normalizeQuestReputation(current = {}) {
  const submitted = Number(current.submitted || 0);
  const accepted = Number(current.accepted || 0);
  const rejected = Number(current.rejected || 0);
  const judgeTotal = Number(current.judge_total || 0);
  const judgeAligned = Number(current.judge_aligned || 0);
  const playerTotal = accepted + rejected;
  const playerScore = playerTotal ? Number(((accepted / playerTotal) * 100).toFixed(2)) : null;
  const judgeScore = judgeTotal ? Number(((judgeAligned / judgeTotal) * 100).toFixed(2)) : null;
  const scores = [playerScore, judgeScore].filter(score => score !== null);

  return {
    submitted,
    accepted,
    rejected,
    player_score: playerScore,
    judge_total: judgeTotal,
    judge_aligned: judgeAligned,
    judge_score: judgeScore,
    score: judgeScore
  };
}

async function updateQuestReputation(userId, accepted) {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('quest_reputation')
    .eq('user_id', userId)
    .single();

  if (profileError) throw profileError;

  const current = profile.quest_reputation && typeof profile.quest_reputation === 'object'
    ? profile.quest_reputation
    : {};
  const next = normalizeQuestReputation({
    ...current,
    accepted: Number(current.accepted || 0) + (accepted ? 1 : 0),
    rejected: Number(current.rejected || 0) + (accepted ? 0 : 1)
  });

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ quest_reputation: next })
    .eq('user_id', userId);

  if (error) throw error;
  return next;
}

async function updateJudgeReputations(validationId, accepted) {
  const { data: votes, error: votesError } = await supabaseAdmin
    .from('quest_validation_votes')
    .select('voter_user_id, vote_value, vote_scope')
    .eq('validation_id', validationId)
    .in('vote_scope', ['public', 'moderator']);

  if (votesError) throw votesError;
  if (!votes?.length) return {};

  const grouped = new Map();
  votes.forEach((vote) => {
    if (!vote.voter_user_id) return;
    const current = grouped.get(vote.voter_user_id) || { total: 0, aligned: 0 };
    current.total += 1;
    if (vote.vote_value === accepted) current.aligned += 1;
    grouped.set(vote.voter_user_id, current);
  });

  const userIds = [...grouped.keys()];
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('user_id, quest_reputation')
    .in('user_id', userIds);

  if (profilesError) throw profilesError;

  const result = {};
  for (const profile of profiles || []) {
    const delta = grouped.get(profile.user_id);
    const current = profile.quest_reputation && typeof profile.quest_reputation === 'object'
      ? profile.quest_reputation
      : {};
    const next = normalizeQuestReputation({
      ...current,
      judge_total: Number(current.judge_total || 0) + delta.total,
      judge_aligned: Number(current.judge_aligned || 0) + delta.aligned
    });

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ quest_reputation: next })
      .eq('user_id', profile.user_id);

    if (error) throw error;
    result[profile.user_id] = next;
  }

  return result;
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

async function getFriendOwnerIdsForUser(userId, ownerIds) {
  if (!ownerIds.length) return new Set();
  const { data, error } = await supabaseAdmin
    .from('friends')
    .select('friend_id')
    .eq('user_id', userId)
    .in('friend_id', ownerIds);

  if (error) throw error;
  return new Set((data || []).map(row => row.friend_id));
}

async function areUsersFriends(userId, otherUserId) {
  const { data, error } = await supabaseAdmin
    .from('friends')
    .select('id')
    .eq('user_id', userId)
    .eq('friend_id', otherUserId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

async function finalizeValidation(validation, status, statusLabel, extraUpdates = {}) {
  const { data, error } = await supabaseAdmin
    .from('quest_validations')
    .update({
      ...extraUpdates,
      status,
      resolved_at: new Date().toISOString()
    })
    .eq('id', validation.id)
    .eq('owner_user_id', validation.owner_user_id)
    .select('*')
    .single();

  if (error) throw error;
  const quest_history = await appendQuestHistory(validation.owner_user_id, validation.quest_text, statusLabel);
  const accepted = status === 'accepted';
  const quest_reputation = await updateQuestReputation(validation.owner_user_id, accepted);
  const judge_reputations = await updateJudgeReputations(validation.id, accepted);
  return { validation: data, quest_history, quest_reputation, judge_reputations };
}

async function getValidationVotes(validationId) {
  const { data, error } = await supabaseAdmin
    .from('quest_validation_votes')
    .select('id, voter_user_id, vote_value, vote_scope, created_at')
    .eq('validation_id', validationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

async function ensurePublicVoteStillHasSlot(validation, vote) {
  const votes = await getValidationVotes(validation.id);
  const publicVotes = votes
    .filter(item => item.vote_scope === 'public')
    .sort((a, b) => {
      const dateDiff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (dateDiff !== 0) return dateDiff;
      return String(a.id).localeCompare(String(b.id));
    });
  const voteIndex = publicVotes.findIndex(item => item.id === vote.id);
  const slots = Number(validation.public_slots || 0);

  if (voteIndex >= 0 && voteIndex < slots) return;

  await supabaseAdmin
    .from('quest_validation_votes')
    .delete()
    .eq('id', vote.id);

  const error = new Error('Votes publics deja complets');
  error.status = 409;
  throw error;
}

function isOlderThan(value, delayMs) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) && Date.now() - time >= delayMs;
}

async function evaluateValidation(validation, options = {}) {
  const votes = await getValidationVotes(validation.id);
  const friendVotes = votes.filter(vote => vote.vote_scope === 'friend');
  const publicVotes = votes.filter(vote => vote.vote_scope === 'public');
  const friendCount = Array.isArray(validation.friend_validator_ids) ? validation.friend_validator_ids.length : 0;
  const publicSlots = Number(validation.public_slots || 0);
  const forceFriend = options.forceFriend === true;
  const forcePublic = options.forcePublic === true;
  const updates = {};
  let xpDelta = 0;

  if (friendCount > 0 && validation.friend_status === 'pending') {
    const yes = friendVotes.filter(vote => vote.vote_value).length;
    const no = friendVotes.filter(vote => !vote.vote_value).length;
    const majority = Math.floor(friendCount / 2) + 1;
    const closed = forceFriend || yes >= majority || no >= majority || yes + no >= friendCount;

    if (closed) {
      updates.friend_status = forceFriend
        ? (yes > no ? 'accepted' : 'rejected')
        : (yes >= majority ? 'accepted' : 'rejected');
      xpDelta += updates.friend_status === 'accepted'
        ? Number(validation.friend_xp || 0)
        : Number(validation.fallback_xp || 0);
    }
  }

  if (publicSlots > 0 && validation.public_status === 'pending' && (forcePublic || publicVotes.length >= publicSlots)) {
    const publicAward = calculatePublicAwardXP(validation, publicVotes);
    updates.public_status = publicAward > 0 ? 'accepted' : 'rejected';
    xpDelta += publicAward;
  }

  const nextFriendStatus = updates.friend_status || validation.friend_status;
  const nextPublicStatus = updates.public_status || validation.public_status;
  const friendDone = nextFriendStatus === 'none' || nextFriendStatus === 'accepted' || nextFriendStatus === 'rejected';
  const publicDone = nextPublicStatus === 'none' || nextPublicStatus === 'accepted' || nextPublicStatus === 'rejected';
  let finalized = null;
  let award = null;

  if (xpDelta > 0) {
    award = await awardQuestXpToOwner(validation, xpDelta);
    updates.xp_awarded = Number(((Number(validation.xp_awarded || 0)) + xpDelta).toFixed(4));
  }

  if (friendDone && publicDone) {
    const accepted = nextFriendStatus === 'accepted' || nextPublicStatus === 'accepted';
    finalized = await finalizeValidation(validation, accepted ? 'accepted' : 'rejected', accepted ? 'acceptee' : 'refusee', updates);
  } else if (Object.keys(updates).length) {
    const { error } = await supabaseAdmin
      .from('quest_validations')
      .update(updates)
      .eq('id', validation.id);
    if (error) throw error;
  }

  return { updates, finalized, award };
}

async function closeExpiredPendingValidations() {
  const expiryDate = new Date(Date.now() - AUTO_CLOSE_DELAY_MS).toISOString();
  const { data, error } = await supabaseAdmin
    .from('quest_validations')
    .select('*')
    .eq('status', 'pending')
    .lte('created_at', expiryDate)
    .limit(50);

  if (error) throw error;
  for (const validation of data || []) {
    await evaluateValidation(validation, { forceFriend: true, forcePublic: true });
  }
}

async function keepOnlyOpenForScope(validations, scope) {
  const result = [];

  for (const validation of validations || []) {
    const evaluation = await evaluateValidation(validation);
    if (evaluation.finalized) continue;

    const nextFriendStatus = evaluation.updates?.friend_status || validation.friend_status;
    const nextPublicStatus = evaluation.updates?.public_status || validation.public_status;

    if (scope === 'friend' && nextFriendStatus === 'pending') {
      result.push(validation);
    }

    if (scope === 'public' && nextPublicStatus === 'pending') {
      const votes = await getValidationVotes(validation.id);
      const publicVotes = votes.filter(vote => vote.vote_scope === 'public');
      if (publicVotes.length < Number(validation.public_slots || 0)) {
        result.push(validation);
      }
    }
  }

  return result;
}

router.post('/validations', async (req, res) => {
  const quests = Array.isArray(req.body.quests) ? req.body.quests : [];
  const friendValidatorIds = normalizeFriendIds(req.body.friend_validator_ids);
  const requestedPublicSlots = normalizePublicSlots(req.body.public_slots);
  const publicSlots = Math.max(1, requestedPublicSlots);

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
        moderator_required: false,
        friend_status: friendValidatorIds.length ? 'pending' : 'none',
        public_status: publicSlots > 0 ? 'pending' : 'none',
        moderator_status: 'none',
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

router.get('/moderators', async (req, res) => {
  try {
    const { data: ownerProfile, error: ownerError } = await supabaseAdmin
      .from('profiles')
      .select('level')
      .eq('user_id', req.user.id)
      .single();

    if (ownerError) return res.status(500).json({ error: ownerError.message });

    const ownerLevel = parseInt(ownerProfile?.level, 10) || 1;
    const minLevel = Math.max(1, ownerLevel - MODERATOR_LEVEL_BELOW);
    const maxLevel = ownerLevel + MODERATOR_LEVEL_ABOVE;
    const activeSince = new Date(Date.now() - MODERATOR_ACTIVE_DELAY_MS).toISOString();

    const { data: friendRows, error: friendError } = await supabaseAdmin
      .from('friends')
      .select('friend_id')
      .eq('user_id', req.user.id);

    if (friendError) return res.status(500).json({ error: friendError.message });

    const friendIds = new Set((friendRows || []).map(row => row.friend_id));

    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('user_id, username, level, last_seen, quest_reputation')
      .neq('user_id', req.user.id)
      .gte('level', minLevel)
      .lte('level', maxLevel)
      .gte('last_seen', activeSince)
      .limit(50);

    if (profilesError) return res.status(500).json({ error: profilesError.message });

    const moderators = (profiles || [])
      .filter(profile => !friendIds.has(profile.user_id))
      .map((profile) => {
        const reputation = profile.quest_reputation || {};
        return {
          user_id: profile.user_id,
          username: profile.username || 'Joueur',
          level: parseInt(profile.level, 10) || 1,
          reputation_score: getReputationScore(reputation),
          reputation_actions: getReputationActionCount(reputation)
        };
      })
      .filter(profile => profile.reputation_score >= MODERATOR_MIN_REPUTATION)
      .filter(profile => profile.reputation_actions >= MODERATOR_MIN_ACTIONS)
      .sort((a, b) => b.reputation_score - a.reputation_score || b.reputation_actions - a.reputation_actions)
      .slice(0, 12);

    res.json(moderators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/friends', async (req, res) => {
  try {
    await closeExpiredPendingValidations();
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
    const openItems = await keepOnlyOpenForScope(data || [], 'friend');
    const items = openItems.filter(item => !votedIds.has(item.id));
    res.json(await attachOwnerNames(items));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/public', async (req, res) => {
  try {
    await closeExpiredPendingValidations();
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
    const openItems = await keepOnlyOpenForScope(data || [], 'public');
    const ownerIds = [...new Set(openItems.map(item => item.owner_user_id))];
    const friendOwnerIds = await getFriendOwnerIdsForUser(req.user.id, ownerIds);
    const items = openItems
      .filter(item => !votedIds.has(item.id))
      .filter(item => !friendOwnerIds.has(item.owner_user_id));
    res.json(await attachOwnerNames(items));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mine', async (req, res) => {
  try {
    await closeExpiredPendingValidations();
    const { data, error } = await supabaseAdmin
      .from('quest_validations')
      .select('*')
      .eq('owner_user_id', req.user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ error: error.message });

    const validationIds = (data || []).map(item => item.id);
    let votes = [];
    if (validationIds.length) {
      const { data: voteRows, error: voteError } = await supabaseAdmin
        .from('quest_validation_votes')
        .select('validation_id, vote_scope, vote_value, vote_weight, created_at')
        .in('validation_id', validationIds)
        .order('created_at', { ascending: true });
      if (voteError) return res.status(500).json({ error: voteError.message });
      votes = voteRows || [];
    }

    const result = (data || []).map((validation) => {
      const validationVotes = votes.filter(vote => vote.validation_id === validation.id);
      const friendVotes = validationVotes.filter(vote => vote.vote_scope === 'friend');
      const publicVotes = validationVotes.filter(vote => vote.vote_scope === 'public');
      const publicShares = getPublicPercentShares(validation.public_slots);
      const publicAwardPercent = publicVotes
        .slice(0, publicShares.length)
        .reduce((sum, vote, index) => sum + (vote.vote_value ? publicShares[index] : 0), 0);
      const publicClosedPercent = publicShares
        .slice(0, publicVotes.length)
        .reduce((sum, share) => sum + share, 0);
      const yes = validationVotes.filter(vote => vote.vote_value).length;
      const no = validationVotes.filter(vote => !vote.vote_value).length;
      return {
        ...validation,
        unlock_available: isOlderThan(validation.created_at, FRIEND_UNLOCK_DELAY_MS),
        auto_close_at: new Date(new Date(validation.created_at).getTime() + AUTO_CLOSE_DELAY_MS).toISOString(),
        votes: {
          yes,
          no,
          total: yes + no,
          friend_yes: friendVotes.filter(vote => vote.vote_value).length,
          friend_no: friendVotes.filter(vote => !vote.vote_value).length,
          friend_total: friendVotes.length,
          public_yes: publicVotes.filter(vote => vote.vote_value).length,
          public_no: publicVotes.filter(vote => !vote.vote_value).length,
          public_total: publicVotes.length,
          public_award_percent: publicAwardPercent,
          public_closed_percent: publicClosedPercent
        }
      };
    });

    res.json(result);
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
  if (isOlderThan(validation.created_at, AUTO_CLOSE_DELAY_MS)) {
    const evaluation = await evaluateValidation(validation, { forceFriend: true, forcePublic: true });
    return res.status(409).json({ error: 'Cette quete vient d etre cloturee automatiquement', ...evaluation });
  }
  if (validation.owner_user_id === req.user.id) return res.status(400).json({ error: 'Impossible de voter pour sa propre quete' });

  if (scope === 'friend') {
    const friendIds = Array.isArray(validation.friend_validator_ids) ? validation.friend_validator_ids : [];
    if (!friendIds.includes(req.user.id)) return res.status(403).json({ error: 'Vote ami non autorise' });
  }

  if (scope === 'public') {
    if (Number(validation.public_slots || 0) <= 0 || validation.public_status !== 'pending') {
      return res.status(403).json({ error: 'Vote public non autorise' });
    }
    const ownerIsFriend = await areUsersFriends(req.user.id, validation.owner_user_id);
    if (ownerIsFriend) {
      return res.status(403).json({ error: 'Les amis ne peuvent pas voter en public sur cette quete' });
    }
  }

  const currentVotes = await getValidationVotes(validationId);
  if (scope === 'public') {
    const publicVotes = currentVotes.filter(vote => vote.vote_scope === 'public');
    if (publicVotes.length >= Number(validation.public_slots || 0)) {
      return res.status(409).json({ error: 'Votes publics deja complets' });
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

  try {
    if (scope === 'public') {
      await ensurePublicVoteStillHasSlot(validation, vote);
    }
    const evaluation = await evaluateValidation(validation);
    const votes = await getValidationVotes(validationId);
    const scopeVotes = votes.filter(item => item.vote_scope === scope);
    const yes = scopeVotes.filter(item => item.vote_value).length;
    const no = scopeVotes.filter(item => !item.vote_value).length;
    const voter_reputation = evaluation.finalized?.judge_reputations?.[req.user.id] || null;
    res.json({ vote, tally: { yes, no }, voter_reputation, ...evaluation });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.post('/validations/:id/open-public', async (req, res) => {
  const validationId = req.params.id;

  const { data: validation, error: validationError } = await supabaseAdmin
    .from('quest_validations')
    .select('*')
    .eq('id', validationId)
    .eq('owner_user_id', req.user.id)
    .eq('status', 'pending')
    .single();

  if (validationError || !validation) return res.status(404).json({ error: 'Quete introuvable' });
  if (!isOlderThan(validation.created_at, FRIEND_UNLOCK_DELAY_MS)) {
    return res.status(403).json({ error: 'Deblocage disponible apres 48h' });
  }

  try {
    const votes = await getValidationVotes(validationId);
    const friendVotes = votes.filter(vote => vote.vote_scope === 'friend').length;
    const friendCount = Array.isArray(validation.friend_validator_ids) ? validation.friend_validator_ids.length : 0;
    const missingFriendVotes = Math.max(0, friendCount - friendVotes);
    const publicVotes = votes.filter(vote => vote.vote_scope === 'public').length;
    const nextPublicSlots = Math.max(
      publicVotes,
      Math.min(4, Number(validation.public_slots || 0) + missingFriendVotes)
    );
    const publicStatus = nextPublicSlots > publicVotes ? 'pending' : validation.public_status;
    const updatedValidation = {
      ...validation,
      public_slots: nextPublicSlots,
      public_status: nextPublicSlots > 0 ? publicStatus : 'none'
    };

    const { error } = await supabaseAdmin
      .from('quest_validations')
      .update({
        public_slots: updatedValidation.public_slots,
        public_status: updatedValidation.public_status
      })
      .eq('id', validationId);

    if (error) throw error;

    const evaluation = await evaluateValidation(updatedValidation, { forceFriend: true });
    res.json({
      validation: updatedValidation,
      missing_friend_votes: missingFriendVotes,
      added_public_slots: nextPublicSlots - Number(validation.public_slots || 0),
      ...evaluation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/validations/:id/complete-now', async (req, res) => {
  const validationId = req.params.id;

  const { data: validation, error: validationError } = await supabaseAdmin
    .from('quest_validations')
    .select('*')
    .eq('id', validationId)
    .eq('owner_user_id', req.user.id)
    .eq('status', 'pending')
    .single();

  if (validationError || !validation) return res.status(404).json({ error: 'Quete introuvable' });

  try {
    const hasAcceptedBlock = validation.friend_status === 'accepted' || validation.public_status === 'accepted';
    const hasAwardedBeyondImmediate = Number(validation.xp_awarded || 0) > Number(validation.immediate_xp || 0);
    const accepted = hasAcceptedBlock || hasAwardedBeyondImmediate;
    const finalized = await finalizeValidation(
      validation,
      accepted ? 'accepted' : 'rejected',
      accepted ? 'cloturee manuellement' : 'cloturee sans validation'
    );
    res.json(finalized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

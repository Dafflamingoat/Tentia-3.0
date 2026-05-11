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

router.post('/validations', async (req, res) => {
  const quests = Array.isArray(req.body.quests) ? req.body.quests : [];
  const friendValidatorIds = normalizeFriendIds(req.body.friend_validator_ids);
  const publicSlots = normalizePublicSlots(req.body.public_slots);

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

module.exports = router;

const express  = require('express');
const router   = express.Router();
const { supabaseAdmin } = require('../supabase');
const { requireAuth }   = require('../middleware/auth');

// Toutes les routes data nécessitent d'être connecté
router.use(requireAuth);

// ── GET /api/data/profile ────────────────────
// Récupère toutes les données du joueur
router.get('/profile', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── PUT /api/data/profile ────────────────────
// Met à jour une ou plusieurs clés du profil
router.put('/profile', async (req, res) => {
  const allowed = [
    'xp', 'level', 'hp', 'points_left',
    'force', 'intelligence', 'discipline', 'focus',
    'skills', 'selected_skin', 'selected_bg',
    'equipped_title', 'equipped_avatar', 'equipped_pet',
    'titles', 'avatars', 'skins', 'backgrounds', 'badges', 'pets',
    'badge_slots', 'achievements_claimed', 'journal', 'quests',
    'total_login_days', 'total_quests_done', 'total_quest_xp',
    'total_chess_xp', 'peak_elo', 'last_login', 'last_elo', 'current_elo'
  ];

  // Filtrer pour ne garder que les champs autorisés
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Aucune donnée valide à mettre à jour' });
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── POST /api/data/import ────────────────────
// Import du localStorage existant (migration initiale)
router.post('/import', async (req, res) => {
  const ls = req.body; // tout le localStorage envoyé d'un coup

  const updates = {
    xp:          parseInt(ls.xp)     || 0,
    level:       parseInt(ls.level)  || 1,
    hp:          parseInt(ls.hp)     || 50,
    points_left: parseInt(ls.pointsLeft) || 0,

    force:        parseInt(ls.Force)        || 0,
    intelligence: parseInt(ls.Intelligence) || 0,
    discipline:   parseInt(ls.Discipline)   || 0,
    focus:        parseInt(ls.Focus)        || 0,

    skills:       safeJSON(ls.skills, {}),
    selected_skin:  ls.selectedSkin  || 'Skin_T1',
    selected_bg:    safeJSON(ls.selectedBG, null),
    equipped_title: ls.equippedTitleId  || 'title1',
    equipped_avatar: ls.equippedAvatarId || 'avatar1',
    equipped_pet:   ls.equippedPetId    || null,

    titles:      safeJSON(ls.titles,      []),
    avatars:     safeJSON(ls.avatars,     []),
    skins:       safeJSON(ls.skins,       []),
    backgrounds: safeJSON(ls.backgrounds, []),
    badges:      safeJSON(ls.badges,      []),
    pets:        safeJSON(ls.pets,        []),

    badge_slots:          safeJSON(ls.badges_equipped, {}),
    achievements_claimed: safeJSON(ls.achievementsClaimed, {}),
    journal:              safeJSON(ls.journal, {}),
    quests:               safeJSON(ls.quests,  []),

    total_login_days:  parseInt(ls.totalLoginDays)  || 0,
    total_quests_done: parseInt(ls.totalQuestsDone) || 0,
    total_quest_xp:    parseInt(ls.totalQuestXP)    || 0,
    total_chess_xp:    parseInt(ls.totalChessXP)    || 0,
    peak_elo:          parseInt(ls.peakElo)          || 0,
    last_login:        ls.lastLogin  || null,
    last_elo:          parseInt(ls.lastElo)          || 0,
    current_elo:       parseInt(ls.currentElo)       || 0,
  };

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Import réussi !', data });
});

function safeJSON(str, fallback) {
  if (!str) return fallback;
  if (typeof str === 'object') return str;
  try { return JSON.parse(str); }
  catch { return fallback; }
}

module.exports = router;

// ────────────────
// STATS.JS
// ────────────────

// ────────────────
// DONNEES JOUEUR
// ────────────────
let xp = parseInt(localStorage.getItem('xp')) || 0;
let level = parseInt(localStorage.getItem('level')) || 1;

// ────────────────
// DONNEES FAMILIERS
// ────────────────
let pets = JSON.parse(localStorage.getItem('pets')) || [
  {
    id: 'pet1',
    name: 'Hericendre',
    stat: 'Intelligence',
    level: 1,
    xp: 0,
    share: 0.1,
    active: true,
    owned: false,
    sprite1: 'assets/pets/intel/pet1_frame1.png',
    sprite2: 'assets/pets/intel/pet1_frame2.png'
  },
  {
    id: 'pet2',
    name: 'Chopper',
    stat: 'Force',
    level: 1,
    xp: 0,
    share: 0.1,
    active: true,
    owned: false,
    sprite1: 'assets/pets/force/pet1_frame1.png',
    sprite2: 'assets/pets/force/pet1_frame2.png'
  },
  {
    id: 'pet3',
    name: 'Titan capturé',
    stat: 'Discipline',
    level: 1,
    xp: 0,
    share: 0.1,
    active: true,
    owned: false,
    sprite1: 'assets/pets/discipline/pet1_frame1.png',
    sprite2: 'assets/pets/discipline/pet1_frame2.png'
  },
  {
    id: 'pet4',
    name: 'Aigle Royale',
    stat: 'Focus',
    level: 1,
    xp: 0,
    share: 0.1,
    active: true,
    owned: false,
    sprite1: 'assets/pets/focus/pet1_frame1.png',
    sprite2: 'assets/pets/focus/pet1_frame2.png'
  },
  {
    id: 'pet_dragon_legendary',
    name: 'Dragon legendaire',
    stat: 'ForceIntelligence',
    level: 1,
    xp: 0,
    share: 0.1,
    active: true,
    owned: false,
    sprite1: 'assets/pets/got/pet1_frame1.png',
    sprite2: 'assets/pets/got/pet1_frame2.png'
  },
  {
    id: 'pet_bob',
    name: 'Fantôme de Bob',
    stat: 'FocusDiscipline',
    level: 1,
    xp: 0,
    share: 0.1,
    active: true,
    owned: false,
    sprite1: 'assets/pets/legends/pet1_frame1.png',
    sprite2: 'assets/pets/legends/pet1_frame2.png'
  },
  {
    id: 'pet_endgame',
    name: 'Pet End Game',
    stat: 'All',
    level: 1,
    xp: 0,
    share: 0.1,
    active: true,
    owned: false,
    sprite1: 'assets/pets/pet1_frame1.png',
    sprite2: 'assets/pets/pet1_frame2.png'
  }
];

let equippedPetId = localStorage.getItem('equippedPetId') || 'pet1';

// ────────────────
// DONNEES TITRES
// ────────────────
let titles = JSON.parse(localStorage.getItem('titles')) || [
  { id: 'title1', name: 'Novice', owned: true },
  { id: 'title_t1_supporter', name: 'T1 Supporter', owned: false },
  { id: 'title_SlimShady', name: 'The Slim Shady', owned: false },
  { id: 'title_dresseur', name: 'Dresseur', owned: false },
  { id: 'title_exorciste', name: 'Apprenti Exorciste', owned: false },
  { id: 'title_mugiwara', name: 'Mugiwara', owned: false },
  { id: 'title_bataillon', name: "Bataillon d'exploration", owned: false },
  { id: 'title_dimensions', name: 'Voyageur de dimensions', owned: false },
  { id: 'title_samourai', name: 'Samourai', owned: false },
  { id: 'title_dragons', name: 'Roi du Nord', owned: false },
  { id: 'title_endgame', name: 'Grand Maitre', owned: false },
  // ── Hauts Faits : Montée de niveau ──
  { id: 'title_hf_lvl10',  name: 'Gameur Pro',         owned: false },
  { id: 'title_hf_lvl20',  name: 'Travailleur Acharné', owned: false },
  { id: 'title_hf_lvl30',  name: 'Bourg-Palette',       owned: false },
  { id: 'title_hf_lvl40',  name: "Oeil de l'Infini",    owned: false },
  { id: 'title_hf_lvl50',  name: 'Yonko',               owned: false },
  { id: 'title_hf_lvl60',  name: 'Explorateur',         owned: false },
  { id: 'title_hf_lvl70',  name: 'Chef Galactique',     owned: false },
  { id: 'title_hf_lvl80',  name: 'Divin',               owned: false },
  { id: 'title_hf_lvl90',  name: 'Maitre',              owned: false },
  { id: 'title_hf_lvl100', name: 'Targaryen',           owned: false },
  // ── Hauts Faits : Familier ──
  { id: 'title_hf_eleveur', name: 'Légendaire Éleveur de Bêtes', owned: false },
  // ── Hauts Faits : Quêtes ──
  { id: 'title_hf_rpg',   name: 'RPG',           owned: false },
  // ── Hauts Faits : Échecs ──
  { id: 'title_method',   name: 'Le Méthodique', owned: false },
  { id: 'title_carlsen',  name: 'Carlsen',       owned: false },
];

let equippedTitleId = localStorage.getItem('equippedTitleId') || 'title1';

// ────────────────
// DONNEES AVATARS
// ────────────────
let avatars = JSON.parse(localStorage.getItem('avatars')) || [
  { id: 'avatar1', name: 'Avatar 1', src: 'assets/avatars/avatar1.png', owned: true },
  { id: 'avatar_t1', name: 'Avatar T1', src: 'assets/avatars/avatar_t1.png', owned: false },
  { id: 'avatar_rap', name: 'Avatar SlimShady', src: 'assets/avatars/avatar_rap.png', owned: false },
  { id: 'avatar_pokeball', name: 'Avatar Pokeball', src: 'assets/avatars/avatar_pokeball.png', owned: false },
  { id: 'avatar_jjk', name: 'Avatar JJK', src: 'assets/avatars/avatar_jjk.png', owned: false },
  { id: 'avatar_op', name: 'Avatar One Piece', src: 'assets/avatars/avatar_op.png', owned: false },
  { id: 'avatar_snk', name: 'Avatar SNK', src: 'assets/avatars/avatar_snk.png', owned: false },
  { id: 'avatar_rick_morty', name: 'Avatar Rick & Morty', src: 'assets/avatars/avatar_rick_morty.png', owned: false },
  { id: 'avatar_samourai', name: 'Avatar Samourai', src: 'assets/avatars/avatar_samourai.png', owned: false },
  { id: 'avatar_dragons', name: 'Avatar Dragons', src: 'assets/avatars/avatar_dragons.png', owned: false },
  { id: 'avatar_endgame',  name: 'Avatar End Game', src: 'assets/avatars/avatar_endgame.png',   owned: false },
  { id: 'avatar_king', name: 'Avatar King',    src: 'assets/avatars/avatar_king.png',  owned: false },
  // ── Hauts Faits : Échecs ──
  { id: 'avatar_plat', name: 'Avatar Platine', src: 'assets/avatars/avatar_plat.png',  owned: false },
  // ── Hauts Faits : Familier (visuels à faire) ── ⚙ À COMPLÉTER
  { id: 'avatar_pet1', name: 'Avatar Hericendre',    src: 'assets/avatars/avatar_pet1.png', owned: false },
  { id: 'avatar_pet2', name: 'Avatar Chopper',       src: 'assets/avatars/avatar_pet2.png', owned: false },
  { id: 'avatar_pet3', name: 'Avatar Titan Capturé', src: 'assets/avatars/avatar_pet3.png', owned: false },
  { id: 'avatar_pet4', name: 'Avatar Aigle Royale',  src: 'assets/avatars/avatar_pet4.png', owned: false },
];

let equippedAvatarId = localStorage.getItem('equippedAvatarId') || 'avatar1';

// ────────────────
// DONNEES SKINS
// ────────────────
// ⚙ POUR MODIFIER LES NIVEAUX DE DEBLOCAGE → voir levelRewards plus bas
// folder = nom du dossier dans assets/character/
let skins = JSON.parse(localStorage.getItem('skins')) || [
  { id: 'skin_t1',              name: 'Skin T1',           folder: 'Skin_T1',      owned: true  },
  { id: 'skin_eminem',          name: 'Slim Shady',        folder: 'Skin_Eminem',  owned: false },
  { id: 'skin_pokemon',         name: 'Pokémon',           folder: 'Skin_Pokemon', owned: false },
  { id: 'skin_yuji',            name: 'Yuji Itadori',      folder: 'Skin_JJK',     owned: false },
  { id: 'skin_op',              name: 'One Piece',         folder: 'Skin_OP',      owned: false },
  { id: 'skin_titan',           name: 'Titan',             folder: 'Skin_Snk',     owned: false },
  { id: 'skin_rick',            name: 'Rick & Morty',      folder: 'Skin_RM',      owned: false },
  { id: 'skin_samourai',        name: 'Samourai',          folder: 'Skin_ronin',   owned: false },
  { id: 'skin_dragon_hunter',   name: 'Roi du Nord',       folder: 'Skin_got',      owned: false },
  { id: 'skin_backpacker',      name: 'Backpacker',        folder: 'Skin_backpacker', owned: false },
  { id: 'skin_quilby',          name: 'Quilby',            folder: 'Skin_quilby',   owned: false },
  { id: 'skin_ultra_rare_zoro', name: 'Zoro',              folder: 'Skin_zoro',    owned: false },
  { id: 'skin_roi_liche',       name: 'Roi Liche',         folder: 'Skin_liche',   owned: false },
  { id: 'skin_imu',             name: 'Imu Nerona',        folder: 'Skin_imu',     owned: false },
  // ── Hauts Faits : Quêtes ──
  { id: 'skin_iop',     name: 'IOP',     folder: 'Skin_iop',     owned: false },
  { id: 'skin_xelor',   name: 'Xelor',   folder: 'Skin_xelor',   owned: false },
  // ── Hauts Faits : Échecs ──
  { id: 'skin_carlsen', name: 'Carlsen', folder: 'Skin_carlsen', owned: false },
];

// ────────────────
// DONNEES BACKGROUNDS
// ────────────────
// bg1/bg2 = les deux frames d'animation
let backgrounds = JSON.parse(localStorage.getItem('backgrounds')) || [
  { id: 'bg_default',      name: 'Défaut',          bg1: 'assets/background/bg1_frame1.png',  bg2: 'assets/background/bg1_frame2.png',  owned: true  },
  { id: 'bg_white',        name: 'Blanc',            bg1: 'assets/background/bg2_frame1.png',  bg2: 'assets/background/bg2_frame2.png',  owned: true  },
  { id: 'bg_t1',           name: 'T1',               bg1: 'assets/background/bg3_frame1.png',  bg2: 'assets/background/bg3_frame2.png',  owned: false },
  { id: 'bg_detroit',      name: 'Detroit',          bg1: 'assets/background/bg4_frame1.png',  bg2: 'assets/background/bg4_frame2.png',  owned: false },
  { id: 'bg_pokemon',      name: 'Pokémon',          bg1: 'assets/background/bg5_frame1.png',  bg2: 'assets/background/bg5_frame2.png',  owned: false },
  { id: 'bg_yuji_train',   name: 'Train Yuji',       bg1: 'assets/background/bg6_frame1.png',  bg2: 'assets/background/bg6_frame2.png',  owned: false },
  { id: 'bg_merry',        name: 'Going Merry',      bg1: 'assets/background/bg7_frame1.png',  bg2: 'assets/background/bg7_frame2.png',  owned: false },
  { id: 'bg_foret',        name: 'Titan Colossal',   bg1: 'assets/background/bg8_frame1.png',  bg2: 'assets/background/bg8_frame2.png',  owned: false },
  { id: 'bg_portal',       name: 'Portail',          bg1: 'assets/background/bg9_frame1.png',  bg2: 'assets/background/bg9_frame2.png',  owned: false },
  { id: 'bg_got',          name: 'Trône de Fer',     bg1: 'assets/background/bg11_frame1.png', bg2: 'assets/background/bg11_frame2.png', owned: false },
  // ── Hauts Faits : Connexion régulière ──
  { id: 'bg_paris',        name: 'Paris',            bg1: 'assets/background/bg13_frame1.png', bg2: 'assets/background/bg13_frame2.png', owned: false },
  { id: 'bg_japon',        name: 'Japon',            bg1: 'assets/background/bg14_frame1.png', bg2: 'assets/background/bg14_frame2.png', owned: false },
  { id: 'bg_usa',         name: 'Amérique',    bg1: 'assets/background/bg15_frame1.png', bg2: 'assets/background/bg15_frame2.png', owned: false },
  { id: 'bg_australie',   name: 'Australie',   bg1: 'assets/background/bg16_frame1.png', bg2: 'assets/background/bg16_frame2.png', owned: false },
  { id: 'bg_afrique',     name: 'Afrique',     bg1: 'assets/background/bg17_frame1.png', bg2: 'assets/background/bg17_frame2.png', owned: false },
  { id: 'bg_marineford',  name: 'MarineFord',  bg1: 'assets/background/bg18_frame1.png', bg2: 'assets/background/bg18_frame2.png', owned: false },
  { id: 'bg_hell',        name: 'Enfers',      bg1: 'assets/background/bg19_frame1.png', bg2: 'assets/background/bg19_frame2.png', owned: false },
  { id: 'bg_paradis',     name: 'Paradis',     bg1: 'assets/background/bg20_frame1.png', bg2: 'assets/background/bg20_frame2.png', owned: false },
  { id: 'bg_hf_250',      name: '? (250j)',    bg1: 'assets/background/bg22_frame1.png', bg2: 'assets/background/bg22_frame2.png', owned: false },
  { id: 'bg_hf_300',      name: '? (300j)',    bg1: 'assets/background/bg23_frame1.png', bg2: 'assets/background/bg23_frame2.png', owned: false },
  // ── End Game ──
  { id: 'bg_end_game',     name: 'End Game',    bg1: 'assets/background/bg24_frame1.png', bg2: 'assets/background/bg24_frame2.png', owned: false },
  // ── Hauts Faits : Quêtes ──
  { id: 'bg_dofus',  name: 'Dofus',     bg1: 'assets/background/bg21_frame1.png', bg2: 'assets/background/bg21_frame2.png', owned: false },
  // ── Hauts Faits : Échecs ──
  { id: 'bg_echecs', name: 'Échiquier', bg1: 'assets/background/bg25_frame1.png', bg2: 'assets/background/bg25_frame2.png', owned: false },
];

// ────────────────
// DONNEES BADGES
// ────────────────
// Structure d'un badge :
//   id        : identifiant unique
//   name      : nom affiché
//   src       : chemin vers l'image PNG 64x64
//   stats     : { NomStat: { base: N, dominant: N }, ... }
//               base = bonus quand ce n'est PAS le slot dominant
//               dominant = bonus quand équipé DANS ce slot
//               Pour un badge mono-stat base === dominant
//   equippedSlot : null | 'Force' | 'Intelligence' | 'Discipline' | 'Focus'
//   owned     : bool
//
// ⚙ POUR MODIFIER LES NIVEAUX DE DEBLOCAGE → voir levelRewards plus bas
// ⚙ POUR MODIFIER LES VALEURS DE BONUS     → modifier base/dominant ici
let badges = JSON.parse(localStorage.getItem('badges')) || [
  {
    id: 'badge_t1',
    name: 'Emblème T1',
    src: 'assets/badges/badge_t1.png',
    stats: {
      Force: { base: 5, dominant: 5 }
    },
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_plume',
    name: 'Plume du MC',
    src: 'assets/badges/badge_plume.png',
    stats: {
      Intelligence: { base: 5, dominant: 5 }
    },
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_pokemon',
    name: 'Badge Pokémon',
    src: 'assets/badges/badge_pokemon.png',
    stats: {
      Discipline: { base: 5, dominant: 5 }
    },
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_tengen',
    name: 'Sceau de Tengen',
    src: 'assets/badges/badge_tengen.png',
    stats: {
      Focus: { base: 5, dominant: 5 }
    },
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_op',
    name: 'Chapeau de Paille',
    src: 'assets/badges/badge_op.png',
    stats: {
	  Force: { base: 10, dominant: 15 },
    },
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_snk',
    name: 'Ailes de la Liberté',
    src: 'assets/badges/badge_snk.png',
    stats: {
      Discipline: { base: 10, dominant: 15 },
    },
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_rick',
    name: 'Portail dimensionnel',
    src: 'assets/badges/badge_rick.png',
    stats: {
      Intelligence: { base: 10, dominant: 15 },
    },
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_dragon',
    name: 'Écaille de Dragon',
    src: 'assets/badges/badge_dragon.png',
    stats: {
      Focus: { base: 10, dominant: 15 },
    },
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_tiers3_1',
    name: 'Badge Tiers 3 - Focus',
    src: 'assets/badges/badge_tiers3_1.png',
    stats: {
      Focus: { base: 1.05, dominant: 1.05 }
    },
    multiplier: true,
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_tiers3_2',
    name: 'Badge Tiers 3 - Force',
    src: 'assets/badges/badge_tiers3_2.png',
    stats: {
      Force: { base: 1.05, dominant: 1.05 }
    },
    multiplier: true,
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_tiers3_3',
    name: 'Badge Tiers 3 - Intelligence',
    src: 'assets/badges/badge_tiers3_3.png',
    stats: {
      Intelligence: { base: 1.05, dominant: 1.05 }
    },
    multiplier: true,
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_tiers3_4',
    name: 'Badge Tiers 3 - Focus',
    src: 'assets/badges/badge_tiers3_4.png',
    stats: {
      Focus: { base: 1.05, dominant: 1.05 }
    },
    multiplier: true,
    equippedSlot: null,
    owned: false
  },
  {
    id: 'badge_endgame',
    name: 'Badge End Game',
    src: 'assets/badges/badge_endgame.png',
    stats: {
      Force:        { base: 15, dominant: 20 },
      Intelligence: { base: 15, dominant: 20 },
      Discipline:   { base: 15, dominant: 20 },
      Focus:        { base: 15, dominant: 20 }
    },
    equippedSlot: null,
    owned: false
  }
];

// ────────────────
// RECOMPENSES DE NIVEAU
// ────────────────
const levelRewards = {
  2: [{ type: 'title', id: 'title_t1_supporter' }],
  4: [{ type: 'avatar', id: 'avatar_t1' }],
  7: [{ type: 'background', id: 'bg_t1' }],
  10: [{ type: 'badge', id: 'badge_t1' }],

  12: [{ type: 'title', id: 'title_SlimShady' }],
  13: [{ type: 'avatar', id: 'avatar_rap' }],
  15: [{ type: 'background', id: 'bg_detroit' }],
  17: [{ type: 'badge', id: 'badge_plume' }],
  20: [{ type: 'skin', id: 'skin_eminem' }],

  22: [{ type: 'title', id: 'title_dresseur' }],
  23: [{ type: 'avatar', id: 'avatar_pokeball' }],
  25: [{ type: 'pet', id: 'pet1' }],
  27: [{ type: 'background', id: 'bg_pokemon' }],
  29: [{ type: 'badge', id: 'badge_pokemon' }],
  30: [{ type: 'skin', id: 'skin_pokemon' }],

  32: [{ type: 'title', id: 'title_exorciste' }],
  33: [{ type: 'avatar', id: 'avatar_jjk' }],
  35: [{ type: 'skin', id: 'skin_yuji' }],
  37: [{ type: 'background', id: 'bg_yuji_train' }],
  40: [{ type: 'badge', id: 'badge_tengen' }],

  42: [{ type: 'title', id: 'title_mugiwara' }],
  43: [{ type: 'avatar', id: 'avatar_op' }],
  45: [{ type: 'pet', id: 'pet2' }],
  46: [{ type: 'background', id: 'bg_merry' }],
  49: [{ type: 'skin', id: 'skin_op' }],
  50: [{ type: 'badge', id: 'badge_op' }],

  52: [{ type: 'title', id: 'title_bataillon' }],
  53: [{ type: 'avatar', id: 'avatar_snk' }],
  55: [{ type: 'skin', id: 'skin_titan' }],
  57: [{ type: 'background', id: 'bg_foret' }],
  59: [{ type: 'badge', id: 'badge_snk' }],
  60: [{ type: 'pet', id: 'pet3' }],

  62: [{ type: 'title', id: 'title_dimensions' }],
  63: [{ type: 'avatar', id: 'avatar_rick_morty' }],
  65: [{ type: 'background', id: 'bg_portal' }],
  67: [{ type: 'skin', id: 'skin_rick' }],
  69: [{ type: 'badge', id: 'badge_rick' }],

  72: [{ type: 'title', id: 'title_samourai' }],
  73: [{ type: 'avatar', id: 'avatar_samourai' }],
  75: [{ type: 'background', id: 'bg_japon' }],
  77: [{ type: 'skin', id: 'skin_samourai' }],
  79: [{ type: 'badge', id: 'badge_dragon' }],
  80: [{ type: 'pet', id: 'pet4' }],

  82: [{ type: 'title', id: 'title_dragons' }],
  83: [{ type: 'avatar', id: 'avatar_dragons' }],
  85: [{ type: 'skin', id: 'skin_dragon_hunter' }],
  87: [{ type: 'background', id: 'bg_got' }],
  88: [{ type: 'badge', id: 'badge_tiers3_1' }],
  89: [{ type: 'badge', id: 'badge_tiers3_2' }],
  90: [{ type: 'pet', id: 'pet_dragon_legendary' }],

  91: [{ type: 'skin', id: 'skin_backpacker' }],
  92: [{ type: 'badge', id: 'badge_tiers3_3' }],
  93: [{ type: 'badge', id: 'badge_tiers3_4' }],
  94: [{ type: 'skin', id: 'skin_quilby' }],
  95: [{ type: 'pet', id: 'pet_bob' }],
  96: [{ type: 'skin', id: 'skin_ultra_rare_zoro' }],
  97: [{ type: 'skin', id: 'skin_roi_liche' }],
  98: [{ type: 'background', id: 'bg_got' }],
  99: [{ type: 'avatar', id: 'avatar_king' }],
  100: [
    { type: 'title', id: 'title_endgame' },
    { type: 'avatar', id: 'avatar_endgame' },
    { type: 'background', id: 'bg_end_game' },
    { type: 'skin', id: 'skin_imu' },
    { type: 'badge', id: 'badge_endgame' },
    { type: 'pet', id: 'pet_endgame' }
  ]
};

const rewardUnlockLevels = {};

Object.entries(levelRewards).forEach(([levelKey, rewards]) => {
  rewards.forEach((reward) => {
    rewardUnlockLevels[reward.id] = parseInt(levelKey, 10);
  });
});

// Exposer la map en localStorage pour que script.js puisse afficher les niveaux de déblocage
localStorage.setItem('_levelRewardsMap', JSON.stringify(rewardUnlockLevels));

// Map des récompenses issues de hauts faits (id → label HF)
const achievementSourceMap = {};

// Sera rempli après la définition de ACHIEVEMENT_CATEGORIES
function buildAchievementSourceMap() {
  if (typeof ACHIEVEMENT_CATEGORIES === 'undefined') return;
  ACHIEVEMENT_CATEGORIES.forEach(cat => {
    (cat.steps || []).forEach(step => {
      if (step.reward && step.reward.id) {
        achievementSourceMap[step.reward.id] = `HF : ${cat.name}`;
      }
    });
  });
}

// Helper : retourne le bon label de déblocage pour n'importe quel item
function getUnlockLabel(id) {
  if (rewardUnlockLevels[id]) return `Niveau ${rewardUnlockLevels[id]}`;
  if (achievementSourceMap[id])  return achievementSourceMap[id];
  return null; // item de base, pas de label
}

// Noms lisibles pour les récompenses dans les popups HF
const REWARD_NAMES = {
  // Titres HF niveaux
  title_hf_lvl10:  'Titre : Gameur Pro',
  title_hf_lvl20:  'Titre : Travailleur Acharné',
  title_hf_lvl30:  'Titre : Bourg-Palette',
  title_hf_lvl40:  "Titre : Oeil de l'Infini",
  title_hf_lvl50:  'Titre : Yonko',
  title_hf_lvl60:  'Titre : Explorateur',
  title_hf_lvl70:  'Titre : Chef Galactique',
  title_hf_lvl80:  'Titre : Divin',
  title_hf_lvl90:  'Titre : Maitre',
  title_hf_lvl100: 'Titre : Targaryen',
  // Titres HF autres
  title_hf_eleveur: 'Titre : Légendaire Éleveur de Bêtes',
  title_hf_rpg:     'Titre : RPG',
  // Backgrounds connexion
  bg_paris:        'Background : Paris',
  bg_japon:        'Background : Japon',
  bg_usa:          'Background : Amérique',
  bg_australie:    'Background : Australie',
  bg_afrique:      'Background : Afrique',
  bg_marineford:   'Background : Marine Ford',
  bg_hell:         'Background : Hell',
  bg_paradis:      'Background : Paradis',
  bg_hf_250:       'Background : Rare (à définir)',
  bg_hf_300:       'Background : Ultime (à définir)',
  bg_end_game:     'Background : End Game',
  // Backgrounds quêtes
  bg_dofus:        'Background : Dofus',
  // Avatars pets
  avatar_pet1:     'Avatar : Hericendre',
  avatar_pet2:     'Avatar : Chopper',
  avatar_pet3:     'Avatar : Titan Capturé',
  avatar_pet4:     'Avatar : Aigle Royale',
  // Skins quêtes
  skin_iop:        'Skin : IOP',
  skin_xelor:      'Skin : Xelor',
  // Hauts Faits : Échecs
  skin_carlsen:    'Skin : Carlsen',
  bg_echecs:       'Background : Échiquier',
  avatar_plat:     'Avatar : Platine',
  title_method:    'Titre : Le Méthodique',
  title_carlsen:   'Titre : Carlsen',
  // Meta
  pack_legendary:  '🏆 Pack Légendaire (tout débloquer)',
};

function getRewardLabel(reward) {
  if (!reward) return '';
  if (REWARD_NAMES[reward.id]) return REWARD_NAMES[reward.id];
  // Fallback : type + id nettoyé
  const typeLabel = reward.type === 'title' ? 'Titre'
    : reward.type === 'background' ? 'Background'
    : reward.type === 'skin'       ? 'Skin'
    : reward.type === 'avatar'     ? 'Avatar'
    : reward.type === 'legendary_pack' ? 'Pack Légendaire'
    : reward.type;
  return `${typeLabel} : ${reward.id}`;
}




// ────────────────
// SAUVEGARDE / GETTERS
// ────────────────
function saveSkins() {
  localStorage.setItem('skins', JSON.stringify(skins));
}

function saveBackgrounds() {
  localStorage.setItem('backgrounds', JSON.stringify(backgrounds));
}

function savePets() {
  localStorage.setItem('pets', JSON.stringify(pets));
  localStorage.setItem('equippedPetId', equippedPetId);
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ pets, equipped_pet: equippedPetId });
  }
}

function saveBadges() {
  localStorage.setItem('badges', JSON.stringify(badges));
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ badges });
  }
}

function saveTitlesAndAvatars() {
  localStorage.setItem('titles', JSON.stringify(titles));
  localStorage.setItem('avatars', JSON.stringify(avatars));
  localStorage.setItem('equippedTitleId', equippedTitleId);
  localStorage.setItem('equippedAvatarId', equippedAvatarId);
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({
      titles, avatars,
      equipped_title:  equippedTitleId,
      equipped_avatar: equippedAvatarId
    });
  }
}

function getEquippedPet() {
  const equippedPet = pets.find((pet) => pet.id === equippedPetId && pet.owned);
  if (equippedPet) return equippedPet;
  return pets.find((pet) => pet.owned) || null;
}

function getEquippedTitle() {
  return titles.find((title) => title.id === equippedTitleId) || titles[0];
}

function getEquippedAvatar() {
  return avatars.find((avatar) => avatar.id === equippedAvatarId) || avatars[0];
}

// ────────────────
// MIGRATION ANCIEN PET
// ────────────────
const oldPet = JSON.parse(localStorage.getItem('pet'));
if (oldPet && !localStorage.getItem('pets')) {
  pets[0] = {
    ...pets[0],
    level: oldPet.level || 1,
    xp: oldPet.xp || 0,
    share: typeof oldPet.share === 'number' ? oldPet.share : 0.1,
    active: oldPet.active !== false,
    owned: true
  };
  equippedPetId = pets[0].id;
  localStorage.removeItem('pet');
  savePets();
}

// ────────────────
// RECOMPENSES
// ────────────────
function unlockReward(reward) {
  if (reward.type === 'title') {
    const title = titles.find((item) => item.id === reward.id);
    if (title) {
      title.owned = true;
      saveTitlesAndAvatars();
    }
  }

  if (reward.type === 'avatar') {
    const avatar = avatars.find((item) => item.id === reward.id);
    if (avatar) {
      avatar.owned = true;
      saveTitlesAndAvatars();
    }
  }

  if (reward.type === 'skin') {
    const skin = skins.find((item) => item.id === reward.id);
    if (skin) {
      skin.owned = true;
      saveSkins();
    }
  }

  if (reward.type === 'background') {
    const bg = backgrounds.find((item) => item.id === reward.id);
    if (bg) {
      bg.owned = true;
      saveBackgrounds();
    }
  }

  if (reward.type === 'skin') {
    const skin = skins.find(s => s.id === reward.id);
    if (skin) { skin.owned = true; saveSkins(); }
  }

  if (reward.type === 'background') {
    const bg = backgrounds.find(b => b.id === reward.id);
    if (bg) { bg.owned = true; saveBackgrounds(); }
  }

  if (reward.type === 'badge') {
    const badge = badges.find((item) => item.id === reward.id);
    if (badge) {
      badge.owned = true;
      saveBadges();
    }
  }

  if (reward.type === 'pet') {
    const pet = pets.find((item) => item.id === reward.id);
    if (pet) {
      pet.owned = true;
      savePets();
    }
  }
}

function applyLevelRewardsFor(levelReached) {
  const rewards = levelRewards[levelReached];
  if (!rewards || rewards.length === 0) return;

  rewards.forEach((reward) => {
    unlockReward(reward);
  });

  const rewardNames = rewards.map((reward) => reward.id).join(', ');
  alert(`Nouvelle recompense debloquee ! (${rewardNames})`);
}

function syncRewardsWithCurrentLevel() {
  for (let i = 1; i <= level; i++) {
    const rewards = levelRewards[i];
    if (!rewards) continue;

    rewards.forEach((reward) => {
      unlockReward(reward);
    });
  }
}

// ────────────────
// FONCTIONS PETS
// ────────────────
function getPetBonus(statName) {
  const pet = getEquippedPet();
  if (!pet || !pet.active) return 0;

  if (pet.stat === statName) {
    return Math.min(pet.level, 50);
  }

  if (pet.stat === 'ForceIntelligence') {
    return (statName === 'Force' || statName === 'Intelligence')
      ? Math.floor(Math.min(pet.level, 50) / 2)
      : 0;
  }

  if (pet.stat === 'All') {
    return Math.floor(Math.min(pet.level, 50) * 0.2);
  }

  if (pet.stat === 'EndGame') {
    return Math.floor(Math.min(pet.level, 50) * 0.3);
  }

  return 0;
}

// ────────────────
// FONCTIONS BADGES
// ────────────────
function getBadgeBonus(statName, flatValue) {
  let flat = 0;
  let multiplier = 1;

  badges.forEach(badge => {
    if (!badge.owned || !badge.equippedSlot) return;
    const statDef = badge.stats[statName];
    if (!statDef) return;

    if (badge.multiplier) {
      multiplier *= statDef.dominant;
    } else {
      const val = badge.equippedSlot === statName ? statDef.dominant : statDef.base;
      flat += val;
    }
  });

  return Math.floor((flatValue + flat) * multiplier) - flatValue;
}

function renderBadgeInventory() {
  const list = document.getElementById('badge-list');
  if (!list) return;

  list.innerHTML = '';

  badges.forEach(badge => {
    const item = document.createElement('button');
    item.className = 'badge-inv-item';
    item.type = 'button';

    if (!badge.owned) item.classList.add('locked');
    if (badge.equippedSlot) item.classList.add('equipped');

    const unlockLevel = rewardUnlockLevels[badge.id] || '?';

    const statLines = Object.entries(badge.stats).map(([s, v]) =>
      `${s} base ${v.base} / dom. ${v.dominant}`
    ).join('<br>');

    item.innerHTML = `
      <div class="reward-card-media">
        <img src="${badge.src}" alt="${badge.name}" class="badge-inv-img">
        ${!badge.owned ? '<div class="reward-lock">🔒</div>' : ''}
      </div>
      <span class="badge-inv-name">${badge.name}</span>
      <span class="badge-inv-stats">${statLines}</span>
      ${badge.equippedSlot ? `<span class="badge-inv-slot">Slot : ${badge.equippedSlot}</span>` : ''}
      ${!badge.owned ? `<span class="reward-unlock-text">Niveau ${unlockLevel}</span>` : ''}
    `;

    list.appendChild(item);
  });
}

function getPetXpNeeded(levelValue) {
  return Math.floor(60 + levelValue * 25 + levelValue * levelValue * 3);
}

// ────────────────
// STATS ECHECS (pour HF)
// ────────────────

function getTotalChessGames() {
  const journal = JSON.parse(localStorage.getItem('journal')) || {};
  return Object.values(journal).reduce((sum, entry) => sum + (parseInt(entry.games) || 0), 0);
}

function getChessStreak() {
  const journal = JSON.parse(localStorage.getItem('journal')) || {};
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const entry = journal[key];
    if (entry && parseInt(entry.games) > 0) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

function getPeakElo() {
  const current = parseInt(localStorage.getItem('currentElo')) || 0;
  const peak    = parseInt(localStorage.getItem('peakElo'))    || 0;
  if (current > peak) {
    localStorage.setItem('peakElo', current);
    return current;
  }
  return peak;
}

// ════════════════════════════════════════════
//  HAUTS FAITS
// ════════════════════════════════════════════
//
// ⚙ MODIFIER UN TITRE/RÉCOMPENSE  → cherche reward: { type, id } dans ACHIEVEMENT_CATEGORIES
// ⚙ MODIFIER UNE CONDITION        → cherche target: N dans la step concernée
// ⚙ AJOUTER UNE ÉTAPE             → ajouter { id, label, target, getValue, reward } dans steps[]
// ⚙ COMPLÉTER 250/300 JOURS       → cherche bg_hf_250 / bg_hf_300 dans backgrounds[] ET ici

const ACHIEVEMENT_CATEGORIES = [

  // ── 🎮 MONTÉE DE NIVEAU ──────────────────────────────────────────
  {
    id: 'hf_levels',
    name: 'Montée de Niveau',
    icon: 'assets/achievements/hf_levels.png',
    getValue: () => parseInt(localStorage.getItem('level')) || 1,
    steps: [
      { id: 'hf_lvl10',  label: 'Atteindre le niveau 10',  target: 10,  reward: { type: 'title', id: 'title_hf_lvl10'  } },
      { id: 'hf_lvl20',  label: 'Atteindre le niveau 20',  target: 20,  reward: { type: 'title', id: 'title_hf_lvl20'  } },
      { id: 'hf_lvl30',  label: 'Atteindre le niveau 30',  target: 30,  reward: { type: 'title', id: 'title_hf_lvl30'  } },
      { id: 'hf_lvl40',  label: 'Atteindre le niveau 40',  target: 40,  reward: { type: 'title', id: 'title_hf_lvl40'  } },
      { id: 'hf_lvl50',  label: 'Atteindre le niveau 50',  target: 50,  reward: { type: 'title', id: 'title_hf_lvl50'  } },
      { id: 'hf_lvl60',  label: 'Atteindre le niveau 60',  target: 60,  reward: { type: 'title', id: 'title_hf_lvl60'  } },
      { id: 'hf_lvl70',  label: 'Atteindre le niveau 70',  target: 70,  reward: { type: 'title', id: 'title_hf_lvl70'  } },
      { id: 'hf_lvl80',  label: 'Atteindre le niveau 80',  target: 80,  reward: { type: 'title', id: 'title_hf_lvl80'  } },
      { id: 'hf_lvl90',  label: 'Atteindre le niveau 90',  target: 90,  reward: { type: 'title', id: 'title_hf_lvl90'  } },
      { id: 'hf_lvl100', label: 'Atteindre le niveau 100', target: 100, reward: { type: 'title', id: 'title_hf_lvl100' } },
    ]
  },

  // ── 📅 CONNEXION RÉGULIÈRE ───────────────────────────────────────
  {
    id: 'hf_login',
    name: 'Connexion Régulière',
    icon: 'assets/achievements/hf_login.png',
    getValue: () => parseInt(localStorage.getItem('totalLoginDays')) || 0,
    steps: [
      { id: 'hf_login25',  label: '25 jours de connexion',  target: 25,  reward: { type: 'background', id: 'bg_paris'       } },
      { id: 'hf_login50',  label: '50 jours de connexion',  target: 50,  reward: { type: 'background', id: 'bg_japon' } },
      { id: 'hf_login75',  label: '75 jours de connexion',  target: 75,  reward: { type: 'background', id: 'bg_usa'          } },
      { id: 'hf_login100', label: '100 jours de connexion', target: 100, reward: { type: 'background', id: 'bg_australie'    } },
      { id: 'hf_login125', label: '125 jours de connexion', target: 125, reward: { type: 'background', id: 'bg_afrique'      } },
      { id: 'hf_login150', label: '150 jours de connexion', target: 150, reward: { type: 'background', id: 'bg_marineford'   } },
      { id: 'hf_login175', label: '175 jours de connexion', target: 175, reward: { type: 'background', id: 'bg_hell'         } },
      { id: 'hf_login200', label: '200 jours de connexion', target: 200, reward: { type: 'background', id: 'bg_paradis'      } },
      // ⚙ À COMPLÉTER — changer reward.id quand tu as trouvé les récompenses 250/300j
      { id: 'hf_login250', label: '250 jours de connexion', target: 250, reward: { type: 'background', id: 'bg_hf_250'       } },
      { id: 'hf_login300', label: '300 jours de connexion', target: 300, reward: { type: 'background', id: 'bg_hf_300'       } },
      { id: 'hf_login400', label: '400 jours de connexion', target: 400, reward: { type: 'background', id: 'bg_japon'    } },
      { id: 'hf_login500', label: '500 jours de connexion', target: 500, reward: { type: 'background', id: 'bg_japon'    } },
    ]
  },

  // ── ♟️ ÉCHECS ────────────────────────────────────────────────────
  {
    id: 'hf_chess',
    name: 'Échecs',
    icon: 'assets/achievements/hf_chess.png',
    steps: [
      {
        id: 'hf_chess_platine',
        label: 'Atteindre la ligue Platine (ELO ≥ 901)',
        target: 901,
        getValue: () => getPeakElo(),
        reward: { type: 'skin', id: 'skin_carlsen' }
      },
      {
        id: 'hf_chess_xp5000',
        label: 'Gagner 5 000 XP via les Échecs',
        target: 5000,
        getValue: () => parseInt(localStorage.getItem('totalChessXP')) || 0,
        reward: { type: 'background', id: 'bg_echecs' }
      },
      {
        id: 'hf_chess_games250',
        label: "Jouer 250 parties d'Échecs",
        target: 250,
        getValue: () => getTotalChessGames(),
        reward: { type: 'title', id: 'title_method' }
      },
      {
        id: 'hf_chess_avatar',
        label: '250 parties — Avatar Platine',
        target: 250,
        getValue: () => getTotalChessGames(),
        reward: { type: 'avatar', id: 'avatar_plat' }
      },
      {
        id: 'hf_chess_streak30',
        label: "Jouer aux Échecs 30 jours de suite",
        target: 30,
        getValue: () => getChessStreak(),
        reward: { type: 'title', id: 'title_carlsen' }
      },
    ]
  },

  // ── 🐾 FAMILIER ─────────────────────────────────────────────────
  {
    id: 'hf_pets',
    name: 'Familier',
    icon: 'assets/achievements/hf_pets.png',
    getValue: () => pets.filter(p => p.owned && ['pet1','pet2','pet3','pet4'].includes(p.id)).length,
    steps: [
      { id: 'hf_pets_all', label: 'Déverrouiller les 4 familiers de base', target: 4, reward: { type: 'title', id: 'title_hf_eleveur' } },
      // ⚙ avatars pets — visuels à créer (assets/avatars/avatar_pet1-4.png)
      { id: 'hf_pet1_max', label: 'Familier Intelligence niveau 50', target: 1,
        getValue: () => { const p = pets.find(x => x.id==='pet1'); return (p && p.owned && p.level >= 50) ? 1 : 0; },
        reward: { type: 'avatar', id: 'avatar_pet1' } },
      { id: 'hf_pet2_max', label: 'Familier Force niveau 50',        target: 1,
        getValue: () => { const p = pets.find(x => x.id==='pet2'); return (p && p.owned && p.level >= 50) ? 1 : 0; },
        reward: { type: 'avatar', id: 'avatar_pet2' } },
      { id: 'hf_pet3_max', label: 'Familier Discipline niveau 50',   target: 1,
        getValue: () => { const p = pets.find(x => x.id==='pet3'); return (p && p.owned && p.level >= 50) ? 1 : 0; },
        reward: { type: 'avatar', id: 'avatar_pet3' } },
      { id: 'hf_pet4_max', label: 'Familier Focus niveau 50',        target: 1,
        getValue: () => { const p = pets.find(x => x.id==='pet4'); return (p && p.owned && p.level >= 50) ? 1 : 0; },
        reward: { type: 'avatar', id: 'avatar_pet4' } },
    ]
  },

  // ── ⚔️ QUÊTES ────────────────────────────────────────────────────
  {
    id: 'hf_quests',
    name: 'Quêtes',
    icon: 'assets/achievements/hf_quests.png',
    steps: [
      { id: 'hf_quests50',    label: 'Réaliser 50 quêtes',            target: 50,
        getValue: () => parseInt(localStorage.getItem('totalQuestsDone')) || 0,
        reward: { type: 'title', id: 'title_hf_rpg' } },
      { id: 'hf_quests100',   label: 'Réaliser 100 quêtes',           target: 100,
        getValue: () => parseInt(localStorage.getItem('totalQuestsDone')) || 0,
        reward: { type: 'background', id: 'bg_dofus' } },
      { id: 'hf_questxp50k',  label: 'Gagner 50 000 XP via quêtes',  target: 50000,
        getValue: () => parseInt(localStorage.getItem('totalQuestXP')) || 0,
        reward: { type: 'skin', id: 'skin_iop' } },
      { id: 'hf_questxp100k', label: 'Gagner 100 000 XP via quêtes', target: 100000,
        getValue: () => parseInt(localStorage.getItem('totalQuestXP')) || 0,
        reward: { type: 'skin', id: 'skin_xelor' } },
    ]
  },

  // ── 🏆 META ──────────────────────────────────────────────────────
  {
    id: 'hf_meta',
    name: 'Meta',
    icon: 'assets/achievements/hf_meta.png',
    steps: [
      { id: 'hf_meta_all', label: 'Réaliser TOUS les hauts faits', target: 1,
        getValue: () => areAllAchievementsDone() ? 1 : 0,
        reward: { type: 'legendary_pack', id: 'pack_legendary' } },
    ]
  }
];

// ────────────────
// SAUVEGARDE HAUTS FAITS
// ────────────────

// Construire la map source après définition des catégories
buildAchievementSourceMap();

function getClaimedAchievements() {
  return JSON.parse(localStorage.getItem('achievementsClaimed')) || {};
}
function saveClaimedAchievements(claimed) {
  localStorage.setItem('achievementsClaimed', JSON.stringify(claimed));
}

// ────────────────
// PROGRESSION PAR CATÉGORIE
// ────────────────
function getAchievementProgress(cat) {
  const claimed = getClaimedAchievements();
  let done = 0;
  const steps = cat.steps || [];

  steps.forEach(step => {
    if (claimed[step.id]) { done++; return; }
    const val = (step.getValue || cat.getValue || (() => 0))();
    if (val >= step.target) done++;
  });

  return { done, total: steps.length };
}

function areAllAchievementsDone() {
  return ACHIEVEMENT_CATEGORIES
    .filter(c => c.id !== 'hf_meta')
    .every(cat => {
      const { done, total } = getAchievementProgress(cat);
      return done >= total;
    });
}

// ────────────────
// UNLOCK RÉCOMPENSE HF
// ────────────────
function unlockAchievementReward(reward) {
  if (!reward) return;

  if (reward.type === 'legendary_pack') {
    skins.forEach(s => { s.owned = true; }); saveSkins();
    backgrounds.forEach(b => { b.owned = true; }); saveBackgrounds();
    titles.forEach(t => { t.owned = true; }); saveTitlesAndAvatars();
    avatars.forEach(a => { a.owned = true; }); saveTitlesAndAvatars();
    alert('🏆 PACK LÉGENDAIRE ! Tous les contenus sont débloqués !');
    return;
  }

  unlockReward(reward);
}

// ────────────────
// VÉRIFICATION ET ATTRIBUTION
// ────────────────
function checkAllAchievements() {
  const claimed = getClaimedAchievements();
  let anyNew = false;

  ACHIEVEMENT_CATEGORIES.forEach(cat => {
    (cat.steps || []).forEach(step => {
      if (claimed[step.id]) return;

      const val = (step.getValue || cat.getValue || (() => 0))();
      if (val >= step.target) {
        claimed[step.id] = true;
        anyNew = true;
        if (step.reward) {
          unlockAchievementReward(step.reward);
          alert(`🏆 Haut Fait : "${step.label}" débloqué !\nRécompense : ${getRewardLabel(step.reward)}`);
        }
      }
    });
  });

  if (anyNew) {
    saveClaimedAchievements(claimed);
    renderAchievements();
  }
}

// ────────────────
// COMPTEURS QUÊTES
// ────────────────
function trackQuestStats(count, xpGained) {
  const total = (parseInt(localStorage.getItem('totalQuestsDone')) || 0) + count;
  const totalXP = (parseInt(localStorage.getItem('totalQuestXP')) || 0) + xpGained;
  localStorage.setItem('totalQuestsDone', total);
  localStorage.setItem('totalQuestXP', totalXP);
}

// ────────────────
// RENDER GRILLE HAUTS FAITS
// ────────────────
function renderAchievements() {
  const container = document.getElementById('achievements-grid');
  if (!container) return;

  const claimed = getClaimedAchievements();
  container.innerHTML = '';

  ACHIEVEMENT_CATEGORIES.forEach(cat => {
    const { done, total } = getAchievementProgress(cat);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const card = document.createElement('div');
    card.className = 'hf-card' + (pct === 100 ? ' hf-card-done' : '');
    card.title = `${cat.name} — ${done}/${total} étapes (${pct}%) — Cliquer pour détails`;
    card.innerHTML = `
      <img src="${cat.icon}" alt="${cat.name}" class="hf-icon">
      <div class="hf-name">${cat.name}</div>
      <div class="hf-bar-wrap">
        <div class="hf-bar" style="width:${pct}%"></div>
      </div>
      <div class="hf-pct">${pct}%</div>
    `;
    card.addEventListener('click', () => openAchievementPopup(cat));
    container.appendChild(card);
  });
}

// ────────────────
// POPUP HAUT FAIT
// ────────────────
function openAchievementPopup(cat) {
  const overlay = document.getElementById('hf-popup');
  const title   = document.getElementById('hf-popup-title');
  const list    = document.getElementById('hf-popup-list');
  if (!overlay) return;

  title.textContent = cat.name;
  list.innerHTML = '';

  const claimed = getClaimedAchievements();

  (cat.steps || []).forEach(step => {
    const getValue = step.getValue || cat.getValue || (() => 0);
    const value   = getValue();
    const isDone  = !!claimed[step.id] || value >= step.target;

    const item = document.createElement('div');
    item.className = 'hf-step' + (isDone ? ' hf-step-done' : '');

    // Barre de progression numérique
    let progressHTML = '';
    if (step.target && step.target < 999999) {
      const stepPct = Math.min(Math.round((value / step.target) * 100), 100);
      progressHTML = `
        <div class="hf-step-bar-wrap">
          <div class="hf-step-bar" style="width:${stepPct}%"></div>
          <span class="hf-step-bar-label">${Math.min(value, step.target).toLocaleString()} / ${step.target.toLocaleString()}</span>
        </div>`;
    }

    // Label récompense
    let rewardHTML = '';
    if (step.reward === null) {
      rewardHTML = `<div class="hf-step-reward hf-reward-soon">🎁 À venir</div>`;
    } else if (step.reward) {
      rewardHTML = `<div class="hf-step-reward">🎁 ${getRewardLabel(step.reward)}</div>`;
    }

    item.innerHTML = `
      <div class="hf-step-header">
        <span class="hf-step-check">${isDone ? '✅' : '⬜'}</span>
        <span class="hf-step-label">${step.label}</span>
      </div>
      ${progressHTML}
      ${rewardHTML}
    `;
    list.appendChild(item);
  });

  overlay.classList.add('active');
}

// ────────────────
// REFERENCES DOM
// ────────────────
const xpBar = document.querySelector('.xp-bar');
const xpText = document.querySelector('.xp-text');
const levelText = document.querySelector('.level');

const questListEl = document.querySelector('.quest-list');
const newQuestInput = document.querySelector('#new-quest');
const addQuestBtn = document.querySelector('#add-quest');
const validateBtn = document.querySelector('.validate-btn');

const statsBox = document.querySelector('#stats-box');
const statsToggle = document.querySelector('#stats-toggle');
const resetBtn = document.querySelector('.reset-btn');
const resetSkillsBtn = document.getElementById('reset-skills');

const journalBtn = document.getElementById('open-journal');
const journalPopup = document.getElementById('journal-popup');
const closeJournal = document.getElementById('close-journal');

const petBtn = document.getElementById('open-pet');
const petPopup = document.getElementById('pet-popup');
const closePet = document.getElementById('close-pet');

const petDisplay = document.getElementById('pet-display');
const petInventory = document.getElementById('pet-inventory');
const closePetInventory = document.getElementById('close-pet-inventory');

const shareToggle = document.getElementById('pet-share-toggle');
const shareInput = document.getElementById('pet-share-input');

const profileAvatar = document.getElementById('profile-avatar');
const openTitlesBtn = document.getElementById('open-titles');
const titlePopup = document.getElementById('title-popup');
const closeTitlePopup = document.getElementById('close-title-popup');
const titleList = document.getElementById('title-list');

const avatarPopup = document.getElementById('avatar-popup');
const closeAvatarPopup = document.getElementById('close-avatar-popup');

// ────────────────
// XP JOUEUR
// ────────────────
function getXpToNextLevel(currentLevel) {
  return 100 + (currentLevel - 1) * 50;
}

function updateXPBar() {
  const xpNeeded = getXpToNextLevel(level);
  const percent = Math.min((xp / xpNeeded) * 100, 100);

  if (xpBar) xpBar.style.width = `${percent}%`;
  if (xpText) xpText.textContent = `${xp} / ${xpNeeded}`;
  if (levelText) levelText.textContent = `LEVEL ${level}`;
}

function checkLevelUp() {
  let xpNeeded = getXpToNextLevel(level);

  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    level++;

    let statPoints = parseInt(localStorage.getItem('statPoints')) || 0;
    statPoints += 2;
    localStorage.setItem('statPoints', statPoints);

    applyLevelRewardsFor(level);

    xpNeeded = getXpToNextLevel(level);
    alert(`LEVEL UP ! Niveau ${level}`);
  }

  localStorage.setItem('xp', xp);
  localStorage.setItem('level', level);

  updateXPBar();
  updatePointsUI();
  updateProfilePanel();
  checkAllAchievements();
}

function addXP(amount) {
  const equippedPet = getEquippedPet();
  const share = equippedPet ? (equippedPet.share || 0.1) : 0;

  const playerXP = Math.floor(amount * (1 - share));

  xp += playerXP;
  localStorage.setItem('xp', xp);

  checkLevelUp();
  updateXPBar();

  addPetXP(amount);
  updateProfilePanel();

  // Sync Supabase
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ xp, level: parseInt(localStorage.getItem('level')) || 1 });
  }
}

// ────────────────
// XP FAMILIER
// ────────────────
function addPetXP(amount) {
  const pet = getEquippedPet();
  if (!pet || !pet.active) return;

  const share = pet.share || 0.1;
  const petXP = Math.floor(amount * share);

  pet.xp += petXP;

  let xpNeeded = getPetXpNeeded(pet.level);

  while (pet.xp >= xpNeeded && pet.level < 50) {
    pet.xp -= xpNeeded;
    pet.level++;
    xpNeeded = getPetXpNeeded(pet.level);
  }

  savePets();
  updatePetUI();
  updateStatsUI();
}

// ────────────────
// XP QUOTIDIEN
// ────────────────
function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function giveDailyXP() {
  const today = getToday();
  const lastLogin = localStorage.getItem('lastLogin');

  if (lastLogin !== today) {
    addXP(5);
    localStorage.setItem('lastLogin', today);
    const days = (parseInt(localStorage.getItem('totalLoginDays')) || 0) + 1;
    localStorage.setItem('totalLoginDays', days);
    console.log('+5 XP (connexion) — jour total :', days);
    checkAllAchievements();

    // Sync Supabase
    if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
      window.TentiaAPI.saveProfile({
        last_login: today,
        total_login_days: days
      });
    }
  }

  updateProfilePanel();
}

// ────────────────
// QUETES
// ────────────────
let quests = JSON.parse(localStorage.getItem('quests')) || [];

function generateID() {
  return `q_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function saveQuests() {
  localStorage.setItem('quests', JSON.stringify(quests));
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ quests });
  }
}

// ────────────────
// HISTORIQUE QUÊTES
// ────────────────
function saveQuestHistory(questText) {
  const history = JSON.parse(localStorage.getItem('questHistory')) || {};
  const today = getToday();
  if (!history[today]) history[today] = [];
  history[today].push(questText);
  localStorage.setItem('questHistory', JSON.stringify(history));
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ quests }); // on piggyback sur quests pour l'instant
  }
}

function openQuestHistoryPopup() {
  const overlay = document.getElementById('quest-history-popup');
  const list    = document.getElementById('quest-history-list');
  if (!overlay || !list) return;

  const history = JSON.parse(localStorage.getItem('questHistory')) || {};
  list.innerHTML = '';

  const dates = Object.keys(history).sort().reverse();
  if (dates.length === 0) {
    list.innerHTML = '<div class="qh-empty">Aucune quête accomplie pour le moment.</div>';
  } else {
    dates.forEach(date => {
      const block = document.createElement('div');
      block.className = 'qh-block';
      const d = new Date(date);
      const label = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
      block.innerHTML = `<div class="qh-date">${label}</div>`;
      history[date].forEach(q => {
        const item = document.createElement('div');
        item.className = 'qh-item';
        item.textContent = '✅ ' + q;
        block.appendChild(item);
      });
      list.appendChild(block);
    });
  }

  overlay.classList.add('active');
}

function renderQuests() {
  if (!questListEl) return;

  questListEl.innerHTML = '';

  quests.forEach((quest) => {
    const li = document.createElement('li');

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = quest.completed;
    label.appendChild(checkbox);

    const span = document.createElement('span');
    span.textContent = quest.text;
    label.appendChild(span);

    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.className = 'edit-quest-btn';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.className = 'delete-quest-btn';

    const content = document.createElement('div');
    content.className = 'quest-content';
    content.appendChild(label);

    const actions = document.createElement('div');
    actions.className = 'quest-actions';
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(content);
    li.appendChild(actions);
    questListEl.appendChild(li);

    checkbox.addEventListener('change', () => {
      quest.completed = checkbox.checked;
      saveQuests();
    });

    editBtn.addEventListener('click', () => {
      const newText = prompt('Modifier la quête', quest.text);
      if (newText) {
        quest.text = newText;
        saveQuests();
        renderQuests();
      }
    });

    deleteBtn.addEventListener('click', () => {
      quests = quests.filter((q) => q.id !== quest.id);
      saveQuests(); // sync Supabase automatiquement
      renderQuests();
    });
  });
}

// ────────────────
// STATS JOUEUR
// ────────────────
function addStat(statName) {
  let statPoints = parseInt(localStorage.getItem('statPoints')) || 0;

  if (statPoints <= 0) {
    alert('Plus de points disponibles !');
    return;
  }

  let value = parseInt(localStorage.getItem(statName)) || 0;
  value++;
  statPoints--;

  localStorage.setItem(statName, value);
  localStorage.setItem('statPoints', statPoints);

  updateStatsUI();
  updatePointsUI();

  // Sync Supabase
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({
      force:        parseInt(localStorage.getItem('Force'))        || 0,
      intelligence: parseInt(localStorage.getItem('Intelligence')) || 0,
      discipline:   parseInt(localStorage.getItem('Discipline'))   || 0,
      focus:        parseInt(localStorage.getItem('Focus'))        || 0,
      points_left:  statPoints
    });
  }
}

function updateStatsUI() {
  const force = parseInt(localStorage.getItem('Force')) || 0;
  const intelligence = parseInt(localStorage.getItem('Intelligence')) || 0;
  const discipline = parseInt(localStorage.getItem('Discipline')) || 0;
  const focus = parseInt(localStorage.getItem('Focus')) || 0;

  document.getElementById('stat-force').textContent      = force + getPetBonus('Force') + getBadgeBonus('Force', force + getPetBonus('Force'));
  document.getElementById('stat-intel').textContent      = intelligence + getPetBonus('Intelligence') + getBadgeBonus('Intelligence', intelligence + getPetBonus('Intelligence'));
  document.getElementById('stat-discipline').textContent = discipline + getPetBonus('Discipline') + getBadgeBonus('Discipline', discipline + getPetBonus('Discipline'));
  document.getElementById('stat-focus').textContent      = focus + getPetBonus('Focus') + getBadgeBonus('Focus', focus + getPetBonus('Focus'));
}

function updatePointsUI() {
  const points = parseInt(localStorage.getItem('statPoints')) || 0;
  const el = document.getElementById('points-left');
  if (el) el.textContent = points;
}

// ────────────────
// PROFIL
// ────────────────
function updateProfilePanel() {
  const lvl = parseInt(localStorage.getItem('level')) || 1;
  const elo = parseInt(localStorage.getItem('currentElo')) || 0;

  const equippedTitle = getEquippedTitle();
  const equippedAvatar = getEquippedAvatar();

  const levelEl = document.getElementById('profile-level');
  const avatarEl = document.getElementById('profile-avatar');
  const titleEl = document.getElementById('profile-title');

  if (levelEl) levelEl.textContent = lvl;
  if (avatarEl && equippedAvatar) avatarEl.src = equippedAvatar.src;
  if (titleEl && equippedTitle) titleEl.textContent = equippedTitle.name;


  let ligueLogo = 'assets/ligues/placeholder-ligue.png';
  let ligueName = 'Non classé';
  if      (elo < 300) { ligueLogo = 'assets/ligues/Bronze.png';  ligueName = `🥉 Bronze (${elo} ELO)`; }
  else if (elo < 600) { ligueLogo = 'assets/ligues/Argent.png';  ligueName = `🥈 Argent (${elo} ELO)`; }
  else if (elo < 900) { ligueLogo = 'assets/ligues/Or.png';      ligueName = `🥇 Or (${elo} ELO)`;     }
  else                { ligueLogo = 'assets/ligues/Platine.png'; ligueName = `💎 Platine (${elo} ELO)`; }

  const leagueEl = document.querySelector('.profile-league');
  if (leagueEl) {
    leagueEl.src   = ligueLogo;
    leagueEl.title = `${ligueName} — Cliquer pour voir les ligues`;
    leagueEl.style.cursor = 'pointer';
    leagueEl.onclick = () => {
      const popup = document.getElementById('chess-leagues-popup');
      if (popup) popup.classList.add('active');
    };
  }
}

// ────────────────
// FAMILIER UI
// ────────────────
function updatePetUI() {
  const pet = getEquippedPet();

  const petName = document.getElementById('pet-name');
  const petStat = document.getElementById('pet-stat');
  const petLevel = document.getElementById('pet-level');
  const petSprite = document.getElementById('pet-sprite');
  const petXpText = document.getElementById('pet-xp-text');
  const petXpBar = document.getElementById('pet-xp-bar');

if (!pet) {
  const petPlaceholder = document.getElementById('pet-placeholder');

  if (petName) petName.textContent = 'Aucun familier';
  if (petStat) petStat.textContent = 'Debloque-en un via les niveaux';
  if (petLevel) petLevel.textContent = '-';
  if (petSprite) petSprite.style.display = 'none';
  if (petPlaceholder) petPlaceholder.style.display = 'flex';
  if (petXpText) petXpText.textContent = '0 / 0';
  if (petXpBar) petXpBar.style.width = '0%';
  if (shareToggle) shareToggle.checked = false;
  if (shareInput) shareInput.value = 10;
  return;
}

const petPlaceholder = document.getElementById('pet-placeholder');
if (petSprite) petSprite.style.display = 'block';
if (petPlaceholder) petPlaceholder.style.display = 'none';



  if (petName) petName.textContent = pet.name;
  if (petStat) petStat.textContent = `${pet.stat} (+${getPetBonusLabel(pet)})`;
  if (petLevel) petLevel.textContent = pet.level;
  if (petSprite) petSprite.src = pet.sprite1;

  if (shareToggle) shareToggle.checked = pet.share > 0;
  if (shareInput) shareInput.value = Math.floor((pet.share || 0) * 100);

  const xpNeeded = getPetXpNeeded(pet.level);
  const percent = Math.min((pet.xp / xpNeeded) * 100, 100);

  if (petXpText) petXpText.textContent = `${pet.xp} / ${xpNeeded}`;
  if (petXpBar) petXpBar.style.width = `${percent}%`;
}

function getPetBonusLabel(pet) {
  if (pet.stat === 'ForceIntelligence') return 'Force + Intelligence';
  if (pet.stat === 'All') return 'Toutes stats';
  if (pet.stat === 'EndGame') return 'End Game';
  return Math.min(pet.level, 50);
}

function renderPetInventory() {
  const petList = document.getElementById('pet-list');
  if (!petList) return;

  petList.innerHTML = '';

  pets.forEach((pet) => {
    const item = document.createElement('button');
    item.className = 'pet-item';
    item.dataset.pet = pet.id;
    item.type = 'button';

    if (pet.id === equippedPetId && pet.owned) {
      item.classList.add('equipped');
    }

    if (!pet.owned) {
      item.classList.add('locked');
    }

    const xpNeeded = getPetXpNeeded(pet.level);
    const xpPercent = Math.min((pet.xp / xpNeeded) * 100, 100);
    const unlockLevel = rewardUnlockLevels[pet.id];

    item.innerHTML = `
      <div class="reward-card-media">
        <img src="${pet.sprite1}" alt="${pet.name}" class="pet-item-sprite">
        ${!pet.owned ? '<div class="reward-lock">🔒</div>' : ''}
      </div>
      <span class="pet-item-name">${pet.name}</span>
      <span class="pet-item-stat">${pet.stat}</span>
      <span class="pet-item-level">Lvl ${pet.level}</span>
      <div class="pet-item-xp-wrap">
        <div class="pet-item-xp-bar" style="width: ${xpPercent}%"></div>
        <span class="pet-item-xp-label">${pet.xp} / ${xpNeeded}</span>
      </div>
      ${!pet.owned ? `<span class="reward-unlock-text">Niveau ${unlockLevel}</span>` : ''}
    `;

    item.addEventListener('click', () => {
      if (!pet.owned) {
        alert(`Ce familier se debloque au niveau ${unlockLevel}.`);
        return;
      }

      equippedPetId = pet.id;
      savePets();
      updatePetUI();
      updateStatsUI();
      renderPetInventory();

      if (petInventory) {
        petInventory.classList.remove('active');
      }
    });

    petList.appendChild(item);
  });
}




function renderAvatarInventory() {
  const avatarList = document.getElementById('avatar-list');
  if (!avatarList) return;

  avatarList.innerHTML = '';

  avatars.forEach((avatar) => {
    const item = document.createElement('button');
    item.className = 'avatar-item';
    item.type = 'button';

    if (avatar.id === equippedAvatarId && avatar.owned) {
      item.classList.add('equipped');
    }

    if (!avatar.owned) {
      item.classList.add('locked');
    }

    const unlockLabel = getUnlockLabel(avatar.id);

    item.innerHTML = `
      <div class="reward-card-media">
        <img src="${avatar.src}" alt="${avatar.name}" class="avatar-item-image">
        ${!avatar.owned ? '<div class="reward-lock">🔒</div>' : ''}
      </div>
      <span class="avatar-item-name">${avatar.name}</span>
      ${!avatar.owned && unlockLabel ? `<span class="reward-unlock-text">${unlockLabel}</span>` : ''}
    `;

    item.addEventListener('click', () => {
      if (!avatar.owned) {
        alert(unlockLabel ? `Cet avatar se débloque : ${unlockLabel}.` : 'Cet avatar n\'est pas encore débloqué.');
        return;
      }

      equippedAvatarId = avatar.id;
      saveTitlesAndAvatars();
      updateProfilePanel();
      renderAvatarInventory();
      avatarPopup.classList.remove('active');
    });

    avatarList.appendChild(item);
  });
}

function renderTitleInventory() {
  if (!titleList) return;

  titleList.innerHTML = '';

  titles.forEach((title) => {
    const item = document.createElement('button');
    item.className = 'title-item';
    item.type = 'button';

    if (title.id === equippedTitleId && title.owned) {
      item.classList.add('equipped');
    }

    if (!title.owned) {
      item.classList.add('locked');
    }

    const unlockLabel = getUnlockLabel(title.id);

    item.innerHTML = `
      <div class="title-item-row">
        <span class="title-item-name">${title.name}</span>
        <div class="title-item-meta">
          ${!title.owned && unlockLabel ? `<span class="reward-unlock-text">${unlockLabel}</span>` : ''}
          ${!title.owned ? '<span class="title-lock">🔒</span>' : ''}
        </div>
      </div>
    `;

    item.addEventListener('click', () => {
      if (!title.owned) {
        alert(unlockLabel ? `Ce titre se débloque : ${unlockLabel}.` : 'Ce titre n\'est pas encore débloqué.');
        return;
      }

      equippedTitleId = title.id;
      saveTitlesAndAvatars();
      updateProfilePanel();
      renderTitleInventory();
      titlePopup.classList.remove('active');
    });

    titleList.appendChild(item);
  });
}


// ────────────────
// XP VIA ECHECS
// ────────────────
function giveChessXP() {
  const currentElo = parseInt(localStorage.getItem('currentElo'));
  let lastElo = parseInt(localStorage.getItem('lastElo'));

  if (!currentElo) return;

  // Mettre à jour le peak ELO
  getPeakElo();

  if (!lastElo) {
    localStorage.setItem('lastElo', currentElo);
    return;
  }

  if (currentElo === lastElo) return;

  let xpBase = 0;
  const isWin = currentElo > lastElo;

  if (currentElo < 300) {
    xpBase = isWin ? 2 : 1;
  } else if (currentElo < 600) {
    xpBase = isWin ? 3 : 1;
  } else if (currentElo < 900) {
    xpBase = isWin ? 4 : 1;
  } else {
    xpBase = isWin ? 5 : 2;
  }

  const focus = parseInt(localStorage.getItem('Focus')) || 0;
  const xpGained = xpBase + Math.floor(focus / 10);

  addXP(xpGained);
  localStorage.setItem('lastElo', currentElo);

  // Tracker l'XP total gagné via les échecs
  const prevChessXP = parseInt(localStorage.getItem('totalChessXP')) || 0;
  localStorage.setItem('totalChessXP', prevChessXP + xpGained);

  console.log(`+${xpGained} XP (Échecs - ligue)`);
  updateProfilePanel();
  checkAllAchievements();

  // Sync Supabase
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({
      current_elo: currentElo,
      last_elo:    currentElo,
      peak_elo:    parseInt(localStorage.getItem('peakElo')) || 0,
      total_chess_xp: prevChessXP + xpGained
    });
  }
}

// ────────────────
// JOURNAL
// ────────────────
let currentDate = new Date();

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function displayDate(date) {
  return date.toLocaleDateString('fr-FR');
}

function cloneDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getPreviousDateKey(date) {
  const previous = cloneDate(date);
  previous.setDate(previous.getDate() - 1);
  return formatDate(previous);
}

function isToday(date) {
  return formatDate(date) === formatDate(new Date());
}

function ensureJournalEntry(journal, key) {
  if (journal[key]) {
    if (typeof journal[key].eloEnd !== 'number') {
      journal[key].eloEnd = journal[key].eloStart || 0;
    }
    return journal[key];
  }

  const currentElo = parseInt(localStorage.getItem('currentElo')) || 0;
  const entryDate = new Date(`${key}T00:00:00`);
  const previousKey = getPreviousDateKey(entryDate);
  const previousEntry = journal[previousKey];

  let eloStart = currentElo;

  if (previousEntry) {
    eloStart = typeof previousEntry.eloEnd === 'number'
      ? previousEntry.eloEnd
      : (previousEntry.eloStart || currentElo);
  }

  journal[key] = {
    text: '',
    games: 0,
    eloStart,
    eloEnd: eloStart
  };

  return journal[key];
}

function updateCurrentDayElo(journal) {
  const todayKey = formatDate(new Date());
  const todayEntry = ensureJournalEntry(journal, todayKey);
  const currentElo = parseInt(localStorage.getItem('currentElo')) || 0;
  todayEntry.eloEnd = currentElo;
}

function updateNextDayButton() {
  const nextBtn = document.getElementById('next-day');
  if (nextBtn) {
    nextBtn.disabled = isToday(currentDate);
  }
}

function loadJournal() {
  const journal = JSON.parse(localStorage.getItem('journal')) || {};
  const key = formatDate(currentDate);

  updateCurrentDayElo(journal);
  const entry = ensureJournalEntry(journal, key);

  document.getElementById('journal-text').value = entry.text || '';
  document.getElementById('journal-games-input').value = entry.games || 0;

  const eloEnd = typeof entry.eloEnd === 'number' ? entry.eloEnd : entry.eloStart;
  const diff = eloEnd - entry.eloStart;

  document.getElementById('journal-elo').textContent =
    `${entry.eloStart} → ${eloEnd} (${diff >= 0 ? '+' : ''}${diff})`;

  document.getElementById('journal-date').textContent = displayDate(currentDate);

  updateNextDayButton();
  localStorage.setItem('journal', JSON.stringify(journal));
}

function saveJournal() {
  const journal = JSON.parse(localStorage.getItem('journal')) || {};
  const key = formatDate(currentDate);

  updateCurrentDayElo(journal);
  const entry = ensureJournalEntry(journal, key);

  entry.text = document.getElementById('journal-text').value;
  entry.games = parseInt(document.getElementById('journal-games-input').value) || 0;

  localStorage.setItem('journal', JSON.stringify(journal));

  // Sync Supabase
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ journal });
  }
}

// ────────────────
// EVENTS QUETES
// ────────────────
if (addQuestBtn) {
  addQuestBtn.addEventListener('click', () => {
    const text = newQuestInput.value.trim();
    if (!text) return;

    quests.push({
      id: generateID(),
      text,
      completed: false,
      claimed: false
    });

    saveQuests();
    renderQuests();
    newQuestInput.value = '';
  });
}

if (validateBtn) {
  validateBtn.addEventListener('click', () => {
    let gainedXP = 0;
    let newlyClaimed = 0;

    quests.forEach((q) => {
      if (q.completed && !q.claimed) {
        const discipline = parseInt(localStorage.getItem('Discipline')) || 0;
        gainedXP += 5 + Math.floor(discipline / 8);
        q.claimed = true;
        newlyClaimed++;
      }
    });

    if (gainedXP > 0) {
      // Sauvegarder les quêtes validées dans l'historique
      quests.filter(q => q.claimed).forEach(q => saveQuestHistory(q.text));

      // Supprimer les quêtes validées définitivement
      quests = quests.filter(q => !q.claimed);

      trackQuestStats(newlyClaimed, gainedXP);
      addXP(gainedXP);
      alert(`+${gainedXP} XP gagné !`);
      saveQuests();
      renderQuests();
      checkAllAchievements();

      // Sync Supabase
      if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
        window.TentiaAPI.saveProfile({
          quests,
          total_quests_done: parseInt(localStorage.getItem('totalQuestsDone')) || 0,
          total_quest_xp:    parseInt(localStorage.getItem('totalQuestXP'))    || 0,
        });
      }
    } else {
      alert('Aucune quête valide ou déjà validée.');
    }
  });
}

// ────────────────
// EVENTS STATS / RESET
// ────────────────
if (statsToggle && statsBox) {
  statsToggle.addEventListener('click', () => {
    statsBox.classList.toggle('open');
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (!confirm('Reset XP et Level ?')) return;

    xp = 0;
    level = 1;

    localStorage.setItem('xp', xp);
    localStorage.setItem('level', level);

    updateXPBar();
    alert('Reset effectué !');
  });
}

if (resetSkillsBtn) {
  resetSkillsBtn.addEventListener('click', () => {
    const confirmReset = confirm('Reset COMPLET ? Tous vos points de stats seront perdus !');
    if (!confirmReset) return;

    localStorage.setItem('Force', 0);
    localStorage.setItem('Intelligence', 0);
    localStorage.setItem('Discipline', 0);
    localStorage.setItem('Focus', 0);
    localStorage.setItem('statPoints', 0);

    updateStatsUI();
    updatePointsUI();

    alert('Reset OK !');
  });
}

// ────────────────
// EVENTS POPUPS JOURNAL
// ────────────────
if (journalBtn && journalPopup) {
  journalBtn.addEventListener('click', () => {
    journalPopup.classList.add('active');
    currentDate = new Date();
    loadJournal();
  });
}

if (closeJournal && journalPopup) {
  closeJournal.addEventListener('click', () => {
    journalPopup.classList.remove('active');
  });
}

if (journalPopup) {
  journalPopup.addEventListener('click', (e) => {
    if (e.target === journalPopup) {
      journalPopup.classList.remove('active');
    }
  });
}

const prevDayBtn = document.getElementById('prev-day');
const nextDayBtn = document.getElementById('next-day');
const journalText = document.getElementById('journal-text');
const journalGames = document.getElementById('journal-games-input');

if (prevDayBtn) {
  prevDayBtn.addEventListener('click', () => {
    saveJournal();
    currentDate.setDate(currentDate.getDate() - 1);
    loadJournal();
  });
}

if (nextDayBtn) {
  nextDayBtn.addEventListener('click', () => {
    if (isToday(currentDate)) return;
    saveJournal();
    currentDate.setDate(currentDate.getDate() + 1);
    loadJournal();
  });
}

if (journalText) {
  journalText.addEventListener('input', saveJournal);
}

if (journalGames) {
  journalGames.addEventListener('input', saveJournal);
}

// ────────────────
// EVENTS POPUPS FAMILIER
// ────────────────
if (petBtn && petPopup) {
  petBtn.addEventListener('click', () => {
    petPopup.classList.add('active');
    updatePetUI();
  });
}

if (closePet && petPopup) {
  closePet.addEventListener('click', () => {
    petPopup.classList.remove('active');
  });
}

if (petPopup) {
  petPopup.addEventListener('click', (e) => {
    if (e.target === petPopup) {
      petPopup.classList.remove('active');
    }
  });
}

if (petDisplay && petInventory) {
  petDisplay.addEventListener('click', () => {
    renderPetInventory();
    petInventory.classList.add('active');
  });
}

if (closePetInventory && petInventory) {
  closePetInventory.addEventListener('click', () => {
    petInventory.classList.remove('active');
  });
}

if (petInventory) {
  petInventory.addEventListener('click', (e) => {
    if (e.target === petInventory) {
      petInventory.classList.remove('active');
    }
  });
}

if (shareToggle) {
  shareToggle.addEventListener('change', () => {
    const pet = getEquippedPet();
    if (!pet) return;

    pet.share = shareToggle.checked ? 0.1 : 0;
    savePets();
    updatePetUI();
  });
}

if (shareInput) {
  shareInput.addEventListener('change', () => {
    const pet = getEquippedPet();
    if (!pet) return;

    let val = parseInt(shareInput.value);
    if (isNaN(val) || val < 10) val = 10;
    if (val > 90) val = 90;

    pet.share = val / 100;
    savePets();
    updatePetUI();
  });
}

// ────────────────
// EVENTS AVATAR / TITRE
// ────────────────
if (profileAvatar && avatarPopup) {
  profileAvatar.addEventListener('click', () => {
    renderAvatarInventory();
    avatarPopup.classList.add('active');
  });
}

if (closeAvatarPopup && avatarPopup) {
  closeAvatarPopup.addEventListener('click', () => {
    avatarPopup.classList.remove('active');
  });
}

if (avatarPopup) {
  avatarPopup.addEventListener('click', (e) => {
    if (e.target === avatarPopup) {
      avatarPopup.classList.remove('active');
    }
  });
}

// ────────────────
// EVENTS BADGES
// ────────────────
const openBadgesBtn = document.getElementById('open-badges');
const badgePopup = document.getElementById('badge-popup');
const closeBadgePopup = document.getElementById('close-badge-popup');

if (openBadgesBtn && badgePopup) {
  openBadgesBtn.addEventListener('click', () => {
    renderBadgeInventory();
    badgePopup.classList.add('active');
  });
}

if (closeBadgePopup && badgePopup) {
  closeBadgePopup.addEventListener('click', () => {
    badgePopup.classList.remove('active');
  });
}

if (badgePopup) {
  badgePopup.addEventListener('click', (e) => {
    if (e.target === badgePopup) badgePopup.classList.remove('active');
  });
}

if (openTitlesBtn && titlePopup) {
  openTitlesBtn.addEventListener('click', () => {
    renderTitleInventory();
    titlePopup.classList.add('active');
  });
}

if (closeTitlePopup && titlePopup) {
  closeTitlePopup.addEventListener('click', () => {
    titlePopup.classList.remove('active');
  });
}

if (titlePopup) {
  titlePopup.addEventListener('click', (e) => {
    if (e.target === titlePopup) {
      titlePopup.classList.remove('active');
    }
  });
}


// ────────────────
// ANIMATION FAMILIER
// ────────────────
let petFrame = 0;

setInterval(() => {
  const sprite = document.getElementById('pet-sprite');
  const pet = getEquippedPet();

  if (!sprite || !pet) return;

  petFrame = (petFrame + 1) % 2;
  sprite.src = petFrame === 0 ? pet.sprite1 : pet.sprite2;
}, 500);

// ────────────────
// RAFRAICHISSEMENT JOURNAL
// ────────────────
setInterval(() => {
  const journal = JSON.parse(localStorage.getItem('journal')) || {};
  updateCurrentDayElo(journal);
  localStorage.setItem('journal', JSON.stringify(journal));

  if (isToday(currentDate)) {
    loadJournal();
  }
}, 5000);

// ────────────────
// EVENTS HISTORIQUE QUÊTES
// ────────────────
const openQuestHistoryBtn  = document.getElementById('open-quest-history');
const questHistoryPopup    = document.getElementById('quest-history-popup');
const closeQuestHistoryBtn = document.getElementById('close-quest-history');

if (openQuestHistoryBtn) {
  openQuestHistoryBtn.addEventListener('click', openQuestHistoryPopup);
}
if (closeQuestHistoryBtn && questHistoryPopup) {
  closeQuestHistoryBtn.addEventListener('click', () => questHistoryPopup.classList.remove('active'));
}
if (questHistoryPopup) {
  questHistoryPopup.addEventListener('click', (e) => {
    if (e.target === questHistoryPopup) questHistoryPopup.classList.remove('active');
  });
}

// ────────────────
// EVENTS INFO POPUPS
// ────────────────
const statsInfoPopup    = document.getElementById('stats-info-popup');
const openStatsInfo     = document.getElementById('open-stats-info');
const closeStatsInfo    = document.getElementById('close-stats-info');
const chessLeaguesPopup = document.getElementById('chess-leagues-popup');
const closeChessLeagues = document.getElementById('close-chess-leagues');

if (openStatsInfo && statsInfoPopup) {
  openStatsInfo.addEventListener('click', () => statsInfoPopup.classList.add('active'));
}
if (closeStatsInfo && statsInfoPopup) {
  closeStatsInfo.addEventListener('click', () => statsInfoPopup.classList.remove('active'));
}
if (statsInfoPopup) {
  statsInfoPopup.addEventListener('click', (e) => { if (e.target === statsInfoPopup) statsInfoPopup.classList.remove('active'); });
}
if (closeChessLeagues && chessLeaguesPopup) {
  closeChessLeagues.addEventListener('click', () => chessLeaguesPopup.classList.remove('active'));
}
if (chessLeaguesPopup) {
  chessLeaguesPopup.addEventListener('click', (e) => { if (e.target === chessLeaguesPopup) chessLeaguesPopup.classList.remove('active'); });
}

// ────────────────
// EVENTS HAUTS FAITS
// ────────────────
const hfPopup = document.getElementById('hf-popup');
const hfPopupClose = document.getElementById('hf-popup-close');

if (hfPopupClose && hfPopup) {
  hfPopupClose.addEventListener('click', () => hfPopup.classList.remove('active'));
}
if (hfPopup) {
  hfPopup.addEventListener('click', (e) => {
    if (e.target === hfPopup) hfPopup.classList.remove('active');
  });
}

// ────────────────
// INITIALISATION
// ────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Si l'API est disponible, charger le profil depuis Supabase d'abord
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    await window.TentiaAPI.loadProfile();
  }

  syncRewardsWithCurrentLevel();

  giveDailyXP();
  giveChessXP();

  updateXPBar();
  updatePointsUI();
  updateStatsUI();
  updateProfilePanel();
  updatePetUI();
  renderPetInventory();
  renderQuests();
  renderTitleInventory();
  renderAvatarInventory();
  renderBadgeInventory();
  renderAchievements();
  checkAllAchievements();
});

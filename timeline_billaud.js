// ============================================
// timeline_billaud.js — Données Timeline Billaud
// Skins, Backgrounds, Avatars, Pets (visuels), Titres, Récompenses de niveau
// ⚙ MODIFIER les noms, ids et chemins selon les assets de Billaud
// ============================================

window.TIMELINE_DATA = window.TIMELINE_DATA || {};

window.TIMELINE_DATA.billaud = {

  // ────────────────
  // TITRES
  // ────────────────
  titles: [
    { id: 'title1',              name: 'Novice',                    owned: true  },
    { id: 'title_stalk',         name: 'Stalker',                   owned: false },
    { id: 'title_edge_runner',   name: 'Edgerunner',                owned: false },
    { id: 'title_witcher',       name: 'Sorceleurs',                owned: false },
    { id: 'title_guns',          name: 'Gunslinger',                owned: false },
    { id: 'title_zombie',        name: 'Infecté',                   owned: false },
    { id: 'title_marins',        name: "Space Marine",              owned: false },
    { id: 'title_hack',          name: 'Black Hat',                 owned: false },
    { id: 'title_south',         name: 'Sale Gosse',                owned: false },
    { id: 'title_stone',         name: 'Stoner',                    owned: false },
    { id: 'title_endgame',       name: 'Grand Maitre',              owned: false },
    // HF universels
    { id: 'title_hf_lvl10',  name: 'Gameur Pro',          owned: false },
    { id: 'title_hf_lvl20',  name: 'Travailleur Acharné', owned: false },
    { id: 'title_hf_lvl30',  name: 'Bourg-Palette',       owned: false },
    { id: 'title_hf_lvl40',  name: "Oeil de l'Infini",   owned: false },
    { id: 'title_hf_lvl50',  name: 'Yonko',               owned: false },
    { id: 'title_hf_lvl60',  name: 'Explorateur',         owned: false },
    { id: 'title_hf_lvl70',  name: 'Chef Galactique',     owned: false },
    { id: 'title_hf_lvl80',  name: 'Divin',               owned: false },
    { id: 'title_hf_lvl90',  name: 'Maitre',              owned: false },
    { id: 'title_hf_lvl100', name: 'Targaryen',           owned: false },
    { id: 'title_hf_eleveur', name: 'Légendaire Éleveur de Bêtes', owned: false },
    { id: 'title_hf_rpg',    name: 'RPG',                  owned: false },
    { id: 'title_method',    name: 'Le Méthodique',         owned: false },
    { id: 'title_carlsen',   name: 'Carlsen',               owned: false },
  ],

  // ────────────────
  // AVATARS
  // ⚙ Remplacer les src par les assets Billaud
  // ────────────────
  avatars: [
    { id: 'avatar_billaud',   name: 'Avatar Billaud',                  src: 'assets/avatars/timelines/billaud/avatar_billaud.png',   owned: true  },
    { id: 'avatar_fallout',   name: 'Avatar Volboy',                   src: 'assets/avatars/timelines/billaud/avatar_fallout.png',   owned: false },
    { id: 'avatar_cyberpunk', name: 'Avatar Cyberpunk',                src: 'assets/avatars/timelines/billaud/avatar_cyberpunk.png', owned: false },
    { id: 'avatar_witcher',   name: 'Avatar The Witcher',              src: 'assets/avatars/timelines/billaud/avatar_witcher.png',   owned: false },
    { id: 'avatar_zombie',    name: 'Avatar Left for Dead II',         src: 'assets/avatars/timelines/billaud/avatar_zombie.png',    owned: false },
    { id: 'avatar_op',        name: 'Avatar One Piece',                src: 'assets/avatars/timelines/billaud/avatar_op.png',        owned: false },
    { id: 'avatar_snk',       name: 'Avatar SNK',                      src: 'assets/avatars/timelines/billaud/avatar_snk.png',       owned: false },
    { id: 'avatar_rick_morty',name: 'Avatar Rick & Morty',             src: 'assets/avatars/timelines/billaud/avatar_rick_morty.png',owned: false },
    { id: 'avatar_samourai',  name: 'Avatar Samourai',                 src: 'assets/avatars/timelines/billaud/avatar_samourai.png',  owned: false },
    { id: 'avatar_dragons',   name: 'Avatar Dragons',                  src: 'assets/avatars/timelines/billaud/avatar_dragons.png',   owned: false },
    { id: 'avatar_endgame',   name: 'Avatar End Game',                 src: 'assets/avatars/timelines/billaud/avatar_endgame.png',   owned: false },
    { id: 'avatar_king',      name: 'Avatar King',                     src: 'assets/avatars/timelines/billaud/avatar_king.png',      owned: false },
    { id: 'avatar_plat',      name: 'Avatar Platine',                  src: 'assets/avatars/timelines/billaud/avatar_plat.png',      owned: false },
    { id: 'avatar_pet1',      name: 'Avatar Pet 1',                    src: 'assets/avatars/timelines/billaud/avatar_pet1.png',      owned: false },
    { id: 'avatar_pet2',      name: 'Avatar Pet 2',                    src: 'assets/avatars/timelines/billaud/avatar_pet2.png',      owned: false },
    { id: 'avatar_pet3',      name: 'Avatar Pet 3',                    src: 'assets/avatars/timelines/billaud/avatar_pet3.png',      owned: false },
    { id: 'avatar_pet4',      name: 'Avatar Pet 4',                    src: 'assets/avatars/timelines/billaud/avatar_pet4.png',      owned: false },
  ],

  // ────────────────
  // SKINS
  // ⚙ Remplacer les folders par les dossiers Billaud
  // ────────────────
  skins: [
    { id: 'skin_billaud',         name: 'Billaud',        folder: 'timelines/billaud/Skin_Billaud',       owned: true  },
    { id: 'skin_fallout',         name: 'Armor X01',      folder: 'timelines/billaud/Skin_Fallout',       owned: false },
    { id: 'skin_witcher',         name: 'Geralt',         folder: 'timelines/billaud/Skin_Witcher',       owned: false },
    { id: 'skin_nick',            name: 'Nick',           folder: 'timelines/billaud/Skin_Nick',          owned: false },
    { id: 'skin_op',              name: 'One Piece',      folder: 'timelines/billaud/Skin_OP',            owned: false },
    { id: 'skin_titan',           name: 'Titan',          folder: 'timelines/billaud/Skin_Snk',           owned: false },
    { id: 'skin_rick',            name: 'Rick & Morty',   folder: 'timelines/billaud/Skin_RM',            owned: false },
    { id: 'skin_samourai',        name: 'Samourai',       folder: 'timelines/billaud/Skin_ronin',         owned: false },
    { id: 'skin_dragon_hunter',   name: 'Roi du Nord',    folder: 'timelines/billaud/Skin_got',           owned: false },
    { id: 'skin_backpacker',      name: 'Backpacker',     folder: 'timelines/billaud/Skin_backpacker',    owned: false },
    { id: 'skin_quilby',          name: 'Quilby',         folder: 'timelines/billaud/Skin_quilby',        owned: false },
    { id: 'skin_ultra_rare_zoro', name: 'Zoro',           folder: 'timelines/billaud/Skin_zoro',          owned: false },
    { id: 'skin_roi_liche',       name: 'Roi Liche',      folder: 'timelines/billaud/Skin_liche',         owned: false },
    { id: 'skin_imu',             name: 'Imu Nerona',     folder: 'timelines/billaud/Skin_imu',           owned: false },
    { id: 'skin_iop',             name: 'IOP',            folder: 'timelines/billaud/Skin_iop',           owned: false },
    { id: 'skin_xelor',           name: 'Xelor',          folder: 'timelines/billaud/Skin_xelor',         owned: false },
    { id: 'skin_carlsen',         name: 'Carlsen',        folder: 'timelines/billaud/Skin_carlsen',       owned: false },
  ],

  // ────────────────
  // BACKGROUNDS
  // ⚙ Remplacer les chemins par les assets Billaud
  // ────────────────
  backgrounds: [
    { id: 'bg_billaud_1',  name: 'Billaud Défaut', bg1: 'assets/background/timelines/billaud/bg1_frame1.png',  bg2: 'assets/background/timelines/billaud/bg1_frame2.png',  owned: true  },
    { id: 'bg_billaud_2',  name: 'Billaud 2',      bg1: 'assets/background/timelines/billaud/bg2_frame1.png',  bg2: 'assets/background/timelines/billaud/bg2_frame2.png',  owned: true  },
    { id: 'bg_billaud_3',  name: 'Billaud 3',      bg1: 'assets/background/timelines/billaud/bg3_frame1.png',  bg2: 'assets/background/timelines/billaud/bg3_frame2.png',  owned: false },
    { id: 'bg_billaud_4',  name: 'Billaud 4',      bg1: 'assets/background/timelines/billaud/bg4_frame1.png',  bg2: 'assets/background/timelines/billaud/bg4_frame2.png',  owned: false },
    { id: 'bg_billaud_5',  name: 'Billaud 5',      bg1: 'assets/background/timelines/billaud/bg5_frame1.png',  bg2: 'assets/background/timelines/billaud/bg5_frame2.png',  owned: false },
    { id: 'bg_billaud_6',  name: 'Billaud 6',      bg1: 'assets/background/timelines/billaud/bg6_frame1.png',  bg2: 'assets/background/timelines/billaud/bg6_frame2.png',  owned: false },
    { id: 'bg_billaud_7',  name: 'Billaud 7',      bg1: 'assets/background/timelines/billaud/bg7_frame1.png',  bg2: 'assets/background/timelines/billaud/bg7_frame2.png',  owned: false },
    { id: 'bg_billaud_8',  name: 'Billaud 8',      bg1: 'assets/background/timelines/billaud/bg8_frame1.png',  bg2: 'assets/background/timelines/billaud/bg8_frame2.png',  owned: false },
    { id: 'bg_billaud_9',  name: 'Billaud 9',      bg1: 'assets/background/timelines/billaud/bg9_frame1.png',  bg2: 'assets/background/timelines/billaud/bg9_frame2.png',  owned: false },
    { id: 'bg_billaud_10', name: 'Billaud 10',     bg1: 'assets/background/timelines/billaud/bg10_frame1.png', bg2: 'assets/background/timelines/billaud/bg10_frame2.png', owned: false },
    { id: 'bg_billaud_11', name: 'Billaud 11',     bg1: 'assets/background/timelines/billaud/bg11_frame1.png', bg2: 'assets/background/timelines/billaud/bg11_frame2.png', owned: false },
    { id: 'bg_billaud_12', name: 'Billaud 12',     bg1: 'assets/background/timelines/billaud/bg12_frame1.png', bg2: 'assets/background/timelines/billaud/bg12_frame2.png', owned: false },
    { id: 'bg_billaud_13', name: 'End Game',       bg1: 'assets/background/timelines/billaud/bg13_frame1.png', bg2: 'assets/background/timelines/billaud/bg13_frame2.png', owned: false },
    // HF universels (connexion régulière) — même chemins que Dafz ou à adapter
    { id: 'bg_paris',      name: 'Paris',          bg1: 'assets/background/bg13_frame1.png', bg2: 'assets/background/bg13_frame2.png', owned: false },
    { id: 'bg_japon',      name: 'Japon',          bg1: 'assets/background/bg14_frame1.png', bg2: 'assets/background/bg14_frame2.png', owned: false },
    { id: 'bg_usa',        name: 'Amérique',       bg1: 'assets/background/bg15_frame1.png', bg2: 'assets/background/bg15_frame2.png', owned: false },
    { id: 'bg_australie',  name: 'Australie',      bg1: 'assets/background/bg16_frame1.png', bg2: 'assets/background/bg16_frame2.png', owned: false },
    { id: 'bg_afrique',    name: 'Afrique',        bg1: 'assets/background/bg17_frame1.png', bg2: 'assets/background/bg17_frame2.png', owned: false },
    { id: 'bg_marineford', name: 'MarineFord',     bg1: 'assets/background/bg18_frame1.png', bg2: 'assets/background/bg18_frame2.png', owned: false },
    { id: 'bg_hell',       name: 'Enfers',         bg1: 'assets/background/bg19_frame1.png', bg2: 'assets/background/bg19_frame2.png', owned: false },
    { id: 'bg_paradis',    name: 'Paradis',        bg1: 'assets/background/bg20_frame1.png', bg2: 'assets/background/bg20_frame2.png', owned: false },
    { id: 'bg_hf_250',     name: 'Rome Antique',   bg1: 'assets/background/bg22_frame1.png', bg2: 'assets/background/bg22_frame2.png', owned: false },
    { id: 'bg_hf_300',     name: 'Royaume Céleste',bg1: 'assets/background/bg23_frame1.png', bg2: 'assets/background/bg23_frame2.png', owned: false },
    { id: 'bg_dofus',      name: 'Dofus',          bg1: 'assets/background/bg21_frame1.png', bg2: 'assets/background/bg21_frame2.png', owned: false },
    { id: 'bg_echecs',     name: 'Échiquier',      bg1: 'assets/background/bg25_frame1.png', bg2: 'assets/background/bg25_frame2.png', owned: false },
  ],


  // ────────────────
  // PETS (visuels et noms uniquement — stats/level/xp dans stats.js)
  // ⚙ Remplacer les sprites et noms selon la timeline
  // ────────────────
  pets: {
    pet1: {
      name: 'Pet 1',
      evolutions: [
        { minLevel: 1,  maxLevel: 15, name: 'Carapuce',      sprite1: 'assets/pets/timelines/billaud/pet1_evo1_f1.png', sprite2: 'assets/pets/timelines/billaud/pet1_evo1_f2.png' },
        { minLevel: 16, maxLevel: 34, name: 'Pet 1 Forme 2', sprite1: 'assets/pets/timelines/billaud/pet1_evo2_f1.png', sprite2: 'assets/pets/timelines/billaud/pet1_evo2_f2.png' },
        { minLevel: 35, maxLevel: 50, name: 'Pet 1 Forme 3', sprite1: 'assets/pets/timelines/billaud/pet1_evo3_f1.png', sprite2: 'assets/pets/timelines/billaud/pet1_evo3_f2.png' },
      ],
      sprite1: 'assets/pets/timelines/billaud/pet1_evo1_f1.png',
      sprite2: 'assets/pets/timelines/billaud/pet1_evo1_f2.png'
    },
    pet2: {
      name: 'Pet 2',
      sprite1: 'assets/pets/timelines/billaud/pet2_f1.png',
      sprite2: 'assets/pets/timelines/billaud/pet2_f2.png'
    },
    pet3: {
      name: 'Pet 3',
      sprite1: 'assets/pets/timelines/billaud/pet3_f1.png',
      sprite2: 'assets/pets/timelines/billaud/pet3_f2.png'
    },
    pet4: {
      name: 'Pet 4',
      evolutions: [
        { minLevel: 1,  maxLevel: 9,  name: 'Pet 4 Forme 1', sprite1: 'assets/pets/timelines/billaud/pet4_evo1_f1.png', sprite2: 'assets/pets/timelines/billaud/pet4_evo1_f2.png' },
        { minLevel: 10, maxLevel: 50, name: 'Pet 4 Forme 2', sprite1: 'assets/pets/timelines/billaud/pet4_evo2_f1.png', sprite2: 'assets/pets/timelines/billaud/pet4_evo2_f2.png' },
      ],
      sprite1: 'assets/pets/timelines/billaud/pet4_evo1_f1.png',
      sprite2: 'assets/pets/timelines/billaud/pet4_evo1_f2.png'
    },
    pet_dragon_legendary: {
      name: 'Dragon legendaire',
      sprite1: 'assets/pets/timelines/billaud/pet_dragon_f1.png',
      sprite2: 'assets/pets/timelines/billaud/pet_dragon_f2.png'
    },
    pet_bob: {
      name: 'Familier Légendaire',
      sprite1: 'assets/pets/timelines/billaud/pet_bob_f1.png',
      sprite2: 'assets/pets/timelines/billaud/pet_bob_f2.png'
    },
    pet_endgame: {
      name: 'Arme Ultime',
      sprite1: 'assets/pets/timelines/billaud/endgame_arc_f1.png',
      sprite2: 'assets/pets/timelines/billaud/endgame_arc_f2.png',
      forms: {
        arc:      { name: 'Arc Céleste',      sprite1: 'assets/pets/timelines/billaud/endgame_arc_f1.png',      sprite2: 'assets/pets/timelines/billaud/endgame_arc_f2.png'      },
        baton:    { name: 'Bâton du Sage',    sprite1: 'assets/pets/timelines/billaud/endgame_baton_f1.png',    sprite2: 'assets/pets/timelines/billaud/endgame_baton_f2.png'    },
        marteau:  { name: 'Marteau Divin',    sprite1: 'assets/pets/timelines/billaud/endgame_marteau_f1.png',  sprite2: 'assets/pets/timelines/billaud/endgame_marteau_f2.png'  },
        bouclier: { name: 'Bouclier Absolu',  sprite1: 'assets/pets/timelines/billaud/endgame_bouclier_f1.png', sprite2: 'assets/pets/timelines/billaud/endgame_bouclier_f2.png' },
      }
    }
  },

  // ────────────────
  // RÉCOMPENSES DE NIVEAU
  // Même structure que Dafz — remplacer skin/avatar/background par les ids Billaud
  // ────────────────
  levelRewards: {
    2:  [{ type: 'title',      id: 'title_stalk' }],
    4:  [{ type: 'avatar',     id: 'avatar_fallout' }],
    7:  [{ type: 'background', id: 'bg_billaud_3' }],
    10: [{ type: 'badge',      id: 'badge_t1' }],

    12: [{ type: 'title',      id: 'title_edge_runner' }],
    13: [{ type: 'avatar',     id: 'avatar_cyberpunk' }],
    15: [{ type: 'background', id: 'bg_billaud_4' }],
    17: [{ type: 'badge',      id: 'badge_plume' }],
    20: [{ type: 'skin',       id: 'skin_fallout' }],

    22: [{ type: 'title',      id: 'title_witcher' }],
    23: [{ type: 'avatar',     id: 'avatar_witcher' }],
    25: [{ type: 'pet',        id: 'pet1' }],
    27: [{ type: 'background', id: 'bg_billaud_5' }],
    29: [{ type: 'badge',      id: 'badge_pokemon' }],
    30: [{ type: 'skin',       id: 'skin_witcher' }],

    32: [{ type: 'title',      id: 'title_guns' }],
    33: [{ type: 'avatar',     id: 'avatar_zombie' }],
    35: [{ type: 'skin',       id: 'skin_yuji' }],
    37: [{ type: 'background', id: 'bg_billaud_6' }],
    40: [{ type: 'badge',      id: 'badge_tengen' }],

    42: [{ type: 'title',      id: 'title_zombie' }],
    43: [{ type: 'avatar',     id: 'avatar_op' }],
    45: [{ type: 'pet',        id: 'pet2' }],
    46: [{ type: 'background', id: 'bg_billaud_7' }],
    49: [{ type: 'skin',       id: 'skin_op' }],
    50: [{ type: 'badge',      id: 'badge_op' }],

    52: [{ type: 'title',      id: 'title_marins' }],
    53: [{ type: 'avatar',     id: 'avatar_snk' }],
    55: [{ type: 'skin',       id: 'skin_titan' }],
    57: [{ type: 'background', id: 'bg_billaud_8' }],
    59: [{ type: 'badge',      id: 'badge_snk' }],
    60: [{ type: 'pet',        id: 'pet3' }],

    62: [{ type: 'title',      id: 'title_hack' }],
    63: [{ type: 'avatar',     id: 'avatar_rick_morty' }],
    65: [{ type: 'background', id: 'bg_billaud_9' }],
    67: [{ type: 'skin',       id: 'skin_rick' }],
    69: [{ type: 'badge',      id: 'badge_rick' }],

    72: [{ type: 'title',      id: 'title_south' }],
    73: [{ type: 'avatar',     id: 'avatar_samourai' }],
    75: [{ type: 'background', id: 'bg_billaud_10' }],
    77: [{ type: 'skin',       id: 'skin_samourai' }],
    79: [{ type: 'badge',      id: 'badge_dragon' }],
    80: [{ type: 'pet',        id: 'pet4' }],

    82: [{ type: 'title',      id: 'title_stone' }],
    83: [{ type: 'avatar',     id: 'avatar_dragons' }],
    85: [{ type: 'skin',       id: 'skin_dragon_hunter' }],
    87: [{ type: 'background', id: 'bg_billaud_11' }],
    88: [{ type: 'badge',      id: 'badge_tiers3_1' }],
    89: [{ type: 'badge',      id: 'badge_tiers3_2' }],
    90: [{ type: 'pet',        id: 'pet_dragon_legendary' }],

    91: [{ type: 'skin',       id: 'skin_backpacker' }],
    92: [{ type: 'badge',      id: 'badge_tiers3_3' }],
    93: [{ type: 'badge',      id: 'badge_tiers3_4' }],
    94: [{ type: 'skin',       id: 'skin_quilby' }],
    95: [{ type: 'pet',        id: 'pet_bob' }],
    96: [{ type: 'skin',       id: 'skin_ultra_rare_zoro' }],
    97: [{ type: 'skin',       id: 'skin_roi_liche' }],
    98: [{ type: 'background', id: 'bg_billaud_12' }],
    99: [{ type: 'avatar',     id: 'avatar_king' }],
    100: [
      { type: 'title',      id: 'title_endgame' },
      { type: 'avatar',     id: 'avatar_endgame' },
      { type: 'background', id: 'bg_billaud_13' },
      { type: 'skin',       id: 'skin_imu' },
      { type: 'badge',      id: 'badge_endgame' },
      { type: 'pet',        id: 'pet_endgame' }
    ]
  }
};

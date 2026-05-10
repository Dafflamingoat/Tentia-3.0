// ============================================
// timeline_arthur.js — Données Timeline Arthur
// Skins, Backgrounds, Avatars, Pets (visuels), Titres, Récompenses de niveau
// ⚙ MODIFIER les noms, ids et chemins selon les assets d'Arthur
// ============================================

window.TIMELINE_DATA = window.TIMELINE_DATA || {};

window.TIMELINE_DATA.arthur = {

  // ────────────────
  // TITRES
  // ────────────────
  titles: [
    { id: 'title1',              name: 'Novice',                    owned: true  },
    { id: 'title_stagiaire',     name: 'Stagiaire',                 owned: false },
    { id: 'title_peche',         name: 'Le Gardon Frais',           owned: false },
    { id: 'title_boxe',          name: 'Champion de Boxe',          owned: false },
    { id: 'title_employe',       name: 'Employé du mois',           owned: false },
    { id: 'title_surf',          name: 'Le Surfeur',                owned: false },
    { id: 'title_trade',         name: "Trader",                    owned: false },
    { id: 'title_capitaine',     name: 'Capitaine',                 owned: false },
    { id: 'title_ceo',           name: 'CEO',                       owned: false },
    { id: 'title_don',           name: 'Don Juan',                  owned: false },
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
  // ⚙ Remplacer les src par les assets Arthur
  // ────────────────
  avatars: [
    { id: 'avatar_arthur',    name: 'Avatar Arthur',      src: 'assets/avatars/timelines/arthur/avatar_arthur.png',       owned: true  },
    { id: 'avatar_t1',        name: 'Avatar Stage',       src: 'assets/avatars/timelines/arthur/avatar_stage.png',        owned: false },
    { id: 'avatar_peche',     name: 'Avatar Pêche',       src: 'assets/avatars/timelines/arthur/avatar_peche.png',        owned: false },
    { id: 'avatar_boxe',      name: 'Avatar Boxe',        src: 'assets/avatars/timelines/arthur/avatar_boxe.png',         owned: false },
    { id: 'avatar_jjk',       name: 'Avatar JJK',         src: 'assets/avatars/timelines/arthur/avatar_jjk.png',        owned: false },
    { id: 'avatar_op',        name: 'Avatar One Piece',   src: 'assets/avatars/timelines/arthur/avatar_op.png',         owned: false },
    { id: 'avatar_snk',       name: 'Avatar SNK',         src: 'assets/avatars/timelines/arthur/avatar_snk.png',        owned: false },
    { id: 'avatar_rick_morty',name: 'Avatar Rick & Morty',src: 'assets/avatars/timelines/arthur/avatar_rick_morty.png', owned: false },
    { id: 'avatar_samourai',  name: 'Avatar Samourai',    src: 'assets/avatars/timelines/arthur/avatar_samourai.png',   owned: false },
    { id: 'avatar_dragons',   name: 'Avatar Dragons',     src: 'assets/avatars/timelines/arthur/avatar_dragons.png',    owned: false },
    { id: 'avatar_endgame',   name: 'Avatar End Game',    src: 'assets/avatars/timelines/arthur/avatar_endgame.png',    owned: false },
    { id: 'avatar_king',      name: 'Avatar King',        src: 'assets/avatars/timelines/arthur/avatar_king.png',       owned: false },
    { id: 'avatar_plat',      name: 'Avatar Platine',     src: 'assets/avatars/timelines/arthur/avatar_plat.png',       owned: false },
    { id: 'avatar_pet1',      name: 'Avatar Pet 1',       src: 'assets/avatars/timelines/arthur/avatar_pet1.png',       owned: false },
    { id: 'avatar_pet2',      name: 'Avatar Pet 2',       src: 'assets/avatars/timelines/arthur/avatar_pet2.png',       owned: false },
    { id: 'avatar_pet3',      name: 'Avatar Pet 3',       src: 'assets/avatars/timelines/arthur/avatar_pet3.png',       owned: false },
    { id: 'avatar_pet4',      name: 'Avatar Pet 4',       src: 'assets/avatars/timelines/arthur/avatar_pet4.png',       owned: false },
  ],

  // ────────────────
  // SKINS
  // ⚙ Remplacer les folders par les dossiers Arthur
  // ────────────────
  skins: [
    { id: 'skin_arthur',          name: 'Arthur',         folder: 'timelines/arthur/Skin_arthur',         owned: true  },
    { id: 'skin_peche',           name: 'Le pêcheur',     folder: 'timelines/arthur/Skin_peche',          owned: false },
    { id: 'skin_boxe',            name: 'Le Boxeur',      folder: 'timelines/arthur/Skin_boxe',           owned: false },
    { id: 'skin_yuji',            name: 'Yuji Itadori',   folder: 'timelines/arthur/Skin_JJK',            owned: false },
    { id: 'skin_op',              name: 'One Piece',      folder: 'timelines/arthur/Skin_OP',             owned: false },
    { id: 'skin_titan',           name: 'Titan',          folder: 'timelines/arthur/Skin_Snk',            owned: false },
    { id: 'skin_rick',            name: 'Rick & Morty',   folder: 'timelines/arthur/Skin_RM',             owned: false },
    { id: 'skin_samourai',        name: 'Samourai',       folder: 'timelines/arthur/Skin_ronin',          owned: false },
    { id: 'skin_don',             name: 'Don Juan',       folder: 'timelines/arthur/skin_don',            owned: false },
    { id: 'skin_backpacker',      name: 'Backpacker',     folder: 'timelines/arthur/Skin_backpacker',     owned: false },
    { id: 'skin_quilby',          name: 'Quilby',         folder: 'timelines/arthur/Skin_quilby',         owned: false },
    { id: 'skin_ultra_rare_zoro', name: 'Zoro',           folder: 'timelines/arthur/Skin_zoro',           owned: false },
    { id: 'skin_roi_liche',       name: 'Roi Liche',      folder: 'timelines/arthur/Skin_liche',          owned: false },
    { id: 'skin_imu',             name: 'Imu Nerona',     folder: 'timelines/arthur/Skin_imu',            owned: false },
    { id: 'skin_iop',             name: 'IOP',            folder: 'timelines/arthur/Skin_iop',            owned: false },
    { id: 'skin_xelor',           name: 'Xelor',          folder: 'timelines/arthur/Skin_xelor',          owned: false },
    { id: 'skin_carlsen',         name: 'Carlsen',        folder: 'timelines/arthur/Skin_carlsen',        owned: false },
  ],

  // ────────────────
  // BACKGROUNDS
  // ⚙ Remplacer les chemins par les assets Arthur
  // ────────────────
  backgrounds: [
    { id: 'bg_arthur_1',  name: 'Arthur Défaut', bg1: 'assets/background/timelines/arthur/bg1_frame1.png',  bg2: 'assets/background/timelines/arthur/bg1_frame2.png',  owned: true  },
    { id: 'bg_arthur_2',  name: 'Arthur 2',      bg1: 'assets/background/timelines/arthur/bg2_frame1.png',  bg2: 'assets/background/timelines/arthur/bg2_frame2.png',  owned: true  },
    { id: 'bg_arthur_3',  name: 'Arthur 3',      bg1: 'assets/background/timelines/arthur/bg3_frame1.png',  bg2: 'assets/background/timelines/arthur/bg3_frame2.png',  owned: false },
    { id: 'bg_arthur_4',  name: 'Arthur 4',      bg1: 'assets/background/timelines/arthur/bg4_frame1.png',  bg2: 'assets/background/timelines/arthur/bg4_frame2.png',  owned: false },
    { id: 'bg_arthur_5',  name: 'Arthur 5',      bg1: 'assets/background/timelines/arthur/bg5_frame1.png',  bg2: 'assets/background/timelines/arthur/bg5_frame2.png',  owned: false },
    { id: 'bg_arthur_6',  name: 'Arthur 6',      bg1: 'assets/background/timelines/arthur/bg6_frame1.png',  bg2: 'assets/background/timelines/arthur/bg6_frame2.png',  owned: false },
    { id: 'bg_arthur_7',  name: 'Arthur 7',      bg1: 'assets/background/timelines/arthur/bg7_frame1.png',  bg2: 'assets/background/timelines/arthur/bg7_frame2.png',  owned: false },
    { id: 'bg_arthur_8',  name: 'Arthur 8',      bg1: 'assets/background/timelines/arthur/bg8_frame1.png',  bg2: 'assets/background/timelines/arthur/bg8_frame2.png',  owned: false },
    { id: 'bg_arthur_9',  name: 'Arthur 9',      bg1: 'assets/background/timelines/arthur/bg9_frame1.png',  bg2: 'assets/background/timelines/arthur/bg9_frame2.png',  owned: false },
    { id: 'bg_arthur_10', name: 'Arthur 10',     bg1: 'assets/background/timelines/arthur/bg10_frame1.png', bg2: 'assets/background/timelines/arthur/bg10_frame2.png', owned: false },
    { id: 'bg_arthur_11', name: 'Arthur 11',     bg1: 'assets/background/timelines/arthur/bg11_frame1.png', bg2: 'assets/background/timelines/arthur/bg11_frame2.png', owned: false },
    { id: 'bg_arthur_12', name: 'Arthur 12',     bg1: 'assets/background/timelines/arthur/bg12_frame1.png', bg2: 'assets/background/timelines/arthur/bg12_frame2.png', owned: false },
    { id: 'bg_arthur_13', name: 'End Game',      bg1: 'assets/background/timelines/arthur/bg13_frame1.png', bg2: 'assets/background/timelines/arthur/bg13_frame2.png', owned: false },
    // HF universels
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
        { minLevel: 1,  maxLevel: 15, name: 'Pet 1 Forme 1', sprite1: 'assets/pets/timelines/arthur/pet1_evo1_f1.png', sprite2: 'assets/pets/timelines/arthur/pet1_evo1_f2.png' },
        { minLevel: 16, maxLevel: 34, name: 'Pet 1 Forme 2', sprite1: 'assets/pets/timelines/arthur/pet1_evo2_f1.png', sprite2: 'assets/pets/timelines/arthur/pet1_evo2_f2.png' },
        { minLevel: 35, maxLevel: 50, name: 'Pet 1 Forme 3', sprite1: 'assets/pets/timelines/arthur/pet1_evo3_f1.png', sprite2: 'assets/pets/timelines/arthur/pet1_evo3_f2.png' },
      ],
      sprite1: 'assets/pets/timelines/arthur/pet1_evo1_f1.png',
      sprite2: 'assets/pets/timelines/arthur/pet1_evo1_f2.png'
    },
    pet2: {
      name: 'Pet 2',
      sprite1: 'assets/pets/timelines/arthur/pet2_f1.png',
      sprite2: 'assets/pets/timelines/arthur/pet2_f2.png'
    },
    pet3: {
      name: 'Pet 3',
      sprite1: 'assets/pets/timelines/arthur/pet3_f1.png',
      sprite2: 'assets/pets/timelines/arthur/pet3_f2.png'
    },
    pet4: {
      name: 'Pet 4',
      evolutions: [
        { minLevel: 1,  maxLevel: 9,  name: 'Pet 4 Forme 1', sprite1: 'assets/pets/timelines/arthur/pet4_evo1_f1.png', sprite2: 'assets/pets/timelines/arthur/pet4_evo1_f2.png' },
        { minLevel: 10, maxLevel: 50, name: 'Pet 4 Forme 2', sprite1: 'assets/pets/timelines/arthur/pet4_evo2_f1.png', sprite2: 'assets/pets/timelines/arthur/pet4_evo2_f2.png' },
      ],
      sprite1: 'assets/pets/timelines/arthur/pet4_evo1_f1.png',
      sprite2: 'assets/pets/timelines/arthur/pet4_evo1_f2.png'
    },
    pet_dragon_legendary: {
      name: 'Dragon legendaire',
      sprite1: 'assets/pets/timelines/arthur/pet_dragon_f1.png',
      sprite2: 'assets/pets/timelines/arthur/pet_dragon_f2.png'
    },
    pet_bob: {
      name: 'Familier Légendaire',
      sprite1: 'assets/pets/timelines/arthur/pet_bob_f1.png',
      sprite2: 'assets/pets/timelines/arthur/pet_bob_f2.png'
    },
    pet_endgame: {
      name: 'Arme Ultime',
      sprite1: 'assets/pets/timelines/arthur/endgame_arc_f1.png',
      sprite2: 'assets/pets/timelines/arthur/endgame_arc_f2.png',
      forms: {
        arc:      { name: 'Arc Céleste',      sprite1: 'assets/pets/timelines/arthur/endgame_arc_f1.png',      sprite2: 'assets/pets/timelines/arthur/endgame_arc_f2.png'      },
        baton:    { name: 'Bâton du Sage',    sprite1: 'assets/pets/timelines/arthur/endgame_baton_f1.png',    sprite2: 'assets/pets/timelines/arthur/endgame_baton_f2.png'    },
        marteau:  { name: 'Marteau Divin',    sprite1: 'assets/pets/timelines/arthur/endgame_marteau_f1.png',  sprite2: 'assets/pets/timelines/arthur/endgame_marteau_f2.png'  },
        bouclier: { name: 'Bouclier Absolu',  sprite1: 'assets/pets/timelines/arthur/endgame_bouclier_f1.png', sprite2: 'assets/pets/timelines/arthur/endgame_bouclier_f2.png' },
      }
    }
  },

  // ────────────────
  // RÉCOMPENSES DE NIVEAU
  // ⚙ Adapter skin/avatar/background aux ids Arthur
  // ────────────────
  levelRewards: {
    2:  [{ type: 'title',      id: 'title_stagiaire' }],
    4:  [{ type: 'avatar',     id: 'avatar_stage' }],
    7:  [{ type: 'background', id: 'bg_arthur_3' }],
    10: [{ type: 'badge',      id: 'badge_t1' }],

    12: [{ type: 'title',      id: 'title_peche' }],
    13: [{ type: 'avatar',     id: 'avatar_peche' }],
    15: [{ type: 'background', id: 'bg_arthur_4' }],
    17: [{ type: 'badge',      id: 'badge_plume' }],
    20: [{ type: 'skin',       id: 'skin_peche' }],

    22: [{ type: 'title',      id: 'title_boxe' }],
    23: [{ type: 'avatar',     id: 'avatar_boxe' }],
    25: [{ type: 'pet',        id: 'pet1' }],
    27: [{ type: 'background', id: 'bg_arthur_5' }],
    29: [{ type: 'badge',      id: 'badge_pokemon' }],
    30: [{ type: 'skin',       id: 'skin_boxe' }],

    32: [{ type: 'title',      id: 'title_employe' }],
    33: [{ type: 'avatar',     id: 'avatar_jjk' }],
    35: [{ type: 'skin',       id: 'skin_yuji' }],
    37: [{ type: 'background', id: 'bg_arthur_6' }],
    40: [{ type: 'badge',      id: 'badge_tengen' }],

    42: [{ type: 'title',      id: 'title_surf' }],
    43: [{ type: 'avatar',     id: 'avatar_op' }],
    45: [{ type: 'pet',        id: 'pet2' }],
    46: [{ type: 'background', id: 'bg_arthur_7' }],
    49: [{ type: 'skin',       id: 'skin_op' }],
    50: [{ type: 'badge',      id: 'badge_op' }],

    52: [{ type: 'title',      id: 'title_trade' }],
    53: [{ type: 'avatar',     id: 'avatar_snk' }],
    55: [{ type: 'skin',       id: 'skin_titan' }],
    57: [{ type: 'background', id: 'bg_arthur_8' }],
    59: [{ type: 'badge',      id: 'badge_snk' }],
    60: [{ type: 'pet',        id: 'pet3' }],

    62: [{ type: 'title',      id: 'title_capitaine' }],
    63: [{ type: 'avatar',     id: 'avatar_rick_morty' }],
    65: [{ type: 'background', id: 'bg_arthur_9' }],
    67: [{ type: 'skin',       id: 'skin_rick' }],
    69: [{ type: 'badge',      id: 'badge_rick' }],

    72: [{ type: 'title',      id: 'title_ceo' }],
    73: [{ type: 'avatar',     id: 'avatar_samourai' }],
    75: [{ type: 'background', id: 'bg_arthur_10' }],
    77: [{ type: 'skin',       id: 'skin_samourai' }],
    79: [{ type: 'badge',      id: 'badge_dragon' }],
    80: [{ type: 'pet',        id: 'pet4' }],

    82: [{ type: 'title',      id: 'title_don' }],
    83: [{ type: 'avatar',     id: 'avatar_dragons' }],
    85: [{ type: 'skin',       id: 'skin_don' }],
    87: [{ type: 'background', id: 'bg_arthur_11' }],
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
    98: [{ type: 'background', id: 'bg_arthur_12' }],
    99: [{ type: 'avatar',     id: 'avatar_king' }],
    100: [
      { type: 'title',      id: 'title_endgame' },
      { type: 'avatar',     id: 'avatar_endgame' },
      { type: 'background', id: 'bg_arthur_13' },
      { type: 'skin',       id: 'skin_imu' },
      { type: 'badge',      id: 'badge_endgame' },
      { type: 'pet',        id: 'pet_endgame' }
    ]
  }
};

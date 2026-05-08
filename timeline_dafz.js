// ============================================
// timeline_dafz.js — Données Timeline Dafz
// Skins, Backgrounds, Avatars, Pets (visuels), Titres, Récompenses de niveau
// ============================================

window.TIMELINE_DATA = window.TIMELINE_DATA || {};

window.TIMELINE_DATA.dafz = {

  // ────────────────
  // TITRES
  // ────────────────
  titles: [
    { id: 'title1',              name: 'Novice',                    owned: true  },
    { id: 'title_t1_supporter',  name: 'T1 Supporter',              owned: false },
    { id: 'title_SlimShady',     name: 'The Slim Shady',            owned: false },
    { id: 'title_dresseur',      name: 'Dresseur',                  owned: false },
    { id: 'title_exorciste',     name: 'Apprenti Exorciste',        owned: false },
    { id: 'title_mugiwara',      name: 'Mugiwara',                  owned: false },
    { id: 'title_bataillon',     name: "Bataillon d'exploration",   owned: false },
    { id: 'title_dimensions',    name: 'Voyageur de dimensions',    owned: false },
    { id: 'title_samourai',      name: 'Samourai',                  owned: false },
    { id: 'title_dragons',       name: 'Roi du Nord',               owned: false },
    { id: 'title_endgame',       name: 'Grand Maitre',              owned: false },
    // HF : Montée de niveau (universels, inclus ici pour chargement initial)
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
  // ────────────────
  avatars: [
    { id: 'avatar1',          name: 'Avatar 1',          src: 'assets/avatars/avatar1.png',          owned: true  },
    { id: 'avatar_t1',        name: 'Avatar T1',          src: 'assets/avatars/avatar_t1.png',        owned: false },
    { id: 'avatar_rap',       name: 'Avatar SlimShady',   src: 'assets/avatars/avatar_rap.png',       owned: false },
    { id: 'avatar_pokeball',  name: 'Avatar Pokeball',    src: 'assets/avatars/avatar_pokeball.png',  owned: false },
    { id: 'avatar_jjk',       name: 'Avatar JJK',         src: 'assets/avatars/avatar_jjk.png',       owned: false },
    { id: 'avatar_op',        name: 'Avatar One Piece',   src: 'assets/avatars/avatar_op.png',        owned: false },
    { id: 'avatar_snk',       name: 'Avatar SNK',         src: 'assets/avatars/avatar_snk.png',       owned: false },
    { id: 'avatar_rick_morty',name: 'Avatar Rick & Morty',src: 'assets/avatars/avatar_rick_morty.png',owned: false },
    { id: 'avatar_samourai',  name: 'Avatar Samourai',    src: 'assets/avatars/avatar_samourai.png',  owned: false },
    { id: 'avatar_dragons',   name: 'Avatar Dragons',     src: 'assets/avatars/avatar_dragons.png',   owned: false },
    { id: 'avatar_endgame',   name: 'Avatar End Game',    src: 'assets/avatars/avatar_endgame.png',   owned: false },
    { id: 'avatar_king',      name: 'Avatar King',        src: 'assets/avatars/avatar_king.png',      owned: false },
    // HF Échecs
    { id: 'avatar_plat',  name: 'Avatar Platine',       src: 'assets/avatars/avatar_plat.png',  owned: false },
    // HF Familier
    { id: 'avatar_pet1',  name: 'Avatar Hericendre',    src: 'assets/avatars/avatar_pet1.png',  owned: false },
    { id: 'avatar_pet2',  name: 'Avatar Chopper',       src: 'assets/avatars/avatar_pet2.png',  owned: false },
    { id: 'avatar_pet3',  name: 'Avatar Titan Capturé', src: 'assets/avatars/avatar_pet3.png',  owned: false },
    { id: 'avatar_pet4',  name: 'Avatar Aigle Royale',  src: 'assets/avatars/avatar_pet4.png',  owned: false },
  ],

  // ────────────────
  // SKINS
  // ────────────────
  skins: [
    { id: 'skin_t1',              name: 'Skin T1',        folder: 'Skin_T1',           owned: true  },
    { id: 'skin_eminem',          name: 'Slim Shady',     folder: 'Skin_Eminem',       owned: false },
    { id: 'skin_pokemon',         name: 'Pokémon',        folder: 'Skin_Pokemon',      owned: false },
    { id: 'skin_yuji',            name: 'Yuji Itadori',   folder: 'Skin_JJK',          owned: false },
    { id: 'skin_op',              name: 'One Piece',      folder: 'Skin_OP',           owned: false },
    { id: 'skin_titan',           name: 'Titan',          folder: 'Skin_Snk',          owned: false },
    { id: 'skin_rick',            name: 'Rick & Morty',   folder: 'Skin_RM',           owned: false },
    { id: 'skin_samourai',        name: 'Samourai',       folder: 'Skin_ronin',        owned: false },
    { id: 'skin_dragon_hunter',   name: 'Roi du Nord',    folder: 'Skin_got',          owned: false },
    { id: 'skin_backpacker',      name: 'Backpacker',     folder: 'Skin_backpacker',   owned: false },
    { id: 'skin_quilby',          name: 'Quilby',         folder: 'Skin_quilby',       owned: false },
    { id: 'skin_ultra_rare_zoro', name: 'Zoro',           folder: 'Skin_zoro',         owned: false },
    { id: 'skin_roi_liche',       name: 'Roi Liche',      folder: 'Skin_liche',        owned: false },
    { id: 'skin_imu',             name: 'Imu Nerona',     folder: 'Skin_imu',          owned: false },
    // HF Quêtes
    { id: 'skin_iop',    name: 'IOP',    folder: 'Skin_iop',    owned: false },
    { id: 'skin_xelor',  name: 'Xelor',  folder: 'Skin_xelor',  owned: false },
    // HF Échecs
    { id: 'skin_carlsen', name: 'Carlsen', folder: 'Skin_carlsen', owned: false },
  ],

  // ────────────────
  // BACKGROUNDS
  // ────────────────
  backgrounds: [
    { id: 'bg_default',     name: 'Défaut',         bg1: 'assets/background/bg1_frame1.png',  bg2: 'assets/background/bg1_frame2.png',  owned: true  },
    { id: 'bg_white',       name: 'Blanc',           bg1: 'assets/background/bg2_frame1.png',  bg2: 'assets/background/bg2_frame2.png',  owned: true  },
    { id: 'bg_t1',          name: 'T1',              bg1: 'assets/background/bg3_frame1.png',  bg2: 'assets/background/bg3_frame2.png',  owned: false },
    { id: 'bg_detroit',     name: 'Detroit',         bg1: 'assets/background/bg4_frame1.png',  bg2: 'assets/background/bg4_frame2.png',  owned: false },
    { id: 'bg_pokemon',     name: 'Pokémon',         bg1: 'assets/background/bg5_frame1.png',  bg2: 'assets/background/bg5_frame2.png',  owned: false },
    { id: 'bg_yuji_train',  name: 'Train Yuji',      bg1: 'assets/background/bg6_frame1.png',  bg2: 'assets/background/bg6_frame2.png',  owned: false },
    { id: 'bg_merry',       name: 'Going Merry',     bg1: 'assets/background/bg7_frame1.png',  bg2: 'assets/background/bg7_frame2.png',  owned: false },
    { id: 'bg_foret',       name: 'Titan Colossal',  bg1: 'assets/background/bg8_frame1.png',  bg2: 'assets/background/bg8_frame2.png',  owned: false },
    { id: 'bg_portal',      name: 'Portail',         bg1: 'assets/background/bg9_frame1.png',  bg2: 'assets/background/bg9_frame2.png',  owned: false },
    { id: 'bg_got',         name: 'Trône de Fer',    bg1: 'assets/background/bg11_frame1.png', bg2: 'assets/background/bg11_frame2.png', owned: false },
    // HF Connexion régulière
    { id: 'bg_paris',       name: 'Paris',           bg1: 'assets/background/bg13_frame1.png', bg2: 'assets/background/bg13_frame2.png', owned: false },
    { id: 'bg_japon',       name: 'Japon',           bg1: 'assets/background/bg14_frame1.png', bg2: 'assets/background/bg14_frame2.png', owned: false },
    { id: 'bg_usa',         name: 'Amérique',        bg1: 'assets/background/bg15_frame1.png', bg2: 'assets/background/bg15_frame2.png', owned: false },
    { id: 'bg_australie',   name: 'Australie',       bg1: 'assets/background/bg16_frame1.png', bg2: 'assets/background/bg16_frame2.png', owned: false },
    { id: 'bg_afrique',     name: 'Afrique',         bg1: 'assets/background/bg17_frame1.png', bg2: 'assets/background/bg17_frame2.png', owned: false },
    { id: 'bg_marineford',  name: 'MarineFord',      bg1: 'assets/background/bg18_frame1.png', bg2: 'assets/background/bg18_frame2.png', owned: false },
    { id: 'bg_hell',        name: 'Enfers',          bg1: 'assets/background/bg19_frame1.png', bg2: 'assets/background/bg19_frame2.png', owned: false },
    { id: 'bg_paradis',     name: 'Paradis',         bg1: 'assets/background/bg20_frame1.png', bg2: 'assets/background/bg20_frame2.png', owned: false },
    { id: 'bg_hf_250',      name: '? (250j)',        bg1: 'assets/background/bg22_frame1.png', bg2: 'assets/background/bg22_frame2.png', owned: false },
    { id: 'bg_hf_300',      name: '? (300j)',        bg1: 'assets/background/bg23_frame1.png', bg2: 'assets/background/bg23_frame2.png', owned: false },
    // End Game
    { id: 'bg_end_game',    name: 'End Game',        bg1: 'assets/background/bg24_frame1.png', bg2: 'assets/background/bg24_frame2.png', owned: false },
    // HF Quêtes
    { id: 'bg_dofus',       name: 'Dofus',           bg1: 'assets/background/bg21_frame1.png', bg2: 'assets/background/bg21_frame2.png', owned: false },
    // HF Échecs
    { id: 'bg_echecs',      name: 'Échiquier',       bg1: 'assets/background/bg25_frame1.png', bg2: 'assets/background/bg25_frame2.png', owned: false },
  ],

  // ────────────────
  // RÉCOMPENSES DE NIVEAU (skins/avatars/backgrounds spécifiques Dafz)
  // Les badges, pets, titres HF sont universels → dans stats.js
  // ────────────────
  levelRewards: {
    2:  [{ type: 'title',      id: 'title_t1_supporter' }],
    4:  [{ type: 'avatar',     id: 'avatar_t1' }],
    7:  [{ type: 'background', id: 'bg_t1' }],
    10: [{ type: 'badge',      id: 'badge_t1' }],

    12: [{ type: 'title',      id: 'title_SlimShady' }],
    13: [{ type: 'avatar',     id: 'avatar_rap' }],
    15: [{ type: 'background', id: 'bg_detroit' }],
    17: [{ type: 'badge',      id: 'badge_plume' }],
    20: [{ type: 'skin',       id: 'skin_eminem' }],

    22: [{ type: 'title',      id: 'title_dresseur' }],
    23: [{ type: 'avatar',     id: 'avatar_pokeball' }],
    25: [{ type: 'pet',        id: 'pet1' }],
    27: [{ type: 'background', id: 'bg_pokemon' }],
    29: [{ type: 'badge',      id: 'badge_pokemon' }],
    30: [{ type: 'skin',       id: 'skin_pokemon' }],

    32: [{ type: 'title',      id: 'title_exorciste' }],
    33: [{ type: 'avatar',     id: 'avatar_jjk' }],
    35: [{ type: 'skin',       id: 'skin_yuji' }],
    37: [{ type: 'background', id: 'bg_yuji_train' }],
    40: [{ type: 'badge',      id: 'badge_tengen' }],

    42: [{ type: 'title',      id: 'title_mugiwara' }],
    43: [{ type: 'avatar',     id: 'avatar_op' }],
    45: [{ type: 'pet',        id: 'pet2' }],
    46: [{ type: 'background', id: 'bg_merry' }],
    49: [{ type: 'skin',       id: 'skin_op' }],
    50: [{ type: 'badge',      id: 'badge_op' }],

    52: [{ type: 'title',      id: 'title_bataillon' }],
    53: [{ type: 'avatar',     id: 'avatar_snk' }],
    55: [{ type: 'skin',       id: 'skin_titan' }],
    57: [{ type: 'background', id: 'bg_foret' }],
    59: [{ type: 'badge',      id: 'badge_snk' }],
    60: [{ type: 'pet',        id: 'pet3' }],

    62: [{ type: 'title',      id: 'title_dimensions' }],
    63: [{ type: 'avatar',     id: 'avatar_rick_morty' }],
    65: [{ type: 'background', id: 'bg_portal' }],
    67: [{ type: 'skin',       id: 'skin_rick' }],
    69: [{ type: 'badge',      id: 'badge_rick' }],

    72: [{ type: 'title',      id: 'title_samourai' }],
    73: [{ type: 'avatar',     id: 'avatar_samourai' }],
    75: [{ type: 'background', id: 'bg_japon' }],
    77: [{ type: 'skin',       id: 'skin_samourai' }],
    79: [{ type: 'badge',      id: 'badge_dragon' }],
    80: [{ type: 'pet',        id: 'pet4' }],

    82: [{ type: 'title',      id: 'title_dragons' }],
    83: [{ type: 'avatar',     id: 'avatar_dragons' }],
    85: [{ type: 'skin',       id: 'skin_dragon_hunter' }],
    87: [{ type: 'background', id: 'bg_got' }],
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
    98: [{ type: 'background', id: 'bg_got' }],
    99: [{ type: 'avatar',     id: 'avatar_king' }],
    100: [
      { type: 'title',      id: 'title_endgame' },
      { type: 'avatar',     id: 'avatar_endgame' },
      { type: 'background', id: 'bg_end_game' },
      { type: 'skin',       id: 'skin_imu' },
      { type: 'badge',      id: 'badge_endgame' },
      { type: 'pet',        id: 'pet_endgame' }
    ]
  }
};

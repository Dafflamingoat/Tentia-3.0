// ============================================
// timeline_male.js - Timeline Male
// Base propre pour le futur createur de personnage.
// Les anciens skins sont conserves en legacyPvPSkins pour un usage PvP plus tard.
// ============================================

window.TIMELINE_DATA = window.TIMELINE_DATA || {};

window.TIMELINE_DATA.male = {
  id: 'male',
  label: 'Male',

  characterBuilder: {
    basePath: 'assets/character-builder/male',
    available: true,
    defaultAppearance: {
      body: 'body_light',
      hair: 'hair_01',
      eyes: 'eyes_01_green',
      eyebrows: null,
      beard: 'beard_none',
      scar: null
    },

    // Ajouter ici les nouvelles teintes de peau.
    bodies: [
      { id: 'body_light', label: 'Claire', src: 'assets/character-builder/male/body/body_light.png', owned: true },
      { id: 'body_medium', label: 'Medium', src: 'assets/character-builder/male/body/body_medium.png', owned: true },
      { id: 'body_dark', label: 'Foncee', src: 'assets/character-builder/male/body/body_dark.png', owned: true }
    ],

    // Ajouter ici les nouvelles coupes de cheveux.
    hair: [
      { id: 'hair_01', label: 'Cheveux 1', src: 'assets/character-builder/male/hair/hair_01.png', owned: true },
      { id: 'hair_02', label: 'Cheveux 2', src: 'assets/character-builder/male/hair/hair_02.png', owned: true },
      { id: 'hair_03', label: 'Cheveux 3', src: 'assets/character-builder/male/hair/hair_03.png', owned: true }
    ],

    // Ajouter ici les nouveaux yeux/couleurs.
    eyes: [
      { id: 'eyes_01_green', label: 'Yeux 1 vert', src: 'assets/character-builder/male/eyes/eyes_01_green.png', owned: true },
      { id: 'eyes_01_brown', label: 'Yeux 1 brun', src: 'assets/character-builder/male/eyes/eyes_01_brown.png', owned: true },
      { id: 'eyes_02_green', label: 'Yeux 2 vert', src: 'assets/character-builder/male/eyes/eyes_02_green.png', owned: true },
      { id: 'eyes_02_brown', label: 'Yeux 2 brun', src: 'assets/character-builder/male/eyes/eyes_02_brown.png', owned: true },
      { id: 'eyes_03_green', label: 'Yeux 3 vert', src: 'assets/character-builder/male/eyes/eyes_03_green.png', owned: true },
      { id: 'eyes_03_brown', label: 'Yeux 3 brun', src: 'assets/character-builder/male/eyes/eyes_03_brown.png', owned: true }
    ],

    // Ajouter ici les sourcils si on les active plus tard.
    eyebrows: [],

    // Ajouter ici les cicatrices si on les active plus tard.
    scars: [],

    // Ajouter ici les barbes.
    beards: [
      { id: 'beard_none', label: 'Aucune', src: null, owned: true },
      { id: 'beard_01', label: 'Barbe 1', src: 'assets/character-builder/male/beard/beard_01.png', owned: true },
      { id: 'beard_02', label: 'Barbe 2', src: 'assets/character-builder/male/beard/beard_02.png', owned: true },
      { id: 'beard_03', label: 'Barbe 3', src: 'assets/character-builder/male/beard/beard_03.png', owned: true }
    ]
  },
  titles: [
  {
    "id": "title1",
    "name": "Novice",
    "owned": true
  },
  {
    "id": "title_t1_supporter",
    "name": "T1 Supporter",
    "owned": false
  },
  {
    "id": "title_SlimShady",
    "name": "The Slim Shady",
    "owned": false
  },
  {
    "id": "title_dresseur",
    "name": "Dresseur",
    "owned": false
  },
  {
    "id": "title_exorciste",
    "name": "Apprenti Exorciste",
    "owned": false
  },
  {
    "id": "title_mugiwara",
    "name": "Mugiwara",
    "owned": false
  },
  {
    "id": "title_bataillon",
    "name": "Bataillon d'exploration",
    "owned": false
  },
  {
    "id": "title_dimensions",
    "name": "Voyageur de dimensions",
    "owned": false
  },
  {
    "id": "title_samourai",
    "name": "Samourai",
    "owned": false
  },
  {
    "id": "title_dragons",
    "name": "Roi du Nord",
    "owned": false
  },
  {
    "id": "title_endgame",
    "name": "Grand Maitre",
    "owned": false
  },
  {
    "id": "title_hf_lvl10",
    "name": "Gameur Pro",
    "owned": false
  },
  {
    "id": "title_hf_lvl20",
    "name": "Travailleur Acharné",
    "owned": false
  },
  {
    "id": "title_hf_lvl30",
    "name": "Bourg-Palette",
    "owned": false
  },
  {
    "id": "title_hf_lvl40",
    "name": "Oeil de l'Infini",
    "owned": false
  },
  {
    "id": "title_hf_lvl50",
    "name": "Yonko",
    "owned": false
  },
  {
    "id": "title_hf_lvl60",
    "name": "Explorateur",
    "owned": false
  },
  {
    "id": "title_hf_lvl70",
    "name": "Chef Galactique",
    "owned": false
  },
  {
    "id": "title_hf_lvl80",
    "name": "Divin",
    "owned": false
  },
  {
    "id": "title_hf_lvl90",
    "name": "Maitre",
    "owned": false
  },
  {
    "id": "title_hf_lvl100",
    "name": "Targaryen",
    "owned": false
  },
  {
    "id": "title_hf_eleveur",
    "name": "Légendaire Éleveur de Bêtes",
    "owned": false
  },
  {
    "id": "title_hf_rpg",
    "name": "RPG",
    "owned": false
  },
  {
    "id": "title_method",
    "name": "Le Méthodique",
    "owned": false
  },
  {
    "id": "title_carlsen",
    "name": "Carlsen",
    "owned": false
  }
],
  avatars: [
  {
    "id": "avatar1",
    "name": "Avatar 1",
    "src": "assets/avatars/avatar1.png",
    "owned": true
  },
  {
    "id": "avatar_t1",
    "name": "Avatar T1",
    "src": "assets/avatars/avatar_t1.png",
    "owned": false
  },
  {
    "id": "avatar_rap",
    "name": "Avatar SlimShady",
    "src": "assets/avatars/avatar_rap.png",
    "owned": false
  },
  {
    "id": "avatar_pokeball",
    "name": "Avatar Pokeball",
    "src": "assets/avatars/avatar_pokeball.png",
    "owned": false
  },
  {
    "id": "avatar_jjk",
    "name": "Avatar JJK",
    "src": "assets/avatars/avatar_jjk.png",
    "owned": false
  },
  {
    "id": "avatar_op",
    "name": "Avatar One Piece",
    "src": "assets/avatars/avatar_op.png",
    "owned": false
  },
  {
    "id": "avatar_snk",
    "name": "Avatar SNK",
    "src": "assets/avatars/avatar_snk.png",
    "owned": false
  },
  {
    "id": "avatar_rick_morty",
    "name": "Avatar Rick & Morty",
    "src": "assets/avatars/avatar_rick_morty.png",
    "owned": false
  },
  {
    "id": "avatar_samourai",
    "name": "Avatar Samourai",
    "src": "assets/avatars/avatar_samourai.png",
    "owned": false
  },
  {
    "id": "avatar_dragons",
    "name": "Avatar Dragons",
    "src": "assets/avatars/avatar_dragons.png",
    "owned": false
  },
  {
    "id": "avatar_endgame",
    "name": "Avatar End Game",
    "src": "assets/avatars/avatar_endgame.png",
    "owned": false
  },
  {
    "id": "avatar_king",
    "name": "Avatar King",
    "src": "assets/avatars/avatar_king.png",
    "owned": false
  },
  {
    "id": "avatar_plat",
    "name": "Avatar Platine",
    "src": "assets/avatars/avatar_plat.png",
    "owned": false
  },
  {
    "id": "avatar_pet1",
    "name": "Avatar Hericendre",
    "src": "assets/avatars/avatar_pet1.png",
    "owned": false
  },
  {
    "id": "avatar_pet2",
    "name": "Avatar Chopper",
    "src": "assets/avatars/avatar_pet2.png",
    "owned": false
  },
  {
    "id": "avatar_pet3",
    "name": "Avatar Titan Capturé",
    "src": "assets/avatars/avatar_pet3.png",
    "owned": false
  },
  {
    "id": "avatar_pet4",
    "name": "Avatar Aigle Royale",
    "src": "assets/avatars/avatar_pet4.png",
    "owned": false
  }
],
  backgrounds: [
  {
    "id": "bg_default",
    "name": "Défaut",
    "bg1": "assets/background/bg1_frame1.png",
    "bg2": "assets/background/bg1_frame2.png",
    "owned": true
  },
  {
    "id": "bg_white",
    "name": "Blanc",
    "bg1": "assets/background/bg2_frame1.png",
    "bg2": "assets/background/bg2_frame2.png",
    "owned": true
  },
  {
    "id": "bg_t1",
    "name": "T1",
    "bg1": "assets/background/bg3_frame1.png",
    "bg2": "assets/background/bg3_frame2.png",
    "owned": false
  },
  {
    "id": "bg_detroit",
    "name": "Detroit",
    "bg1": "assets/background/bg4_frame1.png",
    "bg2": "assets/background/bg4_frame2.png",
    "owned": false
  },
  {
    "id": "bg_pokemon",
    "name": "Pokémon",
    "bg1": "assets/background/bg5_frame1.png",
    "bg2": "assets/background/bg5_frame2.png",
    "owned": false
  },
  {
    "id": "bg_yuji_train",
    "name": "Train Yuji",
    "bg1": "assets/background/bg6_frame1.png",
    "bg2": "assets/background/bg6_frame2.png",
    "owned": false
  },
  {
    "id": "bg_merry",
    "name": "Going Merry",
    "bg1": "assets/background/bg7_frame1.png",
    "bg2": "assets/background/bg7_frame2.png",
    "owned": false
  },
  {
    "id": "bg_foret",
    "name": "Titan Colossal",
    "bg1": "assets/background/bg8_frame1.png",
    "bg2": "assets/background/bg8_frame2.png",
    "owned": false
  },
  {
    "id": "bg_portal",
    "name": "Portail",
    "bg1": "assets/background/bg9_frame1.png",
    "bg2": "assets/background/bg9_frame2.png",
    "owned": false
  },
  {
    "id": "bg_got",
    "name": "Trône de Fer",
    "bg1": "assets/background/bg11_frame1.png",
    "bg2": "assets/background/bg11_frame2.png",
    "owned": false
  },
  {
    "id": "bg_paris",
    "name": "Paris",
    "bg1": "assets/background/bg13_frame1.png",
    "bg2": "assets/background/bg13_frame2.png",
    "owned": false
  },
  {
    "id": "bg_japon",
    "name": "Japon",
    "bg1": "assets/background/bg14_frame1.png",
    "bg2": "assets/background/bg14_frame2.png",
    "owned": false
  },
  {
    "id": "bg_usa",
    "name": "Amérique",
    "bg1": "assets/background/bg15_frame1.png",
    "bg2": "assets/background/bg15_frame2.png",
    "owned": false
  },
  {
    "id": "bg_australie",
    "name": "Australie",
    "bg1": "assets/background/bg16_frame1.png",
    "bg2": "assets/background/bg16_frame2.png",
    "owned": false
  },
  {
    "id": "bg_afrique",
    "name": "Afrique",
    "bg1": "assets/background/bg17_frame1.png",
    "bg2": "assets/background/bg17_frame2.png",
    "owned": false
  },
  {
    "id": "bg_marineford",
    "name": "MarineFord",
    "bg1": "assets/background/bg18_frame1.png",
    "bg2": "assets/background/bg18_frame2.png",
    "owned": false
  },
  {
    "id": "bg_hell",
    "name": "Enfers",
    "bg1": "assets/background/bg19_frame1.png",
    "bg2": "assets/background/bg19_frame2.png",
    "owned": false
  },
  {
    "id": "bg_paradis",
    "name": "Paradis",
    "bg1": "assets/background/bg20_frame1.png",
    "bg2": "assets/background/bg20_frame2.png",
    "owned": false
  },
  {
    "id": "bg_hf_250",
    "name": "Rome Antique",
    "bg1": "assets/background/bg22_frame1.png",
    "bg2": "assets/background/bg22_frame2.png",
    "owned": false
  },
  {
    "id": "bg_hf_300",
    "name": "Royaume Céleste",
    "bg1": "assets/background/bg23_frame1.png",
    "bg2": "assets/background/bg23_frame2.png",
    "owned": false
  },
  {
    "id": "bg_end_game",
    "name": "Abysse",
    "bg1": "assets/background/bg24_frame1.png",
    "bg2": "assets/background/bg24_frame2.png",
    "owned": false
  },
  {
    "id": "bg_dofus",
    "name": "Dofus",
    "bg1": "assets/background/bg21_frame1.png",
    "bg2": "assets/background/bg21_frame2.png",
    "owned": false
  },
  {
    "id": "bg_echecs",
    "name": "Échiquier",
    "bg1": "assets/background/bg25_frame1.png",
    "bg2": "assets/background/bg25_frame2.png",
    "owned": false
  }
],
  skins: [],
  legacyPvPSkins: [
  {
    "id": "skin_t1",
    "name": "Skin T1",
    "folder": "Skin_T1",
    "futureUse": "pvp"
  },
  {
    "id": "skin_eminem",
    "name": "Slim Shady",
    "folder": "Skin_Eminem",
    "futureUse": "pvp"
  },
  {
    "id": "skin_pokemon",
    "name": "Pokémon",
    "folder": "Skin_Pokemon",
    "futureUse": "pvp"
  },
  {
    "id": "skin_yuji",
    "name": "Yuji Itadori",
    "folder": "Skin_JJK",
    "futureUse": "pvp"
  },
  {
    "id": "skin_op",
    "name": "One Piece",
    "folder": "Skin_OP",
    "futureUse": "pvp"
  },
  {
    "id": "skin_titan",
    "name": "Titan",
    "folder": "Skin_Snk",
    "futureUse": "pvp"
  },
  {
    "id": "skin_rick",
    "name": "Rick & Morty",
    "folder": "Skin_RM",
    "futureUse": "pvp"
  },
  {
    "id": "skin_samourai",
    "name": "Samourai",
    "folder": "Skin_ronin",
    "futureUse": "pvp"
  },
  {
    "id": "skin_dragon_hunter",
    "name": "Roi du Nord",
    "folder": "Skin_got",
    "futureUse": "pvp"
  },
  {
    "id": "skin_backpacker",
    "name": "Backpacker",
    "folder": "Skin_backpacker",
    "futureUse": "pvp"
  },
  {
    "id": "skin_quilby",
    "name": "Quilby",
    "folder": "Skin_quilby",
    "futureUse": "pvp"
  },
  {
    "id": "skin_ultra_rare_zoro",
    "name": "Zoro",
    "folder": "Skin_zoro",
    "futureUse": "pvp"
  },
  {
    "id": "skin_roi_liche",
    "name": "Roi Liche",
    "folder": "Skin_liche",
    "futureUse": "pvp"
  },
  {
    "id": "skin_imu",
    "name": "Imu Nerona",
    "folder": "Skin_imu",
    "futureUse": "pvp"
  },
  {
    "id": "skin_iop",
    "name": "IOP",
    "folder": "Skin_iop",
    "futureUse": "pvp"
  },
  {
    "id": "skin_xelor",
    "name": "Xelor",
    "folder": "Skin_xelor",
    "futureUse": "pvp"
  },
  {
    "id": "skin_carlsen",
    "name": "Carlsen",
    "folder": "Skin_carlsen",
    "futureUse": "pvp"
  }
],
  pets: {
  "pet1": {
    "name": "Hericendre",
    "evolutions": [
      {
        "minLevel": 1,
        "maxLevel": 15,
        "name": "Hericendre",
        "sprite1": "assets/pets/intel/pet1_frame1.png",
        "sprite2": "assets/pets/intel/pet1_frame2.png"
      },
      {
        "minLevel": 16,
        "maxLevel": 34,
        "name": "Feurisson",
        "sprite1": "assets/pets/intel/pet2_frame1.png",
        "sprite2": "assets/pets/intel/pet2_frame2.png"
      },
      {
        "minLevel": 35,
        "maxLevel": 50,
        "name": "Typhlosion",
        "sprite1": "assets/pets/intel/pet3_frame1.png",
        "sprite2": "assets/pets/intel/pet3_frame2.png"
      }
    ],
    "sprite1": "assets/pets/intel/pet1_frame1.png",
    "sprite2": "assets/pets/intel/pet1_frame2.png"
  },
  "pet2": {
    "name": "Chopper",
    "sprite1": "assets/pets/force/pet1_frame1.png",
    "sprite2": "assets/pets/force/pet1_frame2.png"
  },
  "pet3": {
    "name": "Titan capturé",
    "sprite1": "assets/pets/discipline/pet1_frame1.png",
    "sprite2": "assets/pets/discipline/pet1_frame2.png"
  },
  "pet4": {
    "name": "Oeuf Mystère",
    "evolutions": [
      {
        "minLevel": 1,
        "maxLevel": 9,
        "name": "Oeuf Mystère",
        "sprite1": "assets/pets/focus/pet1_frame1.png",
        "sprite2": "assets/pets/focus/pet1_frame2.png"
      },
      {
        "minLevel": 10,
        "maxLevel": 50,
        "name": "Aigle Royale",
        "sprite1": "assets/pets/focus/pet2_frame1.png",
        "sprite2": "assets/pets/focus/pet2_frame2.png"
      }
    ],
    "sprite1": "assets/pets/focus/pet1_frame1.png",
    "sprite2": "assets/pets/focus/pet1_frame2.png"
  },
  "pet_dragon_legendary": {
    "name": "Dragon legendaire",
    "sprite1": "assets/pets/got/pet1_frame1.png",
    "sprite2": "assets/pets/got/pet1_frame2.png"
  },
  "pet_bob": {
    "name": "Fantôme de Bob",
    "sprite1": "assets/pets/legends/pet1_frame1.png",
    "sprite2": "assets/pets/legends/pet1_frame2.png"
  },
  "pet_endgame": {
    "name": "Arme Ultime",
    "sprite1": "assets/pets/arc_frame1.png",
    "sprite2": "assets/pets/arc_frame2.png",
    "forms": {
      "arc": {
        "name": "Arc Céleste",
        "sprite1": "assets/pets/arc_frame1.png",
        "sprite2": "assets/pets/arc_frame2.png"
      },
      "baton": {
        "name": "Bâton du Sage",
        "sprite1": "assets/pets/baton_frame1.png",
        "sprite2": "assets/pets/baton_frame2.png"
      },
      "marteau": {
        "name": "Marteau Divin",
        "sprite1": "assets/pets/marteau_frame1.png",
        "sprite2": "assets/pets/marteau_frame2.png"
      },
      "bouclier": {
        "name": "Bouclier Absolu",
        "sprite1": "assets/pets/bouclier_frame1.png",
        "sprite2": "assets/pets/bouclier_frame2.png"
      }
    }
  }
},
  levelRewards: {
  "2": [
    {
      "type": "title",
      "id": "title_t1_supporter"
    }
  ],
  "4": [
    {
      "type": "avatar",
      "id": "avatar_t1"
    }
  ],
  "7": [
    {
      "type": "background",
      "id": "bg_t1"
    }
  ],
  "10": [
    {
      "type": "badge",
      "id": "badge_t1"
    }
  ],
  "12": [
    {
      "type": "title",
      "id": "title_SlimShady"
    }
  ],
  "13": [
    {
      "type": "avatar",
      "id": "avatar_rap"
    }
  ],
  "15": [
    {
      "type": "background",
      "id": "bg_detroit"
    }
  ],
  "17": [
    {
      "type": "badge",
      "id": "badge_plume"
    }
  ],
  "22": [
    {
      "type": "title",
      "id": "title_dresseur"
    }
  ],
  "23": [
    {
      "type": "avatar",
      "id": "avatar_pokeball"
    }
  ],
  "25": [
    {
      "type": "pet",
      "id": "pet1"
    }
  ],
  "27": [
    {
      "type": "background",
      "id": "bg_pokemon"
    }
  ],
  "29": [
    {
      "type": "badge",
      "id": "badge_pokemon"
    }
  ],
  "32": [
    {
      "type": "title",
      "id": "title_exorciste"
    }
  ],
  "33": [
    {
      "type": "avatar",
      "id": "avatar_jjk"
    }
  ],
  "37": [
    {
      "type": "background",
      "id": "bg_yuji_train"
    }
  ],
  "40": [
    {
      "type": "badge",
      "id": "badge_tengen"
    }
  ],
  "42": [
    {
      "type": "title",
      "id": "title_mugiwara"
    }
  ],
  "43": [
    {
      "type": "avatar",
      "id": "avatar_op"
    }
  ],
  "45": [
    {
      "type": "pet",
      "id": "pet2"
    }
  ],
  "46": [
    {
      "type": "background",
      "id": "bg_merry"
    }
  ],
  "50": [
    {
      "type": "badge",
      "id": "badge_op"
    }
  ],
  "52": [
    {
      "type": "title",
      "id": "title_bataillon"
    }
  ],
  "53": [
    {
      "type": "avatar",
      "id": "avatar_snk"
    }
  ],
  "57": [
    {
      "type": "background",
      "id": "bg_foret"
    }
  ],
  "59": [
    {
      "type": "badge",
      "id": "badge_snk"
    }
  ],
  "60": [
    {
      "type": "pet",
      "id": "pet3"
    }
  ],
  "62": [
    {
      "type": "title",
      "id": "title_dimensions"
    }
  ],
  "63": [
    {
      "type": "avatar",
      "id": "avatar_rick_morty"
    }
  ],
  "65": [
    {
      "type": "background",
      "id": "bg_portal"
    }
  ],
  "69": [
    {
      "type": "badge",
      "id": "badge_rick"
    }
  ],
  "72": [
    {
      "type": "title",
      "id": "title_samourai"
    }
  ],
  "73": [
    {
      "type": "avatar",
      "id": "avatar_samourai"
    }
  ],
  "75": [
    {
      "type": "background",
      "id": "bg_japon"
    }
  ],
  "79": [
    {
      "type": "badge",
      "id": "badge_dragon"
    }
  ],
  "80": [
    {
      "type": "pet",
      "id": "pet4"
    }
  ],
  "82": [
    {
      "type": "title",
      "id": "title_dragons"
    }
  ],
  "83": [
    {
      "type": "avatar",
      "id": "avatar_dragons"
    }
  ],
  "87": [
    {
      "type": "background",
      "id": "bg_got"
    }
  ],
  "88": [
    {
      "type": "badge",
      "id": "badge_tiers3_1"
    }
  ],
  "89": [
    {
      "type": "badge",
      "id": "badge_tiers3_2"
    }
  ],
  "90": [
    {
      "type": "pet",
      "id": "pet_dragon_legendary"
    }
  ],
  "92": [
    {
      "type": "badge",
      "id": "badge_tiers3_3"
    }
  ],
  "93": [
    {
      "type": "badge",
      "id": "badge_tiers3_4"
    }
  ],
  "95": [
    {
      "type": "pet",
      "id": "pet_bob"
    }
  ],
  "98": [
    {
      "type": "background",
      "id": "bg_got"
    }
  ],
  "99": [
    {
      "type": "avatar",
      "id": "avatar_king"
    }
  ],
  "100": [
    {
      "type": "title",
      "id": "title_endgame"
    },
    {
      "type": "avatar",
      "id": "avatar_endgame"
    },
    {
      "type": "background",
      "id": "bg_end_game"
    },
    {
      "type": "badge",
      "id": "badge_endgame"
    },
    {
      "type": "pet",
      "id": "pet_endgame"
    }
  ]
}
};

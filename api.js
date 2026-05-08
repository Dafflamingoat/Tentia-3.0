// ============================================
// api.js — Client API Tentia
// Gère auth + sync avec le serveur
// ============================================

const API_URL = window.location.origin + '/api';

const TIMELINE_KEY = 'timelineId';
const TIMELINE_SKILLS_KEY = '_timelineId';

const TIMELINES = {
  dafz: {
    id: 'dafz',
    name: 'Dafz',
    skinPreview: 'assets/character/Skin_T1/moove1.png',
    starter: {
      selectedSkin: 'Skin_T1',
      equippedAvatarId: 'avatar1',
      selectedBG: ['assets/background/bg1_frame1.png', 'assets/background/bg1_frame2.png']
    }
  },
  billaud: {
    id: 'billaud',
    name: 'Billaud',
    skinPreview: 'assets/character/timelines/billaud/Skin_Billaud/moove1.png',
    starter: {
      selectedSkin: 'timelines/billaud/Skin_Billaud',
      equippedAvatarId: 'avatar_billaud',
      selectedBG: [
        'assets/background/timelines/billaud/bg1_frame1.png',
        'assets/background/timelines/billaud/bg1_frame2.png'
      ]
    }
  }
};

function safeParseJSON(value, fallback) {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); }
  catch { return fallback; }
}

function getStoredSkillsPayload() {
  return safeParseJSON(localStorage.getItem('skills'), {});
}

function getTimelineId() {
  const fromStorage = localStorage.getItem(TIMELINE_KEY);
  if (fromStorage && TIMELINES[fromStorage]) return fromStorage;

  const skills = getStoredSkillsPayload();
  if (skills[TIMELINE_SKILLS_KEY] && TIMELINES[skills[TIMELINE_SKILLS_KEY]]) {
    localStorage.setItem(TIMELINE_KEY, skills[TIMELINE_SKILLS_KEY]);
    return skills[TIMELINE_SKILLS_KEY];
  }

  return null;
}

function getProfileTimelineId(profile) {
  const skills = safeParseJSON(profile?.skills, {});
  if (skills[TIMELINE_SKILLS_KEY] && TIMELINES[skills[TIMELINE_SKILLS_KEY]]) {
    return skills[TIMELINE_SKILLS_KEY];
  }
  return null;
}

function setTimelineIdLocal(timelineId) {
  if (!TIMELINES[timelineId]) return;
  const skills = getStoredSkillsPayload();
  skills[TIMELINE_SKILLS_KEY] = timelineId;
  localStorage.setItem(TIMELINE_KEY, timelineId);
  localStorage.setItem('skills', JSON.stringify(skills));
}

function buildBillaudBackgrounds() {
  return Array.from({ length: 24 }, (_, index) => {
    const n = index + 1;
    return {
      id: `bg_billaud_${n}`,
      name: `Billaud ${n}`,
      bg1: `assets/background/timelines/billaud/bg${n}_frame1.png`,
      bg2: `assets/background/timelines/billaud/bg${n}_frame2.png`,
      owned: n <= 2
    };
  });
}

function applyTimelineStarterLocal(timelineId) {
  const timeline = TIMELINES[timelineId];
  if (!timeline) return null;

  setTimelineIdLocal(timelineId);

  if (timelineId === 'billaud') {
    const skins = [
      {
        id: 'skin_billaud',
        name: 'Billaud',
        folder: 'timelines/billaud/Skin_Billaud',
        owned: true
      }
    ];

    const avatars = [
      {
        id: 'avatar_billaud',
        name: 'Billaud',
        src: 'assets/avatars/timelines/billaud/avatar_billaud.png',
        owned: true
      }
    ];

    const backgrounds = buildBillaudBackgrounds();

    localStorage.setItem('skins', JSON.stringify(skins));
    localStorage.setItem('avatars', JSON.stringify(avatars));
    localStorage.setItem('backgrounds', JSON.stringify(backgrounds));
  }

  localStorage.setItem('selectedSkin', timeline.starter.selectedSkin);
  localStorage.setItem('equippedAvatarId', timeline.starter.equippedAvatarId);
  localStorage.setItem('selectedBG', JSON.stringify(timeline.starter.selectedBG));

  return {
    skills: getStoredSkillsPayload(),
    selected_skin: timeline.starter.selectedSkin,
    selected_bg: timeline.starter.selectedBG,
    equipped_avatar: timeline.starter.equippedAvatarId,
    ...(timelineId === 'billaud'
      ? {
          skins: safeParseJSON(localStorage.getItem('skins'), []),
          avatars: safeParseJSON(localStorage.getItem('avatars'), []),
          backgrounds: safeParseJSON(localStorage.getItem('backgrounds'), [])
        }
      : {})
  };
}

function isExistingLegacyProfile(profile) {
  if (!profile) return false;
  // Un profil legacy = vrai progrès mesurable uniquement
  // (pas hasCosmetics qui se déclenche sur un profil vierge avec skills vide)
  const hasProgress =
    (profile.level && profile.level > 1) ||
    (profile.xp && profile.xp > 0) ||
    (profile.total_quests_done && profile.total_quests_done > 0) ||
    (profile.total_quest_xp && profile.total_quest_xp > 0) ||
    (profile.total_chess_xp && profile.total_chess_xp > 0) ||
    (profile.peak_elo && profile.peak_elo > 0);

  return Boolean(hasProgress);
}

function injectTimelineStyles() {
  if (document.getElementById('timeline-choice-styles')) return;

  const style = document.createElement('style');
  style.id = 'timeline-choice-styles';
  style.textContent = `
    .timeline-overlay {
      position: fixed;
      inset: 0;
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.82);
      font-family: 'Press Start 2P', monospace;
    }
    .timeline-box {
      width: min(620px, calc(100vw - 28px));
      background: #2a1e08;
      border: 2px solid #c8a32c;
      box-shadow: 0 0 22px rgba(240,200,68,0.55), 4px 4px 0 #000;
      padding: 20px;
      color: #f5e6b0;
    }
    .timeline-title {
      color: #f0c844;
      text-align: center;
      font-size: 11px;
      margin-bottom: 18px;
      text-shadow: 0 0 8px #c8a32c;
    }
    .timeline-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .timeline-card {
      background: #12100a;
      border: 2px solid #6b4a00;
      padding: 14px 10px;
      color: #f5e6b0;
      cursor: pointer;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.65), 2px 2px 0 #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    }
    .timeline-card:hover {
      border-color: #f0c844;
      box-shadow: 0 0 12px rgba(240,200,68,0.5), inset 0 0 10px rgba(0,0,0,0.65), 2px 2px 0 #000;
      transform: translateY(-1px);
    }
    .timeline-sprite {
      width: 82px;
      height: 104px;
      object-fit: contain;
      image-rendering: pixelated;
    }
    .timeline-name {
      color: #f0c844;
      font-size: 8px;
      letter-spacing: 1px;
    }
    .timeline-btn {
      font-family: 'Press Start 2P', monospace;
      font-size: 7px;
      padding: 8px 10px;
      color: #f0c844;
      background: #2a1e08;
      border: 2px solid #6b4a00;
      box-shadow: 2px 2px 0 #000;
    }
    @media (max-width: 520px) {
      .timeline-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

function showTimelineChoice() {
  injectTimelineStyles();

  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'timeline-overlay';
    overlay.innerHTML = `
      <div class="timeline-box">
        <div class="timeline-title">CHOISIS TA TIMELINE</div>
        <div class="timeline-grid">
          ${Object.values(TIMELINES).map(timeline => `
            <button class="timeline-card" type="button" data-timeline="${timeline.id}">
              <img class="timeline-sprite" src="${timeline.skinPreview}" alt="${timeline.name}">
              <span class="timeline-name">${timeline.name}</span>
              <span class="timeline-btn">CHOISIR</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    overlay.querySelectorAll('[data-timeline]').forEach((button) => {
      button.addEventListener('click', async () => {
        const timelineId = button.dataset.timeline;
        const updates = applyTimelineStarterLocal(timelineId);

        if (updates && isLoggedIn()) {
          await saveProfile(updates);
        }

        overlay.remove();
        resolve(timelineId);
      });
    });

    document.body.appendChild(overlay);
  });
}

async function ensureTimelineSelection(profile) {
  // 1. Si le localStorage a déjà une timeline valide → stop immédiat (pas de popup)
  const localTimeline = getTimelineId();
  if (localTimeline) return localTimeline;

  // 2. Si le profil Supabase a une timeline → l'appliquer et stop
  const profileTimelineId = getProfileTimelineId(profile);
  if (profileTimelineId) {
    setTimelineIdLocal(profileTimelineId);
    return profileTimelineId;
  }

  // 3. Profil legacy existant → assigner dafz, sauvegarder, ne plus demander
  if (profile && isExistingLegacyProfile(profile)) {
    setTimelineIdLocal('dafz');
    const skills = getStoredSkillsPayload();
    await saveProfile({ skills });
    return 'dafz';
  }

  // 4. Nouveau compte vierge → afficher le choix une seule fois
  return showTimelineChoice();
}

// ── Gestion du token ─────────────────────────
function getToken() {
  return localStorage.getItem('_token');
}

function setToken(token, refresh) {
  localStorage.setItem('_token', token);
  if (refresh) localStorage.setItem('_refresh', refresh);
}

function clearToken() {
  localStorage.removeItem('_token');
  localStorage.removeItem('_refresh');
}

function isLoggedIn() {
  return !!getToken();
}

// ── Requête authentifiée ─────────────────────
async function apiRequest(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  let res = await fetch(API_URL + path, opts);

  // Token expiré → essayer de refresh
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`;
      res = await fetch(API_URL + path, { method, headers, body: opts.body });
    } else {
      clearToken();
      showLoginScreen();
      return null;
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('API error:', err);
    return null;
  }

  return res.json();
}

async function tryRefresh() {
  const refresh = localStorage.getItem('_refresh');
  if (!refresh) return false;

  const res = await fetch(API_URL + '/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh })
  });

  if (!res.ok) return false;
  const data = await res.json();
  setToken(data.token, data.refresh);
  return true;
}

// ── Auth ─────────────────────────────────────
async function register(email, password, username) {
  const res = await fetch(API_URL + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username })
  });
  return res.json();
}

async function login(email, password) {
  const res = await fetch(API_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const err = await res.json();
    return { error: err.error };
  }

  const data = await res.json();
  setToken(data.token, data.refresh);
  localStorage.setItem('_username', data.user.username);
  return data;
}

async function logout() {
  await apiRequest('POST', '/auth/logout');
  clearLocalStorage();
  showLoginScreen();
}

function clearLocalStorage() {
  // Garder uniquement les clés système, tout vider pour ne pas polluer le prochain compte
  const keep = [];
  clearToken();
  const allKeys = [];
  for (let i = 0; i < localStorage.length; i++) allKeys.push(localStorage.key(i));
  allKeys.forEach(key => {
    if (!keep.includes(key)) localStorage.removeItem(key);
  });
}

// ── Données ──────────────────────────────────
async function loadProfile() {
  const data = await apiRequest('GET', '/data/profile');
  if (!data) return;

  // Helper : n'écrase le localStorage que si la valeur Supabase est non nulle
  const setIfDefined = (key, val) => {
    if (val !== undefined && val !== null) localStorage.setItem(key, val);
  };

  // Helper : n'écrase les tableaux/objets que s'ils ont du contenu
  const setIfNotEmpty = (key, val) => {
    if (!val) return;
    const parsed = typeof val === 'string' ? JSON.parse(val) : val;
    const isEmpty = Array.isArray(parsed) ? parsed.length === 0 : Object.keys(parsed).length === 0;
    if (!isEmpty) localStorage.setItem(key, JSON.stringify(parsed));
  };

  // Valeurs simples — toujours charger
  setIfDefined('xp',            data.xp);
  setIfDefined('level',         data.level);
  setIfDefined('hp',            data.hp);
  setIfDefined('Force',         data.force);
  setIfDefined('Intelligence',  data.intelligence);
  setIfDefined('Discipline',    data.discipline);
  setIfDefined('Focus',         data.focus);
  setIfDefined('totalLoginDays',  data.total_login_days);
  setIfDefined('totalQuestsDone', data.total_quests_done);
  setIfDefined('totalQuestXP',    data.total_quest_xp);
  setIfDefined('totalChessXP',    data.total_chess_xp);
  setIfDefined('peakElo',         data.peak_elo);
  setIfDefined('lastLogin',       data.last_login);
  setIfDefined('lastElo',         data.last_elo);
  setIfDefined('currentElo',      data.current_elo);

  // Cosmétique simple
  if (data.selected_skin)   localStorage.setItem('selectedSkin',    data.selected_skin);
  if (data.equipped_title)  localStorage.setItem('equippedTitleId', data.equipped_title);
  if (data.equipped_avatar) localStorage.setItem('equippedAvatarId', data.equipped_avatar);
  if (data.equipped_pet)    localStorage.setItem('equippedPetId',   data.equipped_pet);

  // Background (objet)
  if (data.selected_bg && data.selected_bg !== 'null') {
    localStorage.setItem('selectedBG', JSON.stringify(data.selected_bg));
  }

  // Tableaux cosmétiques — ne pas écraser si vide dans Supabase
  setIfNotEmpty('skills',              data.skills);
  const loadedSkills = safeParseJSON(localStorage.getItem('skills'), {});
  if (loadedSkills[TIMELINE_SKILLS_KEY] && TIMELINES[loadedSkills[TIMELINE_SKILLS_KEY]]) {
    localStorage.setItem(TIMELINE_KEY, loadedSkills[TIMELINE_SKILLS_KEY]);
  }
  setIfNotEmpty('titles',              data.titles);
  setIfNotEmpty('avatars',             data.avatars);
  setIfNotEmpty('skins',               data.skins);
  setIfNotEmpty('backgrounds',         data.backgrounds);
  setIfNotEmpty('badges',              data.badges);
  setIfNotEmpty('pets',                data.pets);
  setIfNotEmpty('badges_equipped',     data.badge_slots);
  setIfNotEmpty('achievementsClaimed', data.achievements_claimed);

  // Quêtes — charger depuis Supabase seulement si non vide
  // (évite d'écraser des quêtes locales fraîches avec un tableau vide au login)
  setIfNotEmpty('quests', data.quests);
  // Journal — toujours charger depuis Supabase (source de vérité)
  // Le journal est sauvegardé à chaque modification, donc Supabase est toujours à jour
  if (data.journal !== undefined && data.journal !== null) {
    localStorage.setItem('journal', JSON.stringify(data.journal));
  }

  return data;
}

// Sauvegarde un ou plusieurs champs vers le serveur
async function saveProfile(updates) {
  if (!isLoggedIn()) return;
  return apiRequest('PUT', '/data/profile', updates);
}

async function loadProfilePhoto() {
  if (!isLoggedIn()) return null;
  return apiRequest('GET', '/data/profile-photo');
}

async function saveProfilePhoto(imageData) {
  if (!isLoggedIn()) return null;
  return apiRequest('POST', '/data/profile-photo', { imageData });
}

// Import du localStorage complet (migration initiale)
async function importFromLocalStorage() {
  const ls = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith('_')) { // ignorer les clés internes (_token etc)
      ls[key] = localStorage.getItem(key);
    }
  }
  return apiRequest('POST', '/data/import', ls);
}

// ── UI Login/Register ────────────────────────
function showLoginScreen() {
  // Cacher le contenu principal
  const page = document.querySelector('.page') || document.querySelector('.stats-page');
  if (page) page.style.display = 'none';

  // Afficher ou créer l'écran de login
  let loginScreen = document.getElementById('login-screen');
  if (!loginScreen) {
    loginScreen = createLoginScreen();
    document.body.prepend(loginScreen);
  }
  loginScreen.style.display = 'flex';
}

function hideLoginScreen() {
  const loginScreen = document.getElementById('login-screen');
  if (loginScreen) loginScreen.style.display = 'none';

  const page = document.querySelector('.page') || document.querySelector('.stats-page');
  if (page) page.style.display = '';
}

function createLoginScreen() {
  const div = document.createElement('div');
  div.id = 'login-screen';
  div.innerHTML = `
    <div class="login-box">
      <h1 class="login-title">⚔ TENTIA ⚔</h1>
      <div class="login-tabs">
        <button class="login-tab active" id="tab-login">Connexion</button>
        <button class="login-tab" id="tab-register">Inscription</button>
      </div>

      <div id="form-login">
        <input class="login-input" type="email" id="login-email" placeholder="Email">
        <input class="login-input" type="password" id="login-password" placeholder="Mot de passe">
        <button class="login-btn" id="btn-login">SE CONNECTER</button>
      </div>

      <div id="form-register" style="display:none">
        <input class="login-input" type="text" id="reg-username" placeholder="Pseudo">
        <input class="login-input" type="email" id="reg-email" placeholder="Email">
        <input class="login-input" type="password" id="reg-password" placeholder="Mot de passe">
        <button class="login-btn" id="btn-register">CRÉER UN COMPTE</button>
      </div>

      <div class="login-error" id="login-error"></div>
    </div>
  `;

  // Events tabs
  div.querySelector('#tab-login').addEventListener('click', () => {
    div.querySelector('#form-login').style.display = '';
    div.querySelector('#form-register').style.display = 'none';
    div.querySelector('#tab-login').classList.add('active');
    div.querySelector('#tab-register').classList.remove('active');
  });

  div.querySelector('#tab-register').addEventListener('click', () => {
    div.querySelector('#form-login').style.display = 'none';
    div.querySelector('#form-register').style.display = '';
    div.querySelector('#tab-login').classList.remove('active');
    div.querySelector('#tab-register').classList.add('active');
  });

  // Login
  div.querySelector('#btn-login').addEventListener('click', async () => {
    const email    = div.querySelector('#login-email').value.trim();
    const password = div.querySelector('#login-password').value;
    const err      = div.querySelector('#login-error');

    if (!email || !password) { err.textContent = 'Remplis tous les champs.'; return; }

    err.textContent = 'Connexion...';

    // Vider le localStorage de l'ancien compte AVANT de login
    clearLocalStorage();

    const result = await login(email, password);

    if (result.error) { err.textContent = result.error; return; }

    err.textContent = '';
    const profile = await loadProfile();
    await ensureTimelineSelection(profile);
    hideLoginScreen();
    window.location.reload();
  });

  // Register
  div.querySelector('#btn-register').addEventListener('click', async () => {
    const username = div.querySelector('#reg-username').value.trim();
    const email    = div.querySelector('#reg-email').value.trim();
    const password = div.querySelector('#reg-password').value;
    const err      = div.querySelector('#login-error');

    if (!username || !email || !password) { err.textContent = 'Remplis tous les champs.'; return; }

    err.textContent = 'Création du compte...';
    const result = await register(email, password, username);

    if (result.error) { err.textContent = result.error; return; }

    err.textContent = '✅ Compte créé ! Vérifie ton email puis connecte-toi.';
  });

  return div;
}

// ── Init ─────────────────────────────────────
async function initApp() {
  if (!isLoggedIn()) {
    showLoginScreen();
    return false;
  }

  const profile = await loadProfile();
  await ensureTimelineSelection(profile);

  // Déclencher la récupération ELO maintenant que le profil est chargé
  if (typeof window._fetchChessEloWhenReady === 'function') {
    window._fetchChessEloWhenReady();
  }

  return true;
}

// Export pour utilisation dans les autres fichiers
window.TentiaAPI = {
  isLoggedIn, login, logout, register,
  loadProfile, saveProfile, importFromLocalStorage,
  loadProfilePhoto, saveProfilePhoto,
  showLoginScreen, hideLoginScreen, initApp,
  getTimelineId, ensureTimelineSelection
};

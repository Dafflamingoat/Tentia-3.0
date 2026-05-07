// ============================================
// api.js — Client API Tentia
// Gère auth + sync avec le serveur
// ============================================

const API_URL = window.location.origin + '/api';

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
  clearToken();
  showLoginScreen();
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
  setIfNotEmpty('titles',              data.titles);
  setIfNotEmpty('avatars',             data.avatars);
  setIfNotEmpty('skins',               data.skins);
  setIfNotEmpty('backgrounds',         data.backgrounds);
  setIfNotEmpty('badges',              data.badges);
  setIfNotEmpty('pets',                data.pets);
  setIfNotEmpty('badges_equipped',     data.badge_slots);
  setIfNotEmpty('achievementsClaimed', data.achievements_claimed);

  // Quêtes et journal — TOUJOURS charger depuis Supabase (source de vérité)
  // même si vide, pour éviter que des suppressions locales réapparaissent
  if (data.quests !== undefined && data.quests !== null) {
    localStorage.setItem('quests', JSON.stringify(data.quests));
  }
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
    const result = await login(email, password);

    if (result.error) { err.textContent = result.error; return; }

    err.textContent = '';
    await loadProfile();
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

  await loadProfile();
  return true;
}

// Export pour utilisation dans les autres fichiers
window.TentiaAPI = {
  isLoggedIn, login, logout, register,
  loadProfile, saveProfile, importFromLocalStorage,
  showLoginScreen, hideLoginScreen, initApp
};

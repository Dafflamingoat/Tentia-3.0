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

  // Injecter dans localStorage pour que le reste du code fonctionne
  if (data.xp           !== undefined) localStorage.setItem('xp',            data.xp);
  if (data.level        !== undefined) localStorage.setItem('level',          data.level);
  if (data.hp           !== undefined) localStorage.setItem('hp',             data.hp);
  if (data.force        !== undefined) localStorage.setItem('Force',          data.force);
  if (data.intelligence !== undefined) localStorage.setItem('Intelligence',   data.intelligence);
  if (data.discipline   !== undefined) localStorage.setItem('Discipline',     data.discipline);
  if (data.focus        !== undefined) localStorage.setItem('Focus',          data.focus);
  if (data.skills)                     localStorage.setItem('skills',         JSON.stringify(data.skills));
  if (data.selected_skin)              localStorage.setItem('selectedSkin',   data.selected_skin);
  if (data.selected_bg)                localStorage.setItem('selectedBG',     JSON.stringify(data.selected_bg));
  if (data.equipped_title)             localStorage.setItem('equippedTitleId', data.equipped_title);
  if (data.equipped_avatar)            localStorage.setItem('equippedAvatarId', data.equipped_avatar);
  if (data.equipped_pet)               localStorage.setItem('equippedPetId',  data.equipped_pet);
  if (data.titles)                     localStorage.setItem('titles',         JSON.stringify(data.titles));
  if (data.avatars)                     localStorage.setItem('avatars',        JSON.stringify(data.avatars));
  if (data.skins)                      localStorage.setItem('skins',          JSON.stringify(data.skins));
  if (data.backgrounds)                localStorage.setItem('backgrounds',    JSON.stringify(data.backgrounds));
  if (data.badges)                     localStorage.setItem('badges',         JSON.stringify(data.badges));
  if (data.pets)                       localStorage.setItem('pets',           JSON.stringify(data.pets));
  if (data.badge_slots)                localStorage.setItem('badges_equipped', JSON.stringify(data.badge_slots));
  if (data.achievements_claimed)       localStorage.setItem('achievementsClaimed', JSON.stringify(data.achievements_claimed));
  if (data.journal)                    localStorage.setItem('journal',        JSON.stringify(data.journal));
  if (data.quests)                     localStorage.setItem('quests',         JSON.stringify(data.quests));
  if (data.total_login_days !== undefined) localStorage.setItem('totalLoginDays',  data.total_login_days);
  if (data.total_quests_done !== undefined) localStorage.setItem('totalQuestsDone', data.total_quests_done);
  if (data.total_quest_xp !== undefined)   localStorage.setItem('totalQuestXP',    data.total_quest_xp);
  if (data.total_chess_xp !== undefined)   localStorage.setItem('totalChessXP',    data.total_chess_xp);
  if (data.peak_elo !== undefined)         localStorage.setItem('peakElo',          data.peak_elo);
  if (data.last_login)                     localStorage.setItem('lastLogin',        data.last_login);
  if (data.last_elo !== undefined)         localStorage.setItem('lastElo',          data.last_elo);
  if (data.current_elo !== undefined)      localStorage.setItem('currentElo',       data.current_elo);

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

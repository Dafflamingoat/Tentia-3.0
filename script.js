// ────────────────
// SPRITE DYNAMIQUE SELON HP
// ────────────────
const sprite = document.getElementById('char-sprite');

let frameIndex = 0;
let currentFrames = [];
let animationSpeed = 400;
let animationInterval = null;
let currentSkin = localStorage.getItem('selectedSkin') || 'Skin_T1';

function getStateFrames() {
  if (hp <= 0) {
    return {
      frames: [`assets/character/${currentSkin}/placeholder.png`],
      speed: 1000
    };
  }
  if (hp <= 20) {
    return {
      frames: [
        `assets/character/${currentSkin}/faible1.png`,
        `assets/character/${currentSkin}/faible2.png`
      ],
      speed: 700
    };
  }
  if (hp <= 80) {
    return {
      frames: [
        `assets/character/${currentSkin}/moove1.png`,
        `assets/character/${currentSkin}/moove2.png`
      ],
      speed: 400
    };
  }
  return {
    frames: [
      `assets/character/${currentSkin}/moove1.png`,
      `assets/character/${currentSkin}/moove2.png`
    ],
    speed: 180
  };
}

function setSkin(skinName) {
  currentSkin = skinName;
  localStorage.setItem('selectedSkin', skinName);
  startAnimation();
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ selected_skin: skinName });
  }
}

function startAnimation() {
  if (animationInterval) clearInterval(animationInterval);
  const state = getStateFrames();
  currentFrames = state.frames;
  animationSpeed = state.speed;
  frameIndex = 0;
  animationInterval = setInterval(() => {
    frameIndex = (frameIndex + 1) % currentFrames.length;
    sprite.src = currentFrames[frameIndex];
  }, animationSpeed);
}

sprite.onerror = function () {
  this.onerror = null;
  this.src = 'assets/character/placeholder.svg';
};

// ════════════════════════════════════════════
//  COMPÉTENCES + sauvegarde
// ════════════════════════════════════════════
const CUSTOM_SKILLS_KEY = 'customSkills';
const REMOVED_DEFAULT_SKILLS = ['mecanique', 'anglais', 'dev'];
const MAX_LEVELS = { echec: 1000, argent: 3000 };
const STUDY_XP_PER_HOUR = 12;
const STUDY_MIN_SESSION_MS = 5 * 60 * 1000;
const skills = { echec: 0, argent: 0 };
let customSkills = [];
let customSkillTimerInterval = null;

function getCustomSkills() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_SKILLS_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function loadSavedSkills() {
  let savedSkills = {};

  try {
    savedSkills = JSON.parse(localStorage.getItem('skills') || '{}');
  } catch (e) {}

  const localCustomSkills = getCustomSkills();
  const syncedCustomSkills = Array.isArray(savedSkills._customSkills) ? savedSkills._customSkills : [];
  const sourceCustomSkills = localCustomSkills.length ? localCustomSkills : syncedCustomSkills;

  customSkills = sourceCustomSkills.map(skill => ({
    id: skill.id,
    name: skill.name,
    totalMs: Number(skill.totalMs || 0),
    activeStartedAt: skill.activeStartedAt || null
  }));

  Object.keys(skills).forEach(name => delete skills[name]);
  skills.echec = 0;
  skills.argent = 0;

  // Pour echec : utiliser currentElo sauvegardé plutôt que la valeur skills
  // (la valeur skills.echec peut être 0 si loadProfile n'a pas encore tourné)
  const storedElo = parseInt(localStorage.getItem('currentElo')) || 0;
  skills.echec = storedElo || Number(savedSkills.echec || 0);
  skills.argent = Number(savedSkills.argent || 0);

  localStorage.setItem('skills', JSON.stringify(getSkillsPayload()));
  localStorage.setItem(CUSTOM_SKILLS_KEY, JSON.stringify(customSkills));
}

loadSavedSkills();

function getSkillMax(name) {
  if (MAX_LEVELS[name]) return MAX_LEVELS[name];
  const custom = customSkills.find(skill => skill.id === name);
  return custom ? custom.max : 100;
}

function getSkillsPayload() {
  const savedSkills = (() => {
    try { return JSON.parse(localStorage.getItem('skills') || '{}'); }
    catch (e) { return {}; }
  })();

  const timelineId = savedSkills._timelineId || localStorage.getItem('timelineId') || 'dafz';

  return {
    _timelineId: timelineId,
    ...skills,
    _customSkills: customSkills
  };
}

function persistSkills() {
  localStorage.setItem('skills', JSON.stringify(getSkillsPayload()));
  localStorage.setItem(CUSTOM_SKILLS_KEY, JSON.stringify(customSkills));

  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ skills: getSkillsPayload() });
  }
}

function updateSkillUI(name) {
  // Echecs : géré exclusivement par updateEloBar
  if (name === 'echec') {
    const elo = parseInt(localStorage.getItem('currentElo')) || skills.echec || 0;
    const hasAccount = !!localStorage.getItem('chessUsername');
    updateEloBar(elo, !hasAccount);
    return;
  }

  const val = skills[name] || 0;
  const max = getSkillMax(name);
  const bar = document.getElementById('bar-' + name);
  const label = document.getElementById('val-' + name);
  const node = document.getElementById('skill-' + name);

  if (!bar || !label || !node || !max) return;

  bar.style.width = (val / max * 100) + '%';
  label.textContent = val.toLocaleString() + '/' + max.toLocaleString();

  if (val >= max) node.classList.add('maxed');
  else node.classList.remove('maxed');
}

function renderCustomSkills() {
  const list = document.getElementById('custom-skills-list');
  if (!list) return;

  list.innerHTML = '';

  customSkills.forEach(skill => {
    const node = document.createElement('div');
    node.className = 'skill-node custom-skill-node';
    node.id = 'skill-' + skill.id;

    node.innerHTML = `
      <button class="skill-delete-btn" type="button" title="Supprimer" aria-label="Supprimer la competence">x</button>
      <div class="skill-icon custom-skill-icon">TIME</div>
      <div class="skill-name"></div>
      <div class="skill-time-panel">
        <span class="skill-time-label">TOTAL</span>
        <span class="skill-time-total" id="total-${skill.id}">0'00</span>
        <span class="skill-time-session" id="session-${skill.id}">00:00:00</span>
      </div>
      <span class="skill-xp-feedback" id="xp-feedback-${skill.id}"></span>
      <button class="skill-btn timer-btn" type="button" data-action="toggle"></button>
    `;

    node.querySelector('.skill-name').textContent = skill.name;
    node.querySelector('[data-action="toggle"]').addEventListener('click', () => toggleSkillTimer(skill.id));
    node.querySelector('.skill-delete-btn').addEventListener('click', () => deleteCustomSkill(skill.id));

    list.appendChild(node);
    updateCustomSkillUI(skill.id);
  });
}

function formatSessionTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');
}

function formatTotalHours(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}'${String(minutes).padStart(2, '0')}`;
}

function getXpToNextLevel(currentLevel) {
  return 100 + (currentLevel - 1) * 50;
}

function getPetXpNeeded(currentLevel) {
  return 80 + currentLevel * 8;
}

function getHpXpMultiplier() {
  const currentHP = parseInt(localStorage.getItem('hp')) || 0;
  if (currentHP >= 80) return 1.1;
  if (currentHP <= 20) return 0.9;
  return 1;
}

function applyHpXpModifier(amount) {
  const baseAmount = Math.max(0, Number(amount) || 0);
  const multiplier = getHpXpMultiplier();
  const modifiedAmount = Math.max(0, Math.round(baseAmount * multiplier));

  localStorage.setItem('lastHpXpMultiplier', multiplier);
  return {
    baseAmount,
    multiplier,
    modifiedAmount
  };
}

function getStoredPets() {
  try {
    const pets = JSON.parse(localStorage.getItem('pets') || '[]');
    return Array.isArray(pets) ? pets : [];
  } catch (e) {
    return [];
  }
}

function getEquippedPetForXP() {
  const pets = getStoredPets();
  const equippedPetId = localStorage.getItem('equippedPetId') || 'pet1';
  return pets.find(pet => pet.id === equippedPetId && pet.owned) || null;
}

function addPetXPFromStudy(totalXP) {
  const pets = getStoredPets();
  const equippedPetId = localStorage.getItem('equippedPetId') || 'pet1';
  const pet = pets.find(item => item.id === equippedPetId && item.owned);
  if (!pet || pet.active === false) return;

  const share = typeof pet.share === 'number' ? pet.share : 0.1;
  const petXP = Math.floor(totalXP * share);
  if (petXP <= 0) return;

  pet.xp = (pet.xp || 0) + petXP;

  let xpNeeded = getPetXpNeeded(pet.level || 1);
  while (pet.xp >= xpNeeded && (pet.level || 1) < 50) {
    pet.xp -= xpNeeded;
    pet.level = (pet.level || 1) + 1;
    xpNeeded = getPetXpNeeded(pet.level);
  }

  localStorage.setItem('pets', JSON.stringify(pets));
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ pets, equipped_pet: equippedPetId });
  }
}

function addPlayerXPFromStudy(totalXP) {
  let currentXP = parseInt(localStorage.getItem('xp')) || 0;
  let currentLevel = parseInt(localStorage.getItem('level')) || 1;
  const equippedPet = getEquippedPetForXP();
  const share = equippedPet ? (typeof equippedPet.share === 'number' ? equippedPet.share : 0.1) : 0;
  const xpModifier = applyHpXpModifier(totalXP);
  const playerXP = Math.floor(xpModifier.modifiedAmount * (1 - share));

  currentXP += playerXP;

  let xpNeeded = getXpToNextLevel(currentLevel);
  let levelsGained = 0;
  while (currentXP >= xpNeeded) {
    currentXP -= xpNeeded;
    currentLevel++;
    levelsGained++;
    xpNeeded = getXpToNextLevel(currentLevel);
  }

  if (levelsGained > 0) {
    const statPoints = (parseInt(localStorage.getItem('statPoints')) || 0) + levelsGained * 2;
    localStorage.setItem('statPoints', statPoints);
  }

  localStorage.setItem('xp', currentXP);
  localStorage.setItem('level', currentLevel);

  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({
      xp: currentXP,
      level: currentLevel,
      points_left: parseInt(localStorage.getItem('statPoints')) || 0
    });
  }

  return { playerXP, currentLevel, levelsGained, ...xpModifier };
}

function calculateStudyXP(sessionMs) {
  if (sessionMs < STUDY_MIN_SESSION_MS) return 0;

  const intelligence = parseInt(localStorage.getItem('Intelligence')) || 0;
  const bonusMultiplier = 1 + Math.floor(intelligence / 10) * 0.05;
  const rawXP = (sessionMs / 3600000) * STUDY_XP_PER_HOUR * bonusMultiplier;
  return Math.floor(rawXP);
}

function awardStudyXP(skill, sessionMs) {
  const totalXP = calculateStudyXP(sessionMs);
  if (totalXP <= 0) return 0;

  const xpResult = addPlayerXPFromStudy(totalXP);
  addPetXPFromStudy(xpResult.modifiedAmount);

  const totalSkillXP = (parseInt(localStorage.getItem('totalSkillXP')) || 0) + xpResult.modifiedAmount;
  localStorage.setItem('totalSkillXP', totalSkillXP);

  return xpResult.modifiedAmount;
}

function getCustomSkillElapsed(skill) {
  if (!skill) return 0;
  const runningMs = skill.activeStartedAt ? Date.now() - Number(skill.activeStartedAt) : 0;
  return Math.max(0, skill.totalMs + runningMs);
}

function updateCustomSkillUI(id) {
  const skill = customSkills.find(item => item.id === id);
  const node = document.getElementById('skill-' + id);
  if (!skill || !node) return;

  const total = document.getElementById('total-' + id);
  const session = document.getElementById('session-' + id);
  const button = node.querySelector('[data-action="toggle"]');
  const currentSessionMs = skill.activeStartedAt ? Date.now() - Number(skill.activeStartedAt) : 0;

  if (total) total.textContent = formatTotalHours(getCustomSkillElapsed(skill));
  if (session) session.textContent = formatSessionTime(currentSessionMs);
  if (button) button.textContent = skill.activeStartedAt ? 'STOP' : 'START';

  node.classList.toggle('timer-running', Boolean(skill.activeStartedAt));
}

function showSkillXPFeedback(id, message) {
  const feedback = document.getElementById('xp-feedback-' + id);
  if (!feedback) return;
  feedback.textContent = message;
}

function updateAllCustomSkillTimers() {
  customSkills.forEach(skill => updateCustomSkillUI(skill.id));
}

function toggleSkillTimer(id) {
  const skill = customSkills.find(item => item.id === id);
  if (!skill) return;

  if (skill.activeStartedAt) {
    const sessionMs = Math.max(0, Date.now() - Number(skill.activeStartedAt));
    skill.totalMs += sessionMs;
    skill.activeStartedAt = null;
    const xpGained = awardStudyXP(skill, sessionMs);
    if (xpGained > 0) {
      console.log(`+${xpGained} XP (${skill.name}, session ${formatSessionTime(sessionMs)})`);
      showSkillXPFeedback(skill.id, `+${xpGained} XP`);
    } else {
      showSkillXPFeedback(skill.id, 'MIN 5 MIN');
    }
  } else {
    skill.activeStartedAt = Date.now();
    showSkillXPFeedback(skill.id, '');
  }

  persistSkills();
  updateCustomSkillUI(id);
}

function normalizeSkillName(name) {
  return name.trim().replace(/\s+/g, ' ').slice(0, 24);
}

function createSkillId(name) {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'competence';

  let id = base;
  let index = 2;
  while (skills[id] !== undefined || MAX_LEVELS[id] || customSkills.some(skill => skill.id === id)) {
    id = `${base}-${index}`;
    index++;
  }
  return id;
}

function showAddSkillError(message) {
  const error = document.getElementById('add-skill-error');
  if (error) error.textContent = message || '';
}

function openAddSkillModal() {
  const modal = document.getElementById('add-skill-modal');
  const input = document.getElementById('add-skill-input');
  if (!modal || !input) return;

  showAddSkillError('');
  input.value = '';
  modal.style.display = 'flex';
  setTimeout(() => input.focus(), 0);
}

function closeAddSkillModal() {
  const modal = document.getElementById('add-skill-modal');
  if (modal) modal.style.display = 'none';
}

function addCustomSkill(name) {
  const cleanName = normalizeSkillName(name);
  if (!cleanName) {
    showAddSkillError('Entre un nom de competence.');
    return;
  }

  const alreadyExists = customSkills.some(skill => skill.name.toLowerCase() === cleanName.toLowerCase());
  if (alreadyExists) {
    showAddSkillError('Cette competence existe deja.');
    return;
  }

  const skill = {
    id: createSkillId(cleanName),
    name: cleanName,
    totalMs: 0,
    activeStartedAt: null
  };

  customSkills.push(skill);
  persistSkills();
  renderCustomSkills();
  closeAddSkillModal();
}

function deleteCustomSkill(id) {
  const skill = customSkills.find(item => item.id === id);
  if (!skill) return;
  if (!confirm(`Supprimer la competence "${skill.name}" ?`)) return;

  customSkills = customSkills.filter(item => item.id !== id);
  persistSkills();
  renderCustomSkills();
}

function increment(name) {
  if (name === 'echec') return;

  const max = getSkillMax(name);
  if (!max) return;

  if (name === 'argent') {
    skills[name] = Math.min((skills[name] || 0) + 50, max);
  } else {
    const intel = parseInt(localStorage.getItem('Intelligence')) || 0;
    const bonus = Math.floor(intel / 10);
    const step = 1 + bonus;
    skills[name] = Math.min((skills[name] || 0) + step, max);
    console.log(`+${step} ${name} (Intelligence incluse)`);
  }

  updateSkillUI(name);
  persistSkills();
}

function resetSkill(skill) {
  if (skill === 'echec' || skills[skill] === undefined) return;
  skills[skill] = 0;
  updateSkillUI(skill);
  persistSkills();
}

renderCustomSkills();
Object.keys(skills).forEach(name => updateSkillUI(name));

if (!customSkillTimerInterval) {
  customSkillTimerInterval = setInterval(updateAllCustomSkillTimers, 1000);
}

// Events ajout competence
const addSkillModal = document.getElementById('add-skill-modal');
const addSkillForm = document.getElementById('add-skill-form');
const openAddSkill = document.getElementById('open-add-skill');
const closeAddSkill = document.getElementById('close-add-skill');

if (openAddSkill) openAddSkill.addEventListener('click', openAddSkillModal);
if (closeAddSkill) closeAddSkill.addEventListener('click', closeAddSkillModal);
if (addSkillModal) addSkillModal.addEventListener('click', (e) => { if (e.target === addSkillModal) closeAddSkillModal(); });
if (addSkillForm) {
  addSkillForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('add-skill-input');
    addCustomSkill(input ? input.value : '');
  });
}

// ----------------
// ELO CHESS
// ----------------

async function fetchChessElo() {
  // Lire le username Chess.com depuis Supabase (chargé dans loadProfile)
  const chessUsername = localStorage.getItem('chessUsername');

  if (!chessUsername) {
    // Pas de compte connecté : afficher la jauge vide avec message
    updateEloBar(0, true);
    return;
  }

  try {
    const resp = await fetch(`https://api.chess.com/pub/player/${chessUsername}/stats`);
    if (!resp.ok) throw new Error('Compte introuvable');
    const data = await resp.json();

    const blitz  = data.chess_blitz?.last?.rating  || 0;
    const rapid  = data.chess_rapid?.last?.rating   || 0;
    const bullet = data.chess_bullet?.last?.rating  || 0;
    const elo    = blitz || rapid || bullet || 0;

    localStorage.setItem('currentElo', elo);

    // Mettre à jour le peak ELO
    const peak = parseInt(localStorage.getItem('peakElo')) || 0;
    if (elo > peak) localStorage.setItem('peakElo', elo);

    if (typeof updateProfilePanel === "function") updateProfilePanel();

    skills.echec = Math.min(elo, MAX_LEVELS.echec);
    updateSkillUI('echec');
    updateEloBar(skills.echec, false);
    localStorage.setItem('skills', JSON.stringify(getSkillsPayload()));

    // Sync Supabase
    if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
      window.TentiaAPI.saveProfile({
        current_elo: elo,
        peak_elo:    Math.max(elo, peak)
      });
    }

    // Signaler que l'ELO est prêt → stats.js peut calculer le gain XP
    window.dispatchEvent(new CustomEvent('tentia:eloReady', { detail: { elo } }));
  } catch (err) {
    console.warn("Erreur récupération ELO :", err);
    updateEloBar(0, true);
  }
}

// Appelé après loadProfile() pour avoir chessUsername disponible
window._fetchChessEloWhenReady = function() {
  fetchChessElo();
  setInterval(() => {
    if (document.visibilityState === 'visible') fetchChessElo();
  }, 300000);
};

// Lancer quand api.js signale que le profil est chargé
// Si l'event a déjà été dispatché avant que script.js soit chargé,
// on vérifie chessUsername directement et on lance immédiatement
function startChessPolling() {
  fetchChessElo();
  setInterval(() => {
    if (document.visibilityState === 'visible') fetchChessElo();
  }, 300000);
}

window.addEventListener('tentia:profileReady', startChessPolling);

// Fallback : si le profil est déjà chargé (event manqué), lancer directement
if (localStorage.getItem('chessUsername')) {
  startChessPolling();
}

// ----------------
// STRAVA
// ----------------

function getTentiaAuthHeaders() {
  const token = localStorage.getItem('_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function updateStravaUI(status = {}) {
  const node = document.getElementById('skill-strava');
  const metric = document.getElementById('val-strava');
  const summary = document.getElementById('strava-summary');
  if (!node || !metric) return;

  const connected = Boolean(status.connected);
  const totals = status.summary?.totals || {};
  const activities = Number(totals.activities || 0);
  const distanceKm = (Number(totals.distance || 0) / 1000);
  const movingHours = Number(totals.moving_time || 0) / 3600;
  const elevation = Math.round(Number(totals.elevation_gain || 0));
  const activityType = status.summary?.activityType || getSelectedStravaActivityType();
  const activityLabel = status.summary?.activityLabel || 'Toutes';
  const timeLabel = movingHours >= 1
    ? `${movingHours.toFixed(1)} h`
    : `${Math.round(movingHours * 60)} min`;
  const distanceActivities = ['all', 'Run', 'Ride', 'Walk', 'Hike', 'Swim'];
  const shouldShowDistance = distanceActivities.includes(activityType) || distanceKm > 0;

  node.classList.toggle('connected', connected);

  if (!connected) {
    metric.textContent = 'Non connecte';
    if (summary) summary.textContent = 'Dashboard > Parametres';
    return;
  }

  metric.textContent = activityLabel;
  if (!summary) return;

  const lines = [
    `${activities} activite${activities > 1 ? 's' : ''}`,
    timeLabel
  ];

  if (shouldShowDistance) lines.push(`${distanceKm.toFixed(1)} km`);
  if (elevation > 0) lines.push(`D+ ${elevation} m`);

  summary.innerHTML = lines.map(line => `<span>${line}</span>`).join('');
}

function getSelectedStravaActivityType() {
  return localStorage.getItem('stravaActivityType') || 'all';
}

function initStravaActivitySelect() {
  const select = document.getElementById('strava-activity-select');
  if (!select || select.dataset.initialized === 'true') return;

  select.value = getSelectedStravaActivityType();
  select.dataset.initialized = 'true';
  select.addEventListener('change', () => {
    localStorage.setItem('stravaActivityType', select.value);
    loadStravaSummary();
  });
}

async function loadStravaSummary() {
  if (!window.TentiaAPI || !window.TentiaAPI.isLoggedIn()) {
    updateStravaUI({ connected: false });
    return;
  }

  try {
    const activity = encodeURIComponent(getSelectedStravaActivityType());
    const resp = await fetch(`/api/strava/summary?activity=${activity}`, { headers: getTentiaAuthHeaders() });
    if (!resp.ok) throw new Error('Statut Strava indisponible');
    const status = await resp.json();
    updateStravaUI(status);
  } catch (err) {
    console.warn('Erreur statut Strava :', err);
    updateStravaUI({ connected: false });
  }
}

async function claimStravaPv() {
  if (!window.TentiaAPI || !window.TentiaAPI.isLoggedIn()) return;

  try {
    const resp = await fetch('/api/strava/claim-pv', {
      method: 'POST',
      headers: getTentiaAuthHeaders()
    });
    if (resp.status === 409) {
      console.warn('Migration PV Strava manquante.');
      return;
    }
    if (!resp.ok) return;

    const result = await resp.json();
    if (!result.connected || !result.hpDelta) return;

    hp = result.hpAfter;
    localStorage.setItem('hp', hp);
    updateHPUI();
    console.log(`+${result.hpDelta} PV Strava`);
  } catch (err) {
    console.warn('Erreur attribution PV Strava :', err);
  }
}

initStravaActivitySelect();
window.addEventListener('tentia:profileReady', () => {
  loadStravaSummary();
  claimStravaPv();
});
loadStravaSummary();

function updateEloBar(elo, noAccount = false) {
  const maxElo = MAX_LEVELS.echec || 1000;
  const bar = document.getElementById('bar-echec');
  const val = document.getElementById('val-echec');
  if (!bar || !val) return;
  if (noAccount) {
    bar.style.width = '0%';
    val.textContent = 'Non connecté';
    return;
  }
  bar.style.width = Math.min((elo / maxElo) * 100, 100) + '%';
  bar.style.background = `linear-gradient(90deg, ${getEloColor(elo)}, #ffffff22)`;
  val.textContent = `${elo}/${maxElo}`;
}

function getEloColor(elo) {
  if (elo < 300) return '#f44336';
  if (elo < 600) return '#ff9800';
  if (elo < 900) return '#ffeb3b';
  if (elo < 1000) return '#ffeb3b';
  return '#4caf50';
}

// ════════════════════════════════════════════
//  BOUTON RESET GLOBAL
// ════════════════════════════════════════════
const resetBtn = document.createElement('button');
resetBtn.textContent = 'Réinitialiser tout';
resetBtn.style.cssText = `
  position: fixed; bottom: 20px; right: 20px; 
  padding: 8px 12px; background:#f44336; color:white; 
  border:none; border-radius:5px; cursor:pointer; z-index:999;
  font-family: 'Press Start 2P', monospace; font-size: 6px;
`;
document.body.appendChild(resetBtn);

resetBtn.addEventListener('click', () => {
  Object.keys(skills).forEach(name => {
    skills[name] = 0;
    updateSkillUI(name);
  });
  customSkills = customSkills.map(skill => ({
    ...skill,
    totalMs: 0,
    activeStartedAt: null
  }));
  persistSkills();
  renderCustomSkills();
});

// ────────────────
// HP SYSTEM
// ────────────────
const MAX_HP = 100;
let hp = 50;

const savedHP = localStorage.getItem('hp');
if (savedHP !== null) hp = parseInt(savedHP);

function updateHPUI() {
  document.getElementById('hp').textContent = hp;

  if (hp > 0) {
    startAnimation();
    const koOverlay = document.getElementById('ko-overlay');
    if (koOverlay) koOverlay.remove();
  } else {
    sprite.src = 'assets/character/placeholder.svg';
    if (!document.getElementById('ko-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'ko-overlay';
      overlay.textContent = '💀 KO';
      overlay.style.cssText = `
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%);
        font-size:14px; color:#f44336;
        text-shadow:2px 2px 0 #000; pointer-events:none;
      `;
      document.querySelector('.character-frame').appendChild(overlay);
      overlay.classList.add('shake');
    }
  }

  startAnimation();
}

function setHP(nextHP) {
  hp = Math.max(0, Math.min(Number(nextHP) || 0, MAX_HP));
  updateHPUI();
  localStorage.setItem('hp', hp);
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ hp });
  }
}

function syncHPFromStorage() {
  const storedHP = localStorage.getItem('hp');
  if (storedHP === null) return;
  hp = Math.max(0, Math.min(parseInt(storedHP) || 0, MAX_HP));
  updateHPUI();
}

window.addEventListener('tentia:profileReady', syncHPFromStorage);

// ----------------
// BILAN QUOTIDIEN HYGIENE
// ----------------
const DAILY_HEALTH_KEY = 'dailyHealthLogs';
const DAILY_HEALTH_MIN_DELTA = -20;

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getDailyHealthLogs() {
  try {
    const logs = JSON.parse(localStorage.getItem(DAILY_HEALTH_KEY) || '{}');
    return logs && typeof logs === 'object' ? logs : {};
  } catch (e) {
    return {};
  }
}

function saveDailyHealthLogs(logs) {
  localStorage.setItem(DAILY_HEALTH_KEY, JSON.stringify(logs));
}

function getCheckedDailyValue(name) {
  const input = document.querySelector(`input[name="${name}"]:checked`);
  return input ? Number(input.value) : 0;
}

function calculateDailyHealthImpact() {
  const sleep = getCheckedDailyValue('sleep');
  const food = getCheckedDailyValue('food');
  const cigarettes = Math.max(0, parseInt(document.getElementById('daily-cigarettes')?.value, 10) || 0);
  const alcohol = Math.max(0, parseInt(document.getElementById('daily-alcohol')?.value, 10) || 0);
  const rawDelta = sleep + food - cigarettes - alcohol * 2;
  const delta = Math.max(rawDelta, DAILY_HEALTH_MIN_DELTA);

  return { sleep, food, cigarettes, alcohol, rawDelta, delta };
}

function updateDailyHealthPreview() {
  const preview = document.getElementById('daily-health-preview');
  if (!preview) return;
  const { rawDelta, delta } = calculateDailyHealthImpact();
  const capped = rawDelta !== delta ? ` (plafonne a ${delta})` : '';
  preview.textContent = `Impact : ${delta > 0 ? '+' : ''}${delta} PV${capped}`;
}

function closeDailyHealthModal() {
  const modal = document.getElementById('daily-health-modal');
  if (modal) modal.style.display = 'none';
}

function openDailyHealthModal() {
  const modal = document.getElementById('daily-health-modal');
  if (!modal) return;
  updateDailyHealthPreview();
  modal.style.display = 'flex';
}

function shouldShowDailyHealthModal() {
  const logs = getDailyHealthLogs();
  const today = getTodayKey();
  const journal = (() => {
    try { return JSON.parse(localStorage.getItem('journal') || '{}'); }
    catch (e) { return {}; }
  })();
  return !logs[today] && !journal[today]?.hygiene;
}

function saveDailyHealthEntry() {
  const today = getTodayKey();
  const logs = getDailyHealthLogs();
  if (logs[today]) return;

  const entry = {
    ...calculateDailyHealthImpact(),
    hpBefore: hp,
    createdAt: new Date().toISOString()
  };
  entry.hpAfter = Math.max(0, Math.min(hp + entry.delta, MAX_HP));

  logs[today] = entry;
  saveDailyHealthLogs(logs);

  const journal = (() => {
    try { return JSON.parse(localStorage.getItem('journal') || '{}'); }
    catch (e) { return {}; }
  })();
  journal[today] = { ...(journal[today] || {}), hygiene: entry };
  localStorage.setItem('journal', JSON.stringify(journal));

  setHP(entry.hpAfter);
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ journal });
  }
  closeDailyHealthModal();
}

function initDailyHealthModal() {
  const form = document.getElementById('daily-health-form');
  const later = document.getElementById('daily-health-later');
  const modal = document.getElementById('daily-health-modal');
  if (!form || !modal || modal.dataset.initialized === 'true') return;

  modal.dataset.initialized = 'true';
  form.addEventListener('input', updateDailyHealthPreview);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveDailyHealthEntry();
  });
  later?.addEventListener('click', closeDailyHealthModal);

  if (shouldShowDailyHealthModal()) {
    setTimeout(openDailyHealthModal, 300);
  }
}

window.addEventListener('tentia:profileReady', initDailyHealthModal);

// ────────────────
// POPUPS INFO (arbre + ligues)
// ────────────────
const skillInfoModal  = document.getElementById('skill-info-modal');
const chessInfoModal  = document.getElementById('chess-info-modal');
const openSkillInfo   = document.getElementById('open-skill-info');
const closeSkillInfo  = document.getElementById('close-skill-info');
const openChessInfo   = document.getElementById('open-chess-info');
const closeChessInfo  = document.getElementById('close-chess-info');

if (openSkillInfo)  openSkillInfo.addEventListener('click',  (e) => { e.stopPropagation(); skillInfoModal.style.display = 'flex'; });
if (closeSkillInfo) closeSkillInfo.addEventListener('click', () => skillInfoModal.style.display = 'none');
if (skillInfoModal) skillInfoModal.addEventListener('click', (e) => { if (e.target === skillInfoModal) skillInfoModal.style.display = 'none'; });

if (openChessInfo)  openChessInfo.addEventListener('click',  (e) => { e.stopPropagation(); chessInfoModal.style.display = 'flex'; });
if (closeChessInfo) closeChessInfo.addEventListener('click', () => chessInfoModal.style.display = 'none');
if (chessInfoModal) chessInfoModal.addEventListener('click', (e) => { if (e.target === chessInfoModal) chessInfoModal.style.display = 'none'; });

updateHPUI();
startAnimation();

// ────────────────
// MENU DES FONDS (avec verrou par niveau)
// ────────────────
const bgThumbsWrap = document.querySelector('.bg-thumbs-wrap');
const charFrame = document.querySelector('.character-frame');

let bgFrames = [];
let bgFrameIndex = 0;
let bgInterval = null;

function toggleBGMenu() {
  bgThumbsWrap.classList.toggle('hidden');
}

// Données par défaut si localStorage vide (avant que stats.js s'exécute)
const DEFAULT_OWNED_BG_FILES  = ['assets/background/bg1_frame1.png', 'assets/background/bg2_frame1.png'];
const DEFAULT_OWNED_SKIN_FOLDERS = ['Skin_T1'];

function getBackgrounds() {
  const timelineId = localStorage.getItem('timelineId') || 'dafz';
  const timelineData = (window.TIMELINE_DATA && window.TIMELINE_DATA[timelineId])
    || (window.TIMELINE_DATA && window.TIMELINE_DATA['dafz']);
  const timelineBGs = (timelineData && timelineData.backgrounds) || [];
  const bgMap = {};
  timelineBGs.forEach(b => { bgMap[b.id] = b; });

  const saved = localStorage.getItem('backgrounds');
  if (saved) {
    const parsed = JSON.parse(saved);
    // Toujours merger avec TIMELINE_DATA pour inclure les nouveaux backgrounds
    return timelineBGs.map(b => {
      const sv = parsed.find(x => x.id === b.id);
      if (sv) return { ...b, ...sv };
      return b;
    });
  }

  // Fallback depuis TIMELINE_DATA ou défaut
  if (timelineBGs.length) return timelineBGs;
  return [
    { id: 'bg_default', name: 'Défaut', bg1: 'assets/background/bg1_frame1.png', bg2: 'assets/background/bg1_frame2.png', owned: true },
    { id: 'bg_white',   name: 'Blanc',  bg1: 'assets/background/bg2_frame1.png', bg2: 'assets/background/bg2_frame2.png', owned: true },
  ];
}

function getSkins() {
  const timelineId = localStorage.getItem('timelineId') || 'dafz';
  const timelineData = (window.TIMELINE_DATA && window.TIMELINE_DATA[timelineId])
    || (window.TIMELINE_DATA && window.TIMELINE_DATA['dafz']);
  const timelineSkins = (timelineData && timelineData.skins) || [];
  const folderMap = {};
  timelineSkins.forEach(s => { folderMap[s.id] = s; });

  const saved = localStorage.getItem('skins');
  if (saved) {
    const parsed = JSON.parse(saved);
    // Toujours merger avec TIMELINE_DATA pour inclure les nouveaux skins ajoutés
    return timelineSkins.map(s => {
      const sv = parsed.find(x => x.id === s.id);
      // Si le skin existe en localStorage : garder son owned, compléter les champs manquants
      if (sv) return { ...s, ...sv };
      // Sinon : skin nouveau, utiliser les données de TIMELINE_DATA
      return s;
    });
  }

  // Fallback depuis TIMELINE_DATA ou Skin_T1
  if (timelineSkins.length) return timelineSkins;
  return [{ id: 'skin_t1', name: 'Skin T1', folder: 'Skin_T1', owned: true }];
}

// Récupère le label de déblocage depuis levelRewards (stocké en localStorage par stats.js)
function getUnlockInfoFromStorage(rewardId) {
  try {
    const lr = JSON.parse(localStorage.getItem('_levelRewardsMap') || '{}');
    if (lr[rewardId]) return `Niveau ${lr[rewardId]}`;
  } catch(e) {}
  return 'Verrouillé';
}

function applyBG(bg1, bg2) {
  if (bgInterval) clearInterval(bgInterval);
  bgFrames = [bg1, bg2];
  localStorage.setItem('selectedBG', JSON.stringify([bg1, bg2]));
  bgFrameIndex = 0;
  charFrame.style.backgroundImage = `url(${bg1})`;
  // Retirer le filtre et le cadenas BG de prévisualisation
  charFrame.style.filter = '';
  const bgLockEl = charFrame.querySelector('.bg-preview-lock');
  if (bgLockEl) bgLockEl.remove();
  bgInterval = setInterval(() => {
    bgFrameIndex = (bgFrameIndex + 1) % bgFrames.length;
    charFrame.style.backgroundImage = `url(${bgFrames[bgFrameIndex]})`;
  }, 400);
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ selected_bg: [bg1, bg2] });
  }
}

function renderBGThumbs() {
  const wrap = document.querySelector('.bg-thumbs-wrap');
  if (!wrap) return;

  const ownedBGs = getBackgrounds();

  // Lire depuis TIMELINE_DATA selon la timeline active
  const timelineId = localStorage.getItem('timelineId') || 'dafz';
  const timelineData = (window.TIMELINE_DATA && window.TIMELINE_DATA[timelineId]) || (window.TIMELINE_DATA && window.TIMELINE_DATA['dafz']);
  const allBGs = timelineData ? timelineData.backgrounds : [];
  if (allBGs.length) window._allBGThumbs = allBGs.map(b => ({ bg1: b.bg1, bg2: b.bg2 }));

  // Fallback sur HTML statique si pas de TIMELINE_DATA
  if (!window._allBGThumbs || !window._allBGThumbs.length) {
    const currentThumbs = Array.from(wrap.querySelectorAll('.bg-thumb[data-bg1]'))
      .map(t => ({ bg1: t.dataset.bg1, bg2: t.dataset.bg2 }));
    if (currentThumbs.length) window._allBGThumbs = currentThumbs;
  }
  const thumbData = window._allBGThumbs || [];

  wrap.innerHTML = '';

  thumbData.forEach(({ bg1, bg2 }) => {
    const bgData = ownedBGs.find(b => b.bg1 === bg1);
    const owned = bgData ? bgData.owned : DEFAULT_OWNED_BG_FILES.includes(bg1);
    const bgName = bgData ? bgData.name : '';
    const unlockInfo = !owned
      ? (bgData ? getUnlockInfoFromStorage(bgData.id) : 'Verrouillé')
      : '';

    const thumb = document.createElement('div');
    thumb.className = 'bg-thumb' + (owned ? '' : ' bg-locked');
    thumb.style.backgroundImage = `url(${bg1})`;
    thumb.dataset.bg1 = bg1;
    thumb.dataset.bg2 = bg2;
    thumb.title = bgName ? (owned ? bgName : `${bgName} — ${unlockInfo}`) : (owned ? '' : unlockInfo);

    if (!owned) {
      const lock = document.createElement('span');
      lock.className = 'bg-lock-icon';
      lock.textContent = '🔒';
      thumb.appendChild(lock);
      if (unlockInfo) {
        const label = document.createElement('span');
        label.className = 'bg-lock-label';
        label.textContent = unlockInfo;
        thumb.appendChild(label);
      }
    }

    thumb.addEventListener('click', () => {
      if (owned) {
        applyBG(bg1, bg2);
        // Retirer l'overlay cadenas si présent
        const existingLock = charFrame.querySelector('.bg-preview-lock');
        if (existingLock) existingLock.remove();
        charFrame.style.filter = '';
      } else {
        // Prévisualisation statique grisée avec cadenas
        if (bgInterval) clearInterval(bgInterval);
        charFrame.style.backgroundImage = `url(${bg1})`;
        charFrame.style.filter = 'grayscale(80%) brightness(0.6)';
        // Ajouter cadenas si pas déjà là
        if (!charFrame.querySelector('.bg-preview-lock')) {
          const lockEl = document.createElement('span');
          lockEl.className = 'bg-preview-lock';
          lockEl.textContent = '🔒';
          lockEl.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:22px;pointer-events:none;filter:drop-shadow(1px 1px 3px #000);z-index:10;';
          charFrame.appendChild(lockEl);
        }
      }
    });

    wrap.appendChild(thumb);
  });
}

// ────────────────
// MENU SKINS (avec verrou par niveau)
// ────────────────
const skinWrap = document.querySelector('.skin-thumbs-wrap');

function toggleSkinMenu() {
  skinWrap.classList.toggle('hidden');
}

function renderSkinThumbs() {
  const skinWrapEl = document.querySelector('.skin-thumbs-wrap');
  if (!skinWrapEl) return;

  const ownedSkins = getSkins();

  // Lire depuis TIMELINE_DATA selon la timeline active
  const timelineId = localStorage.getItem('timelineId') || 'dafz';
  const timelineData = (window.TIMELINE_DATA && window.TIMELINE_DATA[timelineId]) || (window.TIMELINE_DATA && window.TIMELINE_DATA['dafz']);
  const allSkins = timelineData ? timelineData.skins : [];
  if (allSkins.length) window._allSkinFolders = allSkins.map(s => s.folder);

  // Fallback sur HTML statique si pas de TIMELINE_DATA
  if (!window._allSkinFolders || !window._allSkinFolders.length) {
    const currentThumbs = Array.from(skinWrapEl.querySelectorAll('.skin-thumb[data-skin]'))
      .map(t => t.dataset.skin);
    if (currentThumbs.length) window._allSkinFolders = currentThumbs;
  }
  const folders = window._allSkinFolders || [];

  skinWrapEl.innerHTML = '';

  folders.forEach(folder => {
    const skinData = ownedSkins.find(s => s.folder === folder);
    const owned = skinData ? skinData.owned : DEFAULT_OWNED_SKIN_FOLDERS.includes(folder);
    const skinName = skinData ? skinData.name : folder.replace(/^Skin_/i, '').replace(/_/g, ' ');
    const unlockInfo = !owned
      ? (skinData ? getUnlockInfoFromStorage(skinData.id) : 'Verrouillé')
      : '';

    const thumb = document.createElement('div');
    thumb.className = 'skin-thumb' + (currentSkin === folder ? ' active' : '') + (owned ? '' : ' skin-locked');
    thumb.dataset.skin = folder;
    thumb.style.backgroundImage = `url('assets/character/${folder}/moove1.png')`;
    thumb.title = owned ? skinName : `${skinName}${unlockInfo ? ' — ' + unlockInfo : ''}`;

    if (!owned) {
      const lock = document.createElement('span');
      lock.className = 'skin-lock-icon';
      lock.textContent = '🔒';
      thumb.appendChild(lock);
      if (unlockInfo) {
        const label = document.createElement('span');
        label.className = 'skin-lock-label';
        label.textContent = unlockInfo;
        thumb.appendChild(label);
      }
    }

    thumb.addEventListener('click', () => {
      const sprite = document.getElementById('char-sprite');
      if (owned) {
        // Sélection réelle : relancer l'animation normalement
        document.querySelectorAll('.skin-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (sprite) { sprite.style.filter = ''; }
        // Retirer le cadenas skin si présent
        const existingSkinLock = charFrame.querySelector('.skin-preview-lock');
        if (existingSkinLock) existingSkinLock.remove();
        setSkin(folder);
      } else {
        // Prévisualisation : stopper l'animation et figer sur moove1 grisé
        if (animationInterval) clearInterval(animationInterval);
        if (sprite) {
          sprite.src = `assets/character/${folder}/moove1.png`;
          sprite.style.filter = 'grayscale(80%) brightness(0.6)';
        }
        // Ajouter cadenas skin sur la frame si pas déjà là
        if (!charFrame.querySelector('.skin-preview-lock')) {
          const lockEl = document.createElement('span');
          lockEl.className = 'skin-preview-lock';
          lockEl.textContent = '🔒';
          lockEl.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:22px;pointer-events:none;filter:drop-shadow(1px 1px 3px #000);z-index:10;';
          charFrame.appendChild(lockEl);
        }
      }
    });

    skinWrapEl.appendChild(thumb);
  });
}

window.addEventListener('load', () => {
  renderSkinThumbs();
  renderBGThumbs();

  // Restaurer le background sauvegardé
  const saved = localStorage.getItem('selectedBG');
  if (saved) {
    const [bg1, bg2] = JSON.parse(saved);
    // Vérifier qu'il est toujours owned avant de l'appliquer
    const ownedBGs = getBackgrounds();
    const bgData = ownedBGs.find(b => b.bg1 === bg1);
    if (bgData && bgData.owned) {
      applyBG(bg1, bg2);
    } else if (bgData && !bgData.owned) {
      // BG plus owned (reset?) → effacer la sélection
      localStorage.removeItem('selectedBG');
    }
  }

  // Restaurer le skin sauvegardé (vérifier qu'il est owned)
  const ownedSkins = getSkins();
  const savedSkin = localStorage.getItem('selectedSkin');
  if (savedSkin) {
    const skinData = ownedSkins.find(s => s.folder === savedSkin);
    if (!skinData || !skinData.owned) {
      // Skin plus owned → revenir au skin de base
      currentSkin = 'Skin_T1';
      localStorage.setItem('selectedSkin', 'Skin_T1');
      startAnimation();
    }
  }
});

// ────────────────
// BADGE SLOTS (index.html)
// ────────────────

const SLOT_STATS = ['Force', 'Intelligence', 'Discipline', 'Focus'];

function getBadges() {
  return JSON.parse(localStorage.getItem('badges')) || [];
}

function saveBadgesIndex(badges) {
  localStorage.setItem('badges', JSON.stringify(badges));
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    const slots = {};
    badges.forEach(b => { if (b.equippedSlot) slots[b.id] = b.equippedSlot; });
    window.TentiaAPI.saveProfile({ badges, badge_slots: slots });
  }
}

// Met à jour visuellement les 4 slots depuis le localStorage
function renderBadgeSlots() {
  const badges = getBadges();

  SLOT_STATS.forEach(stat => {
    const img = document.getElementById(`badge-img-${stat}`);
    const empty = document.getElementById(`badge-empty-${stat}`);
    const slot = document.querySelector(`.badge-slot[data-slot="${stat}"]`);
    if (!img || !slot) return;

    const equipped = badges.find(b => b.equippedSlot === stat && b.owned);

    if (equipped) {
      img.src = equipped.src || '';
      img.style.display = 'block';
      if (empty) empty.style.display = 'none';
      slot.classList.add('has-badge');
    } else {
      img.style.display = 'none';
      if (empty) empty.style.display = 'block';
      slot.classList.remove('has-badge');
    }
  });
}

// Ouvre la modal de sélection de badge pour un slot donné
function openBadgeModal(slotStat) {
  const modal = document.getElementById('badge-modal');
  const grid = document.getElementById('badge-modal-grid');
  const title = document.getElementById('badge-modal-title');

  title.textContent = `SLOT ${slotStat.toUpperCase()}`;
  grid.innerHTML = '';

  const badges = getBadges();

  const compatible = badges.filter(b => {
    if (!b.owned) return false;
    return Object.keys(b.stats || {}).includes(slotStat);
  });

  const currentlyEquipped = badges.find(b => b.equippedSlot === slotStat);

  // Bouton retirer
  if (currentlyEquipped) {
    const removeBtn = document.createElement('button');
    removeBtn.className = 'badge-modal-item badge-modal-remove';
    removeBtn.innerHTML = `<span class="badge-remove-icon">✕</span><span>Retirer</span>`;
    removeBtn.addEventListener('click', () => {
      currentlyEquipped.equippedSlot = null;
      saveBadgesIndex(badges);
      renderBadgeSlots();
      closeBadgeModal();
    });
    grid.appendChild(removeBtn);
  }

  if (compatible.length === 0 && !currentlyEquipped) {
    const msg = document.createElement('p');
    msg.className = 'badge-modal-empty';
    msg.textContent = 'Aucun badge compatible débloqué.';
    grid.appendChild(msg);
  }

  compatible.forEach(badge => {
    const btn = document.createElement('button');
    btn.className = 'badge-modal-item';

    const isEquippedHere = badge.equippedSlot === slotStat;
    const isEquippedElsewhere = badge.equippedSlot && badge.equippedSlot !== slotStat;

    if (isEquippedHere) btn.classList.add('badge-equipped');
    if (isEquippedElsewhere) btn.classList.add('badge-elsewhere');

    const statKeys = Object.keys(badge.stats);
    const bonusLines = statKeys.map(s => {
      const val = s === slotStat ? badge.stats[s].dominant : badge.stats[s].base;
      return `${s.substring(0, 3).toUpperCase()} +${val}`;
    }).join(' / ');

    btn.innerHTML = `
      <img src="${badge.src}" alt="${badge.name}" class="badge-modal-img">
      <span class="badge-modal-name">${badge.name}</span>
      <span class="badge-modal-bonus">${bonusLines}</span>
      ${isEquippedElsewhere ? `<span class="badge-modal-slot-tag">Équipé : ${badge.equippedSlot}</span>` : ''}
    `;

    btn.addEventListener('click', () => {
      if (isEquippedHere) {
        badge.equippedSlot = null;
      } else {
        // Libérer le slot cible si occupé par un autre badge
        badges.forEach(b => {
          if (b.id !== badge.id && b.equippedSlot === slotStat) {
            b.equippedSlot = null;
          }
        });
        badge.equippedSlot = slotStat;
      }
      saveBadgesIndex(badges);
      renderBadgeSlots();
      closeBadgeModal();
    });

    grid.appendChild(btn);
  });

  modal.style.display = 'flex';
}

function closeBadgeModal() {
  document.getElementById('badge-modal').style.display = 'none';
}

// Events slots
document.querySelectorAll('.badge-slot').forEach(slot => {
  slot.addEventListener('click', () => openBadgeModal(slot.dataset.slot));
});

document.getElementById('badge-modal-close').addEventListener('click', closeBadgeModal);
document.getElementById('badge-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('badge-modal')) closeBadgeModal();
});

// Init slots au chargement
renderBadgeSlots();

// ────────────────
// SYNC SUPABASE (si connecté)
// ────────────────
window.addEventListener('load', async () => {
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    await window.TentiaAPI.loadProfile();

    // Réinitialiser les UI avec les données fraîches
    updateHPUI();
    startAnimation();
    renderBadgeSlots();
    renderSkinThumbs();
    renderBGThumbs();

    // Recharger les competences personnalisees
    loadSavedSkills();
    renderCustomSkills();
    Object.keys(skills).forEach(name => updateSkillUI(name));

    // Recharger la BG sauvegardée
    const savedBG = localStorage.getItem('selectedBG');
    if (savedBG) {
      try {
        const frames = JSON.parse(savedBG);
        if (frames && frames[0]) applyBG(frames[0], frames[1]);
      } catch(e) {}
    }

    // Recharger le skin sauvegardé
    const savedSkin = localStorage.getItem('selectedSkin');
    if (savedSkin) setSkin(savedSkin);
  }
});

// Afficher le pseudo du joueur dans le name tag
const nameTag = document.getElementById('char-name-tag');
if (nameTag) {
  const username = localStorage.getItem('_username') || 'Joueur';
  nameTag.textContent = username;
}

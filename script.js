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

  skills.echec = Number(savedSkills.echec || 0);
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
  return {
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

function updateAllCustomSkillTimers() {
  customSkills.forEach(skill => updateCustomSkillUI(skill.id));
}

function toggleSkillTimer(id) {
  const skill = customSkills.find(item => item.id === id);
  if (!skill) return;

  if (skill.activeStartedAt) {
    skill.totalMs += Math.max(0, Date.now() - Number(skill.activeStartedAt));
    skill.activeStartedAt = null;
  } else {
    skill.activeStartedAt = Date.now();
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
const CHESS_USERNAME = 'Dafflaming0';

async function fetchChessElo() {
  try {
    const resp = await fetch(`https://api.chess.com/pub/player/${CHESS_USERNAME}/stats`);
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
    updateEloBar(skills.echec);
    localStorage.setItem('skills', JSON.stringify(getSkillsPayload()));

    // Sync Supabase — sauvegarde l'ELO actuel pour que stats.js y accède
    if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
      window.TentiaAPI.saveProfile({
        current_elo: elo,
        peak_elo:    Math.max(elo, peak)
      });
    }

    console.log("ELO récupéré :", elo);
  } catch (err) {
    console.warn("Erreur récupération ELO :", err);
  }
}

fetchChessElo();

setInterval(() => {
  if (document.visibilityState === 'visible') {
    console.log("🔄 Refresh ELO (actif)");
    fetchChessElo();
  }
}, 300000);

function updateEloBar(elo) {
  const maxElo = MAX_LEVELS.echec || 1000;
  const bar = document.getElementById('bar-echec');
  const val = document.getElementById('val-echec');
  if (!bar || !val) return;
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

function addHP() {
  if (hp >= MAX_HP) return;
  const force = parseInt(localStorage.getItem('Force')) || 0;
  const bonus = Math.floor(force / 10);
  hp = Math.min(hp + 1 + bonus, MAX_HP);
  updateHPUI();
  localStorage.setItem('hp', hp);
  console.log(`+${1 + bonus} HP (Force incluse)`);
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ hp });
  }
}

function removeHP() {
  if (hp <= 0) return;
  hp--;
  updateHPUI();
  localStorage.setItem('hp', hp);
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ hp });
  }
}

// Brancher les boutons sport / fumette
document.getElementById('btn-sport').addEventListener('click', addHP);
document.getElementById('btn-smoke').addEventListener('click', removeHP);

// Hover dynamique sur les boutons HP
function updateHPButtonTooltips() {
  const force = parseInt(localStorage.getItem('Force')) || 0;
  const bonus = Math.floor(force / 10);
  const gain  = 1 + bonus;
  const btnSport = document.getElementById('btn-sport');
  const btnSmoke = document.getElementById('btn-smoke');
  if (btnSport) btnSport.title = `+${gain} HP (Force ${force} → +${bonus} bonus)`;
  if (btnSmoke) btnSmoke.title = `-1 HP`;
}
updateHPButtonTooltips();

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
  const saved = localStorage.getItem('backgrounds');
  if (saved) return JSON.parse(saved);
  // Fallback : bg1 et bg2 owned par défaut
  return [
    { id: 'bg_default', name: 'Défaut', bg1: 'assets/background/bg1_frame1.png', bg2: 'assets/background/bg1_frame2.png', owned: true },
    { id: 'bg_white',   name: 'Blanc',  bg1: 'assets/background/bg2_frame1.png', bg2: 'assets/background/bg2_frame2.png', owned: true },
  ];
}

function getSkins() {
  const saved = localStorage.getItem('skins');
  if (saved) return JSON.parse(saved);
  // Fallback : Skin_T1 owned par défaut
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
  // Lire les données depuis les thumbs déjà dans le HTML
  const thumbData = Array.from(wrap.querySelectorAll('.bg-thumb')).map(t => ({
    bg1: t.dataset.bg1,
    bg2: t.dataset.bg2
  }));

  wrap.innerHTML = '';

  thumbData.forEach(({ bg1, bg2 }) => {
    const bgData = ownedBGs.find(b => b.bg1 === bg1);
    // Si pas trouvé en localStorage → fallback sur bg1/bg2 de base
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
      if (!owned) return;
      applyBG(bg1, bg2);
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
  // Lire les données depuis les thumbs déjà dans le HTML
  const thumbData = Array.from(skinWrapEl.querySelectorAll('.skin-thumb')).map(t => ({
    folder: t.dataset.skin
  }));

  skinWrapEl.innerHTML = '';

  thumbData.forEach(({ folder }) => {
    const skinData = ownedSkins.find(s => s.folder === folder);
    const owned = skinData ? skinData.owned : DEFAULT_OWNED_SKIN_FOLDERS.includes(folder);
    // Nom propre : depuis les données ou nettoyé depuis le folder
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
      if (!owned) return;
      document.querySelectorAll('.skin-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      setSkin(folder);
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

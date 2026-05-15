// ────────────────
// SPRITE DYNAMIQUE SELON HP
// ────────────────
const CHARACTER_APPEARANCE_KEY = 'characterAppearance';
const CHARACTER_TIMELINE_KEY = 'characterTimeline';
const DEFAULT_TIMELINE_ID = 'male';

let pendingCharacterTimelineId = null;
let pendingCharacterAppearance = null;

function getActiveTimelineId() {
  const saved = localStorage.getItem(CHARACTER_TIMELINE_KEY) || localStorage.getItem('timelineId');
  if (saved && window.TIMELINE_DATA && window.TIMELINE_DATA[saved]) return saved;
  return DEFAULT_TIMELINE_ID;
}

function setCharacterTimelineLocal(timelineId) {
  if (!window.TIMELINE_DATA || !window.TIMELINE_DATA[timelineId]) return;
  localStorage.setItem('timelineId', timelineId);
  localStorage.setItem(CHARACTER_TIMELINE_KEY, timelineId);
  try {
    const skills = JSON.parse(localStorage.getItem('skills') || '{}');
    skills._timelineId = timelineId;
    localStorage.setItem('skills', JSON.stringify(skills));
  } catch (e) {}
}

function getTimelineData(timelineId = getActiveTimelineId()) {
  return (window.TIMELINE_DATA && window.TIMELINE_DATA[timelineId])
    || (window.TIMELINE_DATA && window.TIMELINE_DATA[DEFAULT_TIMELINE_ID])
    || null;
}

function getCharacterBuilderConfig(timelineId = getActiveTimelineId()) {
  const data = getTimelineData(timelineId);
  return data ? data.characterBuilder : null;
}

function getDefaultAppearance(timelineId = getActiveTimelineId()) {
  const config = getCharacterBuilderConfig(timelineId);
  return { ...((config && config.defaultAppearance) || {}) };
}

function normalizeCharacterAppearance(appearance = {}, timelineId = getActiveTimelineId()) {
  const defaults = getDefaultAppearance(timelineId);
  return { ...defaults, ...(appearance || {}) };
}

function getCharacterAppearance() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHARACTER_APPEARANCE_KEY) || '{}');
    return normalizeCharacterAppearance(saved);
  } catch (e) {
    return normalizeCharacterAppearance({});
  }
}

function findCharacterLayer(category, id, timelineId = getActiveTimelineId()) {
  const config = getCharacterBuilderConfig(timelineId);
  if (!config || !id) return null;
  const list = config[category] || [];
  return list.find(item => item.id === id) || null;
}

function addCharacterFallback(stage) {
  if (!stage || stage.querySelector('.character-builder-fallback')) return;
  const fallback = document.createElement('div');
  fallback.className = 'character-builder-fallback';
  fallback.textContent = 'PERSONNAGE';
  stage.appendChild(fallback);
}

function renderCharacterLayers(stage, appearance, timelineId = getActiveTimelineId()) {
  if (!stage) return;
  const normalized = normalizeCharacterAppearance(appearance, timelineId);
  const layers = [
    findCharacterLayer('bodies', normalized.body, timelineId),
    findCharacterLayer('eyes', normalized.eyes, timelineId),
    findCharacterLayer('eyebrows', normalized.eyebrows, timelineId),
    findCharacterLayer('scars', normalized.scar, timelineId),
    findCharacterLayer('beards', normalized.beard, timelineId),
    findCharacterLayer('hair', normalized.hair, timelineId)
  ].filter(Boolean);

  stage.innerHTML = '';
  layers.forEach((layer) => {
    if (!layer.src) return;
    const img = document.createElement('img');
    img.className = 'character-builder-layer';
    img.src = layer.src;
    img.alt = '';
    img.draggable = false;
    img.onerror = function () {
      this.remove();
      if (!stage.querySelector('.character-builder-layer')) addCharacterFallback(stage);
    };
    stage.appendChild(img);
  });

  if (!stage.querySelector('.character-builder-layer')) addCharacterFallback(stage);
}

function renderCharacterBuilder() {
  renderCharacterLayers(
    document.getElementById('character-builder-preview'),
    getCharacterAppearance(),
    getActiveTimelineId()
  );
}

function saveCharacterAppearance(nextAppearance, timelineId = getActiveTimelineId()) {
  const merged = normalizeCharacterAppearance(nextAppearance, timelineId);
  setCharacterTimelineLocal(timelineId);
  localStorage.setItem(CHARACTER_APPEARANCE_KEY, JSON.stringify(merged));
  renderCharacterBuilder();
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({
      character_timeline: timelineId,
      character_appearance: merged,
      skills: JSON.parse(localStorage.getItem('skills') || '{}')
    });
  }
}

function startAnimation() {
  renderCharacterBuilder();
}

function setSkin() {
  renderCharacterBuilder();
}

function getPendingCharacterAppearance() {
  if (!pendingCharacterAppearance) {
    pendingCharacterAppearance = normalizeCharacterAppearance({}, pendingCharacterTimelineId || getActiveTimelineId());
  }
  return pendingCharacterAppearance;
}

function renderCharacterTimelineOptions() {
  const wrap = document.getElementById('character-timeline-options');
  if (!wrap || !window.TIMELINE_DATA) return;
  wrap.innerHTML = '';
  ['male', 'female'].forEach((timelineId) => {
    const data = window.TIMELINE_DATA[timelineId];
    if (!data) return;
    const config = data.characterBuilder || {};
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'character-choice-btn character-gender-btn' + (pendingCharacterTimelineId === timelineId ? ' active' : '') + (config.available === false ? ' locked' : '');
    button.dataset.timeline = timelineId;
    button.disabled = config.available === false;
    button.innerHTML = '<span class="character-gender-symbol">' + (timelineId === 'female' ? '&#9792;' : '&#9794;') + '</span><span>' + (timelineId === 'female' ? 'Fille' : 'Garcon') + '</span>';
    button.addEventListener('click', () => {
      if (config.available === false) return;
      pendingCharacterTimelineId = timelineId;
      pendingCharacterAppearance = normalizeCharacterAppearance({}, timelineId);
      renderCharacterBuilderModal();
    });
    wrap.appendChild(button);
  });
}

const CHARACTER_BUILDER_TABS = [
  { id: 'body', label: 'Peau', category: 'bodies', field: 'body' },
  { id: 'hair', label: 'Cheveux', category: 'hair', field: 'hair' },
  { id: 'eyes', label: 'Yeux', category: 'eyes', field: 'eyes' },
  { id: 'beard', label: 'Barbe', category: 'beards', field: 'beard' }
];
let activeCharacterBuilderTab = 'body';

function makeCharacterOptionButton(item, field) {
  const appearance = getPendingCharacterAppearance();
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'character-choice-btn' + (appearance[field] === item.id ? ' active' : '');
  button.title = item.label || item.id;
  if (item.src) {
    const preview = document.createElement('span');
    preview.className = 'character-choice-preview';
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = '';
    img.onerror = function () { this.style.display = 'none'; };
    preview.appendChild(img);
    button.appendChild(preview);
  } else {
    const empty = document.createElement('span');
    empty.className = 'character-choice-preview character-choice-none';
    empty.textContent = '-';
    button.appendChild(empty);
  }
  const label = document.createElement('span');
  label.className = 'character-choice-label';
  label.textContent = item.label || item.id;
  button.appendChild(label);
  button.addEventListener('click', () => {
    pendingCharacterAppearance = { ...appearance, [field]: item.id };
    renderCharacterBuilderModal();
  });
  return button;
}

function getAvailableCharacterTabs() {
  const config = getCharacterBuilderConfig(pendingCharacterTimelineId);
  return CHARACTER_BUILDER_TABS.filter(tab => ((config && config[tab.category]) || []).length);
}

function renderCharacterBuilderSubtabs() {
  const wrap = document.getElementById('character-builder-subtabs');
  if (!wrap) return;
  const tabs = getAvailableCharacterTabs();
  if (!tabs.some(tab => tab.id === activeCharacterBuilderTab)) {
    activeCharacterBuilderTab = tabs[0]?.id || 'body';
  }
  wrap.innerHTML = '';
  tabs.forEach((tab) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'character-builder-subtab' + (activeCharacterBuilderTab === tab.id ? ' active' : '');
    button.textContent = tab.label;
    button.addEventListener('click', () => {
      activeCharacterBuilderTab = tab.id;
      renderCharacterBuilderModal();
    });
    wrap.appendChild(button);
  });
}

function renderCharacterOptionPanel() {
  const options = document.getElementById('character-builder-options');
  if (!options) return;
  const config = getCharacterBuilderConfig(pendingCharacterTimelineId);
  const tab = getAvailableCharacterTabs().find(item => item.id === activeCharacterBuilderTab);
  options.innerHTML = '';
  if (!config || !tab) return;

  const section = document.createElement('div');
  section.className = 'character-builder-section active';
  const header = document.createElement('div');
  header.className = 'character-builder-panel-title';
  header.textContent = tab.label;
  const row = document.createElement('div');
  row.className = 'character-choice-row';
  (config[tab.category] || []).forEach(item => row.appendChild(makeCharacterOptionButton(item, tab.field)));
  section.appendChild(header);
  section.appendChild(row);
  options.appendChild(section);
}

function renderCharacterBuilderModal() {
  const preview = document.getElementById('character-builder-modal-preview');
  if (!preview) return;
  renderCharacterTimelineOptions();
  renderCharacterLayers(preview, getPendingCharacterAppearance(), pendingCharacterTimelineId);
  renderCharacterBuilderSubtabs();
  renderCharacterOptionPanel();
}

function openCharacterBuilder() {
  pendingCharacterTimelineId = getActiveTimelineId();
  pendingCharacterAppearance = getCharacterAppearance();
  const modal = document.getElementById('character-builder-modal');
  renderCharacterBuilderModal();
  if (modal) modal.style.display = 'flex';
}

function closeCharacterBuilderModal(saveChanges = false) {
  const modal = document.getElementById('character-builder-modal');
  if (saveChanges && pendingCharacterTimelineId && pendingCharacterAppearance) {
    saveCharacterAppearance(pendingCharacterAppearance, pendingCharacterTimelineId);
  }
  pendingCharacterTimelineId = null;
  pendingCharacterAppearance = null;
  if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('character-builder-modal');
  document.getElementById('close-character-builder')?.addEventListener('click', () => closeCharacterBuilderModal(false));
  document.getElementById('save-character-builder')?.addEventListener('click', () => closeCharacterBuilderModal(true));
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeCharacterBuilderModal(false);
  });
  renderCharacterBuilder();
});

const CUSTOM_SKILLS_KEY = 'customSkills';
const REMOVED_DEFAULT_SKILLS = ['mecanique', 'anglais', 'dev'];
const MAX_LEVELS = { echec: 1000, argent: 3000 };
const STUDY_XP_PER_HOUR = 12;
const STUDY_MIN_SESSION_MS = 5 * 60 * 1000;
const MAX_ACTIVE_CUSTOM_SKILL_TIMERS = 2;
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

  const timelineId = getActiveTimelineId();

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
  const modifiedAmount = Math.max(0, Number((baseAmount * multiplier).toFixed(4)));

  localStorage.setItem('lastHpXpMultiplier', multiplier);
  return {
    baseAmount,
    multiplier,
    modifiedAmount
  };
}

function storeXpBuffer(value) {
  const normalized = Number((Math.max(0, Number(value) || 0)).toFixed(4));
  localStorage.setItem('xpBuffer', normalized);
  return normalized;
}

function convertBufferedXP(amount) {
  const buffer = parseFloat(localStorage.getItem('xpBuffer')) || 0;
  const total = buffer + Math.max(0, Number(amount) || 0);
  const visibleXP = Math.floor(total);
  const nextBuffer = storeXpBuffer(total - visibleXP);
  return { visibleXP, buffer: nextBuffer };
}

const INDEX_DEFAULT_PETS = [
  { id: 'pet1', name: 'Familier Intelligence', level: 1, xp: 0, share: 0.1, active: true, owned: false, sprite1: 'assets/pets/intel/pet1_frame1.png', sprite2: 'assets/pets/intel/pet1_frame2.png' },
  { id: 'pet2', name: 'Familier Force', level: 1, xp: 0, share: 0.1, active: true, owned: false, sprite1: 'assets/pets/force/pet1_frame1.png', sprite2: 'assets/pets/force/pet1_frame2.png' },
  { id: 'pet3', name: 'Familier Discipline', level: 1, xp: 0, share: 0.1, active: true, owned: false, sprite1: 'assets/pets/discipline/pet1_frame1.png', sprite2: 'assets/pets/discipline/pet1_frame2.png' },
  { id: 'pet4', name: 'Familier Focus', level: 1, xp: 0, share: 0.1, active: true, owned: false, sprite1: 'assets/pets/focus/pet1_frame1.png', sprite2: 'assets/pets/focus/pet1_frame2.png' },
  { id: 'pet_dragon_legendary', name: 'Dragon légendaire', level: 1, xp: 0, share: 0.1, active: true, owned: false, sprite1: 'assets/pets/got/pet1_frame1.png', sprite2: 'assets/pets/got/pet1_frame2.png' },
  { id: 'pet_bob', name: 'Fantôme de Bob', level: 1, xp: 0, share: 0.1, active: true, owned: false, sprite1: 'assets/pets/legends/pet1_frame1.png', sprite2: 'assets/pets/legends/pet1_frame2.png' },
  { id: 'pet_endgame', name: 'Arme Ultime', level: 1, xp: 0, share: 0.1, active: true, owned: false, endgameForm: 'arc', sprite1: 'assets/pets/arc_frame1.png', sprite2: 'assets/pets/arc_frame2.png' }
];

function getTimelinePetVisuals() {
  const timelineId = getActiveTimelineId();
  const timelineData = (window.TIMELINE_DATA && window.TIMELINE_DATA[timelineId])
    || (window.TIMELINE_DATA && window.TIMELINE_DATA[DEFAULT_TIMELINE_ID]);
  return (timelineData && timelineData.pets) || {};
}

function mergeIndexPetVisuals(pet) {
  const visual = getTimelinePetVisuals()[pet.id];
  if (!visual) return pet;
  return {
    ...pet,
    name: visual.name || pet.name,
    sprite1: visual.sprite1 || pet.sprite1,
    sprite2: visual.sprite2 || pet.sprite2,
    evolutions: visual.evolutions || pet.evolutions,
    forms: visual.forms
      ? { ...(pet.forms || {}), ...visual.forms }
      : pet.forms
  };
}

function getStoredPets() {
  try {
    const storedPets = JSON.parse(localStorage.getItem('pets') || '[]');
    const savedPets = Array.isArray(storedPets) ? storedPets : [];
    const byId = new Map(savedPets.map(pet => [pet.id, pet]));
    const merged = INDEX_DEFAULT_PETS.map(defaultPet => mergeIndexPetVisuals({
      ...defaultPet,
      ...(byId.get(defaultPet.id) || {})
    }));
    savedPets.forEach((pet) => {
      if (!INDEX_DEFAULT_PETS.some(defaultPet => defaultPet.id === pet.id)) {
        merged.push(mergeIndexPetVisuals(pet));
      }
    });
    return merged;
  } catch (e) {
    return INDEX_DEFAULT_PETS.map(mergeIndexPetVisuals);
  }
}

function getEquippedPetForXP() {
  const pets = getStoredPets();
  const equippedPetId = localStorage.getItem('equippedPetId') || 'pet1';
  return pets.find(pet => pet.id === equippedPetId && pet.owned) || null;
}

function getIndexPetVisual(pet) {
  if (!pet) return { name: 'Familier', sprite: '' };
  if (pet.id === 'pet_endgame' && pet.forms) {
    const form = pet.forms[pet.endgameForm || 'arc'];
    if (form) return { name: form.name || pet.name || 'Familier', sprite: form.sprite1 || pet.sprite1 || '' };
  }
  const level = Number(pet.level || 1);
  const evo = Array.isArray(pet.evolutions)
    ? pet.evolutions.find(item => level >= Number(item.minLevel || 1) && level <= Number(item.maxLevel || 50))
    : null;
  return {
    name: evo?.name || pet.name || 'Familier',
    sprite: evo?.sprite1 || pet.sprite1 || ''
  };
}

function getIndexPetStatBonus(statName) {
  const pets = getStoredPets();
  const equippedPetId = localStorage.getItem('equippedPetId') || 'pet1';
  const pet = pets.find(item => item.id === equippedPetId && item.owned);
  if (!pet || pet.active === false) return 0;

  const levelValue = Math.min(Number(pet.level || 1), 50);
  if (pet.id === 'pet_endgame') {
    const form = pet.forms?.[pet.endgameForm || 'arc'];
    const dominant = form?.dominant;
    if (levelValue <= 25) return statName === dominant ? 10 : 5;
    if (levelValue <= 49) return statName === dominant ? 12 : 10;
    return statName === dominant ? 20 : 15;
  }
  if (pet.stat === statName) return levelValue;
  if (pet.stat === 'ForceIntelligence' && (statName === 'Force' || statName === 'Intelligence')) return Math.floor(levelValue / 2);
  if (pet.stat === 'FocusDiscipline' && (statName === 'Focus' || statName === 'Discipline')) return Math.floor(levelValue / 2);
  return 0;
}

function getIndexBadgeStatBonus(statName, flatValue) {
  const badges = getBadges();
  let flat = 0;
  let multiplier = 1;

  badges.forEach((badge) => {
    if (!badge.owned || !badge.equippedSlot) return;
    const statDef = badge.stats?.[statName];
    if (!statDef) return;
    if (badge.multiplier) multiplier *= statDef.dominant;
    else flat += badge.equippedSlot === statName ? statDef.dominant : statDef.base;
  });

  return Math.floor((flatValue + flat) * multiplier) - flatValue;
}

function getIndexEffectiveStat(statName) {
  const base = parseInt(localStorage.getItem(statName), 10) || 0;
  const petBonus = getIndexPetStatBonus(statName);
  return base + petBonus + getIndexBadgeStatBonus(statName, base + petBonus);
}

function updateIndexStatsAttention() {
  const points = parseInt(localStorage.getItem('statPoints'), 10) || 0;
  const toggle = document.getElementById('index-stats-toggle');
  if (!toggle) return;
  toggle.classList.toggle('has-points', points > 0);
  toggle.title = points > 0 ? `${points} point(s) de stats disponible(s)` : 'Stats';
}

function updateIndexStatsUI() {
  const statMap = {
    Force: 'stat-force',
    Intelligence: 'stat-intel',
    Discipline: 'stat-discipline',
    Focus: 'stat-focus'
  };

  Object.entries(statMap).forEach(([statName, id]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = getIndexEffectiveStat(statName);
  });

  const points = parseInt(localStorage.getItem('statPoints'), 10) || 0;
  const pointsEl = document.getElementById('points-left');
  if (pointsEl) pointsEl.textContent = points;
  updateIndexStatsAttention();
}

function addStat(statName) {
  let statPoints = parseInt(localStorage.getItem('statPoints'), 10) || 0;
  if (statPoints <= 0) {
    alert('Plus de points disponibles !');
    return;
  }

  const nextValue = (parseInt(localStorage.getItem(statName), 10) || 0) + 1;
  statPoints -= 1;
  localStorage.setItem(statName, nextValue);
  localStorage.setItem('statPoints', statPoints);
  updateIndexStatsUI();

  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({
      force: parseInt(localStorage.getItem('Force'), 10) || 0,
      intelligence: parseInt(localStorage.getItem('Intelligence'), 10) || 0,
      discipline: parseInt(localStorage.getItem('Discipline'), 10) || 0,
      focus: parseInt(localStorage.getItem('Focus'), 10) || 0,
      points_left: statPoints
    });
  }
}

function equipPetFromIndex(petId) {
  const pets = getStoredPets();
  const pet = pets.find(item => item.id === petId && item.owned);
  if (!pet) return;
  localStorage.setItem('equippedPetId', pet.id);
  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({ equipped_pet: pet.id });
  }
  renderCharacterPetDock();
  updateIndexStatsUI();
}

function renderCharacterPetDock() {
  const equippedEl = document.getElementById('character-pet-equipped');
  const listEl = document.getElementById('character-pet-list');
  if (!equippedEl || !listEl) return;

  const pets = getStoredPets();
  const ownedPets = pets.filter(pet => pet.owned);
  const equippedPetId = localStorage.getItem('equippedPetId') || 'pet1';
  const equipped = ownedPets.find(pet => pet.id === equippedPetId) || ownedPets[0];

  equippedEl.innerHTML = '';
  listEl.innerHTML = '';

  if (!equipped) {
    const empty = document.createElement('span');
    empty.className = 'character-pet-empty';
    empty.textContent = '?';
    equippedEl.appendChild(empty);
  } else {
    const equippedVisual = getIndexPetVisual(equipped);
    if (equippedVisual.sprite) {
      const equippedImg = document.createElement('img');
      equippedImg.src = equippedVisual.sprite;
      equippedImg.alt = equippedVisual.name;
      equippedImg.title = equippedVisual.name;
      equippedEl.appendChild(equippedImg);
    } else {
      const empty = document.createElement('span');
      empty.className = 'character-pet-empty';
      empty.textContent = '?';
      equippedEl.appendChild(empty);
    }
  }

  pets.forEach((pet) => {
    const visual = getIndexPetVisual(pet);
    const button = document.createElement('button');
    button.className = 'character-pet-option'
      + (equipped && pet.id === equipped.id ? ' equipped' : '')
      + (pet.owned ? '' : ' locked');
    button.type = 'button';
    button.title = pet.owned ? visual.name : `${visual.name} - verrouillé`;
    button.disabled = !pet.owned;
    if (visual.sprite) {
      const img = document.createElement('img');
      img.src = visual.sprite;
      img.alt = visual.name;
      button.appendChild(img);
    } else {
      const empty = document.createElement('span');
      empty.className = 'character-pet-empty';
      empty.textContent = '?';
      button.appendChild(empty);
    }
    if (!pet.owned) {
      const lock = document.createElement('span');
      lock.className = 'character-pet-lock';
      lock.textContent = '🔒';
      button.appendChild(lock);
    } else {
      button.addEventListener('click', () => equipPetFromIndex(pet.id));
    }
    listEl.appendChild(button);
  });
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
  const buffered = convertBufferedXP(xpModifier.modifiedAmount * (1 - share));
  const playerXP = buffered.visibleXP;

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
    updateIndexStatsUI();
  }

  localStorage.setItem('xp', currentXP);
  localStorage.setItem('level', currentLevel);

  if (window.TentiaAPI && window.TentiaAPI.isLoggedIn()) {
    window.TentiaAPI.saveProfile({
      xp: currentXP,
      level: currentLevel,
      xp_buffer: buffered.buffer,
      points_left: parseInt(localStorage.getItem('statPoints')) || 0
    });
  }

  return { playerXP, xpBuffer: buffered.buffer, currentLevel, levelsGained, ...xpModifier };
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

function getActiveCustomSkillTimerCount() {
  return customSkills.filter(skill => Boolean(skill.activeStartedAt)).length;
}

function updateCustomSkillUI(id) {
  const skill = customSkills.find(item => item.id === id);
  const node = document.getElementById('skill-' + id);
  if (!skill || !node) return;

  const total = document.getElementById('total-' + id);
  const session = document.getElementById('session-' + id);
  const button = node.querySelector('[data-action="toggle"]');
  const currentSessionMs = skill.activeStartedAt ? Date.now() - Number(skill.activeStartedAt) : 0;
  const limitReached = !skill.activeStartedAt && getActiveCustomSkillTimerCount() >= MAX_ACTIVE_CUSTOM_SKILL_TIMERS;

  if (total) total.textContent = formatTotalHours(getCustomSkillElapsed(skill));
  if (session) session.textContent = formatSessionTime(currentSessionMs);
  if (button) {
    button.textContent = skill.activeStartedAt ? 'STOP' : 'START';
    button.disabled = limitReached;
    button.title = limitReached ? 'Maximum 2 chronos actifs' : '';
  }

  node.classList.toggle('timer-running', Boolean(skill.activeStartedAt));
  node.classList.toggle('timer-limit-reached', limitReached);
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
    if (getActiveCustomSkillTimerCount() >= MAX_ACTIVE_CUSTOM_SKILL_TIMERS) {
      showSkillXPFeedback(skill.id, 'MAX 2 CHRONOS');
      updateAllCustomSkillTimers();
      return;
    }
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

const characterPetToggle = document.getElementById('character-pet-toggle');
const characterPetList = document.getElementById('character-pet-list');
if (characterPetToggle && characterPetList) {
  characterPetToggle.addEventListener('click', () => {
    characterPetList.classList.toggle('hidden');
    characterPetToggle.textContent = characterPetList.classList.contains('hidden') ? '▶' : '▼';
  });
}


const indexStatsBox = document.getElementById('index-stats-box');
const indexStatsToggle = document.getElementById('index-stats-toggle');
const openIndexStats = document.getElementById('open-index-stats');
const indexGlobalStatsPopup = document.getElementById('index-global-stats-popup');
const closeIndexGlobalStats = document.getElementById('close-index-global-stats');
const openIndexStatsInfo = document.getElementById('open-index-stats-info');
const indexStatsInfoPopup = document.getElementById('index-stats-info-popup');
const closeIndexStatsInfo = document.getElementById('close-index-stats-info');

function toggleIndexStatsBox(forceOpen = null) {
  if (!indexStatsBox || !indexStatsToggle) return;
  const shouldOpen = forceOpen === null ? !indexStatsBox.classList.contains('open') : forceOpen;
  indexStatsBox.classList.toggle('open', shouldOpen);
  indexStatsToggle.textContent = shouldOpen ? '>' : '<';
}

function createIndexSummaryRow(label, value, detail = '') {
  const row = document.createElement('div');
  row.className = 'index-global-stat-row';

  const labelEl = document.createElement('span');
  labelEl.className = 'index-global-stat-label';
  labelEl.textContent = label;

  const valueEl = document.createElement('span');
  valueEl.className = 'index-global-stat-value';
  valueEl.textContent = value;

  row.appendChild(labelEl);
  row.appendChild(valueEl);

  if (detail) {
    const detailEl = document.createElement('span');
    detailEl.className = 'index-global-stat-detail';
    detailEl.textContent = detail;
    row.appendChild(detailEl);
  }

  return row;
}

function renderIndexGlobalStatsSummary() {
  const list = document.getElementById('index-global-stats-list');
  if (!list) return;
  list.innerHTML = '';

  ['Force', 'Intelligence', 'Discipline', 'Focus'].forEach((statName) => {
    const base = parseInt(localStorage.getItem(statName), 10) || 0;
    const petBonus = getIndexPetStatBonus(statName);
    const badgeBonus = getIndexBadgeStatBonus(statName, base + petBonus);
    const total = base + petBonus + badgeBonus;
    list.appendChild(createIndexSummaryRow(statName, total, `Base ${base} | Pet +${petBonus} | Badge +${badgeBonus}`));
  });

  const equippedBadges = getBadges().filter(badge => badge.owned && badge.equippedSlot);
  const badgeText = equippedBadges.length
    ? equippedBadges.map(badge => `${badge.equippedSlot}: ${badge.name}`).join(' | ')
    : 'Aucun badge équipé';
  list.appendChild(createIndexSummaryRow('Badges', equippedBadges.length, badgeText));

  const equippedPet = getEquippedPetForXP();
  const petVisual = getIndexPetVisual(equippedPet);
  list.appendChild(createIndexSummaryRow('Familier', equippedPet ? petVisual.name : 'Aucun', equippedPet ? `Niveau ${equippedPet.level || 1}` : ''));

  const points = parseInt(localStorage.getItem('statPoints'), 10) || 0;
  list.appendChild(createIndexSummaryRow('Points dispo', points));
}

function openIndexGlobalStatsPopup() {
  renderIndexGlobalStatsSummary();
  if (indexGlobalStatsPopup) indexGlobalStatsPopup.style.display = 'flex';
}

function closeIndexOverlay(overlay) {
  if (overlay) overlay.style.display = 'none';
}

if (indexStatsToggle) indexStatsToggle.addEventListener('click', () => toggleIndexStatsBox());
if (openIndexStats) openIndexStats.addEventListener('click', openIndexGlobalStatsPopup);
if (closeIndexGlobalStats) closeIndexGlobalStats.addEventListener('click', () => closeIndexOverlay(indexGlobalStatsPopup));
if (indexGlobalStatsPopup) indexGlobalStatsPopup.addEventListener('click', (event) => {
  if (event.target === indexGlobalStatsPopup) closeIndexOverlay(indexGlobalStatsPopup);
});
if (openIndexStatsInfo) openIndexStatsInfo.addEventListener('click', () => {
  if (indexStatsInfoPopup) indexStatsInfoPopup.style.display = 'flex';
});
if (closeIndexStatsInfo) closeIndexStatsInfo.addEventListener('click', () => closeIndexOverlay(indexStatsInfoPopup));
if (indexStatsInfoPopup) indexStatsInfoPopup.addEventListener('click', (event) => {
  if (event.target === indexStatsInfoPopup) closeIndexOverlay(indexStatsInfoPopup);
});
updateIndexStatsUI();

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
    if (!result.connected) return;

    if (result.hpDelta) {
      const forceBonus = getForceHpBonus(result.hpDelta);
      setHP(result.hpAfter + forceBonus);
      console.log(`+${result.hpDelta + forceBonus} PV Strava${forceBonus ? ` (Force +${forceBonus})` : ''}`);
    }

    if (result.xpDelta) {
      const xpResult = addPlayerXPFromStudy(result.xpDelta);
      addPetXPFromStudy(xpResult.modifiedAmount);
      console.log(`+${xpResult.modifiedAmount} XP Strava`);
    }
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
//  RESET GLOBAL DESACTIVE
// ════════════════════════════════════════════
/*
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
*/

// ────────────────
// HP SYSTEM
// ────────────────
const MAX_HP = 100;
let hp = 50;

const savedHP = localStorage.getItem('hp');
if (savedHP !== null) hp = parseInt(savedHP);

function getEquippedPetForceBonus() {
  const pet = getEquippedPetForXP();
  if (!pet || pet.active === false) return 0;
  const levelValue = Math.min(pet.level || 1, 50);

  if (pet.stat === 'Force') return levelValue;
  if (pet.stat === 'ForceIntelligence') return Math.floor(levelValue / 2);

  if (pet.id === 'pet_endgame') {
    const form = pet.forms?.[pet.endgameForm || 'arc'];
    const dominant = form?.dominant;
    if (levelValue <= 25) return dominant === 'Force' ? 10 : 5;
    if (levelValue <= 49) return dominant === 'Force' ? 12 : 10;
    return dominant === 'Force' ? 20 : 15;
  }

  return 0;
}

function getBadgeForceBonus(flatValue) {
  let flat = 0;
  let multiplier = 1;
  let badges = [];

  try {
    badges = JSON.parse(localStorage.getItem('badges') || '[]');
  } catch (e) {
    badges = [];
  }

  badges.forEach((badge) => {
    if (!badge.owned || !badge.equippedSlot || !badge.stats?.Force) return;
    const statDef = badge.stats.Force;
    if (badge.multiplier) {
      multiplier *= statDef.dominant;
    } else {
      flat += badge.equippedSlot === 'Force' ? statDef.dominant : statDef.base;
    }
  });

  return Math.floor((flatValue + flat) * multiplier) - flatValue;
}

function getEffectiveForceForHp() {
  const baseForce = parseInt(localStorage.getItem('Force'), 10) || 0;
  const petBonus = getEquippedPetForceBonus();
  return baseForce + petBonus + getBadgeForceBonus(baseForce + petBonus);
}

function getForceHpBonus(delta) {
  if (delta <= 0) return 0;
  return Math.min(5, Math.floor(getEffectiveForceForHp() / 20));
}

function applyForceHpBonus(impact) {
  const forceBonus = getForceHpBonus(impact.delta);
  return {
    ...impact,
    baseDelta: impact.delta,
    forceBonus,
    delta: impact.delta + forceBonus
  };
}

function updateHPUI() {
  document.getElementById('hp').textContent = hp;

  if (hp > 0) {
    renderCharacterBuilder();
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
    renderCharacterBuilder();
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
  const baseImpact = calculateDailyHealthImpact();
  const { delta, forceBonus } = applyForceHpBonus(baseImpact);
  const capped = baseImpact.rawDelta !== baseImpact.delta ? ` (plafonne a ${baseImpact.delta})` : '';
  const forceText = forceBonus > 0 ? ` | Force +${forceBonus}` : '';
  preview.textContent = `Impact : ${delta > 0 ? '+' : ''}${delta} PV${capped}${forceText}`;
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
    ...applyForceHpBonus(calculateDailyHealthImpact()),
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
renderCharacterBuilder();

// ────────────────
// Personnage principal: l ancien menu skins/backgrounds est retire.
window.addEventListener('load', () => {
  renderCharacterBuilder();
  renderCharacterPetDock();
});

// BADGE SLOTS (index.html)
// ────────────────

const SLOT_STATS = ['Force', 'Intelligence', 'Discipline', 'Focus'];

function getBadges() {
  return JSON.parse(localStorage.getItem('badges')) || [];
}

function saveBadgesIndex(badges) {
  localStorage.setItem('badges', JSON.stringify(badges));
  updateIndexStatsUI();
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
    renderCharacterBuilder();
    renderBadgeSlots();
    renderCharacterPetDock();
    updateIndexStatsUI();

    // Recharger les competences personnalisees
    loadSavedSkills();
    renderCustomSkills();
    Object.keys(skills).forEach(name => updateSkillUI(name));


  }
});

// Afficher le pseudo du joueur dans le name tag
const nameTag = document.getElementById('char-name-tag');
if (nameTag) {
  const username = localStorage.getItem('_username') || 'Joueur';
  nameTag.textContent = username;
}

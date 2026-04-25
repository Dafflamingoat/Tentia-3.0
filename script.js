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
const MAX_LEVELS = { mecanique:100, anglais:100, dev:100, echec:1000, argent:3000 };
const skills = { mecanique:0, anglais:0, dev:0, echec:0, argent:0 };

const savedSkills = localStorage.getItem('skills');
if (savedSkills) {
  Object.assign(skills, JSON.parse(savedSkills));
  Object.keys(skills).forEach(name => updateSkillUI(name));
}

function updateSkillUI(name) {
  const val = skills[name];
  const max = MAX_LEVELS[name];
  const bar = document.getElementById('bar-' + name);
  const label = document.getElementById('val-' + name);
  const node = document.getElementById('skill-' + name);

  bar.style.width = (val / max * 100) + '%';
  label.textContent = val.toLocaleString() + '/' + max.toLocaleString();

  if (val >= max) node.classList.add('maxed');
  else node.classList.remove('maxed');
}

function increment(name) {
  if (name === 'echec') return;
  if (name === 'argent') {
    const step = 50;
    skills[name] = Math.min(skills[name] + step, MAX_LEVELS[name]);
  } else {
    const intel = parseInt(localStorage.getItem('Intelligence')) || 0;
    const bonus = Math.floor(intel / 10);
    const step = 1 + bonus;
    skills[name] = Math.min(skills[name] + step, MAX_LEVELS[name]);
    console.log(`+${step} ${name} (Intelligence incluse)`);
  }
  updateSkillUI(name);
  localStorage.setItem('skills', JSON.stringify(skills));
}

function resetSkill(skill) {
  if (skill === 'echec') return;
  skills[skill] = 0;
  updateSkillUI(skill);
  localStorage.setItem('skills', JSON.stringify(skills));
}

// ────────────────
// ELO CHESS
// ────────────────
const CHESS_USERNAME = 'Dafflaming0';

async function fetchChessElo() {
  try {
    const resp = await fetch(`https://api.chess.com/pub/player/${CHESS_USERNAME}/stats`);
    const data = await resp.json();

    const blitz = data.chess_blitz?.last?.rating || 0;
    const rapid = data.chess_rapid?.last?.rating || 0;
    const bullet = data.chess_bullet?.last?.rating || 0;
    const elo = blitz || rapid || bullet || 0;

    localStorage.setItem('currentElo', elo);
    if (typeof updateProfilePanel === "function") updateProfilePanel();

    skills.echec = Math.min(elo, MAX_LEVELS.echec);
    updateSkillUI('echec');
    updateEloBar(skills.echec);
    localStorage.setItem('skills', JSON.stringify(skills));

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
  localStorage.setItem('skills', JSON.stringify(skills));
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
}

function removeHP() {
  if (hp <= 0) return;
  hp--;
  updateHPUI();
  localStorage.setItem('hp', hp);
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

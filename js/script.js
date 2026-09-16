/* ==============================================
   BIRTHDAY GIFT PAGE — script.js
   Vanilla JS · Mobile-first · Sin frameworks
   ============================================== */

'use strict';

/* ════════════════════════════════════════════════
   CONFIGURACION PERSONALIZABLE
   Cambia estos valores para personalizar el regalo.
   No necesitas tocar nada mas del codigo.
   ════════════════════════════════════════════════ */

const CONFIG = {

  /* Nombre de la persona que recibe el regalo */
  name: 'Limon',

  /* Frases de la pantalla de introduccion */
  introLine1: 'Hola Limon , ya 2 decadas, ¿como pasa el tiempo, no?',
  introLine2: 'Te queria dar este detallito para recordarte la hermosa y maravillosa persona color canela tentacion que eres.',

  /* Frases de la pantalla 2 (efecto typewriter) */
  phrase1: 'Para la morenita mas linda',
  phrase2: 'Y aunque te mereces infinitamente mas de lo que te estoy regalando espero te saque una sonrisita.',

  /* Mensaje de la sorpresa secreta */
  secretMessage: 'Gracias por explorar hasta aqui.\nSignifica que estuviste presente en cada detalle.\nY eso dice mucho de ti.',

  /* ─── CANCIONES ────────────────────────────────
     Agrega o elimina objetos de este arreglo.
     src: ruta relativa al archivo de audio.
     description: texto opcional explicando por que elegiste esta cancion.
     ─────────────────────────────────────────────── */
  songs: [
    {
      title: 'The first time',
      artist: 'Damiano David',
      description: 'Lo que sucedio en mi cabeza cuando nos conocimos',
      src: 'audio/TheFirstTime.mp3'
    },
    {
      title: 'Sol',
      artist: 'Willian',
      description: 'Lo que pienso cada que te veo',
      src: 'audio/WillianSol(VideoLyrics).mp3'
    },
    {
      title: 'Niña bonita',
      artist: 'Dstance',
      description: 'Creo que la cancion habla por si misma, eres un niña muy bella',
      src: 'audio/DstanceNinaBonita(Versi+ónAcústica).mp3'
    },
    {
      title: 'She will be loved',
      artist: 'Maroon 5',
      description: 'Es mi cancion mas personal relacionada a ti',
      src: 'audio/SheWillBeLoved.mp3'
    },
    {
      title: 'Ilegal',
      artist: 'Cultura profetica',
      description: 'Me recuerda a cuando te miraba mientras te terminabas de maquillar frente a tu espejo',
      src: 'audio/Ilegal.mp3'
    }
  ]
};

/* ════════════════════════════════════════════════
   ESTADO GLOBAL
   ════════════════════════════════════════════════ */

const state = {
  experienceStarted: false,
  musicEnabled: false,
  isMuted: false,
  currentSongIndex: -1,
  isPlaying: false,
  envelopeOpened: false,
  secretTapCount: 0,
  secretTimer: null,
  lastSurpriseShown: false
};

/* ════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function rAF2(fn) {
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

function randomBetween(a, b) { return a + Math.random() * (b - a); }

/* ════════════════════════════════════════════════
   INICIALIZACION
   ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initIntroAnimation();
  initParticles();
  initScrollObserver();
  initProgressBar();
  initSecretElement();
  buildSongList();
  initAudioListeners();
});

/* Aplica CONFIG.name en todos los elementos .final-name
   y en los textos de intro si es necesario */
function applyConfig() {
  document.querySelectorAll('.final-name').forEach(el => {
    el.textContent = CONFIG.name;
  });
  /* Actualizar las lineas de intro desde CONFIG */
  const l1 = $('intro-line-1');
  const l2 = $('intro-line-2');
  if (l1) l1.textContent = CONFIG.introLine1;
  if (l2) l2.textContent = CONFIG.introLine2;
  /* Actualizar saludo de la carta */
  document.querySelectorAll('.letter-salutation').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/\[NOMBRE\]/g, CONFIG.name);
  });
  /* Actualizar mensaje secreto */
  document.querySelectorAll('.secret-msg').forEach(el => {
    el.innerHTML = CONFIG.secretMessage.replace(/\n/g, '<br>');
  });
}

/* ════════════════════════════════════════════════
   ANIMACION DE INTRODUCCION
   ════════════════════════════════════════════════ */

function initIntroAnimation() {
  setTimeout(() => { $('intro-line-1').classList.add('visible'); }, 700);
  setTimeout(() => { $('intro-line-2').classList.add('visible'); }, 2100);
  setTimeout(() => {
    const btn = $('open-gift-btn');
    btn.classList.remove('hidden');
    rAF2(() => btn.classList.add('visible'));
  }, 3500);
}

/* ════════════════════════════════════════════════
   PARTICULAS DE FONDO
   ════════════════════════════════════════════════ */

function initParticles() {
  const canvas = $('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COUNT = 30;
  const particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function mkParticle() {
    return {
      x: randomBetween(0, canvas.width),
      y: randomBetween(0, canvas.height),
      r: randomBetween(0.5, 2),
      vx: randomBetween(-0.18, 0.18),
      vy: randomBetween(-0.28, -0.08),
      alpha: randomBetween(0.06, 0.32),
      color: Math.random() > 0.55 ? '#8b5cf6' : '#e8e0d4'
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(mkParticle());

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx; p.y += p.vy;
      if (p.y + p.r < 0) { particles[i] = mkParticle(); particles[i].y = canvas.height + 2; }
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ════════════════════════════════════════════════
   INICIAR EXPERIENCIA (boton "Abrir regalo")
   ════════════════════════════════════════════════ */

window.startExperience = function () {
  if (state.experienceStarted) return;
  state.experienceStarted = true;

  tryPlayBackground();

  const widget = $('music-widget');
  widget.classList.remove('hidden');
  rAF2(() => widget.classList.add('visible'));

  setTimeout(() => scrollToNext('screen-phrase'), 450);
};

/* ════════════════════════════════════════════════
   SCROLL
   ════════════════════════════════════════════════ */

function scrollToNext(id) {
  const el = $(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.scrollToNext = scrollToNext;

/* ════════════════════════════════════════════════
   INTERSECTION OBSERVER — reveal al hacer scroll
   ════════════════════════════════════════════════ */

function initScrollObserver() {
  /* Secciones completas */
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      const id = entry.target.id;
      if (id === 'screen-phrase') startTypewriterPhrase();
      if (id === 'screen-final') startFinalSequence();
      sectionObs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.hidden-section').forEach(s => sectionObs.observe(s));

  /* Tarjetas de recuerdos — aparecen individualmente */
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      cardObs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-card').forEach(c => cardObs.observe(c));
}

/* ════════════════════════════════════════════════
   BARRA DE PROGRESO
   ════════════════════════════════════════════════ */

function initProgressBar() {
  const fill = $('progress-fill');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      fill.style.width = Math.min(pct, 100) + '%';
      ticking = false;
    });
  });
}

/* ════════════════════════════════════════════════
   TYPEWRITER — PANTALLA 2
   ════════════════════════════════════════════════ */

let phraseStarted = false;

function startTypewriterPhrase() {
  if (phraseStarted) return;
  phraseStarted = true;
  typewrite($('phrase-1'), CONFIG.phrase1, 44, () => {
    setTimeout(() => typewrite($('phrase-2'), CONFIG.phrase2, 40), 700);
  });
}

function typewrite(el, text, speed, callback) {
  if (!el) return;
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'phrase-cursor';
  el.appendChild(cursor);

  function tick() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(tick, speed + Math.random() * 18);
    } else {
      cursor.remove();
      if (callback) callback();
    }
  }
  tick();
}

/* ════════════════════════════════════════════════
   DETALLES INTERACTIVOS — PANTALLA 4
   ════════════════════════════════════════════════ */

window.toggleDetail = function (el) {
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.detail-item.open').forEach(d => {
    if (d !== el) {
      d.classList.remove('open');
      d.setAttribute('aria-expanded', 'false');
    }
  });
  el.classList.toggle('open', !isOpen);
  el.setAttribute('aria-expanded', String(!isOpen));
};

/* ════════════════════════════════════════════════
   SOBRE Y CARTA — PANTALLA 5
   ════════════════════════════════════════════════ */

window.openEnvelope = function () {
  if (state.envelopeOpened) return;
  state.envelopeOpened = true;

  const env = $('envelope');
  const hint = document.querySelector('.envelope-hint');
  const wrap = $('envelope-wrap');
  const letter = $('letter-content');

  env.classList.add('open');
  if (hint) hint.style.opacity = '0';

  setTimeout(() => {
    wrap.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    wrap.style.opacity = '0';
    wrap.style.transform = 'scale(0.9)';
    setTimeout(() => {
      wrap.style.display = 'none';
      letter.classList.remove('hidden');
      rAF2(() => letter.classList.add('visible'));
    }, 500);
  }, 850);
};

/* ════════════════════════════════════════════════
   AUDIO — MUSICA DE FONDO
   ════════════════════════════════════════════════ */

function tryPlayBackground() {
  const audio = $('bg-audio');
  audio.volume = 0.28;
  const p = audio.play();
  if (p !== undefined) {
    p.then(() => {
      state.musicEnabled = true;
      updateMusicWidget(true);
    }).catch(() => {
      updateMusicWidget(false);
    });
  }
}

function updateMusicWidget(playing) {
  const widget = $('music-widget');
  if (playing) {
    widget.classList.add('playing');
  } else {
    widget.classList.remove('playing');
  }
}

window.toggleMusic = function () {
  const audio = $('bg-audio');
  if (audio.paused) {
    audio.play().then(() => {
      state.musicEnabled = true;
      updateMusicWidget(true);
    }).catch(() => { });
  } else {
    audio.pause();
    state.musicEnabled = false;
    updateMusicWidget(false);
  }
};

window.toggleMute = function () {
  state.isMuted = !state.isMuted;
  $('bg-audio').muted = state.isMuted;
  $('song-audio').muted = state.isMuted;
  const waves = $('mute-waves');
  if (waves) waves.style.opacity = state.isMuted ? '0.2' : '1';
};

/* ════════════════════════════════════════════════
   LISTA DE CANCIONES — PANTALLA 6
   ════════════════════════════════════════════════ */

function buildSongList() {
  const list = $('song-list');
  if (!list) return;

  CONFIG.songs.forEach((song, idx) => {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.setAttribute('role', 'listitem');
    card.dataset.index = idx;
    card.innerHTML =
      '<div class="song-card-title">' + escapeHtml(song.title) + '</div>' +
      '<div class="song-card-artist">' + escapeHtml(song.artist) + '</div>' +
      (song.description ? '<div class="song-card-desc">' + escapeHtml(song.description) + '</div>' : '');
    card.addEventListener('click', () => playSong(idx));
    list.appendChild(card);
  });
}

function playSong(idx) {
  const song = CONFIG.songs[idx];
  if (!song) return;

  const audio = $('song-audio');
  const titleEl = $('player-song-title');
  const artistEl = $('player-song-artist');
  const playBtn = $('player-play-btn');
  const player = $('main-player');
  const widgetTitle = $('music-now-title');

  audio.pause();
  audio.src = song.src;
  audio.load();

  if (titleEl) titleEl.textContent = song.title;
  if (artistEl) artistEl.textContent = song.artist;
  if (playBtn) playBtn.disabled = false;
  if (player) player.classList.add('active');
  if (widgetTitle) widgetTitle.textContent = song.title;

  document.querySelectorAll('.song-card').forEach((c, i) => {
    c.classList.toggle('active', i === idx);
  });

  state.currentSongIndex = idx;

  audio.play().then(() => {
    state.isPlaying = true;
    updatePlayerIcon(true);
    /* Pausar musica de fondo mientras suena una cancion */
    $('bg-audio').pause();
    updateMusicWidget(false);
  }).catch(() => {
    state.isPlaying = false;
    updatePlayerIcon(false);
  });
}

window.playerToggle = function () {
  const audio = $('song-audio');
  if (audio.paused) {
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayerIcon(true);
    }).catch(() => { });
  } else {
    audio.pause();
    state.isPlaying = false;
    updatePlayerIcon(false);
  }
};

function updatePlayerIcon(playing) {
  const icon = $('player-play-icon');
  if (!icon) return;
  icon.innerHTML = playing
    ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
    : '<polygon points="5,3 19,12 5,21"/>';
}

function initAudioListeners() {
  const audio = $('song-audio');
  const fill = $('player-progress-fill');
  const current = $('player-current');
  const duration = $('player-duration');
  const bar = $('player-progress-bar');

  if (!audio) return;

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    if (fill) fill.style.width = pct + '%';
    if (bar) bar.setAttribute('aria-valuenow', Math.round(pct));
    if (current) current.textContent = formatTime(audio.currentTime);
    if (duration) duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    state.isPlaying = false;
    updatePlayerIcon(false);
    if (fill) fill.style.width = '0%';
    if (state.musicEnabled) {
      $('bg-audio').play().catch(() => { });
      updateMusicWidget(true);
    }
  });

  if (bar) {
    bar.addEventListener('click', e => {
      if (!audio.duration) return;
      const rect = bar.getBoundingClientRect();
      audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    });
  }
}

/* ════════════════════════════════════════════════
   SECUENCIA FINAL — PANTALLA 7
   ════════════════════════════════════════════════ */

let finalStarted = false;

function startFinalSequence() {
  if (finalStarted) return;
  finalStarted = true;
  setTimeout(() => { $('final-line-1').classList.add('visible'); }, 700);
  setTimeout(() => { $('final-line-2').classList.add('visible'); }, 2500);
  setTimeout(() => { $('final-birthday').classList.add('visible'); }, 4500);
  setTimeout(() => { $('back-to-top').classList.remove('hidden'); }, 6500);
}

window.showLastThing = function () {
  if (state.lastSurpriseShown) return;
  state.lastSurpriseShown = true;

  const btn = $('last-thing-btn');
  const surprise = $('last-surprise');

  if (btn) btn.style.display = 'none';
  if (surprise) {
    surprise.classList.remove('hidden');
    rAF2(() => surprise.classList.add('visible'));
  }

  setTimeout(launchConfetti, 500);
};

window.backToTop = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ════════════════════════════════════════════════
   CONFETI ELEGANTE
   ════════════════════════════════════════════════ */

function launchConfetti() {
  const canvas = $('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  canvas.width = parent.offsetWidth || window.innerWidth;
  canvas.height = parent.offsetHeight || window.innerHeight;

  const COLORS = ['#8b5cf6', '#a78bfa', '#e8e0d4', '#c4b5fd', '#6d28d9', '#ede9fe'];
  const pieces = [];

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width, Math.random() * canvas.height,
        Math.random() * 4 + 1, 0, Math.PI * 2
      );
      ctx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)];
      ctx.globalAlpha = 0.55;
      ctx.fill();
    }
    return;
  }

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * canvas.height * 0.5,
      w: randomBetween(4, 10),
      h: randomBetween(6, 14),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      vx: randomBetween(-1.2, 1.2),
      vy: randomBetween(1.5, 4),
      vr: randomBetween(-0.05, 0.05),
      alpha: randomBetween(0.6, 1)
    });
  }

  let frame = 0;
  function draw() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045;
      p.rotation += p.vr;
      p.alpha -= 0.003;
      if (p.alpha > 0 && p.y < canvas.height + 20) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });
    if (alive && frame < 320) requestAnimationFrame(draw);
  }
  draw();
}

/* ════════════════════════════════════════════════
   SORPRESA ESCONDIDA — estrella discreta
   Toca 5 veces rapido para activarla
   ════════════════════════════════════════════════ */

function initSecretElement() {
  const star = $('secret-star');
  const modal = $('secret-modal');
  if (!star || !modal) return;

  star.addEventListener('click', () => {
    state.secretTapCount++;
    star.classList.add('active');

    clearTimeout(state.secretTimer);
    state.secretTimer = setTimeout(() => {
      state.secretTapCount = 0;
      star.classList.remove('active');
    }, 2200);

    if (state.secretTapCount >= 5) {
      state.secretTapCount = 0;
      clearTimeout(state.secretTimer);
      showSecretModal();
    }
  });
}

function showSecretModal() {
  const modal = $('secret-modal');
  modal.classList.remove('hidden');
  rAF2(() => modal.classList.add('visible'));
  /* bloquear scroll mientras esta abierto */
  document.body.style.overflow = 'hidden';
}

window.closeSecret = function () {
  const modal = $('secret-modal');
  modal.classList.remove('visible');
  document.body.style.overflow = '';
  setTimeout(() => {
    modal.classList.add('hidden');
    $('secret-star').classList.remove('active');
  }, 650);
};

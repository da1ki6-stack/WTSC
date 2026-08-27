/* ============================================================
   WTSC — main.js
   ============================================================ */

/* ── LOADER ─────────────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  let pct = 0;

  const tick = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      fill.style.width = '100%';
      setTimeout(() => loader.classList.add('out'), 400);
      // Kick off hero text animations after loader
      setTimeout(triggerHeroAnims, 600);
    }
    fill.style.width = pct + '%';
  }, 60);
})();

/* ── HERO TEXT ANIMATIONS ───────────────────────── */
function triggerHeroAnims() {
  document.querySelectorAll('.hero-content .reveal-fade, .hero-content .reveal-up').forEach(el => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('in'), delay);
  });

  // Also reveal scroll hint
  const hint = document.querySelector('.hero-scroll-hint');
  if (hint) setTimeout(() => { hint.style.opacity = '1'; }, 1200);
}

// Make scroll hint hidden initially
document.addEventListener('DOMContentLoaded', () => {
  const hint = document.querySelector('.hero-scroll-hint');
  if (hint) hint.style.opacity = '0';
  hint && (hint.style.transition = 'opacity .8s ease');
});

/* ── NAV: SCROLL BEHAVIOR & ACTIVE LINK ─────────── */
const nav = document.getElementById('nav');
const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

function getScrollY() { return window.scrollY || window.pageYOffset; }

function onScroll() {
  // Scrolled class
  nav.classList.toggle('scrolled', getScrollY() > 60);

  // Active link
  const mid = getScrollY() + window.innerHeight * 0.45;
  navLinkEls.forEach(a => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    const { top, bottom } = target.getBoundingClientRect();
    const absTop = top + getScrollY();
    const absBot = bottom + getScrollY();
    a.classList.toggle('active', mid >= absTop && mid < absBot);
  });

  // Parallax
  rafParallax();
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ── MOBILE HAMBURGER ────────────────────────────── */
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── PARALLAX ────────────────────────────────────── */
// Apply background images from data-src
document.querySelectorAll('[data-src]').forEach(el => {
  el.style.backgroundImage = `url('${el.dataset.src}')`;
});

function isMobile() { return window.innerWidth <= 640; }

function rafParallax() {
  // Disable parallax on mobile (performance + layout stability)
  if (isMobile()) return;

  const sy = getScrollY();

  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${sy * 0.38}px)`;
  }

  document.querySelectorAll('.parallax-wrap').forEach(wrap => {
    const bg  = wrap.querySelector('.parallax-bg');
    if (!bg) return;
    const rect = wrap.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const offset = rect.top * 0.28;
    bg.style.transform = `translateY(${offset}px)`;
  });
}
rafParallax();

// Reset parallax transforms on resize (mobile ↔ desktop switch)
window.addEventListener('resize', () => {
  if (isMobile()) {
    document.querySelectorAll('.hero-bg, .parallax-bg').forEach(el => {
      el.style.transform = '';
    });
  }
}, { passive: true });

/* ── SCROLL REVEAL ───────────────────────────────── */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delayReveal || 0, 10);
    setTimeout(() => el.classList.add('in'), delay);
    revealIO.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* ── IMAGE SLIDERS ───────────────────────────────── */
const sliderState = {};

function initSlider(id) {
  const wrap  = document.getElementById(`slider-${id}`);
  const track = wrap.querySelector('.slider-track');
  const slides = wrap.querySelectorAll('.slide');
  const dotsWrap = document.getElementById(`dots-${id}`);
  if (!slides.length) return;

  // Build dots
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(id, i));
    dotsWrap.appendChild(d);
  });

  sliderState[id] = { current: 0, total: slides.length, track, dotsWrap };

  startAutoplay(id);

  // Pause on hover
  wrap.addEventListener('mouseenter', () => stopAutoplay(id));
  wrap.addEventListener('mouseleave', () => startAutoplay(id));

  // Touch swipe
  let tx = 0;
  wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return;
    const { current, total } = sliderState[id];
    goTo(id, diff > 0 ? (current + 1) % total : (current - 1 + total) % total);
  });
}

function goTo(id, index) {
  const s = sliderState[id];
  s.current = index;
  s.track.style.transform = `translateX(-${index * 100}%)`;
  s.dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

function startAutoplay(id) {
  stopAutoplay(id);
  sliderState[id].timer = setInterval(() => {
    const { current, total } = sliderState[id];
    goTo(id, (current + 1) % total);
  }, 4200);
}

function stopAutoplay(id) {
  if (sliderState[id]?.timer) {
    clearInterval(sliderState[id].timer);
  }
}

// Prev / Next buttons
document.querySelectorAll('.s-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id  = btn.dataset.target;
    const dir = btn.classList.contains('s-next') ? 1 : -1;
    const { current, total } = sliderState[id];
    goTo(id, (current + dir + total) % total);
    // Reset autoplay timer on manual navigation
    startAutoplay(id);
  });
});

// Init all sliders
['tomari', 'corner', 'usagiya', 'brownsugar', 'flavordesign'].forEach(initSlider);

/* ── KEYBOARD ACCESSIBILITY ──────────────────────── */
document.querySelectorAll('.s-btn').forEach(btn => {
  btn.setAttribute('tabindex', '0');
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') btn.click();
  });
});

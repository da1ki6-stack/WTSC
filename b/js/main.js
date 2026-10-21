/* WTSC B — main.js */
(function () {
  'use strict';

  const nav       = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  // ── Nav scroll ───────────────────────────────────
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Active section nav ───────────────────────────
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      const link = navLinks.querySelector(`a[href="#${sec.id}"]`);
      if (!link) return;
      link.classList.toggle('active',
        y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
    });
  }

  // ── Mobile hamburger ─────────────────────────────
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Reveal on scroll ─────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      if (delay) {
        setTimeout(() => el.classList.add('in'), delay);
      } else {
        el.classList.add('in');
      }
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.reveal, .reveal-fade, .reveal-up, .reveal-scale')
    .forEach(el => revealObserver.observe(el));

  // ── Store hero image parallax-lite ───────────────
  // Subtle scale-in on entering viewport (handled by CSS + observer above)

  // ── Keyboard accessibility ───────────────────────
  document.querySelectorAll('.brand-item, .c-item, .btn-primary').forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });
})();

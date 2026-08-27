(() => {
  // Header scroll state
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('siteNav');
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.classList.toggle('open');
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Reveal on scroll (IntersectionObserver)
  // モバイルではスタガーを減らし threshold を下げて早めに発火
  const isMobile = () => window.innerWidth <= 768;
  const reveals = document.querySelectorAll(
    '.bento-header, .bcard, .strip-inner, .contact-inner, .hs-text'
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: isMobile() ? 0.05 : 0.12 });

  reveals.forEach((el, i) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const delay = isMobile() ? (i % 3) * 60 : (i % 5) * 80;
    el.style.cssText += `opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease;transition-delay:${delay}ms;`;
    io.observe(el);
  });
})();

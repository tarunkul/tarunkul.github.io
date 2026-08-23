(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('scrollProgress');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const toast = document.getElementById('toast');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) {}
  root.dataset.theme = savedTheme || 'light';

  const updateThemeLabel = () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle?.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
  };
  updateThemeLabel();

  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('portfolio-theme', next); } catch (_) {}
    updateThemeLabel();
  });

  const closeMenu = () => {
    navLinks?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation menu');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks?.classList.contains('open')) {
      closeMenu();
      menuToggle?.focus();
    }
  });

  const updateScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 18);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(anchor => anchor.classList.toggle('active', anchor.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -58% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  };

  document.getElementById('copyEmail')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('tarun.kul@gmail.com');
      showToast('Email copied');
    } catch {
      showToast('Email: tarun.kul@gmail.com');
    }
  });

  document.getElementById('contactForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();
    const subject = encodeURIComponent(`AI project discussion from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`Hello Dr. Tarun,\n\nProblem / data / workflow and desired outcome:\n${message}\n\nRegards,\n${name}\n${email}`);
    window.location.href = `mailto:tarun.kul@gmail.com?subject=${subject}&body=${body}`;
  });

  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();

(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('scrollProgress');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const toast = document.getElementById('toast');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) {}
  const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.theme = savedTheme || preferredTheme;

  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('portfolio-theme', next); } catch (_) {}
  });

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const updateScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 18);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
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

  const roles = ['Generative AI', 'Computer Vision', 'Efficient Deep Learning', 'LLM & RAG Systems', 'Document Intelligence'];
  const typedText = document.getElementById('typedText');
  if (typedText && !reduceMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;
    const type = () => {
      const role = roles[roleIndex];
      typedText.textContent = role.slice(0, charIndex);
      if (deleting) {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
          setTimeout(type, 350);
          return;
        }
      } else {
        charIndex++;
        if (charIndex > roles[roleIndex].length) {
          deleting = true;
          charIndex = roles[roleIndex].length;
          setTimeout(type, 1300);
          return;
        }
      }
      setTimeout(type, deleting ? 35 : 65);
    };
    setTimeout(type, 1000);
  }

  const terminalMessages = [
    'optimizing model architecture...',
    'validating structured output...',
    'profiling inference latency...',
    'preparing reproducible experiment...',
    'deploying resource-aware pipeline...'
  ];
  const terminalText = document.getElementById('terminalText');
  if (terminalText && !reduceMotion) {
    let i = 0;
    setInterval(() => {
      terminalText.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 320 });
      terminalText.textContent = terminalMessages[i = (i + 1) % terminalMessages.length];
    }, 2500);
  }

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
    const subject = encodeURIComponent(`AI project enquiry from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`Hello Dr. Tarun,\n\n${message}\n\nRegards,\n${name}\n${email}`);
    window.location.href = `mailto:tarun.kul@gmail.com?subject=${subject}&body=${body}`;
  });

  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();

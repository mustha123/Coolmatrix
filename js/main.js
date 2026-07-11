/* ════════════════════════════════════════
   COOL MATRIX — SHARED SCRIPT
════════════════════════════════════════ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Navbar: blur on scroll ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScrollNav = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();
  }

  /* ── Mobile menu toggle ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ── Active nav link based on current page ── */
  (function highlightNav() {
    let path = window.location.pathname.split('/').pop();
    if (!path || path === '') path = 'index.html';
    // exact matches (top-level links, mobile menu, dropdown items)
    document.querySelectorAll('.nav-links a, .mobile-menu a, .dropdown-menu a, .nav-dropdown > a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('#')[0];
      if (href === path) a.classList.add('active');
    });
    // if current page is a service detail page, also highlight the Services parent
    const dropdownLinks = Array.from(document.querySelectorAll('.dropdown-menu a'))
      .map(a => (a.getAttribute('href') || '').split('#')[0]);
    if (path === 'services.html' || dropdownLinks.includes(path)) {
      const servicesParent = document.querySelector('.nav-dropdown > a');
      if (servicesParent) servicesParent.classList.add('active');
      const mobileServices = document.querySelector('.mobile-menu a[href="services.html"]');
      if (mobileServices) mobileServices.classList.add('active');
    }
  })();

  /* ── Hero parallax (home only, desktop) ── */
  const heroBg = document.getElementById('heroBg');
  if (heroBg && !reduceMotion) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        heroBg.style.transform = window.innerWidth > 768
          ? 'translateY(' + window.pageYOffset * 0.35 + 'px)' : '';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active', 'show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .service-banner').forEach(el => revealObserver.observe(el));

  /* ── Animated counters ── */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterObserver.unobserve(el);
      const target = parseInt(el.dataset.target, 10) || 0;
      const duration = 1600;
      const start = performance.now();
      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + '+';
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target], .stat-new[data-target]')
  .forEach(el => counterObserver.observe(el));
  /* ── Stacked project cards scale ── */
  const stackCards = Array.from(document.querySelectorAll('.project-card-stack'));
  if (stackCards.length && window.innerWidth > 768 && !reduceMotion) {
    let stackTicking = false;
    window.addEventListener('scroll', () => {
      if (stackTicking) return;
      stackTicking = true;
      requestAnimationFrame(() => {
        stackCards.forEach((card, i) => {
          if (i === stackCards.length - 1) return;
          const next = stackCards[i + 1];
          const rect = next.getBoundingClientRect();
          const vh = window.innerHeight;
          const progress = Math.min(Math.max((vh - rect.top) / vh, 0), 1);
          card.style.transform = 'scale(' + (1 - progress * 0.06) + ')';
        });
        stackTicking = false;
      });
    }, { passive: true });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!wasActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Testimonial slider ── */
  const testimonials = [
    {
      text: '"From planning to execution, the Cool Matrix team maintained clear communication and delivered exactly what was promised. Their HVAC and MEP expertise ensured efficient system performance and long term reliability. We appreciated their attention to detail and safety standards."',
      name: 'Corporate Client', role: 'Facilities Manager'
    },
    {
      text: '"Cool Matrix demonstrated exceptional technical knowledge and professionalism throughout the project. Their ability to manage complex MEP systems while maintaining quality and timelines gave us complete confidence. The coordination, execution, and final delivery reflected their commitment to engineering excellence."',
      name: 'Commercial Client', role: 'Project Director'
    },
    {
      text: '"Cool Matrix approached our interior fit-out project with precision and accountability. The quality of workmanship, adherence to design intent, and timely completion exceeded expectations. Their team handled every phase seamlessly, making the entire process stress free."',
      name: 'Retail Client', role: 'Operations Head'
    }
  ];
  const testiText = document.getElementById('testiText');
  const testiName = document.getElementById('testiName');
  const testiRole = document.getElementById('testiRole');
  if (testiText && testiName && testiRole) {
    let testiIndex = 0;
    const showTestimonial = i => {
      testiIndex = (i + testimonials.length) % testimonials.length;
      const t = testimonials[testiIndex];
      [testiText, testiName, testiRole].forEach(el => { el.style.opacity = 0; });
      setTimeout(() => {
        testiText.textContent = t.text;
        testiName.textContent = t.name;
        testiRole.textContent = t.role;
        [testiText, testiName, testiRole].forEach(el => {
          el.style.transition = 'opacity .4s ease';
          el.style.opacity = 1;
        });
      }, 250);
    };
    const prev = document.getElementById('testiPrev');
    const next = document.getElementById('testiNext');
    if (prev) prev.addEventListener('click', () => showTestimonial(testiIndex - 1));
    if (next) next.addEventListener('click', () => showTestimonial(testiIndex + 1));
    // auto-rotate
    if (!reduceMotion) setInterval(() => showTestimonial(testiIndex + 1), 7000);
  }

  /* ── Video modal (lightbox) ── */
  const videoModal = document.getElementById('videoModal');
  if (videoModal) {
    const iframe = videoModal.querySelector('iframe');
    const VIDEO_SRC = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // placeholder
    const openModal = () => {
      iframe.src = VIDEO_SRC + '?autoplay=1';
      videoModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      iframe.src = '';
      videoModal.classList.remove('open');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('[data-video-trigger]').forEach(t =>
      t.addEventListener('click', openModal));
    videoModal.querySelector('.video-close').addEventListener('click', closeModal);
    videoModal.addEventListener('click', e => { if (e.target === videoModal) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && videoModal.classList.contains('open')) closeModal();
    });
  }

  /* ── Contact form validation + feedback ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const showError = (input, show) => {
      input.classList.toggle('invalid', show);
      const msg = input.parentElement.querySelector('.error-msg');
      if (msg) msg.classList.toggle('show', show);
    };
    const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const required = contactForm.querySelectorAll('[data-required]');
      required.forEach(input => {
        let bad = !input.value.trim();
        if (input.type === 'email' && input.value.trim() && !validateEmail(input.value)) bad = true;
        if (input.tagName === 'SELECT' && input.selectedIndex === 0) bad = true;
        showError(input, bad);
        if (bad) valid = false;
      });
      if (!valid) return;

      const btn = contactForm.querySelector('.submit-btn');
      const orig = btn.textContent;
      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'var(--green)';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        contactForm.reset();
      }, 2600);
    });

    contactForm.querySelectorAll('[data-required]').forEach(input => {
      input.addEventListener('input', () => showError(input, false));
      input.addEventListener('change', () => showError(input, false));
    });
  }

  /* ── Smooth scroll for in-page anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* ── Scroll-to-top button ── */
  const scrollTop = document.getElementById('scrollTop');
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      scrollTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
})();

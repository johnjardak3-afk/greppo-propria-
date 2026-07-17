/* ================================================================
   PRELOADER
   ================================================================ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('done'), 900);
});

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ================================================================
     NAVBAR — background transition on scroll
     ================================================================ */
  const nav = document.getElementById('nav');
  const onNavScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onNavScroll();
  window.addEventListener('scroll', onNavScroll, { passive: true });

  /* ================================================================
     MOBILE MENU
     ================================================================ */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('[data-close]').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ================================================================
     SCROLL REVEAL — fade-up / fade-left / fade-right / zoom
     ================================================================ */
  const revealEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* Hero content reveals immediately (no scroll needed) */
  document.querySelectorAll('.hero-content .fade-up').forEach(el => {
    setTimeout(() => el.classList.add('in-view'), 100);
  });

  /* ================================================================
     PARALLAX — hero scene drifts slower than scroll
     ================================================================ */
  const heroScene = document.getElementById('heroScene');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroScene && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroScene.style.transform = `translateY(${y * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* ================================================================
     ANIMATED STAT COUNTERS
     ================================================================ */
  const counters = document.querySelectorAll('.stat-num');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-US');
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  /* ================================================================
     BUTTON RIPPLE MICRO-INTERACTION
     ================================================================ */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ================================================================
     ESTATE MAP — pin tooltips
     ================================================================ */
  const pins = document.querySelectorAll('.map-pin');
  const tooltip = document.getElementById('mapTooltip');
  pins.forEach(pin => {
    const show = () => {
      tooltip.textContent = pin.getAttribute('data-label');
      tooltip.style.left = pin.style.left;
      tooltip.style.top = pin.style.top;
      tooltip.classList.add('show');
    };
    pin.addEventListener('mouseenter', show);
    pin.addEventListener('focus', show);
    pin.addEventListener('click', show);
    pin.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
    pin.addEventListener('blur', () => tooltip.classList.remove('show'));
  });

  /* GALLERY LIGHTBOX */
  const masonryItems = document.querySelectorAll('.masonry-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxScene = document.getElementById('lightboxScene');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  masonryItems.forEach(item => {
    item.addEventListener('click', () => {
      const inner = item.querySelector('.scene');
      lightboxScene.className = 'lightbox-scene scene ' + [...inner.classList].find(c => c.startsWith('scene-') && c !== 'scene');
      lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });


  /* RESERVATION FORM */
  const HOSTESS_WHATSAPP = '96176444840';

  const form = document.getElementById('reservationForm');
  const status = document.getElementById('formStatus');
  const dateInput = document.getElementById('rDate');
  if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const data = Object.fromEntries(new FormData(form).entries());
    const typeLabels = {
      restaurant: 'a restaurant reservation',
      event: 'a private event',
      tasting: 'a wine tasting',
      pool:'a pool day'
    };

    const lines = [
      `Hello I would like to book— ${typeLabels[data.type] || 'a visit'}`,
      ``,
      `Name: ${data.name}`,
      data.phone ? `Phone: ${data.phone}` : null,
      data.date ? `Preferred date: ${data.date}` : null,
      data.time ? `Preferred time: ${data.time}` : null,
      data.guests ? `Guests: ${data.guests}` : null,
      data.message ? `Notes: ${data.message}` : null
    ].filter(Boolean).join('\n');

    const whatsappUrl = `https://wa.me/${HOSTESS_WHATSAPP}?text=${encodeURIComponent(lines)}`;
    window.open(whatsappUrl, '_blank');

    status.textContent = `Grazie, ${data.name.split(' ')[0]} — we've opened WhatsApp with your enquiry ready to send to the estate. Just hit send there to confirm.`;
    form.reset();
    setTimeout(() => { status.textContent = ''; }, 9000);
  });

  /* NEWSLETTER FORM */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterStatus');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterStatus.textContent = 'Thank you — welcome to the estate list.';
    newsletterForm.reset();
    setTimeout(() => { newsletterStatus.textContent = ''; }, 6000);
  });

});
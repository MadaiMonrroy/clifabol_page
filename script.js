/* =============================================
   ESTOY AQUÍ – Script principal
   ============================================= */

// ── Navbar scroll effect ──────────────────────
const navbar = document.getElementById('navbar');
const logo = document.getElementById("logo");

const onScroll = () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');

    // 👇 cambia logo
    logo.src = "img/clientes.png";
  } else {
    navbar.classList.remove('scrolled');

    // 👇 logo original
    logo.src = "img/logo call center.png";
  }
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Hamburger menu ────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';

  // Animate hamburger → X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ── Smooth scroll for anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Intersection Observer – Fade-in on scroll ─
// El delay se asigna POR SECCIÓN (no global), así el índice
// reinicia en cada bloque y nunca se acumula.
const STAGGER   = 0.07;   // segundos entre cards de un mismo grupo
const MAX_DELAY = 0.28;   // tope máximo de delay
const DURATION  = 0.42;   // duración de la transición

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = Math.min(parseFloat(el.dataset.staggerDelay || 0), MAX_DELAY);
      el.style.transitionDelay = `${delay}s`;
      el.classList.add('visible');
      fadeObserver.unobserve(el);
    }
  });
}, {
  threshold:  0.08,
  rootMargin: '0px 0px -20px 0px'   // dispara un poco antes del borde
});

// Preparar elementos agrupados por su sección padre
const SELECTOR = '.service-card, .step-card, .testimonial-card, .stat-item, .about-img, .value-item';

document.querySelectorAll('section, footer').forEach(section => {
  section.querySelectorAll(SELECTOR).forEach((el, localIndex) => {
    el.dataset.staggerDelay = (localIndex * STAGGER).toFixed(2);
    el.style.opacity   = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity ${DURATION}s ease, transform ${DURATION}s ease`;
    el.classList.add('fade-target');
    fadeObserver.observe(el);
  });
});

// Estado visible
const style = document.createElement('style');
style.textContent = `.fade-target.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// ── Animated counter for stats ────────────────
function animateCounter(el, target, suffix, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString('es') + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const count  = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, count, suffix);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
  statsObserver.observe(el);
});

// ── Active nav link on scroll ─────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(sec => sectionObserver.observe(sec));

// Active link style
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .navbar.scrolled .nav-links a.active {
    background: rgba(4,85,131,.08);
    color: var(--primary);
    font-weight: 600;
  }
`;
document.head.appendChild(activeStyle);

// ── Floating button visibility ────────────────
const fab = document.querySelector('.fab-call');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    fab.style.opacity = '1';
    fab.style.pointerEvents = 'auto';
  } else {
    fab.style.opacity = '0';
    fab.style.pointerEvents = 'none';
  }
}, { passive: true });
// Initial state
fab.style.opacity = '0';
fab.style.transition = 'opacity 0.3s ease';
fab.style.pointerEvents = 'none';


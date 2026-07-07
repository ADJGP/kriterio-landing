/* ============================================
   KRITERIO LANDING PAGE — JavaScript
   Animations, Scroll Effects, Interactivity
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // DOM Ready
  // ============================================
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavbar();
    initMobileNav();
    initScrollReveal();
    initCounterAnimations();
    initForms();
    initSmoothScroll();
    initParallax();
  }

  // ============================================
  // NAVBAR — Scroll-based styling
  // ============================================
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const threshold = 50;

    function onScroll() {
      const currentScroll = window.scrollY;

      if (currentScroll > threshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
  }

  // ============================================
  // MOBILE NAV — Toggle menu
  // ============================================
  function initMobileNav() {
    const toggle = document.getElementById('navbar-toggle');
    const nav = document.getElementById('navbar-nav');
    const overlay = document.getElementById('nav-overlay');

    if (!toggle || !nav) return;

    function openNav() {
      nav.classList.add('open');
      toggle.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      nav.classList.remove('open');
      toggle.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }

    // Close nav when clicking a link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  // ============================================
  // SCROLL REVEAL — Intersection Observer
  // ============================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

    if (!revealElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Don't unobserve so re-entering triggers again? No, keep it one-shot for performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============================================
  // COUNTER ANIMATIONS
  // ============================================
  function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');

    if (!counters.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 2000; // ms
    const startTime = performance.now();
    const startValue = 0;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

      element.textContent = formatNumber(currentValue);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = formatNumber(target);
        // Add a "+" suffix if it's a large number
        if (target >= 100) {
          element.textContent = formatNumber(target) + '+';
        }
      }
    }

    requestAnimationFrame(update);
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
    }
    return num.toLocaleString('es-ES');
  }

  // ============================================
  // FORM HANDLING
  // ============================================
  function initForms() {
    const heroForm = document.getElementById('hero-form');
    const ctaForm = document.getElementById('cta-form');

    if (heroForm) {
      heroForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit(heroForm, 'hero-email-input');
      });
    }

    if (ctaForm) {
      ctaForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit(ctaForm, 'cta-email-input');
      });
    }
  }

  function handleFormSubmit(form, inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const email = input.value.trim();

    if (!email || !isValidEmail(email)) {
      showToast('Por favor ingresa un correo electrónico válido', 'error');
      input.focus();
      return;
    }

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = '✓ ¡Listo!';
      input.value = '';
      showToast('¡Te has unido exitosamente a la lista de espera! 🎉');

      // Increment counter
      const counterEl = document.getElementById('cta-counter-number');
      if (counterEl) {
        const current = parseInt(counterEl.getAttribute('data-count'), 10) || 2547;
        const newCount = current + 1;
        counterEl.setAttribute('data-count', newCount);
        counterEl.textContent = formatNumber(newCount) + '+';
      }

      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    }, 1200);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  function showToast(message, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;

    if (type === 'error') {
      toast.style.background = 'linear-gradient(135deg, #D32F2F, #F44336)';
    } else {
      toast.style.background = 'linear-gradient(135deg, #0052D4, #00C9A7)';
    }

    toast.classList.add('show');

    setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const navHeight = document.getElementById('navbar').offsetHeight || 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }

  // ============================================
  // PARALLAX EFFECT (subtle)
  // ============================================
  function initParallax() {
    const orbs = document.querySelectorAll('.hero-bg .orb');
    if (!orbs.length) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          const scrollY = window.scrollY;

          orbs.forEach(function (orb, index) {
            const speed = 0.15 + index * 0.05;
            orb.style.transform = 'translateY(' + scrollY * speed + 'px)';
          });

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

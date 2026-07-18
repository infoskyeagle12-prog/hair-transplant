/* ==========================================================================
   HT Aesthetiq — Premium Animation Engine
   Auto-applies staggered scroll reveals, stat counters, and a scroll
   progress bar. No HTML changes required — elements are tagged at runtime.
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ------------------------------------------------------------------
     1. Scroll progress bar
     ------------------------------------------------------------------ */
  function initScrollProgress() {
    if (prefersReducedMotion) return;

    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = 'scaleX(' + Math.min(progress, 1) + ')';
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );

    update();
  }

  /* ------------------------------------------------------------------
     2. Reveal system — tag elements + observe
     ------------------------------------------------------------------ */
  var revealTargets = [
    // [selector, variant, staggerMs]
    ['.section-header .section-eyebrow', 'reveal-down', 0],
    ['.section-header .section-title', 'reveal-up', 100],
    ['.section-header .section-desc', 'reveal-up', 200],
    ['.why-choose-grid .why-card', 'reveal-up', 90],
    ['.services-grid .service-card', 'reveal-zoom', 100],
    ['.results-carousel .result-card-container', 'reveal-up', 110],
    ['.steps-container .step-card', 'reveal-up', 140],
    ['.faq-container .faq-item', 'reveal-left', 80],
    ['.testimonial-slide', 'reveal-zoom', 120],
    ['.cta-banner .cta-banner-eyebrow', 'reveal-down', 0],
    ['.cta-banner .cta-banner-title', 'reveal-up', 120],
    ['.cta-banner .cta-banner-desc', 'reveal-up', 240],
    ['.cta-banner .btn-cta', 'reveal-zoom', 360],
    ['.footer .footer-grid > *', 'reveal-up', 100],
    ['.scroll-hint', 'reveal-blur', 0]
  ];

  function tagElements() {
    revealTargets.forEach(function (target) {
      var selector = target[0];
      var variant = target[1];
      var stagger = target[2];

      var elements = document.querySelectorAll(selector);
      elements.forEach(function (el, index) {
        if (el.classList.contains('reveal')) return;
        el.classList.add('reveal', variant);
        el.style.setProperty('--reveal-delay', index * stagger + 'ms');
      });
    });
  }

  function initRevealObserver() {
    var revealed = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealed.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealed.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     3. Section title underline draw
     ------------------------------------------------------------------ */
  function initTitleUnderlines() {
    var titles = document.querySelectorAll('.section-title');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      titles.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    titles.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     4. Stat counter count-up
     ------------------------------------------------------------------ */
  function animateCounter(el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^(\d[\d,]*)(.*)$/);
    if (!match) {
      el.classList.add('counted');
      return;
    }

    var endValue = parseInt(match[1].replace(/,/g, ''), 10);
    var suffix = match[2] || '';
    var duration = 1800;
    var startTime = null;

    el.classList.add('counted');

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function frame(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.round(easeOutExpo(progress) * endValue);
      el.textContent = value.toLocaleString('en-US') + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      }
    }

    window.requestAnimationFrame(frame);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      return; // leave static values as-is
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     5. Subtle hero parallax on scroll
     ------------------------------------------------------------------ */
  function initHeroParallax() {
    if (prefersReducedMotion) return;

    var heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    var ticking = false;

    function update() {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = 'translateY(' + y * 0.18 + 'px)';
        heroContent.style.opacity = String(
          Math.max(1 - y / (window.innerHeight * 0.85), 0)
        );
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function init() {
    tagElements();
    initRevealObserver();
    initTitleUnderlines();
    initCounters();
    initScrollProgress();
    initHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

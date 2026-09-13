/**
 * Intelligence Designed To Evolve — Main Logic
 * Vanilla JavaScript implementation for stats count-up and responsive mobile drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStatsCountUp();
  initMobileMenu();
  initNavLinks();
});

/* ==========================================================================
   1) Stats Count-Up Animation
   ========================================================================== */
function initStatsCountUp() {
  const statElements = document.querySelectorAll('.stat-value');
  if (!statElements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // easeOutCubic curve
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function formatValue(value, decimals, suffix) {
    const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    return `${formatted}${suffix}`;
  }

  function startCountAnimation(el, index) {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

    if (prefersReducedMotion) {
      el.textContent = formatValue(target, decimals, suffix);
      return;
    }

    const duration = 1500 + index * 80;
    const startOffset = 480 + index * 90;

    setTimeout(() => {
      let startTime = null;

      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = easedProgress * target;

        el.textContent = formatValue(currentValue, decimals, suffix);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatValue(target, decimals, suffix);
        }
      }

      requestAnimationFrame(step);
    }, startOffset);
  }

  // Trigger once using IntersectionObserver (threshold 0.25)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statElements.forEach((el, index) => {
              startCountAnimation(el, index);
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    const statsFooter = document.querySelector('.stats-footer');
    if (statsFooter) {
      observer.observe(statsFooter);
    } else {
      statElements.forEach((el, i) => startCountAnimation(el, i));
    }
  } else {
    // Fallback if IntersectionObserver is not supported
    statElements.forEach((el, i) => startCountAnimation(el, i));
  }
}

/* ==========================================================================
   2) Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const burgerBtn = document.getElementById('mobileBurgerBtn');
  const overlay = document.getElementById('mobileOverlay');
  const sheet = document.getElementById('mobileSheet');

  if (!burgerBtn || !overlay || !sheet) return;

  function openMenu() {
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    sheet.removeAttribute('hidden');
    // Force reflow for transition
    void sheet.offsetWidth;
    overlay.classList.add('active');
    sheet.classList.add('active');
  }

  function closeMenu() {
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    overlay.classList.remove('active');
    sheet.classList.remove('active');

    setTimeout(() => {
      if (!document.body.classList.contains('menu-open')) {
        sheet.setAttribute('hidden', '');
      }
    }, 380);
  }

  burgerBtn.addEventListener('click', () => {
    const isOpen = burgerBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  // Close when clicking any link inside the mobile sheet
  sheet.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Auto-close on resize above 720px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3) Navigation Link Active State Handler
   ========================================================================== */
function initNavLinks() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        navLinks.forEach((l) => l.classList.remove('active'));
        // Activate matching links across desktop & mobile
        document.querySelectorAll(`a[href="${href}"]`).forEach((match) => {
          match.classList.add('active');
        });
      }
    });
  });
}

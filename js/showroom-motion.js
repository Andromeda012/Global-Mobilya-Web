/**
 * Global Mobilya — Jiro H&G + Miles Motion Engine
 * - Blur-up staggered IntersectionObserver reveals (.hg-reveal, .reveal-on-scroll)
 * - Miles Wave Clip-Path image unmasking (.miles-wave-frame)
 * - WAAPI Marquee Ticker with hover pause (.hg-marquee-track)
 * - Pulsing Hotspot rings (.hg-hotspot-ring)
 */
(function (global) {
  const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initBlurUpReveals() {
    const els = document.querySelectorAll('.hg-reveal, .reveal-on-scroll');
    if (!els.length) return;

    if (prefersReduced()) {
      els.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Number(el.dataset.delay || 0);
          if (delay > 0) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
  }

  function initWaveMasks() {
    const frames = document.querySelectorAll('.miles-wave-frame');
    if (!frames.length) return;

    if (prefersReduced()) return;

    frames.forEach((frame, idx) => {
      if (frame.dataset.waveBound === '1') return;
      frame.dataset.waveBound = '1';

      const inner = frame.querySelector('.miles-wave-inner');
      if (!inner) return;

      const delay = Number(frame.dataset.waveDelay || ((idx % 2) * 140));
      let rafId = 0;
      let startTs = 0;
      let progress = 0;

      const paint = (t, p) => {
        const phase = (t || 0) * 0.0025;
        const base = p * 112;
        const pts = [];
        for (let i = 0; i <= 6; i++) {
          const x = Math.round((100 / 6) * i);
          const amp = (1 - p) * 10;
          const y = Math.max(0, Math.min(100, base + Math.sin(phase + i * 0.8) * amp));
          pts.push(`${x}% ${y.toFixed(1)}%`);
        }
        pts.push('100% 0%', '0% 0%');
        inner.style.clipPath = `polygon(${pts.reverse().join(',')})`;
        inner.style.transform = `translateY(${(-8 * (1 - p)).toFixed(2)}%) scale(${(1 + 0.1 * (1 - p)).toFixed(4)})`;
      };

      // Initialize gentle mask slightly above viewport reveals
      paint(0, 0.08);

      const step = (now) => {
        if (!startTs) startTs = now;
        const elapsed = (now - startTs) / 1450;
        progress = Math.min(1, elapsed);
        const eased = 1 - Math.pow(1 - progress, 3);
        paint(now, eased);
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          inner.style.clipPath = 'none';
          inner.style.transform = 'none';
        }
      };

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          setTimeout(() => {
            if (!rafId) rafId = requestAnimationFrame(step);
          }, delay);
        }
      }, { threshold: 0.18 });

      obs.observe(frame);
    });
  }

  function initMarquees() {
    if (prefersReduced()) return;
    document.querySelectorAll('.hg-marquee-track').forEach(track => {
      if (track.dataset.marqueeBound === '1') return;
      track.dataset.marqueeBound = '1';

      const duration = Number(track.dataset.duration || 36000);
      if (typeof track.animate === 'function') {
        const anim = track.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
          { duration, iterations: Infinity, easing: 'linear' }
        );
        track.addEventListener('mouseenter', () => anim.pause());
        track.addEventListener('mouseleave', () => anim.play());
      }
    });
  }

  function initHotspots() {
    document.querySelectorAll('.hg-hotspot-ring').forEach(ring => {
      if (ring.dataset.ringBound === '1' || prefersReduced()) return;
      ring.dataset.ringBound = '1';
      if (typeof ring.animate === 'function') {
        ring.animate(
          [{ transform: 'scale(1)', opacity: 0.65 }, { transform: 'scale(2.25)', opacity: 0 }],
          { duration: 1850, iterations: Infinity, easing: 'cubic-bezier(0, 0, 0.2, 1)' }
        );
      }
    });
  }

  function initCategoryDeck() {
    document.querySelectorAll('.hg-category-deck').forEach(deck => {
      const panels = deck.querySelectorAll('.hg-cat-panel');
      if (!panels.length) return;
      panels.forEach(p => {
        const activate = () => {
          panels.forEach(x => x.classList.remove('is-active'));
          p.classList.add('is-active');
        };
        p.addEventListener('mouseenter', activate);
        p.addEventListener('focus', activate);
      });
    });
  }

  function initAllMotion() {
    initBlurUpReveals();
    initWaveMasks();
    initMarquees();
    initHotspots();
    initCategoryDeck();
  }

  global.GKM_MOTION = {
    initAll: initAllMotion,
    refreshReveals: initBlurUpReveals
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllMotion);
  } else {
    initAllMotion();
  }
})(window);

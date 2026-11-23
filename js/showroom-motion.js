/**
 * Global Mobilya — Bidirectional Jiro H&G + Miles Motion Engine
 * - Bidirectional Blur-up staggered IntersectionObserver reveals (.hg-reveal, .reveal-on-scroll)
 * - Bidirectional Miles Wave Clip-Path image unmasking (.miles-wave-frame)
 * - Bidirectional Miles Radial Orbit Services burst (.miles-orbit-stage)
 * - Bidirectional Animated Metric Count-Up ([data-count-target])
 * - WAAPI Infinite Marquee with hover pause (.hg-marquee-track, .miles-split-track)
 * - Pulsing Hotspot rings (.hg-hotspot-ring)
 */
(function (global) {
  const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let _revealObserver = null;

  function initBlurUpReveals() {
    const els = document.querySelectorAll('.hg-reveal, .reveal-on-scroll');
    if (!els.length) return;

    if (prefersReduced()) {
      els.forEach(el => el.classList.add('revealed'));
      return;
    }

    if (!_revealObserver) {
      _revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const el = entry.target;
          if (entry.isIntersecting) {
            const delay = Number(el.dataset.delay || 0);
            el.style.transitionDelay = delay > 0 ? `${delay}ms` : '0ms';
            el.classList.add('revealed');
          } else {
            // Reset cleanly when completely scrolled past (top or bottom) so scrolling UP replays too!
            const rect = entry.boundingClientRect;
            if (rect.bottom <= 0) {
              el.dataset.exit = 'top';
              el.style.transitionDelay = '0ms';
              el.classList.remove('revealed');
            } else if (rect.top >= window.innerHeight) {
              el.dataset.exit = 'bottom';
              el.style.transitionDelay = '0ms';
              el.classList.remove('revealed');
            }
          }
        });
      }, { threshold: 0.12 });
    }

    els.forEach(el => {
      if (el.dataset.revealBound === '1') return;
      el.dataset.revealBound = '1';
      _revealObserver.observe(el);
    });
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
      let timerId = 0;
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

      const resetWave = () => {
        clearTimeout(timerId);
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        startTs = 0;
        progress = 0;
        paint(0, 0.06);
      };

      resetWave();

      const step = (now) => {
        if (!startTs) startTs = now;
        const elapsed = (now - startTs) / 1350;
        progress = Math.min(1, elapsed);
        const eased = 1 - Math.pow(1 - progress, 3);
        paint(now, eased);
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          rafId = 0;
          inner.style.clipPath = 'none';
          inner.style.transform = 'none';
        }
      };

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(timerId);
          timerId = setTimeout(() => {
            if (!rafId && progress < 1) rafId = requestAnimationFrame(step);
          }, delay);
        } else {
          const r = entry.boundingClientRect;
          if (r.bottom <= 0 || r.top >= window.innerHeight) {
            resetWave();
          }
        }
      }, { threshold: 0.16 });

      obs.observe(frame);
    });
  }

  function initOrbitBurst() {
    const stages = document.querySelectorAll('.miles-orbit-stage');
    if (!stages.length) return;

    stages.forEach(stage => {
      if (stage.dataset.orbitBound === '1') return;
      stage.dataset.orbitBound = '1';

      const cards = stage.querySelectorAll('.miles-orbit-card');
      cards.forEach((card, idx) => {
        card.dataset.orbitDelay = String(90 + idx * 85);
      });

      if (prefersReduced()) {
        stage.classList.add('orbit-open');
        return;
      }

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach(card => {
            card.style.transitionDelay = `${card.dataset.orbitDelay}ms`;
          });
          stage.classList.add('orbit-open');
        } else {
          const r = entry.boundingClientRect;
          if (r.bottom <= 0 || r.top >= window.innerHeight) {
            cards.forEach(card => { card.style.transitionDelay = '0ms'; });
            stage.classList.remove('orbit-open');
          }
        }
      }, { threshold: 0.18 });

      obs.observe(stage);
    });
  }

  function initCountUp() {
    const nums = document.querySelectorAll('[data-count-target]');
    if (!nums.length) return;

    nums.forEach(el => {
      if (el.dataset.countBound === '1') return;
      el.dataset.countBound = '1';

      const target = Number(el.dataset.countTarget || 0);
      const prefix = el.dataset.countPrefix || '';
      const suffix = el.dataset.countSuffix || '';
      const useDot = el.dataset.countFormat === 'dot';
      let rafId = 0;

      const formatVal = (v) => {
        const rounded = Math.round(v);
        const txt = useDot ? rounded.toLocaleString('tr-TR') : String(rounded);
        return `${prefix}${txt}${suffix}`;
      };

      if (prefersReduced()) {
        el.textContent = formatVal(target);
        return;
      }

      const animateNum = () => {
        if (rafId) cancelAnimationFrame(rafId);
        const start = performance.now();
        const dur = 1150;
        const tick = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = formatVal(target * eased);
          if (p < 1) rafId = requestAnimationFrame(tick);
          else rafId = 0;
        };
        rafId = requestAnimationFrame(tick);
      };

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          animateNum();
        } else {
          const r = entry.boundingClientRect;
          if (r.bottom <= 0 || r.top >= window.innerHeight) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
            el.textContent = formatVal(0);
          }
        }
      }, { threshold: 0.25 });

      obs.observe(el);
    });
  }

  function initMarquees() {
    if (prefersReduced()) return;
    document.querySelectorAll('.hg-marquee-track, .miles-split-track').forEach(track => {
      if (track.dataset.marqueeBound === '1' || !track.children.length) return;
      track.dataset.marqueeBound = '1';

      const duration = Number(track.dataset.duration || 38000);
      const reverse = track.dataset.reverse === '1';
      if (typeof track.animate === 'function') {
        const anim = track.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
          { duration, iterations: Infinity, easing: 'linear', direction: reverse ? 'reverse' : 'normal' }
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
      if (deck.dataset.deckBound === '1') return;
      deck.dataset.deckBound = '1';
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
    initOrbitBurst();
    initCountUp();
    initMarquees();
    initHotspots();
    initCategoryDeck();
  }

  global.GKM_MOTION = {
    initAll: initAllMotion,
    refreshReveals: initAllMotion
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllMotion);
  } else {
    initAllMotion();
  }
})(window);

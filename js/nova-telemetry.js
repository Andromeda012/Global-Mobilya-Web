// ============================================================================
// GLOBAL MOBİLYA & NOVA FURNITURE — B2C VİTRİN TELEMETRİ MODÜLÜ
// Faz 4: PostHog EU (Ürün, Koleksiyon, 3D Model & Teklif Hunisi Analitiği)
//        + Sentry EU (nova-b2c-web — JS & WebGL/3D Hata İzleme)
// ============================================================================

(function () {
  if (window.__NOVA_TELEMETRY_LOADED__) return;
  window.__NOVA_TELEMETRY_LOADED__ = true;

  const POSTHOG_KEY = 'phc_Crdjof4YyydPjfsUo7gSV6FrQRnbVZcY5ov85rfBqQNG';
  const POSTHOG_HOST = 'https://eu.i.posthog.com';
  const SENTRY_B2C_DSN = 'https://bc4bf8cf80c00fed21b340cef7474be4@o4512471153246208.ingest.de.sentry.io/4512471175331920';

  // ── 1. SENTRY EU (nova-b2c-web) ───────────────────────────────────────────
  (function initSentryB2C() {
    const s = document.createElement('script');
    s.src = 'https://browser.sentry-cdn.com/8.33.1/bundle.min.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => {
      if (window.Sentry && typeof window.Sentry.init === 'function') {
        window.Sentry.init({
          dsn: SENTRY_B2C_DSN,
          environment: 'production',
          integrations: []
        });
      }
    };
    document.head.appendChild(s);
  })();

  // ── 2. POSTHOG EU (Project #361931) ───────────────────────────────────────
  !(function (t, e) {
    var o, n, p, r;
    e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) {
      function g(t, e) {
        var o = e.split('.');
        2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      (p = t.createElement('script')).type = 'text/javascript', p.crossOrigin = 'anonymous', p.async = !0, p.src = s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js', (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
      var u = e;
      for (void 0 !== a ? u = e[a] = [] : a = 'posthog', u.people = u.people || [], u.toString = function (t) {
        var e = 'posthog';
        return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
      }, u.people.toString = function () { return u.toString(1) + '.people (stub)'; }, o = 'init capture register register_once unregister identify alias reset opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing'.split(' '), n = 0; n < o.length; n++) g(u, o[n]);
      e._i.push([i, s, a]);
    }, e.__SV = 1);
  })(document, window.posthog || []);

  window.posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true
  });

  function getUtmProps() {
    try {
      const p = new URLSearchParams(window.location.search);
      return {
        utm_source: p.get('utm_source') || undefined,
        utm_medium: p.get('utm_medium') || undefined,
        utm_campaign: p.get('utm_campaign') || undefined
      };
    } catch (_) {
      return {};
    }
  }

  function trackEvent(eventName, props = {}) {
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(eventName, {
          ...getUtmProps(),
          page_type: document.documentElement.dataset.page || window.location.pathname,
          ...props
        });
      }
    } catch (_) {}
  }

  function identifyClerkUser(clerkUser) {
    try {
      if (!clerkUser?.id || !window.posthog?.identify) return;
      const email = clerkUser.primaryEmailAddress?.emailAddress || undefined;
      const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() || undefined;
      window.posthog.identify(clerkUser.id, { email, name, channel: 'b2c_storefront' });
    } catch (_) {}
  }

  window.NOVA_TELEMETRY = {
    trackEvent,
    identifyClerkUser,
    captureError(err, context = {}) {
      try {
        if (window.Sentry?.captureException) {
          window.Sentry.captureException(err, { extra: context });
        }
      } catch (_) {}
    }
  };

  // ── 3. OTOMATİK KOLEKSİYON, ÜRÜN, 3D MODEL VE TEKLİF TAKİBİ ───────────────
  document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.documentElement.dataset.page || '';
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('id') || params.get('slug') || params.get('collection') || '';

    if (pageType === 'koleksiyon' || window.location.pathname.includes('koleksiyon')) {
      trackEvent('collection_viewed', {
        collection_slug: slug || 'all_collections',
        model_name: slug || 'Koleksiyonlar Showroom'
      });
    } else if (pageType === 'urun' || window.location.pathname.includes('urun')) {
      setTimeout(() => {
        const title = document.getElementById('prodTitle')?.textContent?.trim() || slug || document.title;
        trackEvent('product_viewed', {
          collection_slug: slug,
          model_name: title
        });
      }, 900);
    }

    // 3D <model-viewer> veya 3D canvas etkileşimlerini izle
    document.querySelectorAll('model-viewer, [data-3d-viewer]').forEach(mv => {
      let tracked3d = false;
      const onInteract = () => {
        if (tracked3d) return;
        tracked3d = true;
        trackEvent('3d_model_interacted', {
          model_name: mv.getAttribute('alt') || mv.getAttribute('src') || document.title,
          model_src: mv.getAttribute('src') || ''
        });
      };
      mv.addEventListener('pointerdown', onInteract, { passive: true });
      mv.addEventListener('camera-change', onInteract, { passive: true });
      mv.addEventListener('error', (ev) => {
        window.NOVA_TELEMETRY.captureError(new Error(`3D Model yükleme hatası: ${mv.getAttribute('src') || 'unknown'}`), {
          event: String(ev?.type || 'error')
        });
      });
    });

    // Teklif modalı açılışını izle
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-editorial-cta, .btn-editorial-gold, .nav-cta, [onclick*="openQuote"]');
      if (!btn) return;
      if ((btn.textContent || '').toLowerCase().includes('teklif') || (btn.textContent || '').toLowerCase().includes('fiyat')) {
        trackEvent('quote_modal_opened', {
          model_name: document.getElementById('prodTitle')?.textContent?.trim() || document.title
        });
      }
    });
  });
})();

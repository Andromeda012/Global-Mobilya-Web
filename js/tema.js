/**
 * Global Kapak Mobilya — Warm Architectural Luxury Tema Motoru
 * Tüm sayfalarda sıcak lüks renk paletini, tipografiyi, cam efektli navigasyonu,
 * kart animasyonlarını ve _data/ayarlar/tema.json yapılandırmasını uygular.
 */
(async function () {

  // ── 1. Google Fonts (Cormorant Garamond + Plus Jakarta Sans) Yükle ───────
  if (!document.getElementById('warm-luxury-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'warm-luxury-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontLink);
  }

  // ── 2. Global Warm Architectural Luxury Tasarım Sistemi CSS ─────────────
  if (!document.getElementById('warm-luxury-global-css')) {
    const style = document.createElement('style');
    style.id = 'warm-luxury-global-css';
    style.textContent = `
      :root {
        --navy: #2A1810 !important;
        --navy2: #46281B !important;
        --navy3: #B85D3B !important;
        --gold: #D49546 !important;
        --gold-light: #E8B872 !important;
        --terracotta: #C46238 !important;
        --cream: #FBF7F2 !important;
        --sand: #F3EAE0 !important;
        --white: #FFFDFB !important;
        --gray: #FBF7F2 !important;
        --border: #E8DDD1 !important;
        --text: #2B1E17 !important;
        --muted: #7A6558 !important;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        font-family: 'Plus Jakarta Sans', 'Open Sans', sans-serif !important;
        background-color: #FFFDFB;
        color: #2B1E17 !important;
        -webkit-font-smoothing: antialiased;
      }

      /* ── TOPBAR ── */
      .topbar {
        background: linear-gradient(90deg, #1A0E09 0%, #2E1A11 50%, #1A0E09 100%) !important;
        color: rgba(255, 246, 236, 0.85) !important;
        font-size: 12px !important;
        padding: 9px 40px !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        border-bottom: 1px solid rgba(212, 149, 70, 0.22);
        letter-spacing: 0.3px;
      }
      .topbar a {
        color: #F3C68F !important;
        margin-left: 18px;
        font-size: 12px;
        font-weight: 600;
        transition: color 0.2s;
      }
      .topbar a:hover {
        color: #FFFDFB !important;
      }

      /* ── GLASSMORPHIC NAVBAR ── */
      nav {
        background: rgba(255, 253, 251, 0.90) !important;
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        border-bottom: 1px solid rgba(212, 149, 70, 0.22) !important;
        padding: 0 36px !important;
        height: 76px !important;
        box-shadow: 0 10px 34px rgba(42, 24, 16, 0.06) !important;
        transition: all 0.3s ease;
      }
      nav.scrolled {
        background: rgba(255, 253, 251, 0.96) !important;
        box-shadow: 0 12px 38px rgba(42, 24, 16, 0.11) !important;
      }
      .nav-logo img {
        height: 50px !important;
        width: auto;
        transition: transform 0.25s ease;
      }
      .nav-logo:hover img {
        transform: scale(1.03);
      }
      .nav-menu {
        gap: 4px !important;
      }
      .nav-menu a {
        font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        letter-spacing: 0.5px !important;
        padding: 9px 14px !important;
        border-radius: 9px !important;
      }
      .nav-cta {
        background: linear-gradient(135deg, #C46238 0%, #D49546 100%) !important;
        color: #FFFDFB !important;
        font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif !important;
        font-size: 12.5px !important;
        font-weight: 700 !important;
        padding: 11px 22px !important;
        border-radius: 10px !important;
        box-shadow: 0 8px 20px rgba(196, 98, 56, 0.28) !important;
        transition: all 0.25s ease !important;
      }
      .nav-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 26px rgba(196, 98, 56, 0.42) !important;
      }

      /* ── BREADCRUMB ── */
      .breadcrumb {
        background: linear-gradient(90deg, #F8F1E8 0%, #FBF7F2 100%) !important;
        border-bottom: 1px solid #E8DDD1 !important;
        padding: 13px 40px !important;
        font-size: 12.5px !important;
        color: #7A6558 !important;
      }
      .breadcrumb a {
        color: #B85D3B !important;
        font-weight: 700 !important;
      }
      .breadcrumb strong {
        color: #2A1810 !important;
      }

      /* ── ALT SAYFA HERO BANNER (.page-hero) ── */
      .page-hero {
        background:
          radial-gradient(circle at 20% 20%, rgba(212, 149, 70, 0.26) 0%, transparent 48%),
          radial-gradient(circle at 82% 80%, rgba(196, 98, 56, 0.24) 0%, transparent 50%),
          linear-gradient(135deg, #21120B 0%, #3A2014 52%, #522D1C 100%) !important;
        padding: 72px 40px !important;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid rgba(212, 149, 70, 0.28);
      }
      .page-hero::before {
        content: '✦ GLOBAL KAPAK ATELIER ✦';
        display: inline-block;
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: 3px;
        color: #E8B872;
        background: rgba(212, 149, 70, 0.14);
        border: 1px solid rgba(212, 149, 70, 0.3);
        padding: 5px 14px;
        border-radius: 30px;
        margin-bottom: 14px;
      }
      .page-hero h1 {
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-size: clamp(34px, 4.5vw, 50px) !important;
        font-weight: 700 !important;
        color: #FFFDFB !important;
        letter-spacing: 0.3px;
        margin-bottom: 12px !important;
      }
      .page-hero p {
        color: rgba(255, 246, 236, 0.8) !important;
        font-size: 15.5px !important;
        max-width: 620px;
        margin: 0 auto;
        line-height: 1.75;
      }

      /* ── KARTLAR & FİLTRELER (Tüm Sayfalar) ── */
      .filter-btn {
        border-radius: 30px !important;
        padding: 9px 22px !important;
        border: 1.5px solid #E2D4C4 !important;
        background: #FFFDFB !important;
        color: #5C4438 !important;
        font-weight: 700 !important;
        transition: all 0.25s ease !important;
      }
      .filter-btn:hover, .filter-btn.active {
        background: linear-gradient(135deg, #2A1810 0%, #4A2A1B 100%) !important;
        color: #F3C68F !important;
        border-color: #2A1810 !important;
        box-shadow: 0 6px 18px rgba(42, 24, 16, 0.18);
      }

      .prod-card, .blog-card, .value-card, .sup-card, .cat-item, .qc-card, .cm-form, .content-box, .faq-item {
        background: #FFFDFB !important;
        border: 1px solid #E8DDD1 !important;
        border-radius: 16px !important;
        box-shadow: 0 8px 28px rgba(42, 24, 16, 0.05);
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      .prod-card:hover, .blog-card:hover, .value-card:hover, .sup-card:hover, .qc-card:hover {
        transform: translateY(-6px) !important;
        box-shadow: 0 20px 44px rgba(42, 24, 16, 0.13) !important;
        border-color: rgba(212, 149, 70, 0.55) !important;
      }

      .mv-card, .cta-bar, .partner-cta, .numbers {
        background: linear-gradient(135deg, #23140D 0%, #3D2216 100%) !important;
      }

      .btn-g, .btn-primary, .form-submit, .about-btn, .cta-section a, .cta-bar a, .partner-cta a {
        background: linear-gradient(135deg, #C46238 0%, #D49546 100%) !important;
        color: #FFFDFB !important;
        border-radius: 10px !important;
        box-shadow: 0 8px 22px rgba(196, 98, 56, 0.28);
        transition: all 0.28s ease !important;
      }
      .btn-g:hover, .btn-primary:hover, .form-submit:hover, .about-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(196, 98, 56, 0.42);
      }

      /* ── SCROLL REVEAL ANİMASYONU ── */
      .lux-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .lux-reveal.in-view {
        opacity: 1;
        transform: translateY(0);
      }

      @media(max-width: 768px) {
        .topbar { padding: 8px 16px !important; font-size: 11px !important; justify-content: center; text-align: center; }
        .topbar-right { display: none; }
        nav { padding: 0 18px !important; height: 68px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── 3. Navbar Scroll Efekti & IntersectionObserver Scroll Reveal ────────
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll('.sec-head, .about, .feat, .csr-inner, .value-card, .mv-card, .qc-card, .cat-item, .swatch-card, .craft-pillar');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach((el, idx) => {
      el.classList.add('lux-reveal');
      el.style.transitionDelay = `${(idx % 4) * 70}ms`;
      obs.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

  // ── 4. _data/ayarlar/tema.json Okuma (Sıcak Palet Korumalı) ─────────────
  try {
    const res = await fetch('/_data/ayarlar/tema.json');
    if (!res.ok) return;
    const t = await res.json();
    const r = document.documentElement.style;

    // Eski lacivert (#0B1F4B / #060E22) kalıntılarını sıcak espressoya çevir
    const warmSafe = (val, fallback) => {
      if (!val) return fallback;
      const v = String(val).toUpperCase();
      if (v.includes('0B1F4B') || v.includes('1A3A7A') || v.includes('060E22')) return fallback;
      return val;
    };

    if (t.renkler) {
      const c = t.renkler;
      r.setProperty('--navy',   warmSafe(c.ana_renk,   '#2A1810'));
      r.setProperty('--navy2',  warmSafe(c.ana_renk_2, '#46281B'));
      r.setProperty('--navy3',  warmSafe(c.ana_renk_3, '#B85D3B'));
      r.setProperty('--gold',   warmSafe(c.vurgu_renk, '#D49546'));
      r.setProperty('--gray',   warmSafe(c.arkaplan,   '#FBF7F2'));
      r.setProperty('--text',   warmSafe(c.metin,      '#2B1E17'));
      r.setProperty('--muted',  warmSafe(c.soluk_metin,'#7A6558'));
      r.setProperty('--border', warmSafe(c.sinir,      '#E8DDD1'));
    }
  } catch (e) {
    // tema.json yoksa sessizce geç
  }
})();

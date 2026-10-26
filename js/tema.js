/**
 * Global Kapak Mobilya — Nordic Blue, Slate Grey & Botanical Sage Tema Motoru
 * Tüm sayfalarda mavi, gri ve hafif doğa yeşili renk paletini, tipografiyi,
 * cam efektli navigasyonu ve kart animasyonlarını uygular.
 */
(async function () {

  // ── 1. Google Fonts (Cormorant Garamond + Plus Jakarta Sans) Yükle ───────
  if (!document.getElementById('nordic-luxury-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'nordic-luxury-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontLink);
  }

  // ── 2. Global Nordic Blue, Slate & Sage Tasarım Sistemi CSS ─────────────
  if (!document.getElementById('nordic-luxury-global-css')) {
    const style = document.createElement('style');
    style.id = 'nordic-luxury-global-css';
    style.textContent = `
      :root {
        --navy: #0F253E !important;
        --navy2: #1E3F66 !important;
        --navy3: #2E6F9E !important;
        --gold: #3B82A6 !important;
        --gold-light: #7CC2E6 !important;
        --sage: #4A7862 !important;
        --sage-light: #84A98C !important;
        --slate: #334155 !important;
        --white: #FFFFFF !important;
        --gray: #F4F7F9 !important;
        --sand: #E9EFF4 !important;
        --border: #DCE5ED !important;
        --text: #1E293B !important;
        --muted: #5B6B7C !important;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        font-family: 'Plus Jakarta Sans', 'Open Sans', sans-serif !important;
        background-color: #FFFFFF;
        color: #1E293B !important;
        -webkit-font-smoothing: antialiased;
      }

      /* ── TOPBAR ── */
      .topbar {
        background: linear-gradient(90deg, #091626 0%, #132C47 50%, #0D2329 100%) !important;
        color: rgba(235, 244, 250, 0.88) !important;
        font-size: 12px !important;
        padding: 9px 40px !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        border-bottom: 1px solid rgba(124, 194, 230, 0.18);
        letter-spacing: 0.3px;
      }
      .topbar a {
        color: #84D2F6 !important;
        margin-left: 18px;
        font-size: 12px;
        font-weight: 600;
        transition: color 0.2s;
      }
      .topbar a:hover {
        color: #FFFFFF !important;
      }

      /* ── GLASSMORPHIC NAVBAR ── */
      nav {
        background: rgba(255, 255, 255, 0.90) !important;
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        border-bottom: 1px solid rgba(59, 130, 166, 0.16) !important;
        padding: 0 36px !important;
        height: 76px !important;
        box-shadow: 0 10px 34px rgba(15, 37, 62, 0.06) !important;
        transition: all 0.3s ease;
      }
      nav.scrolled {
        background: rgba(255, 255, 255, 0.96) !important;
        box-shadow: 0 12px 38px rgba(15, 37, 62, 0.10) !important;
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
        background: linear-gradient(135deg, #1E3F66 0%, #2E6F9E 55%, #4A7862 100%) !important;
        color: #FFFFFF !important;
        font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif !important;
        font-size: 12.5px !important;
        font-weight: 700 !important;
        padding: 11px 22px !important;
        border-radius: 10px !important;
        box-shadow: 0 8px 20px rgba(30, 63, 102, 0.25) !important;
        transition: all 0.25s ease !important;
      }
      .nav-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 26px rgba(46, 111, 158, 0.38) !important;
      }

      /* ── BREADCRUMB ── */
      .breadcrumb {
        background: linear-gradient(90deg, #EEF3F7 0%, #F4F7F9 100%) !important;
        border-bottom: 1px solid #DCE5ED !important;
        padding: 13px 40px !important;
        font-size: 12.5px !important;
        color: #5B6B7C !important;
      }
      .breadcrumb a {
        color: #2E6F9E !important;
        font-weight: 700 !important;
      }
      .breadcrumb strong {
        color: #0F253E !important;
      }

      /* ── ALT SAYFA HERO BANNER (.page-hero) ── */
      .page-hero {
        background:
          radial-gradient(circle at 18% 20%, rgba(77, 166, 214, 0.24) 0%, transparent 48%),
          radial-gradient(circle at 82% 80%, rgba(74, 120, 98, 0.24) 0%, transparent 50%),
          linear-gradient(135deg, #0B1B2E 0%, #163352 52%, #1D3E42 100%) !important;
        padding: 72px 40px !important;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid rgba(124, 194, 230, 0.22);
      }
      .page-hero::before {
        content: '✦ GLOBAL KAPAK ATELIER ✦';
        display: inline-block;
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: 3px;
        color: #84D2F6;
        background: rgba(77, 166, 214, 0.14);
        border: 1px solid rgba(124, 194, 230, 0.3);
        padding: 5px 14px;
        border-radius: 30px;
        margin-bottom: 14px;
      }
      .page-hero h1 {
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-size: clamp(34px, 4.5vw, 50px) !important;
        font-weight: 700 !important;
        color: #FFFFFF !important;
        letter-spacing: 0.3px;
        margin-bottom: 12px !important;
      }
      .page-hero p {
        color: rgba(230, 240, 248, 0.82) !important;
        font-size: 15.5px !important;
        max-width: 620px;
        margin: 0 auto;
        line-height: 1.75;
      }

      /* ── KARTLAR & FİLTRELER (Tüm Sayfalar) ── */
      .filter-btn {
        border-radius: 30px !important;
        padding: 9px 22px !important;
        border: 1.5px solid #D3DFE9 !important;
        background: #FFFFFF !important;
        color: #475569 !important;
        font-weight: 700 !important;
        transition: all 0.25s ease !important;
      }
      .filter-btn:hover, .filter-btn.active {
        background: linear-gradient(135deg, #0F253E 0%, #1E4976 100%) !important;
        color: #FFFFFF !important;
        border-color: #0F253E !important;
        box-shadow: 0 6px 18px rgba(15, 37, 62, 0.18);
      }

      .prod-card, .blog-card, .value-card, .sup-card, .cat-item, .qc-card, .cm-form, .content-box, .faq-item {
        background: #FFFFFF !important;
        border: 1px solid #DCE5ED !important;
        border-radius: 16px !important;
        box-shadow: 0 8px 28px rgba(15, 37, 62, 0.05);
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      .prod-card:hover, .blog-card:hover, .value-card:hover, .sup-card:hover, .qc-card:hover {
        transform: translateY(-6px) !important;
        box-shadow: 0 20px 44px rgba(15, 37, 62, 0.12) !important;
        border-color: rgba(59, 130, 166, 0.55) !important;
      }

      .mv-card, .cta-bar, .partner-cta, .numbers {
        background: linear-gradient(135deg, #0C1E33 0%, #173756 60%, #1D3E38 100%) !important;
      }

      .btn-g, .btn-primary, .form-submit, .about-btn, .cta-section a, .cta-bar a, .partner-cta a {
        background: linear-gradient(135deg, #1E3F66 0%, #2E6F9E 55%, #4A7862 100%) !important;
        color: #FFFFFF !important;
        border-radius: 10px !important;
        box-shadow: 0 8px 22px rgba(30, 63, 102, 0.26);
        transition: all 0.28s ease !important;
      }
      .btn-g:hover, .btn-primary:hover, .form-submit:hover, .about-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(46, 111, 158, 0.40);
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
    const targets = document.querySelectorAll('.sec-head, .about, .feat, .csr-inner, .value-card, .mv-card, .qc-card, .cat-item, .swatch-card');
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

  // ── 4. _data/ayarlar/tema.json Okuma ────────────────────────────────────
  try {
    const res = await fetch('/_data/ayarlar/tema.json');
    if (!res.ok) return;
    const t = await res.json();
    const r = document.documentElement.style;
    if (t.renkler) {
      const c = t.renkler;
      if (c.ana_renk)    r.setProperty('--navy',   c.ana_renk);
      if (c.ana_renk_2)  r.setProperty('--navy2',  c.ana_renk_2);
      if (c.ana_renk_3)  r.setProperty('--navy3',  c.ana_renk_3);
      if (c.vurgu_renk)  r.setProperty('--gold',   c.vurgu_renk);
      if (c.arkaplan)    r.setProperty('--gray',   c.arkaplan);
      if (c.metin)       r.setProperty('--text',   c.metin);
      if (c.soluk_metin) r.setProperty('--muted',  c.soluk_metin);
      if (c.sinir)       r.setProperty('--border', c.sinir);
    }
  } catch (e) {}
})();

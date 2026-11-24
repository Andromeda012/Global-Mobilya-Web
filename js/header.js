/**
 * Global Mobilya — Floating Architectural Pill Header (Jiro H&G Showroom Pattern)
 * Renders across all B2C Showroom pages with glassmorphism, morphing mobile drawer,
 * active link detection, scroll transition, and live collection/product search overlay.
 */
(function () {
  const PAGE = document.documentElement.dataset.page || '';
  const DARK_SURFACE_PAGES = new Set(['home', 'koleksiyon', 'galeri', 'hakkimizda', 'iletisim', 'kvkk-ve-gizlilik', 'tekliflerim']);
  const isDarkSurface = DARK_SURFACE_PAGES.has(PAGE);

  function ensureHeaderCssLoaded() {
    if (!document.querySelector('link[href*="showroom-motion.css"]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = '/css/showroom-motion.css';
      document.head.appendChild(l);
    }
    if (!document.querySelector('link[href*="Instrument+Serif"]')) {
      const f = document.createElement('link');
      f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap';
      document.head.appendChild(f);
    }
  }

  function navClass(key) {
    return PAGE === key ? 'class="active"' : '';
  }

  function renderPillHeader() {
    const mount = document.getElementById('hgSiteHeader') || document.querySelector('header.site-header');
    if (!mount) return;

    const wrapper = document.createElement('header');
    wrapper.id = 'siteHeader';
    wrapper.className = 'hg-header-shell' + (isDarkSurface ? ' dark-surface' : '');
    wrapper.innerHTML = `
      <div class="hg-header-pill">
        <div class="hg-pill-top">
          <button type="button" class="hg-hamburger" id="hgHamburgerBtn" aria-label="Menüyü Aç/Kapat" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>

          <a href="/index.html" class="hg-brand-link" aria-label="Global Mobilya Ana Sayfa">
            <span class="hg-brand-mark">
              <img src="/resim/logo.png" alt="Global Mobilya" onerror="this.src='/resim/logo.png'">
            </span>
            <span class="hg-brand-wordmark">Global Mobilya</span>
          </a>

          <nav class="hg-nav-center" aria-label="Ana Menü">
            <a href="/index.html" ${navClass('home')}>Ana Sayfa</a>
            <div class="hg-nav-dropdown-wrap">
              <a href="/koleksiyon.html?kategori=Kahve%20K%C3%B6%C5%9Fesi%20Koleksiyonlar%C4%B1" ${navClass('koleksiyon')} aria-haspopup="true">Koleksiyonlar <span class="hg-caret" aria-hidden="true">▾</span></a>
              <div class="hg-nav-dropdown" role="menu" aria-label="Koleksiyon Kategorileri">
                <div class="hg-nav-dropdown-panel">
                  <a href="/koleksiyon.html?kategori=Kahve%20K%C3%B6%C5%9Fesi%20Koleksiyonlar%C4%B1" class="hg-nav-drop-item" role="menuitem">
                    <span>Kahve Köşesi Koleksiyonları</span>
                    <span class="hg-nav-drop-arrow">→</span>
                  </a>
                  <a href="/koleksiyon.html?kategori=Dolap%20Koleksiyonlar%C4%B1" class="hg-nav-drop-item" role="menuitem">
                    <span>Dolap Koleksiyonları</span>
                    <span class="hg-nav-drop-arrow">→</span>
                  </a>
                  <a href="/koleksiyon.html?kategori=Yatak%20Odas%C4%B1%20Koleksiyonlar%C4%B1" class="hg-nav-drop-item" role="menuitem">
                    <span>Yatak Odası Koleksiyonları</span>
                    <span class="hg-nav-drop-arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
            <div class="hg-nav-dropdown-wrap">
              <a href="/galeri.html" ${navClass('galeri')} aria-haspopup="true">Galeri <span class="hg-caret" aria-hidden="true">▾</span></a>
              <div class="hg-nav-dropdown" role="menu" aria-label="Galeri Kategorileri">
                <div class="hg-nav-dropdown-panel">
                  <a href="/galeri.html?kategori=Kahve%20K%C3%B6%C5%9Feleri" class="hg-nav-drop-item" role="menuitem">
                    <span>Kahve Köşeleri</span>
                    <span class="hg-nav-drop-arrow">→</span>
                  </a>
                  <a href="/galeri.html?kategori=Dolaplar" class="hg-nav-drop-item" role="menuitem">
                    <span>Dolaplar</span>
                    <span class="hg-nav-drop-arrow">→</span>
                  </a>
                  <a href="/galeri.html?kategori=Portmantolar" class="hg-nav-drop-item" role="menuitem">
                    <span>Portmantolar</span>
                    <span class="hg-nav-drop-arrow">→</span>
                  </a>
                  <a href="/galeri.html?kategori=%C5%9Eifonyerler" class="hg-nav-drop-item" role="menuitem">
                    <span>Şifonyerler</span>
                    <span class="hg-nav-drop-arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
            <a href="/iletisim.html" ${navClass('iletisim')}>İletişim</a>
            <a href="/hesabim/tekliflerim" ${navClass('tekliflerim')}>Tekliflerim</a>
            <a href="/kvkk-ve-gizlilik" ${navClass('kvkk-ve-gizlilik')} style="font-size:12px;opacity:0.82;">KVKK</a>
          </nav>

          <div class="hg-actions-right">
            <button type="button" class="hg-icon-circle" id="hgSearchOpenBtn" aria-label="Koleksiyon ve Ürün Ara" title="Koleksiyon / Ürün Ara">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
            </button>
            <a href="https://wa.me/905050151035?text=Merhaba%20Global%20Mobilya%2C%20mobilya%20koleksiyonlar%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener" class="hg-icon-circle primary-dark" aria-label="WhatsApp Mimari Danışma" title="WhatsApp Hattı">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </a>
            <a href="/koleksiyon.html?kategori=Kahve%20K%C3%B6%C5%9Fesi%20Koleksiyonlar%C4%B1" class="btn-hg-wipe">
              <span class="btn-hg-wipe-inner">
                <span class="btn-hg-wipe-row main">✦ Koleksiyonlar <span>→</span></span>
                <span class="btn-hg-wipe-row clone" aria-hidden="true">✦ Koleksiyonlar <span>→</span></span>
              </span>
            </a>
          </div>
        </div>

        <div class="hg-mobile-drawer" id="hgMobileDrawer">
          <div class="hg-mobile-drawer-inner">
            <ul class="hg-mobile-list">
              <li><a href="/index.html">Ana Sayfa <span class="arrow">→</span></a></li>
              <li><a href="/koleksiyon.html?kategori=Kahve%20K%C3%B6%C5%9Fesi%20Koleksiyonlar%C4%B1">Kahve Köşesi Koleksiyonları <span class="arrow">→</span></a></li>
              <li><a href="/koleksiyon.html?kategori=Dolap%20Koleksiyonlar%C4%B1">Dolap Koleksiyonları <span class="arrow">→</span></a></li>
              <li><a href="/koleksiyon.html?kategori=Yatak%20Odas%C4%B1%20Koleksiyonlar%C4%B1">Yatak Odası Koleksiyonları <span class="arrow">→</span></a></li>
              <li><a href="/galeri.html">Galeri — Tümü <span class="arrow">→</span></a></li>
              <li><a href="/galeri.html?kategori=Kahve%20K%C3%B6%C5%9Feleri">Galeri · Kahve Köşeleri <span class="arrow">→</span></a></li>
              <li><a href="/galeri.html?kategori=Dolaplar">Galeri · Dolaplar <span class="arrow">→</span></a></li>
              <li><a href="/galeri.html?kategori=Portmantolar">Galeri · Portmantolar <span class="arrow">→</span></a></li>
              <li><a href="/galeri.html?kategori=%C5%9Eifonyerler">Galeri · Şifonyerler <span class="arrow">→</span></a></li>
              <li><a href="/iletisim.html">İletişim &amp; Teklif <span class="arrow">→</span></a></li>
              <li><a href="/hesabim/tekliflerim">Tekliflerim (Müşteri Portalı) <span class="arrow">→</span></a></li>
              <li><a href="/kvkk-ve-gizlilik">KVKK &amp; Gizlilik <span class="arrow">→</span></a></li>
            </ul>
          </div>
        </div>
      </div>
    `;

    mount.replaceWith(wrapper);

    // Clean up any stale back-to-top button from earlier builds (footer.js provides #scrollTopLux)
    document.getElementById('hgBackTopBtn')?.remove();

    const burger = document.getElementById('hgHamburgerBtn');
    const drawer = document.getElementById('hgMobileDrawer');

    // Time-normalized (refresh-rate independent) 60/120fps rAF scroll glide across all pages
    const pillEl = wrapper.querySelector('.hg-header-pill');
    let currentProg = 0;
    let targetProg = 0;
    let rafId = 0;
    let lastTs = 0;
    let forceHidden = false;

    function applyHeaderFrame(p) {
      const clamped = Math.max(0, Math.min(1, p));
      const hidden = clamped > 0.985;
      wrapper.classList.toggle('hg-header-hidden', hidden);
      if (pillEl) {
        pillEl.style.pointerEvents = clamped > 0.72 ? 'none' : 'auto';
      }
      const yPx = (-112 * clamped).toFixed(2);
      const sc = (1 - 0.06 * clamped).toFixed(4);
      const op = Math.max(0, 1 - Math.pow(clamped, 1.35)).toFixed(3);
      wrapper.style.transform = `translate3d(0, ${yPx}px, 0) scale(${sc})`;
      wrapper.style.opacity = op;
    }

    function stepHeaderAnim(now) {
      const dt = lastTs ? Math.min(0.05, (now - lastTs) / 1000) : 0.016;
      lastTs = now;
      const diff = targetProg - currentProg;
      if (Math.abs(diff) < 0.002) {
        currentProg = targetProg;
        applyHeaderFrame(currentProg);
        rafId = 0;
        lastTs = 0;
        return;
      }
      const factor = 1 - Math.exp(-dt * 6.5);
      currentProg += diff * factor;
      applyHeaderFrame(currentProg);
      rafId = requestAnimationFrame(stepHeaderAnim);
    }

    const updateScroll = () => {
      const y = window.scrollY;
      wrapper.classList.toggle('scrolled', y > 10 || forceHidden);
      if (drawer?.classList.contains('open')) {
        targetProg = 0;
      } else if (forceHidden) {
        targetProg = 1;
      } else {
        targetProg = Math.max(0, Math.min(1, (y - 24) / 166));
      }
      if (!rafId) {
        lastTs = 0;
        rafId = requestAnimationFrame(stepHeaderAnim);
      }
    };

    window.GKM_HEADER = {
      setForceHidden(val) {
        forceHidden = Boolean(val);
        updateScroll();
      },
      isForceHidden() {
        return forceHidden;
      }
    };

    const initialTarget = Math.max(0, Math.min(1, (window.scrollY - 24) / 166));
    currentProg = initialTarget;
    targetProg = initialTarget;
    applyHeaderFrame(currentProg);
    window.addEventListener('scroll', updateScroll, { passive: true });

    // Mobile drawer morphing toggle
    burger?.addEventListener('click', () => {
      const next = !drawer.classList.contains('open');
      drawer.classList.toggle('open', next);
      burger.classList.toggle('open', next);
      burger.setAttribute('aria-expanded', String(next));
      updateScroll();
    });

    mountQuickSearchModal();
  }

  function mountQuickSearchModal() {
    if (document.getElementById('hgSearchBackdrop')) return;
    const modal = document.createElement('div');
    modal.id = 'hgSearchBackdrop';
    modal.className = 'hg-search-backdrop';
    modal.innerHTML = `
      <div class="hg-search-dialog" role="dialog" aria-modal="true" aria-label="Showroom Arama">
        <div class="hg-search-input-row">
          <input type="text" id="hgSearchInput" class="hg-search-input" placeholder="Koleksiyon veya bağımsız ürün ara (ör. Bergamo, Bohem, Dolap)..." autocomplete="off">
          <button type="button" id="hgSearchCloseBtn" style="width:42px;height:42px;border-radius:999px;border:1px solid rgba(42,41,37,0.16);background:#fff;cursor:pointer;font-size:16px;">✕</button>
        </div>
        <div class="hg-search-results" id="hgSearchResults">
          <div style="font-size:13px;color:#68635C;padding:8px 4px;">Aramak için yazmaya başlayın; tüm canlı koleksiyonlar ve bağımsız ürünler taranır.</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const openBtn = document.getElementById('hgSearchOpenBtn');
    const closeBtn = document.getElementById('hgSearchCloseBtn');
    const inputEl = document.getElementById('hgSearchInput');
    const resultsEl = document.getElementById('hgSearchResults');

    let cachedItems = null;
    async function ensureSearchData() {
      if (cachedItems) return cachedItems;
      const items = [];
      try {
        if (window.GKM_SUPABASE) {
          const [cols, prods] = await Promise.all([
            window.GKM_SUPABASE.getCollections().catch(() => []),
            window.GKM_SUPABASE.getProducts().catch(() => [])
          ]);
          (cols || []).forEach(c => items.push({
            type: c.category || 'Koleksiyon',
            title: c.name,
            img: c.hero_image_url || '/resim/showroom/luxury_showroom.jpg',
            href: `/koleksiyon.html?id=${encodeURIComponent(c.slug)}`
          }));
          (prods || []).forEach(p => items.push({
            type: p.kategori || 'Bağımsız Ürün',
            title: p.title || p.baslik,
            img: p.ana_resim || '/resim/logo.png',
            href: `/urun.html?id=${encodeURIComponent(p.slug)}`
          }));
        }
      } catch (_) {}
      cachedItems = items;
      return items;
    }

    async function renderSearch(q) {
      const list = await ensureSearchData();
      const term = String(q || '').trim().toLowerCase();
      const hits = term
        ? list.filter(i => (i.title + ' ' + i.type).toLowerCase().includes(term))
        : list.slice(0, 7);

      if (!hits.length) {
        resultsEl.innerHTML = '<div style="padding:18px;text-align:center;color:#68635C;font-size:13.5px;">Eşleşen koleksiyon veya ürün bulunamadı.</div>';
        return;
      }
      resultsEl.innerHTML = hits.slice(0, 10).map(h => `
        <a href="${h.href}" class="hg-search-hit">
          <img src="${h.img}" alt="${h.title}" onerror="this.src='/resim/logo.png'">
          <div style="min-width:0;flex:1;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#5E7462;">${h.type}</div>
            <div style="font-size:15px;font-weight:600;color:#2A2925;">${h.title}</div>
          </div>
          <span style="color:#5E7462;font-weight:700;">→</span>
        </a>
      `).join('');
    }

    openBtn?.addEventListener('click', () => {
      modal.classList.add('open');
      setTimeout(() => inputEl?.focus(), 60);
      renderSearch('');
    });
    closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
    inputEl?.addEventListener('input', (e) => renderSearch(e.target.value));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) modal.classList.remove('open');
    });
  }

  async function hydrateHeaderFromCms() {
    try {
      const cms = await window.GKM_SUPABASE?.getCmsBundle?.();
      const genel = cms?.genel;
      if (!genel) return;
      const cleanBrand = String(genel.firma?.ad || '').trim();
      if (cleanBrand && !/membran|mdf|kapak/i.test(cleanBrand)) {
        document.querySelectorAll('.hg-brand-wordmark').forEach((el) => { el.textContent = cleanBrand; });
      }
      if (genel.nav_cta?.yazi) {
        document.querySelectorAll('.hg-actions-right .hg-cta').forEach((a) => {
          a.textContent = genel.nav_cta.yazi;
          if (genel.nav_cta.link) a.href = genel.nav_cta.link;
        });
      }
      if (genel.firma?.logo && window.GKM_SUPABASE?.normalizeMediaUrl) {
        const logoUrl = window.GKM_SUPABASE.normalizeMediaUrl(genel.firma.logo, '/resim/logo.png');
        const safeLogo = logoUrl.startsWith('http') || logoUrl.startsWith('/') || logoUrl.startsWith('data:') ? logoUrl : '/' + logoUrl;
        document.querySelectorAll('.hg-brand-mark img').forEach((img) => { img.src = safeLogo; });
      }
      const waRaw = String(genel.iletisim?.whatsapp || '').replace(/\D/g, '');
      if (waRaw) {
        document.querySelectorAll('.hg-actions-right a[href*="wa.me"]').forEach((a) => {
          a.href = `https://wa.me/${waRaw}`;
        });
      }
    } catch (_) {}
  }

  ensureHeaderCssLoaded();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { renderPillHeader(); hydrateHeaderFromCms(); });
  } else {
    renderPillHeader();
    hydrateHeaderFromCms();
  }
})();

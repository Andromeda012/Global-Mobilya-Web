/**
 * Global Mobilya — Floating Architectural Pill Header (Jiro H&G Showroom Pattern)
 * Renders across all B2C Showroom pages with glassmorphism, morphing mobile drawer,
 * active link detection, scroll transition, and live collection/product search overlay.
 */
(function () {
  const PAGE = document.documentElement.dataset.page || '';
  const DARK_SURFACE_PAGES = new Set(['home', 'koleksiyon', 'galeri', 'hakkimizda', 'iletisim', 'kvkk-ve-gizlilik']);
  const isDarkSurface = DARK_SURFACE_PAGES.has(PAGE);

  function ensureHeaderCssLoaded() {
    if (!document.querySelector('link[href*="showroom-motion.css"]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'css/showroom-motion.css';
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

          <a href="index.html" class="hg-brand-link" aria-label="Global Mobilya Ana Sayfa">
            <span class="hg-brand-mark">
              <img src="resim/logo.png" alt="Global Mobilya" onerror="this.src='/resim/logo.png'">
            </span>
            <span class="hg-brand-wordmark">Global Mobilya</span>
          </a>

          <nav class="hg-nav-center" aria-label="Ana Menü">
            <a href="index.html" ${navClass('home')}>Ana Sayfa</a>
            <a href="koleksiyon.html" ${navClass('koleksiyon')}>Koleksiyonlar</a>
            <a href="galeri.html" ${navClass('galeri')}>Galeri</a>
            <a href="iletisim.html" ${navClass('iletisim')}>İletişim</a>
            <a href="/kvkk-ve-gizlilik" ${navClass('kvkk-ve-gizlilik')} style="font-size:12px;opacity:0.82;">KVKK</a>
          </nav>

          <div class="hg-actions-right">
            <button type="button" class="hg-icon-circle" id="hgSearchOpenBtn" aria-label="Koleksiyon ve Ürün Ara" title="Koleksiyon / Ürün Ara">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
            </button>
            <a href="https://wa.me/905050151035?text=Merhaba%20Global%20Mobilya%2C%20mobilya%20koleksiyonlar%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener" class="hg-icon-circle primary-dark" aria-label="WhatsApp Mimari Danışma" title="WhatsApp Hattı">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </a>
            <a href="koleksiyon.html" class="btn-hg-wipe">
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
              <li><a href="index.html">Ana Sayfa <span class="arrow">→</span></a></li>
              <li><a href="koleksiyon.html">Koleksiyonlar <span class="arrow">→</span></a></li>
              <li><a href="galeri.html">Galeri &amp; Bağımsız Ürünler <span class="arrow">→</span></a></li>
              <li><a href="iletisim.html">İletişim &amp; Teklif <span class="arrow">→</span></a></li>
              <li><a href="/kvkk-ve-gizlilik">KVKK &amp; Gizlilik <span class="arrow">→</span></a></li>
            </ul>
          </div>
        </div>
      </div>
    `;

    mount.replaceWith(wrapper);

    // Floating quick-return pill when scrolled into content
    let backTopBtn = document.getElementById('hgBackTopBtn');
    if (!backTopBtn) {
      backTopBtn = document.createElement('button');
      backTopBtn.id = 'hgBackTopBtn';
      backTopBtn.type = 'button';
      backTopBtn.className = 'hg-back-top-btn' + (isDarkSurface ? ' dark-surface' : '');
      backTopBtn.textContent = '↑ Menüye Dön';
      backTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      document.body.appendChild(backTopBtn);
    }

    const burger = document.getElementById('hgHamburgerBtn');
    const drawer = document.getElementById('hgMobileDrawer');

    // Continuous 60fps requestAnimationFrame scroll-damped glide for header exit & return
    const pillEl = wrapper.querySelector('.hg-header-pill');
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentProg = 0;
    let targetProg = 0;
    let rafId = 0;

    function applyHeaderFrame(p) {
      const clamped = Math.max(0, Math.min(1, p));
      const hidden = clamped > 0.985;
      wrapper.classList.toggle('hg-header-hidden', hidden);
      if (pillEl) {
        pillEl.style.pointerEvents = clamped > 0.72 ? 'none' : 'auto';
      }
      if (reducedMotion) {
        wrapper.style.transform = hidden ? 'translate3d(0, -110px, 0)' : 'translate3d(0, 0, 0)';
        wrapper.style.opacity = hidden ? '0' : '1';
      } else {
        const yPx = (-104 * clamped).toFixed(2);
        const sc = (1 - 0.06 * clamped).toFixed(4);
        const op = Math.max(0, 1 - Math.pow(clamped, 1.3)).toFixed(3);
        wrapper.style.transform = `translate3d(0, ${yPx}px, 0) scale(${sc})`;
        wrapper.style.opacity = op;
      }
      backTopBtn.classList.toggle('visible', window.scrollY > 180 && !drawer?.classList.contains('open'));
    }

    function stepHeaderAnim() {
      const diff = targetProg - currentProg;
      if (Math.abs(diff) < 0.002) {
        currentProg = targetProg;
        applyHeaderFrame(currentProg);
        rafId = 0;
        return;
      }
      currentProg += diff * 0.11;
      applyHeaderFrame(currentProg);
      rafId = requestAnimationFrame(stepHeaderAnim);
    }

    const updateScroll = () => {
      const y = window.scrollY;
      wrapper.classList.toggle('scrolled', y > 10);
      if (drawer?.classList.contains('open')) {
        targetProg = 0;
      } else {
        // Glides smoothly away from 24px -> 190px scroll, and glides back smoothly on return
        targetProg = Math.max(0, Math.min(1, (y - 24) / 166));
      }
      if (reducedMotion) {
        currentProg = targetProg;
        applyHeaderFrame(currentProg);
      } else if (!rafId) {
        rafId = requestAnimationFrame(stepHeaderAnim);
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
            img: c.hero_image_url || 'resim/showroom/luxury_showroom.jpg',
            href: `koleksiyon.html?id=${encodeURIComponent(c.slug)}`
          }));
          (prods || []).forEach(p => items.push({
            type: p.kategori || 'Bağımsız Ürün',
            title: p.title || p.baslik,
            img: p.ana_resim || 'resim/logo.png',
            href: `urun.html?id=${encodeURIComponent(p.slug)}`
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
          <img src="${h.img}" alt="${h.title}" onerror="this.src='resim/logo.png'">
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

  ensureHeaderCssLoaded();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPillHeader);
  } else {
    renderPillHeader();
  }
})();

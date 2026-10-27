/**
 * Global Kapak Mobilya — Genel İçerik Yükleyici & Supabase Bulut Senkronizasyonu
 * Önce Supabase Cloud Database (site_settings -> 'genel' ve 'anasayfa') üzerinden,
 * bağlantı yoksa _data/ayarlar/genel.json dosyasından navbar, topbar,
 * hakkımızda resmi, kurumsal tanıtım videosu ve diğer sabit içerikleri dinamik yükler.
 */
(async function () {

  // ── 0. Eğer GKM_SUPABASE henüz yüklenmediyse dinamik yükle ──
  if (!window.GKM_SUPABASE) {
    await new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'js/supabase-config.js';
      s.onload = resolve;
      s.onerror = resolve;
      document.head.appendChild(s);
    });
  }

  const normalizeMedia = (url, fallback) => {
    if (window.GKM_SUPABASE && typeof window.GKM_SUPABASE.normalizeMediaUrl === 'function') {
      return window.GKM_SUPABASE.normalizeMediaUrl(url, fallback);
    }
    if (!url) return fallback;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    return url.replace(/^\/+/, '');
  };

  // ── 1. Eğer sayfada .topbar yoksa, nav öncesine kurumsal topbar ekle ──
  const navEl = document.querySelector('nav');
  if (navEl && !document.querySelector('.topbar')) {
    const tb = document.createElement('div');
    tb.className = 'topbar';
    tb.innerHTML = `
      <span class="topbar-left">✦ 5 İş Gününde Teslimat  |  🛡️ 5 Yıl Üretici Garantisi  |  🌿 Doğa Dostu Üretim & Türkiye Geneli Sevkiyat</span>
      <div class="topbar-right">
        <a href="tel:05050151035">📞 0 (505) 015 1035</a>
        <a href="mailto:info@globalkapakmobilya.com">✉️ info@globalkapakmobilya.com</a>
      </div>
    `;
    navEl.parentNode.insertBefore(tb, navEl);
  }

  // ── 1b. Topbar ve Nav'ı tek bir sabit (sticky) üst panel içinde birleştir ──
  const topbarEl = document.querySelector('.topbar');
  if (navEl && topbarEl && !navEl.closest('.site-sticky-header')) {
    const stickyWrap = document.createElement('div');
    stickyWrap.className = 'site-sticky-header';
    topbarEl.parentNode.insertBefore(stickyWrap, topbarEl);
    stickyWrap.appendChild(topbarEl);
    stickyWrap.appendChild(navEl);
  }

  // ── 2. CSS: Sabit Üst Panel & Navbar aktif/hover link rengi ──
  const fixCSS = document.createElement('style');
  fixCSS.id = 'navbar-fix-css';
  fixCSS.textContent = `
    .site-sticky-header {
      position: sticky !important;
      top: 0 !important;
      z-index: 1000 !important;
      width: 100%;
    }
    .site-sticky-header .topbar {
      position: relative !important;
      z-index: 1001 !important;
    }
    .site-sticky-header nav {
      position: relative !important;
      top: 0 !important;
      z-index: 1000 !important;
    }
    .nav-menu a {
      color: var(--navy, #0F253E) !important;
      border-radius: 8px !important;
      padding: 8px 14px !important;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .nav-menu a:hover {
      background: rgba(59, 130, 166, 0.12) !important;
      color: #1E5680 !important;
    }
    .nav-menu a.active {
      background: linear-gradient(135deg, #0F253E 0%, #1E4976 100%) !important;
      color: #FFFFFF !important;
      box-shadow: 0 4px 14px rgba(15, 37, 62, 0.20) !important;
    }
  `;
  document.head.appendChild(fixCSS);

  // ── 3. Supabase veya genel.json yükle ──────────────────────────────────
  let genel = {};
  let anasayfaAyar = null;

  if (window.GKM_SUPABASE) {
    try {
      const [sbGenel, sbAnasayfa] = await Promise.all([
        window.GKM_SUPABASE.getSiteSetting('genel'),
        window.GKM_SUPABASE.getSiteSetting('anasayfa')
      ]);
      if (sbGenel && typeof sbGenel === 'object') genel = sbGenel;
      if (sbAnasayfa && typeof sbAnasayfa === 'object') anasayfaAyar = sbAnasayfa;
    } catch (e) {}
  }

  if (!genel || !genel.firma) {
    const paths = [
      '_data/ayarlar/genel.json',
      '/_data/ayarlar/genel.json'
    ];
    for (const p of paths) {
      try {
        const res = await fetch(p);
        if (res.ok) {
          const localGenel = await res.json();
          genel = Object.assign({}, localGenel, genel);
          break;
        }
      } catch(e) {}
    }
  }

  const firma    = genel.firma    || {};
  const iletisim = genel.iletisim || {};
  const sosyal   = genel.sosyal_medya || {};
  const topbarD  = genel.topbar   || {};
  const footerD  = genel.footer   || {};

  // ── TOPBAR ────────────────────────────────────────────────────────────
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    if (topbarD.aktif === false) {
      topbar.style.display = 'none';
    } else {
      const leftSpan = topbar.querySelector('.topbar-left') || topbar.firstElementChild;
      if (leftSpan && topbarD.metin) {
        leftSpan.textContent = topbarD.metin;
      }
      const tel   = iletisim.telefon  || '';
      const email = iletisim.email    || '';
      const rightEl = topbar.querySelector('.topbar-right');
      if (rightEl && (tel || email)) {
        rightEl.innerHTML =
          (tel   ? `<a href="tel:${tel.replace(/\s/g,'')}">📞 ${tel}</a>` : '') +
          (email ? `<a href="mailto:${email}">✉️ ${email}</a>` : '');
      }
    }
  }

  // ── NAVBAR: Logo ──────────────────────────────────────────────────────
  if (firma.logo) {
    const logoUrl = normalizeMedia(firma.logo, 'resim/logo.png');
    document.querySelectorAll('.nav-logo img').forEach(img => {
      img.src = logoUrl;
      img.alt = firma.ad || 'Global Kapak Mobilya';
    });
  }

  // ── NAVBAR: CTA Butonu ────────────────────────────────────────────────
  const navCta = genel.nav_cta || {};
  document.querySelectorAll('.nav-cta').forEach(btn => {
    if (navCta.yazi)  btn.textContent = navCta.yazi;
    if (navCta.link)  btn.href = navCta.link;
  });

  // ── ANASAYFA HERO VE HAKKIMIZDA (Supabase 'anasayfa' veya 'genel') ────
  if (anasayfaAyar) {
    const heroObj = anasayfaAyar.hero || anasayfaAyar;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && heroObj) {
      const tagEl = heroContent.querySelector('.hero-tag');
      const h1El  = heroContent.querySelector('h1');
      const pEl   = heroContent.querySelector('p');
      const tagText = heroObj.tag || heroObj.hero_etiket;
      const b1 = heroObj.baslik_1 || heroObj.hero_baslik_1;
      const b2 = heroObj.baslik_2 || heroObj.hero_baslik_2;
      const altYazi = heroObj.alt_yazi || heroObj.hero_aciklama;

      if (tagEl && tagText) tagEl.textContent = tagText;
      if (h1El && (b1 || b2)) {
        h1El.innerHTML = `${b1 || ''}<br><span>${b2 || ''}</span>`;
      }
      if (pEl && altYazi) pEl.textContent = altYazi;
    }
  }

  const aboutImg = document.getElementById('about-main-img') || document.querySelector('.about-img');
  const aboutData = Object.assign({}, genel.anasayfa_hakkimizda || {}, (anasayfaAyar && anasayfaAyar.anasayfa_hakkimizda) || {});

  if (aboutImg && aboutData.resim) {
    const rawImg = aboutData.resim.includes('anasayfa-hakkimizda')
      ? 'resim/yonetilen/atelier-craft.jpg'
      : aboutData.resim;
    const imgUrl = normalizeMedia(rawImg, 'resim/yonetilen/atelier-craft.jpg');
    aboutImg.style.backgroundImage = `url('${imgUrl}')`;
    aboutImg.style.backgroundSize = 'cover';
  }
  if (aboutData.etiket) {
    const tag = document.querySelector('.about-text .sec-tag');
    if (tag) tag.textContent = aboutData.etiket;
  }
  if (aboutData.baslik_1 || aboutData.baslik_2) {
    const h2 = document.querySelector('.about-text h2');
    if (h2 && aboutData.baslik_1) {
      h2.innerHTML = `${aboutData.baslik_1} <span>${aboutData.baslik_2 || ''}</span>`;
    }
  }
  if (aboutData.paragraf_1) {
    const paragraphs = document.querySelectorAll('.about-text p');
    const texts = [aboutData.paragraf_1, aboutData.paragraf_2, aboutData.paragraf_3].filter(Boolean);
    paragraphs.forEach((p, i) => { if (texts[i]) p.textContent = texts[i]; });
  }
  if (aboutData.buton_yazi) {
    const aboutBtn = document.querySelector('.about-btn');
    if (aboutBtn) {
      aboutBtn.textContent = aboutData.buton_yazi + ' →';
      if (aboutData.buton_link) aboutBtn.href = aboutData.buton_link;
    }
  }

  // ── KURUMSAL TANITIM VİDEOSU (Supabase Storage & site_settings) ───────
  const videoCfg = (anasayfaAyar && (anasayfaAyar.video || anasayfaAyar.kurumsal_video)) || genel.anasayfa_video || genel.kurumsal_video;
  const videoSec = document.getElementById('corporateVideoSection');
  const videoUrlRaw = videoCfg ? (videoCfg.video_url || videoCfg.harici_url || videoCfg.url || '') : '';
  if (videoSec && videoCfg && videoCfg.aktif !== false && videoUrlRaw) {
    videoSec.style.display = 'block';
    const vTitle = document.getElementById('corpVideoTitle');
    const vSub   = document.getElementById('corpVideoSub');
    const vWrap  = document.getElementById('corpVideoPlayerWrap');
    if (vTitle && videoCfg.baslik) vTitle.textContent = videoCfg.baslik;
    if (vSub && (videoCfg.aciklama || videoCfg.alt_baslik)) vSub.textContent = videoCfg.aciklama || videoCfg.alt_baslik;
    if (vWrap) {
      const url = normalizeMedia(videoUrlRaw.trim(), '');
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let vidId = '';
        if (url.includes('youtu.be/')) vidId = url.split('youtu.be/')[1].split(/[?&]/)[0];
        else if (url.includes('v=')) vidId = url.split('v=')[1].split(/[?&]/)[0];
        else if (url.includes('embed/')) vidId = url.split('embed/')[1].split(/[?&]/)[0];
        if (vidId) {
          vWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${vidId}?rel=0" style="width:100%;aspect-ratio:16/9;border:0;border-radius:20px;box-shadow:0 24px 60px rgba(15,37,62,0.28);" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
      } else if (url) {
        const autoAttr = videoCfg.otomatik_oynat ? 'autoplay' : '';
        const muteAttr = (videoCfg.sessiz !== false) ? 'muted' : '';
        const loopAttr = (videoCfg.dongu !== false) ? 'loop' : '';
        vWrap.innerHTML = `<video src="${url}" controls playsinline ${autoAttr} ${muteAttr} ${loopAttr} style="width:100%;max-height:600px;border-radius:20px;background:#091526;box-shadow:0 24px 60px rgba(15,37,62,0.28);display:block;"></video>`;
      }
    }
  }

  // ── STATS BAR ────────────────────────────────────────────────────────
  const stats = (anasayfaAyar && anasayfaAyar.stats) || genel.stats || [];
  if (stats.length > 0) {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, i) => {
      if (stats[i]) {
        const n = item.querySelector('.stat-n');
        const l = item.querySelector('.stat-l');
        if (n) n.textContent = stats[i].sayi;
        if (l) l.textContent = stats[i].etiket;
      }
    });
  }

  // ── HAKKIMIZDA SAYFASI RESMİ ──────────────────────────────────────────
  const aboutBig = document.querySelector('.about-img-big');
  const hakkiData = genel.hakkimizda_resim || {};
  if (aboutBig) {
    const useImg = (hakkiData.resim && !hakkiData.resim.includes('logo.png'))
      ? normalizeMedia(hakkiData.resim, 'resim/yonetilen/atelier-craft.jpg')
      : 'resim/yonetilen/atelier-craft.jpg';
    aboutBig.style.backgroundImage = `url('${useImg}')`;
    aboutBig.style.backgroundSize  = 'cover';
    aboutBig.style.backgroundRepeat = 'no-repeat';
    aboutBig.style.backgroundPosition = 'center';
  }

  // ── FOOTER SENKRONİZASYONU ────────────────────────────────────────────
  setTimeout(() => {
    const footerBrandP = document.querySelector('footer .footer-brand p');
    if (footerBrandP && footerD.tanitim_metni) {
      footerBrandP.textContent = footerD.tanitim_metni;
    }
    const footerBrandName = document.querySelector('footer .f-brand-name');
    if (footerBrandName && firma.ad) {
      footerBrandName.textContent = firma.ad;
    }
    const footerLinks = document.querySelectorAll('footer .footer-col a');
    footerLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('tel:') && iletisim.telefon) {
        link.href = 'tel:' + iletisim.telefon.replace(/\s/g,'');
        link.textContent = '📞 ' + iletisim.telefon;
      }
      if (href.startsWith('mailto:') && iletisim.email) {
        link.href = 'mailto:' + iletisim.email;
        link.textContent = '✉️ ' + iletisim.email;
      }
    });

    const socials = document.querySelectorAll('footer .f-socials a');
    const wa2 = iletisim.whatsapp;
    if (socials[2] && wa2) socials[2].href = 'https://wa.me/' + wa2;
    if (socials[0] && sosyal.instagram) socials[0].href = sosyal.instagram;
    if (socials[1] && sosyal.facebook)  socials[1].href = sosyal.facebook;
  }, 500);

})();

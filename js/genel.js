/**
 * Global Kapak Mobilya — Genel İçerik Yükleyici & Nordic Blue-Slate-Sage Header
 * _data/ayarlar/genel.json dosyasından navbar, topbar,
 * hakkımızda resmi ve diğer sabit içerikleri dinamik yükler.
 */
(async function () {

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

  // ── 2. CSS: Navbar aktif/hover link rengi (Mavi, Gri & Doğal Yeşil Palet) ──
  const fixCSS = document.createElement('style');
  fixCSS.id = 'navbar-fix-css';
  fixCSS.textContent = `
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

  // ── 3. genel.json yükle ────────────────────────────────────────────────
  let genel = {};
  const REPO = 'emrecanaksoyea34-a11y/global-kapak-mobilyaa';
  const paths = [
    '_data/ayarlar/genel.json',
    '/_data/ayarlar/genel.json'
  ];
  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (res.ok) { genel = await res.json(); break; }
    } catch(e) {}
  }
  if (!genel.firma) {
    try {
      const raw = await fetch(`https://raw.githubusercontent.com/${REPO}/main/_data/ayarlar/genel.json`);
      if (raw.ok) genel = await raw.json();
    } catch(e) {}
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
    document.querySelectorAll('.nav-logo img').forEach(img => {
      img.src = firma.logo;
      img.alt = firma.ad || 'Global Kapak Mobilya';
    });
  }

  // ── NAVBAR: CTA Butonu ────────────────────────────────────────────────
  const navCta = genel.nav_cta || {};
  document.querySelectorAll('.nav-cta').forEach(btn => {
    if (navCta.yazi)  btn.textContent = navCta.yazi;
    if (navCta.link)  btn.href = navCta.link;
  });

  // ── ANASAYFADAKİ HAKKIMIZDA RESMİ ────────────────────────────────────
  const aboutImg = document.getElementById('about-main-img') || document.querySelector('.about-img');
  const aboutData = genel.anasayfa_hakkimizda || {};
  if (aboutImg && aboutData.resim) {
    const imgUrl = aboutData.resim.includes('anasayfa-hakkimizda')
      ? 'resim/yonetilen/atelier-craft.jpg'
      : aboutData.resim;
    aboutImg.style.backgroundImage = `url('${imgUrl}')`;
    if (imgUrl.includes('atelier-craft')) {
      aboutImg.style.backgroundSize = 'cover';
    }
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

  // ── STATS BAR ────────────────────────────────────────────────────────
  const stats = genel.stats || [];
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
      ? hakkiData.resim
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

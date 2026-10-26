/**
 * Global Kapak Mobilya — Dinamik Nordic Blue, Slate & Sage Luxury Footer
 * Tüm sayfalarda bu dosya include edilir, footer ve sabit iletişim araçları otomatik eklenir.
 */

(function () {
  const FOOTER_HTML = `
<footer>
  <div class="footer-cta-banner">
    <div class="footer-cta-inner">
      <div class="footer-cta-text">
        <span class="footer-cta-tag">✦ MİMARİ PROJE & ÖZEL ÖLÇÜ İMALAT</span>
        <h3>Hayalinizdeki Kapak Tasarımını Birlikte Üretelim</h3>
        <p>2.000 m² modern CNC üretim tesisimizde, projenize özel ölçü ve renk seçenekleriyle 5 iş gününde teslimat.</p>
      </div>
      <div class="footer-cta-actions">
        <a href="iletisim.html" class="f-btn-primary">Hemen Teklif Alın →</a>
        <a href="https://wa.me/905050151035" target="_blank" class="f-btn-wa">WhatsApp Hattı</a>
      </div>
    </div>
  </div>
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="f-logo-wrap">
        <img src="resim/logo.png" alt="Global Kapak Mobilya" style="height:76px;width:auto;background:#FFFFFF;padding:8px 12px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.25);">
      </div>
      <div class="f-brand-name">Global Kapak Mobilya</div>
      <p>Membran kapak üretiminde uzman kadromuz ve modern CNC parkurumuzla mekanlarınıza modern mimari, doğallık ve zamansız estetik katıyoruz.</p>
      <div class="f-badges">
        <span>🛡️ 5 Yıl Garanti</span>
        <span>🌿 Doğa Dostu Üretim</span>
        <span>⚡ 5 İş Günü Teslimat</span>
      </div>
      <div class="f-socials">
        <a href="https://instagram.com" target="_blank" aria-label="Instagram">
          <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
        <a href="https://facebook.com" target="_blank" aria-label="Facebook">
          <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="https://wa.me/905050151035" target="_blank" aria-label="WhatsApp">
          <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Kurumsal Menü</h4>
      <a href="index.html">Anasayfa</a>
      <a href="urunler.html">Ürünlerimiz</a>
      <a href="hakkimizda.html">Hakkımızda</a>
      <a href="galeri.html">Proje Galerisi</a>
      <a href="tedarikcilerimiz.html">Tedarikçilerimiz</a>
      <a href="blog.html">Blog & Rehber</a>
      <a href="iletisim.html">İletişim</a>
    </div>
    <div class="footer-col">
      <h4>Koleksiyonlar</h4>
      <a href="urunler.html">Düz Membran Kapak</a>
      <a href="urunler.html">Çerçeveli Klasik Kapak</a>
      <a href="urunler.html">CNC Derzli & Fluted Kapak</a>
      <a href="urunler.html">Özel Ölçü Mimari Üretim</a>
      <a href="takip.html">Sipariş Durum Sorgulama</a>
    </div>
    <div class="footer-col">
      <h4>Fabrika & İletişim</h4>
      <a href="tel:05050151035">📞 0 (505) 015 1035</a>
      <a href="mailto:info@globalkapakmobilya.com">✉️ info@globalkapakmobilya.com</a>
      <a href="iletisim.html">📍 Yalçın Koreş Cad. Bağlar Mah. No:6B<br>Bağcılar / İstanbul, Türkiye</a>
      <div class="f-hours">🕒 Pzt - Cmt: 08:00 – 18:00</div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 Global Kapak Mobilya — Tüm hakları saklıdır. | <a href="kvkk.html" style="color:#7CC2E6;text-decoration:none;">KVKK Aydınlatma Metni</a></p>
    <div class="f-craft-note">İstanbul Fabrika İmalatı • %100 Yerli & Doğa Dostu Üretim</div>
    <div class="socials" style="display:none"></div>
  </div>
</footer>
`;

  const FOOTER_CSS = `
<style id="footer-dynamic-css">
footer {
  background: radial-gradient(circle at 18% 0%, rgba(59, 130, 166, 0.18) 0%, transparent 50%),
              radial-gradient(circle at 85% 100%, rgba(74, 120, 98, 0.15) 0%, transparent 50%),
              linear-gradient(180deg, #0B192C 0%, #07111E 100%) !important;
  padding: 0 40px 32px !important;
  color: rgba(226, 236, 245, 0.72);
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(124, 194, 230, 0.20);
}
.footer-cta-banner {
  max-width: 1180px;
  margin: 0 auto 56px;
  padding-top: 52px;
}
.footer-cta-inner {
  background: linear-gradient(135deg, rgba(30, 63, 102, 0.55) 0%, rgba(59, 130, 166, 0.25) 55%, rgba(74, 120, 98, 0.28) 100%);
  border: 1px solid rgba(124, 194, 230, 0.28);
  border-radius: 20px;
  padding: 36px 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
}
.footer-cta-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: #84D2F6;
  margin-bottom: 8px;
  font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif;
}
.footer-cta-text h3 {
  font-family: 'Cormorant Garamond', Georgia, serif !important;
  font-size: 32px !important;
  font-weight: 700 !important;
  color: #FFFFFF !important;
  margin-bottom: 6px;
  line-height: 1.2;
}
.footer-cta-text p {
  font-size: 14px;
  color: rgba(226, 236, 245, 0.76);
  max-width: 580px;
  line-height: 1.65;
}
.footer-cta-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.f-btn-primary {
  background: linear-gradient(135deg, #2B6CB0 0%, #3B82A6 55%, #4A7862 100%);
  color: #FFFFFF !important;
  padding: 14px 26px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(43, 108, 176, 0.35);
  transition: all 0.3s ease;
}
.f-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(59, 130, 166, 0.5);
}
.f-btn-wa {
  background: rgba(255, 255, 255, 0.07);
  color: #FFFFFF !important;
  border: 1px solid rgba(124, 194, 230, 0.35);
  padding: 14px 22px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}
.f-btn-wa:hover {
  background: rgba(74, 120, 98, 0.32);
  border-color: #84A98C;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1.2fr;
  gap: 44px;
  max-width: 1180px;
  margin: 0 auto 44px;
}
.f-logo-wrap {
  margin-bottom: 16px;
}
.f-brand-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin-bottom: 10px;
}
.footer-brand p {
  font-size: 13.5px;
  color: rgba(226, 236, 245, 0.64);
  line-height: 1.8;
  margin-bottom: 16px;
}
.f-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.f-badges span {
  font-size: 11px;
  font-weight: 600;
  color: #A5D8F3;
  background: rgba(59, 130, 166, 0.14);
  border: 1px solid rgba(124, 194, 230, 0.24);
  padding: 5px 11px;
  border-radius: 30px;
}
.f-socials {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}
.f-socials a {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(124, 194, 230, 0.25);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(226, 236, 245, 0.72);
  transition: all 0.25s ease;
}
.f-socials a:hover {
  border-color: #7CC2E6;
  background: linear-gradient(135deg, #2B6CB0, #4A7862);
  color: #fff;
  transform: translateY(-3px);
}
.f-socials svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
}
.footer-col h4 {
  font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  color: #7CC2E6 !important;
  letter-spacing: 2.2px;
  text-transform: uppercase;
  margin-bottom: 18px;
  position: relative;
  padding-bottom: 10px;
}
.footer-col h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 28px;
  height: 2px;
  background: linear-gradient(90deg, #3B82A6, #6B9080);
  border-radius: 2px;
}
.footer-col a {
  display: block;
  font-size: 13.5px;
  color: rgba(226, 236, 245, 0.66) !important;
  margin-bottom: 11px;
  transition: all 0.22s ease;
  text-decoration: none;
}
.footer-col a:hover {
  color: #84D2F6 !important;
  transform: translateX(4px);
}
.f-hours {
  margin-top: 12px;
  font-size: 12px;
  color: #98D4B8;
  background: rgba(74, 120, 98, 0.18);
  border: 1px solid rgba(132, 169, 140, 0.25);
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
}
.footer-bottom {
  border-top: 1px solid rgba(124, 194, 230, 0.14);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1180px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 12px;
}
.footer-bottom p, .f-craft-note {
  font-size: 12.5px;
  color: rgba(226, 236, 245, 0.45);
}
/* Sabit WhatsApp & Yukarı Çık Butonları */
.wa-concierge-float {
  position: fixed;
  bottom: 26px;
  right: 26px;
  z-index: 9990;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #2D6A4F 0%, #40916C 100%);
  color: #fff !important;
  padding: 13px 20px;
  border-radius: 50px;
  box-shadow: 0 12px 32px rgba(45, 106, 79, 0.38);
  text-decoration: none;
  font-family: 'Plus Jakarta Sans', 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255,255,255,0.25);
}
.wa-concierge-float:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 18px 40px rgba(64, 145, 108, 0.52);
}
.wa-concierge-float svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
  flex-shrink: 0;
}
.scroll-top-lux {
  position: fixed;
  bottom: 86px;
  right: 28px;
  z-index: 9989;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0F253E, #1E3F66);
  color: #7CC2E6;
  border: 1px solid rgba(124, 194, 230, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(15, 37, 62, 0.3);
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: all 0.3s ease;
}
.scroll-top-lux.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.scroll-top-lux:hover {
  background: linear-gradient(135deg, #2E6F9E, #4A7862);
  color: #fff;
  transform: translateY(-3px);
}
@media(max-width:1024px){
  .footer-grid{grid-template-columns:repeat(2,1fr);}
  .footer-cta-inner{padding:28px;}
}
@media(max-width:600px){
  footer{padding:0 20px 24px !important;}
  .footer-grid{grid-template-columns:1fr;gap:28px;}
  .footer-cta-inner{padding:24px 20px;text-align:center;justify-content:center;}
  .footer-cta-text h3{font-size:25px !important;}
  .wa-concierge-float span{display:none;}
  .wa-concierge-float{padding:14px;border-radius:50%;}
}
</style>
`;

  if (!document.getElementById('footer-dynamic-css')) {
    document.head.insertAdjacentHTML('beforeend', FOOTER_CSS);
  }

  const existing = document.querySelector('footer');
  if (existing) {
    existing.outerHTML = FOOTER_HTML;
  } else {
    document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
  }

  if (!document.querySelector('.wa-concierge-float') && !document.querySelector('.whatsapp-float')) {
    const floatHTML = `
      <a href="https://wa.me/905050151035" class="wa-concierge-float" target="_blank" aria-label="WhatsApp ile Hızlı Teklif">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span>Hızlı Teklif Hattı</span>
      </a>
      <button class="scroll-top-lux" id="scrollTopLux" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Yukarı çık">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
    `;
    document.body.insertAdjacentHTML('beforeend', floatHTML);
    window.addEventListener('scroll', function() {
      const btn = document.getElementById('scrollTopLux');
      if (btn) btn.classList.toggle('visible', window.scrollY > 360);
    }, { passive: true });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('footer .footer-col a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.style.color = '#7CC2E6';
      link.style.fontWeight = '700';
    }
  });
})();

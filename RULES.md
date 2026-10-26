# Global Kapak Mobilya — Proje & Kodlama Kuralları (Project Memory)

Bu belge, **Global Kapak Mobilya** (`https://globalkapakmobilya.com`) projesinin kurumsal kimliğini, tasarım standartlarını ve teknik mimarisini tanımlar. Tüm geliştirmelerde bu standartlar esas alınır.

---

## 🎨 1. Kurumsal Tasarım & Renk Standartları (Warm Architectural Luxury)
* **Birincil Renk (Espresso Ceviz & Kestane):** `#2A1810` (`--navy`), `#46281B` (`--navy2`), `#B85D3B` (`--navy3` / Terracotta Sienna)
* **Vurgu Rengi (Şampanya Kehribar & Terracotta):** `#D49546` (`--gold`), `#E8B872` (`--gold-light`), `#C46238` (`--terracotta`)
* **Arka Plan & Sıcak Nötrler:** `#FFFDFB` (`--white` / Fildişi), `#FBF7F2` (`--gray` / Kaşmir Krem), `#F3EAE0` (`--sand` / Traverten), `#E8DDD1` (`--border`)
* **Yazı Tipleri:**
  - Sergileme ve Ana Başlıklar: `'Cormorant Garamond', Georgia, serif`
  - Alt Başlıklar, Butonlar ve UI: `'Plus Jakarta Sans', 'Montserrat', sans-serif`
  - Gövde Metinleri: `'Plus Jakarta Sans', 'Open Sans', sans-serif`

---

## 🏗️ 2. Veri Mimarisi & Yönetim Paneli Kuralları
* **Dinamik Veri Yolları:**
  - Genel ve Hakkımızda Ayarları: `_data/ayarlar/genel.json`
  - Ana Sayfa Manşet & Hero: `_data/ayarlar/anasayfa.json`
  - Ürünler & İndeks: `_data/urunler/{slug}.json` ve `_data/urunler-index.json`
  - Blog & İndeks: `_data/blog/{slug}.json` ve `_data/blog-index.json`
  - Tedarikçiler & İndeks: `_data/tedarikciler/{slug}.json` ve `_data/tedarikciler-index.json`
  - Galeri: `_data/galeri.json`
* **Admin Panelleri Senkronizasyonu:** `admin/index.html` ile `admin/urunler.html` her zaman **%100 özdeş** ve eşit tutulmalıdır. Biri güncellendiğinde diğeri mutlaka kopyalanarak eşitlenir.

---

## 🔍 3. SEO & Arama Motoru Standartları
* **Favicon & İkonlar:** Tüm HTML sayfalarında `favicon.ico`, `32x32`, `192x192`, `apple-touch-icon` ve `site.webmanifest` bulunmalıdır.
* **Kanonik URL:** Her sayfada `https://globalkapakmobilya.com/{sayfa}.html` kanonik bağlantısı tanımlanmalıdır.
* **Yapısal Veri (Schema.org):**
  - Kurumsal / İletişim / Ana Sayfa: `Organization`, `LocalBusiness`, `FAQPage`, `WebSite`
  - Ürün Sayfaları: `BreadcrumbList`, `Product`
  - Blog Sayfaları: `Article`, `BreadcrumbList`
* **Site Haritası:** Yeni sayfa eklendiğinde `sitemap.xml` güncellenmelidir.

---

## 📍 4. Sabit Firma & İletişim Bilgileri
* **Firma Adı:** Global Kapak Mobilya (Membran Kapak İmalatı)
* **Telefon / WhatsApp:** `0 (505) 015 1035` (`+905050151035`)
* **Adres:** Yalçın Koreş Cad. Bağlar Mah. No:6B Bağcılar / İstanbul
* **Garanti & Teslimat:** 5 Yıl Üretici Garantisi, 5 İş Gününde Teslimat

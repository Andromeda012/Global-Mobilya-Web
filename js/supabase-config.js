/**
 * Global Kapak Mobilya — Supabase Cloud Database & Storage İstemcisi
 * Ürünler, tedarikçiler, galeri, blog, firma ayarları ve kurumsal videoları
 * doğrudan Supabase PostgreSQL REST API (no-store, sıfır önbellek) ve Supabase Storage'dan yükler.
 */
(function () {
  const DEFAULT_SUPABASE_URL = 'https://vrfujrpsjzqjthaqdalx.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZnVqcnBzanpxanRoYXFkYWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwOTcxMzQsImV4cCI6MjEwODY3MzEzNH0.P427jKJ8YX7wGvhK1mBwD2-vuOluvSm8QfVWpwAgQl4';

  // URL parametrelerinden (?sb_url=...&sb_key=...) gelen bağlantıyı otomatik kaydet
  try {
    const params = new URLSearchParams(window.location.search);
    const paramUrl = params.get('sb_url');
    const paramKey = params.get('sb_key');
    if (paramUrl && paramKey) {
      localStorage.setItem('gkm_supabase_url', paramUrl.trim().replace(/\/+$/, ''));
      localStorage.setItem('gkm_supabase_key', paramKey.trim());
      params.delete('sb_url');
      params.delete('sb_key');
      const newSearch = params.toString();
      const cleanUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (e) {}

  // Varsayılan Supabase bağlantısını her tarayıcıda garantile
  try {
    const storedUrl = (localStorage.getItem('gkm_supabase_url') || '').trim();
    const storedKey = (localStorage.getItem('gkm_supabase_key') || '').trim();
    if (!storedUrl || !storedKey || storedUrl.includes('gfxcnmpfksxghbmtvows')) {
      localStorage.setItem('gkm_supabase_url', DEFAULT_SUPABASE_URL);
      localStorage.setItem('gkm_supabase_key', DEFAULT_SUPABASE_ANON_KEY);
    }
  } catch (e) {}

  function getCredentials() {
    let url = DEFAULT_SUPABASE_URL;
    let key = DEFAULT_SUPABASE_ANON_KEY;
    try {
      const u = (localStorage.getItem('gkm_supabase_url') || '').trim();
      const k = (localStorage.getItem('gkm_supabase_key') || '').trim();
      if (u && k && !u.includes('gfxcnmpfksxghbmtvows')) {
        url = u.replace(/\/+$/, '');
        key = k;
      }
    } catch (e) {}
    return { url, key };
  }

  function normalizeMediaUrl(url, fallback = 'resim/logo.png') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    if (!trimmed) return fallback;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
      return trimmed;
    }
    return trimmed.replace(/^\/+/, '');
  }

  async function restSelect(tableAndQuery) {
    const { url, key } = getCredentials();
    if (!url || !key) return null;
    try {
      const res = await fetch(`${url}/rest/v1/${tableAndQuery}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('Supabase REST hatası:', err);
      return null;
    }
  }

  async function restInsert(table, body) {
    const { url, key } = getCredentials();
    if (!url || !key) return null;
    try {
      const res = await fetch(`${url}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const txt = await res.text();
        console.warn('Supabase restInsert rejected:', res.status, txt);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error('Supabase restInsert error:', err);
      return null;
    }
  }

  // 8 Yatak Odası Koleksiyonu (Prototip Tanımları - DB Fallback)
  const FALLBACK_COLLECTIONS = [
    {
      slug: 'siena-yatak-odasi',
      name: 'Siena Yatak Odası Koleksiyonu',
      category: 'Yatak Odası',
      design_story: 'Toskana mimarisinin sıcak toprak tonları, ipek mat kaşmir yüzeyler ve CNC dikey çıta detaylarıyla bütünleşen rafine bir dinlenme alanı.',
      architecture_style: 'Modern İtalyan Minimalizm',
      color_palette: ['İpek Kaşmir', 'Doğal Meşe', 'Mat Bronz', 'Fildişi'],
      hero_image_url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85',
      pieces: [
        { name: 'Siena 6 Kapaklı Akordeon Gardırop', dimensions: '260 × 220 × 60 cm', material: '18mm E1 MDF, Füme Cam & LED' },
        { name: 'Siena Baza & Yatak Başlığı (160×200)', dimensions: '175 × 125 × 215 cm', material: 'Dokulu Keten Döşeme & Meşe' },
        { name: 'Siena Çekmeceli Şifonyer & Ayna', dimensions: '120 × 85 × 48 cm', material: 'Frenli Tandem Ray, CNC Çıta' },
        { name: 'Siena Komodin (Çift)', dimensions: '55 × 48 × 42 cm', material: 'Kablosuz Şarj Entegreli Üst Tabla' }
      ]
    },
    {
      slug: 'porto-yatak-odasi',
      name: 'Porto Yatak Odası Koleksiyonu',
      category: 'Yatak Odası',
      design_story: 'Atlantik sahil rüzgarlarından ilham alan dumanlı meşe kaplamalar ve mat antrasit detayların dengeli kontrastı.',
      architecture_style: 'Endüstriyel Modern',
      color_palette: ['Dumanlı Meşe', 'Mat Antrasit', 'Pirinç Vurgu'],
      hero_image_url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=85',
      pieces: [
        { name: 'Porto Sürgülü Boy Aynalı Gardırop', dimensions: '250 × 220 × 65 cm', material: 'Hettich Üstten Asma Mekanizma' },
        { name: 'Porto Masif Ayaklı Karyola', dimensions: '170 × 110 × 210 cm', material: 'Doğal Duman Meşe & Antrasit' },
        { name: 'Porto 4 Çekmeceli Şifonyer', dimensions: '110 × 90 × 46 cm', material: 'Gizli Kulplu CNC Membran' },
        { name: 'Porto Asimetrik Komodin (2 Adet)', dimensions: '50 × 45 × 40 cm', material: 'Metal Ayak & Frenli Çekmece' }
      ]
    },
    {
      slug: 'milano-yatak-odasi',
      name: 'Milano Yatak Odası Koleksiyonu',
      category: 'Yatak Odası',
      design_story: 'Lombardiya yüksek mimarisinin geometrik düzeni; ipek lake pürüzsüzlüğünde yüzeyler ve gizli ambient aydınlatmalar.',
      architecture_style: 'Haute Couture Modern',
      color_palette: ['Krem Beyaz', 'Ceviz', 'Şampanya Altın'],
      hero_image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=85',
      pieces: [
        { name: 'Milano Modüler Köşe Gardırop', dimensions: '300 × 230 × 60 cm', material: 'Sensörlü İç Aydınlatma, E1 MDF' },
        { name: 'Milano Entegre Aydınlatmalı Karyola', dimensions: '180 × 130 × 220 cm', material: 'Gömme LED Başlık, Nubuk Kumaş' },
        { name: 'Milano Boy Aynalı Makyaj Konsolu', dimensions: '135 × 82 × 50 cm', material: 'Kadeh Cam Üst Yüzey & Çekmece İçi Kadife' },
        { name: 'Milano Yüzen Komodinler (Çift)', dimensions: '55 × 35 × 40 cm', material: 'Duvara Askılı Lake Tasarım' }
      ]
    },
    {
      slug: 'zurih-yatak-odasi',
      name: 'Zürih Yatak Odası Koleksiyonu',
      category: 'Yatak Odası',
      design_story: 'İsviçre mühendislik hassasiyeti; kusursuz gönye burun birleşimler, doğal taş dokulu paneller ve dingin monokrom duruş.',
      architecture_style: 'Alpine Minimalist',
      color_palette: ['Taş Grisi', 'Hafif Çam', 'Mat Siyah'],
      hero_image_url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1600&q=85',
      pieces: [
        { name: 'Zürih Tam Boy Gömmeli Gardırop', dimensions: '240 × 225 × 60 cm', material: 'Görünmez Ray Sistemi, E1 Standart' },
        { name: 'Zürih Düşük Profil Zen Karyola', dimensions: '165 × 95 × 210 cm', material: 'Keten Dokuma & Çam Ayaklar' },
        { name: 'Zürih Yüksek Şifonyer', dimensions: '90 × 115 × 45 cm', material: '5 Kat Frenli Çekmece' },
        { name: 'Zürih Minimalist Komodin (Çift)', dimensions: '48 × 42 × 38 cm', material: 'Masif Detaylı MDF' }
      ]
    },
    {
      slug: 'verona-yatak-odasi',
      name: 'Verona Yatak Odası Koleksiyonu',
      category: 'Yatak Odası',
      design_story: 'Klasik İtalyan zanaatının modern villa yaşamına uyarlaması; kavisli hatlar ve ipeksi dokunuş.',
      architecture_style: 'Neoklasik Çağdaş',
      color_palette: ['Pudra Bej', 'Cappuccino', 'Açık Ceviz'],
      hero_image_url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=85',
      pieces: [
        { name: 'Verona Oymalı Lake Gardırop', dimensions: '260 × 220 × 62 cm', material: 'CNC Membran İşleme, Özel Kulplar' },
        { name: 'Verona Kapitone Yatak Başı & Baza', dimensions: '175 × 135 × 215 cm', material: 'Kadife Dokulu Kumaş Döşeme' },
        { name: 'Verona Klasik Çekmeceli Şifonyer', dimensions: '115 × 88 × 48 cm', material: 'Ayna Dahil, Soft-Close Ray' },
        { name: 'Verona Yuvarlak Hatlı Komodin', dimensions: '52 × 50 × 42 cm', material: 'Ahşap Ayak, Lake Boya' }
      ]
    },
    {
      slug: 'venedik-yatak-odasi',
      name: 'Venedik Yatak Odası Koleksiyonu',
      category: 'Yatak Odası',
      design_story: 'Su kanallarının ışık oyunlarını yansıtan bronz reflekte cam kapaklar ve sıcak bal rengi ceviz gövde.',
      architecture_style: 'Venedik Moderni',
      color_palette: ['Bal Ceviz', 'Bronz Cam', 'Mat Vizon'],
      hero_image_url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85',
      pieces: [
        { name: 'Venedik Bronz Camlı Vitrin Gardırop', dimensions: '270 × 225 × 60 cm', material: 'Alüminyum Çerçeve, LED Sensör' },
        { name: 'Venedik Baza & Entegre Gece Lambası', dimensions: '170 × 120 × 215 cm', material: 'Deri Detaylı Başlık' },
        { name: 'Venedik Makyaj Konsolu', dimensions: '125 × 80 × 48 cm', material: 'Gizli Takı Çekmecesi' },
        { name: 'Venedik Komodin (Çift)', dimensions: '54 × 45 × 40 cm', material: 'Bronz Kulp, MDF Membran' }
      ]
    },
    {
      slug: 'kopenhag-yatak-odasi',
      name: 'Kopenhag Yatak Odası Koleksiyonu',
      category: 'Yatak Odası',
      design_story: 'Kuzey ışığının sadeliği; doğal huş ağacı dokusu, mat adaçayı vurguları ve fonksiyonel depolama çözümleri.',
      architecture_style: 'Skandinav Doğal',
      color_palette: ['Doğal Huş', 'Adaçayı Yeşili', 'Kırık Beyaz'],
      hero_image_url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=85',
      pieces: [
        { name: 'Kopenhag Çift Renkli Gardırop', dimensions: '240 × 215 × 58 cm', material: 'Huş Kaplama & Adaçayı Membran' },
        { name: 'Kopenhag Masif Platform Yatak', dimensions: '165 × 105 × 210 cm', material: 'Latalı Taban, Ahşap Başlık' },
        { name: 'Kopenhag 6 Çekmeceli Şifonyer', dimensions: '130 × 78 × 45 cm', material: 'Geniş Çekmeceli, Ahşap Kulp' },
        { name: 'Kopenhag Sehpa Tipi Komodin', dimensions: '45 × 50 × 40 cm', material: 'Açık Raflı Masif Tasarım' }
      ]
    },
    {
      slug: 'lizbon-yatak-odasi',
      name: 'Lizbon Yatak Odası Koleksiyonu',
      category: 'Yatak Odası',
      design_story: 'Akdeniz güneşinin neşesi; sıcak meşe hareleri, seramik kulp detayları ve geniş ferah iç mekan tasarımı.',
      architecture_style: 'İberik Çağdaş',
      color_palette: ['Altın Meşe', 'Mat Terracotta', 'Keten Beji'],
      hero_image_url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85',
      pieces: [
        { name: 'Lizbon 5 Kapaklı Ahşap Gardırop', dimensions: '235 × 220 × 60 cm', material: '18mm E1 MDF, Doğal Meşe Doku' },
        { name: 'Lizbon Keten Kumaş Karyola', dimensions: '170 × 115 × 215 cm', material: 'Silinebilir Dokuma Keten Başlık' },
        { name: 'Lizbon Rustik Şifonyer', dimensions: '110 × 84 × 46 cm', material: 'Gizli Ray Sistemi' },
        { name: 'Lizbon Komodin (2 Adet)', dimensions: '50 × 46 × 40 cm', material: 'Meşe Gövde, Frenli Çekmece' }
      ]
    }
  ];

  window.GKM_SUPABASE = {
    normalizeMediaUrl,

    isConfigured() {
      const { url, key } = getCredentials();
      return !!(url && key);
    },

    async getCollections() {
      const data = await restSelect('collections?select=*&status=eq.active&order=created_at.asc');
      if (Array.isArray(data) && data.length > 0) {
        return data.map(c => ({
          ...c,
          hero_image_url: normalizeMediaUrl(c.hero_image_url, 'resim/logo.png')
        }));
      }
      return FALLBACK_COLLECTIONS;
    },

    async getCollectionBySlug(slug) {
      if (!slug) return null;
      const data = await restSelect(`collections?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      if (Array.isArray(data) && data.length > 0) {
        return {
          ...data[0],
          hero_image_url: normalizeMediaUrl(data[0].hero_image_url, 'resim/logo.png')
        };
      }
      return FALLBACK_COLLECTIONS.find(c => c.slug === slug) || null;
    },

    async createQuoteRequest(quoteData) {
      const refCode = 'GM-' + (new Date().getFullYear()) + '-' + Math.floor(1000 + Math.random() * 9000);
      const payload = {
        reference_code: refCode,
        customer_name: quoteData.name || 'Müşteri',
        customer_phone: quoteData.phone || '',
        customer_email: quoteData.email || null,
        customer_city: quoteData.city || null,
        collection_id: quoteData.collection_id || null,
        selected_pieces: quoteData.selected_pieces || [],
        custom_dimensions_note: quoteData.notes || '',
        status: 'new'
      };
      const inserted = await restInsert('quote_requests', payload);
      return { ok: true, reference_code: refCode, data: inserted };
    },

    async getProducts() {
      const data = await restSelect('products?select=*&order=created_at.desc');
      if (!Array.isArray(data)) return null;
      return data.map(p => ({
        ...p,
        id: p.slug,
        title: p.title || p.baslik || p.slug,
        ana_resim: normalizeMediaUrl(p.ana_resim, 'resim/logo.png')
      }));
    },

    async getProductBySlug(slug) {
      if (!slug) return null;
      const data = await restSelect(`products?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      if (!Array.isArray(data) || data.length === 0) return null;
      const item = data[0];
      return {
        ...item,
        id: item.slug,
        title: item.title || item.baslik || item.slug,
        ana_resim: normalizeMediaUrl(item.ana_resim, 'resim/logo.png')
      };
    },

    async getSuppliers() {
      const data = await restSelect('suppliers?select=*&order=siralama.asc');
      if (!Array.isArray(data)) return null;
      return data.map(s => ({
        ...s,
        logo: normalizeMediaUrl(s.logo, 'resim/logo.png')
      }));
    },

    async getGallery() {
      const data = await restSelect('gallery?select=*&order=siralama.desc');
      if (!Array.isArray(data)) return null;
      return data.map(g => ({
        ...g,
        id: g.slug,
        resim: normalizeMediaUrl(g.resim, 'resim/logo.png')
      }));
    },

    async getBlogs() {
      const data = await restSelect('blogs?select=*&order=tarih.desc');
      if (!Array.isArray(data)) return null;
      return data.map(b => ({
        ...b,
        id: b.slug,
        kapak_resim: normalizeMediaUrl(b.kapak_resim, 'resim/logo.png')
      }));
    },

    async getBlogBySlug(slug) {
      if (!slug) return null;
      const data = await restSelect(`blogs?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      if (!Array.isArray(data) || data.length === 0) return null;
      const item = data[0];
      return {
        ...item,
        id: item.slug,
        kapak_resim: normalizeMediaUrl(item.kapak_resim, 'resim/logo.png')
      };
    },

    async getSiteSetting(key) {
      if (!key) return null;
      const data = await restSelect(`site_settings?select=data&key=eq.${encodeURIComponent(key)}&limit=1`);
      if (!Array.isArray(data) || data.length === 0 || !data[0].data) return null;
      return data[0].data;
    }
  };
})();

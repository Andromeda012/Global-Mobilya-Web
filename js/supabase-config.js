/**
 * Global Mobilya — Supabase Cloud Database & Storage İstemcisi
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

  const R2_CDN_BASE = 'https://cdn.globalkapakmobilya.com';
  const B2C_API_ENDPOINTS = [
    'https://erp.globalkapakmobilya.com/api/b2c-public',
    'https://insta-deployment-rho.vercel.app/api/b2c-public'
  ];
  let cachedB2CPublicPayload = null;

  async function fetchUnifiedB2CPublicCatalog() {
    if (cachedB2CPublicPayload) return cachedB2CPublicPayload;
    for (const ep of B2C_API_ENDPOINTS) {
      try {
        const res = await fetch(ep, { method: 'GET', cache: 'default' });
        if (res.ok) {
          const json = await res.json();
          if (json && json.ok) {
            cachedB2CPublicPayload = json;
            return json;
          }
        }
      } catch (_) {}
    }
    return null;
  }

  function normalizeMediaUrl(url, fallback = 'resim/logo.png') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    if (!trimmed) return fallback;
    // Eski Supabase Storage bağlantılarını doğrudan Cloudflare R2 CDN'e (cdn.globalkapakmobilya.com) yönlendir
    const supaMatch = trimmed.match(/\/storage\/v1\/object\/(?:public\/)?media\/(.+)$/i);
    if (supaMatch && supaMatch[1]) {
      return `${R2_CDN_BASE}/${supaMatch[1].replace(/^\/+/, '')}`;
    }
    if (trimmed.startsWith('/r2/')) {
      return `${R2_CDN_BASE}/${trimmed.slice(4).replace(/^\/+/, '')}`;
    }
    const gwMatch = trimmed.match(/^https?:\/\/(?:erp\.globalkapakmobilya\.com|insta-deployment-rho\.vercel\.app)\/r2\/(.+)$/i);
    if (gwMatch && gwMatch[1]) {
      return `${R2_CDN_BASE}/${gwMatch[1].replace(/^\/+/, '')}`;
    }
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

  // Koleksiyon parçası ve kodu tespit deseni (Modül 2 ve Modül 7 ile %100 uyumlu)
  const PIECE_SLUG_REGEX = /-(?:6-kapili-dolap|5-kapili-dolap|4-kapili-dolap|3-kapili-dolap|komodin|sifonyer|kucuk-kahve-kosesi|orta-kahve-kosesi|buyuk-kahve-kosesi|main-bed|wardrobe|nightstand|dresser|vanity|mirror|bed|dolap|parca|part)-\d+$/i;
  const PIECE_SKU_REGEX = /-(?:P\d+|parca|piece)$/i;

  const COLLECTION_CATEGORIES = [
    'Kahve Köşesi Koleksiyonları',
    'Dolap Koleksiyonları',
    'Yatak Odası Koleksiyonları'
  ];

  function normalizeCollectionCategory(rawCategory = '', title = '') {
    const src = `${rawCategory} ${title}`.toLowerCase();
    if (src.includes('kahve') || src.includes('coffee')) return 'Kahve Köşesi Koleksiyonları';
    if (src.includes('dolap') || src.includes('gardırop') || src.includes('gardirop') || src.includes('wardrobe')) return 'Dolap Koleksiyonları';
    if (src.includes('yatak') || src.includes('bedroom') || src.includes('suite')) return 'Yatak Odası Koleksiyonları';
    return 'Kahve Köşesi Koleksiyonları';
  }

  // Sahte örnek koleksiyonlar tamamen kaldırıldı — yalnızca Modül 7 / Supabase üzerindeki gerçek koleksiyonlar gösterilir.
  const FALLBACK_COLLECTIONS = [];

  window.GKM_SUPABASE = {
    normalizeMediaUrl,
    COLLECTION_CATEGORIES,
    normalizeCollectionCategory,

    isConfigured() {
      const { url, key } = getCredentials();
      return !!(url && key);
    },

    /**
     * Modül 7 / Supabase üzerindeki gerçek koleksiyonları alt kategorileriyle getirir.
     */
    async getCollections() {
      // 1. Önce Faz 6 Birleşik B2C & 3D Showroom API'sinden (Modül 7 + Modül 8 .glb + Cloudflare R2) çek
      const unified = await fetchUnifiedB2CPublicCatalog();
      if (unified && Array.isArray(unified.collections) && unified.collections.length > 0) {
        return unified.collections.map(c => {
          const cat = normalizeCollectionCategory(c.category, c.name || c.title || c.slug);
          return {
            ...c,
            category: cat,
            design_story: (c.design_story || '').replace(/\b(18mm\s*E1\s*masif\s*MDF|MDF|membran(?:\s+kapak)?)\b/gi, 'E1 Sertifikalı Ahşap'),
            hero_image_url: normalizeMediaUrl(c.hero_image_url, 'resim/showroom/luxury_showroom.jpg'),
            model_3d_url: c.model_3d_url ? normalizeMediaUrl(c.model_3d_url, '') : null,
            pieces: (c.pieces || []).map(pc => ({
              ...pc,
              material: (pc.material && !/membran|mdf|kapak/i.test(pc.material)) ? pc.material : '1. Sınıf E1 Ahşap Gövde & Mimari İşçilik',
              image_url: normalizeMediaUrl(pc.image_url, 'resim/logo.png'),
              model_3d_url: pc.model_3d_url ? normalizeMediaUrl(pc.model_3d_url, '') : null
            }))
          };
        });
      }

      // 2. Fallback: doğrudan Supabase site_settings('module7_extended_catalog') & products tablosu
      const [prods, extData] = await Promise.all([
        restSelect('products?select=*&order=created_at.desc'),
        this.getSiteSetting('module7_extended_catalog').catch(() => null)
      ]);
      const allProds = Array.isArray(prods) ? prods : [];
      const prodBySlug = new Map(allProds.map(p => [p.slug, p]));
      const extCols = Array.isArray(extData?.collections) ? extData.collections : [];
      const extLinks = Array.isArray(extData?.collection_products) ? extData.collection_products : [];

      if (extCols.length > 0) {
        return extCols.filter(c => c && c.slug && c.is_visible !== false).map(c => {
          const base = prodBySlug.get(c.slug) || {};
          const linked = extLinks
            .filter(cp => cp.collection_id === c.slug || cp.collection_id === c.id)
            .map(cp => {
              const pc = prodBySlug.get(cp.product_slug) || {};
              return {
                slug: cp.product_slug,
                name: pc.title || cp.title || cp.product_slug,
                dimensions: cp.dimensions || pc.body || 'Özel Mimari Ölçü',
                material: '1. Sınıf E1 Ahşap Gövde & Mimari İşçilik',
                image_url: normalizeMediaUrl(pc.ana_resim || cp.image_url || base.ana_resim, 'resim/logo.png')
              };
            });
          const title = c.title || c.name || base.title || c.slug;
          return {
            id: c.slug,
            slug: c.slug,
            name: title,
            category: normalizeCollectionCategory(c.category || base.kategori, title),
            design_story: c.design_story || c.promo_quote || base.kisa_aciklama || base.body || 'Modern mimari anlayış ve el işçiliğiyle üretilen seçkin mobilya koleksiyonu.',
            architecture_style: c.category || 'Modern Mimari Tasarım',
            color_palette: Array.isArray(c.color_palette) && c.color_palette.length ? c.color_palette : (base.renkler || []),
            hero_image_url: normalizeMediaUrl(c.hero_image || c.hero_image_url || base.ana_resim, 'resim/showroom/luxury_showroom.jpg'),
            pieces: linked
          };
        });
      }

      const parentSlugs = new Set();
      allProds.forEach(p => {
        if (PIECE_SLUG_REGEX.test(p.slug) || PIECE_SKU_REGEX.test(p.sku || '')) {
          parentSlugs.add(p.slug.replace(PIECE_SLUG_REGEX, ''));
        }
      });

      const dynamicCollections = [];
      parentSlugs.forEach(parentSlug => {
        const parentProd = allProds.find(p => p.slug === parentSlug);
        if (!parentProd) return;
        const pieces = allProds.filter(p => p.slug.startsWith(parentSlug + '-') && p.slug !== parentSlug);
        dynamicCollections.push({
          id: parentSlug,
          slug: parentSlug,
          name: parentProd.title,
          category: normalizeCollectionCategory(parentProd.kategori, parentProd.title),
          design_story: parentProd.kisa_aciklama || parentProd.body || 'Modern mimari anlayışıyla üretilen seçkin koleksiyon.',
          architecture_style: parentProd.kategori || 'Modern Mimari Tasarım',
          color_palette: Array.isArray(parentProd.renkler) ? parentProd.renkler : [],
          hero_image_url: normalizeMediaUrl(parentProd.ana_resim || pieces.find(pc => pc.ana_resim)?.ana_resim, 'resim/showroom/luxury_showroom.jpg'),
          pieces: pieces.map(pc => ({
            name: pc.title,
            dimensions: pc.body || pc.kisa_aciklama || 'Özel Mimari Ölçü',
            material: '1. Sınıf E1 Ahşap Gövde & Mimari İşçilik',
            image_url: normalizeMediaUrl(pc.ana_resim, 'resim/logo.png'),
            slug: pc.slug
          }))
        });
      });

      return dynamicCollections;
    },

    async getCollectionBySlug(slug) {
      if (!slug) return null;
      const all = await this.getCollections();
      return all.find(c => c.slug === slug || c.id === slug || c.slug.startsWith(slug) || slug.startsWith(c.slug)) || null;
    },

    async createQuoteRequest(quoteData) {
      const refCode = 'GM-' + (new Date().getFullYear()) + '-' + Math.floor(1000 + Math.random() * 9000);
      const clerkUser = window.Clerk?.user || null;
      const clerkUserId = clerkUser?.id || quoteData.clerk_user_id || null;
      const primaryEmail = clerkUser?.primaryEmailAddress?.emailAddress || quoteData.email || null;
      const fullName = quoteData.name || [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || 'Müşteri';
      const phone = quoteData.phone || clerkUser?.phoneNumbers?.[0]?.phoneNumber || '';

      const payload = {
        reference_code: refCode,
        customer_name: fullName,
        customer_phone: phone,
        customer_email: primaryEmail,
        customer_city: quoteData.city || null,
        collection_id: quoteData.collection_id || null,
        selected_pieces: quoteData.selected_pieces || [],
        custom_dimensions_note: quoteData.notes || '',
        status: 'new'
      };

      // 1. Müşteriyi organizasyona eklemeden doğrudan Supabase crm_customers tablosuna kaydet
      await restInsert('crm_customers', {
        clerk_user_id: clerkUserId,
        email: primaryEmail,
        full_name: fullName,
        phone,
        city: quoteData.city || null,
        interested_model: quoteData.collection_id || null,
        latest_quote_ref: refCode,
        notes: quoteData.notes || '',
        source: 'b2c_lazy_quote',
        stage: 'Yeni Teklif Talebi'
      }).catch(() => null);

      // 2. ERP /api/b2c-lazy-quote uç noktasına da senkronize et
      try {
        const token = window.Clerk?.session ? await window.Clerk.session.getToken() : '';
        const erpEndpoints = [
          'https://erp.globalkapakmobilya.com/api/b2c-lazy-quote',
          'https://insta-deployment-rho.vercel.app/api/b2c-lazy-quote'
        ];
        for (const ep of erpEndpoints) {
          const r = await fetch(ep, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              clerk_user_id: clerkUserId,
              email: primaryEmail,
              name: fullName,
              phone,
              city: quoteData.city || '',
              collection_id: quoteData.collection_id || '',
              notes: quoteData.notes || '',
              reference_code: refCode
            })
          }).catch(() => null);
          if (r && r.ok) break;
        }
      } catch (_) {}

      const inserted = await restInsert('quote_requests', payload);
      if (window.NOVA_TELEMETRY?.trackEvent) {
        window.NOVA_TELEMETRY.trackEvent('quote_or_order_submitted', {
          reference_code: refCode,
          model_name: quoteData.collection_id || 'Özel Ölçü Mobilya',
          city: quoteData.city || '',
          clerk_user_id: clerkUserId || undefined
        });
      }
      return { ok: true, reference_code: refCode, data: inserted };
    },

    /**
     * Yalnızca BAĞIMSIZ ürünleri (Portmanto, Dresuar, Tekil Dolap vb.) getirir.
     * Koleksiyon parçaları ve koleksiyon kök kayıtları kesinlikle süzülür.
     */
    async getProducts() {
      const unified = await fetchUnifiedB2CPublicCatalog();
      if (unified && Array.isArray(unified.products)) {
        return unified.products
          .filter(p => p && !PIECE_SLUG_REGEX.test(p.slug) && !PIECE_SKU_REGEX.test(p.sku || '') && p.web_gorunur !== false)
          .map(p => ({
            ...p,
            id: p.slug,
            title: p.title || p.baslik || p.slug,
            ana_resim: normalizeMediaUrl(p.ana_resim, 'resim/logo.png')
          }));
      }

      const [data, extData] = await Promise.all([
        restSelect('products?select=*&order=created_at.desc'),
        this.getSiteSetting('module7_extended_catalog').catch(() => null)
      ]);
      if (!Array.isArray(data)) return [];

      const collectionSlugs = new Set(
        (Array.isArray(extData?.collections) ? extData.collections : []).map(c => c?.slug).filter(Boolean)
      );
      const linkedPieceSlugs = new Set(
        (Array.isArray(extData?.collection_products) ? extData.collection_products : []).map(cp => cp?.product_slug).filter(Boolean)
      );

      // Koleksiyon parçalarını ve üst koleksiyon slug'larını tespit et
      const parentSlugs = new Set(collectionSlugs);
      data.forEach(p => {
        if (PIECE_SLUG_REGEX.test(p.slug) || PIECE_SKU_REGEX.test(p.sku || '')) {
          parentSlugs.add(p.slug.replace(PIECE_SLUG_REGEX, ''));
        }
      });

      // Koleksiyon parçası ve koleksiyon olmayan tekil bağımsız ürünler
      const independentOnly = data.filter(p => {
        const isPiece = PIECE_SLUG_REGEX.test(p.slug) || PIECE_SKU_REGEX.test(p.sku || '') || linkedPieceSlugs.has(p.slug) || p.product_type === 'collection_piece';
        const isCollection = parentSlugs.has(p.slug) || p.product_type === 'collection';
        const isVisible = p.web_gorunur !== false;
        return !isPiece && !isCollection && isVisible;
      });

      return independentOnly.map(p => ({
        ...p,
        id: p.slug,
        title: p.title || p.baslik || p.slug,
        ana_resim: normalizeMediaUrl(p.ana_resim, 'resim/logo.png')
      }));
    },

    async getProductBySlug(slug) {
      if (!slug) return null;
      const data = await restSelect(`products?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        return {
          ...item,
          id: item.slug,
          title: item.title || item.baslik || item.slug,
          ana_resim: normalizeMediaUrl(item.ana_resim, 'resim/logo.png')
        };
      }
      return null;
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

  // ==========================================================================
  // FAZ 2: VİTRİN (BETA) CLERK LAZY REGISTRATION (<SignIn routing="virtual"/>)
  // Katalog, ürün detay ve 3D showroom sayfaları herkese açıktır.
  // Sadece kullanıcı "Teklif Al" butonuna bastığında Clerk <SignIn routing="virtual"/>
  // modalı açılır ve giriş yapan müşteri organizasyona eklenmeden doğrudan
  // Supabase `crm_customers` tablosuna kaydedilir.
  // ==========================================================================
  const CLERK_PK = 'pk_live_Y2xlcmsuZ2xvYmFsa2FwYWttb2JpbHlhLmNvbSQ';
  let clerkLoadPromise = null;
  const syncedClerkUserIds = new Set();

  async function ensureClerkLoaded() {
    if (window.Clerk && window.Clerk.loaded) return window.Clerk;
    if (clerkLoadPromise) return clerkLoadPromise;

    clerkLoadPromise = (async () => {
      const uiSrcs = [
        'https://clerk.globalkapakmobilya.com/npm/@clerk/ui@1/dist/ui.browser.js',
        'https://cdn.jsdelivr.net/npm/@clerk/ui@1/dist/ui.browser.js'
      ];
      for (const uiSrc of uiSrcs) {
        if (window.__internal_ClerkUICtor) break;
        try {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = uiSrc;
            s.async = true;
            s.crossOrigin = 'anonymous';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
        } catch (_) {}
      }
      const srcs = [
        'https://clerk.globalkapakmobilya.com/npm/@clerk/clerk-js@6/dist/clerk.browser.js',
        'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@6/dist/clerk.browser.js'
      ];
      for (const src of srcs) {
        if (window.Clerk) break;
        try {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.crossOrigin = 'anonymous';
            s.setAttribute('data-clerk-publishable-key', CLERK_PK);
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
        } catch (_) {}
      }
      if (window.Clerk && !window.Clerk.loaded) {
        await window.Clerk.load({
          publishableKey: CLERK_PK,
          ...(window.__internal_ClerkUICtor ? { ui: { ClerkUI: window.__internal_ClerkUICtor } } : {})
        });
      }
      return window.Clerk || null;
    })();
    return clerkLoadPromise;
  }

  async function syncB2CCustomerToSupabase(clerkUser, interestedModel = '') {
    if (!clerkUser || !clerkUser.id) return;
    const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || '';
    const primaryPhone = clerkUser.phoneNumbers?.[0]?.phoneNumber || '';
    const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim()
      || clerkUser.username
      || primaryEmail
      || 'Vitrin Müşterisi';

    // Teklif formundaki Ad Soyad ve Telefon alanlarını otomatik doldur
    const nameInput = document.getElementById('q_name');
    const phoneInput = document.getElementById('q_phone');
    if (nameInput && !nameInput.value && fullName !== 'Vitrin Müşterisi') nameInput.value = fullName;
    if (phoneInput && !phoneInput.value && primaryPhone) phoneInput.value = primaryPhone;

    const syncKey = `${clerkUser.id}:${interestedModel}`;
    if (syncedClerkUserIds.has(syncKey)) return;
    syncedClerkUserIds.add(syncKey);

    // 1. Doğrudan Supabase crm_customers tablosuna kaydet (organizasyona eklemeden!)
    await restInsert('crm_customers', {
      clerk_user_id: clerkUser.id,
      email: primaryEmail,
      full_name: fullName,
      phone: primaryPhone || null,
      interested_model: interestedModel || document.getElementById('q_model')?.value || null,
      source: 'b2c_lazy_quote',
      stage: 'Teklif Modalı Açıldı'
    }).catch(() => null);

    // 2. ERP /api/b2c-lazy-quote uç noktasına bildir
    try {
      const token = window.Clerk?.session ? await window.Clerk.session.getToken() : '';
      const endpoints = [
        'https://erp.globalkapakmobilya.com/api/b2c-lazy-quote',
        'https://insta-deployment-rho.vercel.app/api/b2c-lazy-quote'
      ];
      for (const ep of endpoints) {
        const res = await fetch(ep, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            clerk_user_id: clerkUser.id,
            email: primaryEmail,
            name: fullName,
            phone: primaryPhone,
            collection_id: interestedModel || document.getElementById('q_model')?.value || '',
            source: 'b2c_lazy_quote'
          })
        }).catch(() => null);
        if (res && res.ok) break;
      }
    } catch (_) {}
  }

  function openVirtualClerkSignInModal(onAuthenticated, interestedModel = '') {
    let backdrop = document.getElementById('gkm-clerk-virtual-modal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'gkm-clerk-virtual-modal';
      backdrop.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(15,20,28,0.86);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
      backdrop.innerHTML = `
        <div style="position:relative;background:#fff;border-radius:20px;padding:28px 24px 24px;max-width:460px;width:100%;box-shadow:0 30px 90px rgba(0,0,0,0.45);text-align:center;">
          <button type="button" id="gkm-clerk-modal-close" style="position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid #e2e8f0;background:#f8fafc;cursor:pointer;font-size:16px;">✕</button>
          <div style="font-size:11px;font-weight:800;letter-spacing:2px;color:#5E7462;text-transform:uppercase;margin-bottom:6px;">GLOBAL MOBİLYA • ÖZEL TEKLİF</div>
          <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;color:#1e293b;margin:0 0 8px;">Teklif Almak İçin Hızlı Giriş Yapın</h3>
          <p style="font-size:12.5px;color:#64748b;margin:0 0 18px;line-height:1.55;">
            Size özel ölçü ve fiyat teklifimizi hazırlayıp takip edebilmemiz için hesabınızla devam edin.
          </p>
          <div id="gkm-clerk-signin-mount" style="display:flex;justify-content:center;min-height:320px;"></div>
        </div>
      `;
      document.body.appendChild(backdrop);
      document.getElementById('gkm-clerk-modal-close')?.addEventListener('click', () => {
        const mount = document.getElementById('gkm-clerk-signin-mount');
        if (mount && window.Clerk?.unmountSignIn) {
          try { window.Clerk.unmountSignIn(mount); } catch (_) {}
        }
        backdrop.style.display = 'none';
      });
    } else {
      backdrop.style.display = 'flex';
    }

    const mountEl = document.getElementById('gkm-clerk-signin-mount');
    if (mountEl && window.Clerk) {
      mountEl.innerHTML = '';
      // <SignIn routing="virtual" />
      window.Clerk.mountSignIn(mountEl, {
        routing: 'virtual'
      });

      const unsub = window.Clerk.addListener(async ({ user }) => {
        if (user) {
          try { window.Clerk.unmountSignIn(mountEl); } catch (_) {}
          backdrop.style.display = 'none';
          if (typeof unsub === 'function') unsub();
          await syncB2CCustomerToSupabase(user, interestedModel);
          if (typeof onAuthenticated === 'function') onAuthenticated();
        }
      });
    }
  }

  async function requireSignInForQuote(proceedCallback, interestedModel = '') {
    const clerk = await ensureClerkLoaded();
    if (!clerk) {
      if (typeof proceedCallback === 'function') proceedCallback();
      return;
    }
    if (clerk.user) {
      await syncB2CCustomerToSupabase(clerk.user, interestedModel);
      if (typeof proceedCallback === 'function') proceedCallback();
      return;
    }
    openVirtualClerkSignInModal(proceedCallback, interestedModel);
  }

  window.GKM_CLERK_LAZY = {
    ensureClerkLoaded,
    requireSignInForQuote,
    syncB2CCustomerToSupabase
  };

  // Sayfadaki mevcut `openQuoteModal` / `openQuoteForCollection` fonksiyonlarını ve "Teklif Al" butonlarını Lazy Registration ile sarmala
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.openQuoteModal === 'function' && !window.openQuoteModal._clerkWrapped) {
      const origOpenQuote = window.openQuoteModal;
      const wrapped = function (...args) {
        const modelName = document.getElementById('q_model')?.value || document.getElementById('prodTitle')?.textContent || '';
        requireSignInForQuote(() => origOpenQuote.apply(this, args), modelName);
      };
      wrapped._clerkWrapped = true;
      window.openQuoteModal = wrapped;
    }

    if (typeof window.openQuoteForCollection === 'function' && !window.openQuoteForCollection._clerkWrapped) {
      const origOpenColQuote = window.openQuoteForCollection;
      const wrappedCol = function (name, ...rest) {
        requireSignInForQuote(() => origOpenColQuote.call(this, name, ...rest), name || '');
      };
      wrappedCol._clerkWrapped = true;
      window.openQuoteForCollection = wrappedCol;
    }

    // Üst menü ve sayfa içi "Teklif Al" (.nav-cta, .f-btn-primary) linklerini de yakala
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-cta, .f-btn-primary, [data-lazy-quote]');
      if (!btn) return;
      const text = (btn.textContent || '').toLowerCase();
      if (!text.includes('teklif')) return;

      if (window.Clerk?.user) {
        syncB2CCustomerToSupabase(window.Clerk.user);
        return;
      }
      e.preventDefault();
      const targetHref = btn.getAttribute('href');
      requireSignInForQuote(() => {
        if (typeof window.openQuoteModal === 'function') {
          window.openQuoteModal();
        } else if (targetHref) {
          window.location.href = targetHref;
        }
      });
    });

    // Faz 4: B2C Vitrin PostHog EU + Sentry EU Telemetri Modülünü Otomatik Yükle
    if (!window.__NOVA_TELEMETRY_LOADED__) {
      const ts = document.createElement('script');
      ts.src = (window.location.pathname.includes('/urun/') || window.location.pathname.includes('/blog/'))
        ? '../js/nova-telemetry.js'
        : 'js/nova-telemetry.js';
      ts.async = true;
      document.head.appendChild(ts);
    }
  });
})();

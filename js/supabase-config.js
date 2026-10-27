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

  window.GKM_SUPABASE = {
    normalizeMediaUrl,

    isConfigured() {
      const { url, key } = getCredentials();
      return !!(url && key);
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

/**
 * Global Kapak Mobilya — Supabase Cloud Database & Storage İstemcisi
 * Ürünler, tedarikçiler, galeri, blog, firma ayarları ve kurumsal videoları
 * doğrudan Supabase PostgreSQL veritabanı ve Supabase Storage'dan yükler.
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

  // Varsayılan Supabase bağlantısını garantile
  try {
    const storedUrl = (localStorage.getItem('gkm_supabase_url') || '').trim();
    const storedKey = (localStorage.getItem('gkm_supabase_key') || '').trim();
    if (!storedUrl || !storedKey || storedUrl.includes('gfxcnmpfksxghbmtvows')) {
      localStorage.setItem('gkm_supabase_url', DEFAULT_SUPABASE_URL);
      localStorage.setItem('gkm_supabase_key', DEFAULT_SUPABASE_ANON_KEY);
    }
  } catch (e) {}

  let clientPromise = null;

  function normalizeMediaUrl(url, fallback = 'resim/logo.png') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    if (!trimmed) return fallback;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
      return trimmed;
    }
    return trimmed.replace(/^\/+/, '');
  }

  function ensureSupabaseLibrary() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      return Promise.resolve(window.supabase);
    }
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-gkm-supabase]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.supabase));
        existing.addEventListener('error', reject);
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.setAttribute('data-gkm-supabase', 'true');
      s.onload = () => resolve(window.supabase);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function getClient() {
    const url = (localStorage.getItem('gkm_supabase_url') || DEFAULT_SUPABASE_URL || '').trim();
    const key = (localStorage.getItem('gkm_supabase_key') || DEFAULT_SUPABASE_ANON_KEY || '').trim();
    if (!url || !key) return null;

    if (!clientPromise) {
      clientPromise = ensureSupabaseLibrary()
        .then((sb) => sb.createClient(url, key))
        .catch(() => null);
    }
    return clientPromise;
  }

  window.GKM_SUPABASE = {
    normalizeMediaUrl,

    isConfigured() {
      const url = (localStorage.getItem('gkm_supabase_url') || DEFAULT_SUPABASE_URL || '').trim();
      const key = (localStorage.getItem('gkm_supabase_key') || DEFAULT_SUPABASE_ANON_KEY || '').trim();
      return !!(url && key);
    },

    async getProducts() {
      const client = await getClient();
      if (!client) return null;
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !Array.isArray(data)) return null;
      return data.map(p => ({
        ...p,
        id: p.slug,
        title: p.title || p.baslik || p.slug,
        ana_resim: normalizeMediaUrl(p.ana_resim, 'resim/logo.png')
      }));
    },

    async getProductBySlug(slug) {
      const client = await getClient();
      if (!client || !slug) return null;
      const { data, error } = await client
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error || !data) return null;
      return {
        ...data,
        id: data.slug,
        title: data.title || data.baslik || data.slug,
        ana_resim: normalizeMediaUrl(data.ana_resim, 'resim/logo.png')
      };
    },

    async getSuppliers() {
      const client = await getClient();
      if (!client) return null;
      const { data, error } = await client
        .from('suppliers')
        .select('*')
        .order('siralama', { ascending: true });
      if (error || !Array.isArray(data)) return null;
      return data.map(s => ({
        ...s,
        logo: normalizeMediaUrl(s.logo, 'resim/logo.png')
      }));
    },

    async getGallery() {
      const client = await getClient();
      if (!client) return null;
      const { data, error } = await client
        .from('gallery')
        .select('*')
        .order('siralama', { ascending: false });
      if (error || !Array.isArray(data)) return null;
      return data.map(g => ({
        ...g,
        id: g.slug,
        resim: normalizeMediaUrl(g.resim, 'resim/logo.png')
      }));
    },

    async getBlogs() {
      const client = await getClient();
      if (!client) return null;
      const { data, error } = await client
        .from('blogs')
        .select('*')
        .order('tarih', { ascending: false });
      if (error || !Array.isArray(data)) return null;
      return data.map(b => ({
        ...b,
        id: b.slug,
        kapak_resim: normalizeMediaUrl(b.kapak_resim, 'resim/logo.png')
      }));
    },

    async getBlogBySlug(slug) {
      const client = await getClient();
      if (!client || !slug) return null;
      const { data, error } = await client
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error || !data) return null;
      return {
        ...data,
        id: data.slug,
        kapak_resim: normalizeMediaUrl(data.kapak_resim, 'resim/logo.png')
      };
    },

    async getSiteSetting(key) {
      const client = await getClient();
      if (!client || !key) return null;
      const { data, error } = await client
        .from('site_settings')
        .select('data')
        .eq('key', key)
        .maybeSingle();
      if (error || !data || !data.data) return null;
      return data.data;
    }
  };
})();

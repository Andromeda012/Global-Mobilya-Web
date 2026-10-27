/**
 * Global Kapak Mobilya — Supabase Cloud Database & Storage İstemcisi
 * Ürünler, tedarikçiler, galeri, blog, firma ayarları ve kurumsal videoları
 * doğrudan Supabase PostgreSQL veritabanı ve Supabase Storage'dan yükler.
 */
(function () {
  const DEFAULT_SUPABASE_URL = '';
  const DEFAULT_SUPABASE_ANON_KEY = '';

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

  const SUPABASE_URL = (localStorage.getItem('gkm_supabase_url') || DEFAULT_SUPABASE_URL || '').trim();
  const SUPABASE_KEY = (localStorage.getItem('gkm_supabase_key') || DEFAULT_SUPABASE_ANON_KEY || '').trim();

  let clientPromise = null;

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
      return data.map(p => ({ ...p, id: p.slug }));
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
      return { ...data, id: data.slug };
    },

    async getSuppliers() {
      const client = await getClient();
      if (!client) return null;
      const { data, error } = await client
        .from('suppliers')
        .select('*')
        .order('siralama', { ascending: true });
      if (error || !Array.isArray(data)) return null;
      return data;
    },

    async getGallery() {
      const client = await getClient();
      if (!client) return null;
      const { data, error } = await client
        .from('gallery')
        .select('*')
        .order('siralama', { ascending: false });
      if (error || !Array.isArray(data)) return null;
      return data.map(g => ({ ...g, id: g.slug }));
    },

    async getBlogs() {
      const client = await getClient();
      if (!client) return null;
      const { data, error } = await client
        .from('blogs')
        .select('*')
        .order('tarih', { ascending: false });
      if (error || !Array.isArray(data)) return null;
      return data.map(b => ({ ...b, id: b.slug }));
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
      return { ...data, id: data.slug };
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

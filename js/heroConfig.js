/**
 * Global Kapak Mobilya — Showroom Hero Scene Runtime Configuration
 * Typed schema mirrored from ./heroConfig.ts with optional live Supabase hydrator.
 */
export const HERO_SCENE_CONFIG = {
  collectionSlug: 'bergamo-kahve-kosesi-61kf',
  background: {
    image: '/hero/bg.jpg',
    alt: 'Global Mobilya Tuğla ve Sıva Duvarlı Showroom Mekânı',
    initialScale: 1.06,
    targetScale: 1.0,
    durationSec: 1.2,
    floorLineBottomPct: 14.8
  },
  cabinets: [
    {
      id: 'bergamo-kucuk',
      title: 'Bergamo Küçük Modül',
      subtitle: 'Cam Vitrinli Kahve Köşesi',
      productSlug: 'bergamo-kahve-kosesi-61kf-kucuk-kahve-kosesi-1',
      detailsUrl: 'urun.html?id=bergamo-kahve-kosesi-61kf-kucuk-kahve-kosesi-1',
      image: '/hero/dolap-1.png',
      alt: 'Bergamo Kahve Köşesi Küçük Modül',
      heightPctDesktop: 49.5,
      aspectRatio: 900 / 1897,
      staggerOrder: 0,
      hoverScale: 1.02
    },
    {
      id: 'bergamo-orta',
      title: 'Bergamo Orta Modül',
      subtitle: 'Geniş Servis & Vitrin Ünitesi',
      productSlug: 'bergamo-kahve-kosesi-61kf-orta-kahve-kosesi-2',
      detailsUrl: 'urun.html?id=bergamo-kahve-kosesi-61kf-orta-kahve-kosesi-2',
      image: '/hero/dolap-2.png',
      alt: 'Bergamo Kahve Köşesi Orta Modül',
      heightPctDesktop: 44.2,
      aspectRatio: 900 / 1447,
      staggerOrder: 1,
      hoverScale: 1.02
    },
    {
      id: 'bergamo-buyuk',
      title: 'Bergamo Büyük Modül',
      subtitle: 'Çift Taraflı LED Vitrin Seti',
      productSlug: 'bergamo-kahve-kosesi-61kf-buyuk-kahve-kosesi-3',
      detailsUrl: 'urun.html?id=bergamo-kahve-kosesi-61kf-buyuk-kahve-kosesi-3',
      image: '/hero/dolap-3.png',
      alt: 'Bergamo Kahve Köşesi Büyük Modül',
      heightPctDesktop: 44.2,
      aspectRatio: 1000 / 1229,
      staggerOrder: 2,
      hoverScale: 1.02
    }
  ],
  decors: [
    {
      id: 'decor-left-bar',
      side: 'left',
      image: '/hero/dekor-sol.png',
      alt: 'Ön Plan Bar Masası ve Tabureler',
      initialX: -80,
      heightPctDesktop: 40,
      parallaxStrengthX: 22,
      parallaxStrengthY: 12
    },
    {
      id: 'decor-right-lounge',
      side: 'right',
      image: '/hero/dekor-sag.png',
      alt: 'Ön Plan Deri Berjer ve Yan Sehpa',
      initialX: 80,
      heightPctDesktop: 37,
      parallaxStrengthX: -24,
      parallaxStrengthY: 14
    }
  ],
  typography: {
    eyebrow: 'Öne Çıkan Seri · Bergamo Koleksiyonu',
    titleLine1: 'Zamansız Formlar,',
    titleAccent: 'Sıcak Yaşam Alanları',
    description:
      'Kahve köşesi koleksiyonlarından modüler dolap sistemlerine ve özel yatak odası kurgularına kadar her parçayı mekânınızın oranlarına göre üretiyoruz.',
    ctaLabel: 'Koleksiyonu İncele',
    ctaUrl: 'koleksiyon.html?id=bergamo-kahve-kosesi-61kf',
    secondaryLabel: 'Bağımsız Ürünler',
    secondaryUrl: 'galeri.html#sectionBagimsiz'
  }
};

/**
 * Supabase / ERP'den gelen olası vitrin yapılandırmasını HERO_SCENE_CONFIG üzerine güvenli şekilde birleştirir.
 */
export async function resolveHeroSceneConfig() {
  try {
    if (!window.GKM_SUPABASE?.getSiteSetting) return HERO_SCENE_CONFIG;
    const remote = await window.GKM_SUPABASE.getSiteSetting('hero_scene_config');
    if (!remote || typeof remote !== 'object') return HERO_SCENE_CONFIG;

    const isLegacyKapak = (txt) => /(membran|\bmdf\b|kapak\s*üret|vakum)/i.test(String(txt || ''));

    return {
      ...HERO_SCENE_CONFIG,
      collectionSlug: remote.collectionSlug || HERO_SCENE_CONFIG.collectionSlug,
      background: { ...HERO_SCENE_CONFIG.background, ...(remote.background || {}) },
      cabinets: Array.isArray(remote.cabinets) && remote.cabinets.length
        ? remote.cabinets
        : HERO_SCENE_CONFIG.cabinets,
      decors: Array.isArray(remote.decors) && remote.decors.length
        ? remote.decors
        : HERO_SCENE_CONFIG.decors,
      typography: {
        ...HERO_SCENE_CONFIG.typography,
        ...(remote.typography && !isLegacyKapak(remote.typography.description) ? remote.typography : {})
      }
    };
  } catch (_) {
    return HERO_SCENE_CONFIG;
  }
}

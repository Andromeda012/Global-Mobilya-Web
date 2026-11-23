/**
 * Global Kapak Mobilya — Showroom Hero Scene Configuration Schema
 * İleride doğrudan Supabase (site_settings / module7_extended_catalog) veya ERP tablosundan
 * beslenebilecek tip güvenli veri yapısı.
 */

export interface HeroBackgroundConfig {
  image: string;
  alt: string;
  initialScale: number;
  targetScale: number;
  durationSec: number;
  floorLineBottomPct: number;
}

export interface HeroCabinetItem {
  id: string;
  title: string;
  subtitle: string;
  productSlug: string;
  detailsUrl: string;
  image: string;
  alt: string;
  heightPctDesktop: number;
  aspectRatio: number;
  staggerOrder: number;
  hoverScale: number;
}

export interface HeroDecorItem {
  id: string;
  side: 'left' | 'right';
  image: string;
  alt: string;
  initialX: number;
  heightPctDesktop: number;
  parallaxStrengthX: number;
  parallaxStrengthY: number;
}

export interface HeroTypographyConfig {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
}

export interface HeroSceneConfig {
  collectionSlug: string;
  background: HeroBackgroundConfig;
  cabinets: HeroCabinetItem[];
  decors: HeroDecorItem[];
  typography: HeroTypographyConfig;
}

export const DEFAULT_HERO_SCENE_CONFIG: HeroSceneConfig = {
  collectionSlug: 'bergamo-kahve-kosesi-61kf',
  background: {
    image: '/hero/bg.jpg',
    alt: 'Global Kapak Mobilya Tuğla ve Sıva Duvarlı Showroom Mekânı',
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

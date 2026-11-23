/**
 * Global Kapak Mobilya — Etkileşimli Koleksiyon Sahnesi Yapılandırma Şeması
 * -------------------------------------------------------------------------
 * Gelecekteki Supabase / ERP entegrasyonu için tüm çok katmanlı sahne görselleri,
 * yüzde koordinatları, oranlar ve tooltip ürün verileri tek bir veri şemasında tutulur.
 * `collections` tablosunda eklenecek opsiyonel `scene_config` JSONB sütunu veya
 * `COLLECTION_SCENES` kayıt defteri üzerinden yeni koleksiyonlar otomatik olarak
 * çok katmanlı etkileşimli sahneye dönüşür.
 */

export interface SceneBackgroundConfig {
  src: string;
  alt: string;
  initialScale: number;
  targetScale: number;
  entranceDurationSec: number;
  parallaxStrengthPx: number;
}

export interface SceneModuleItem {
  id: string;
  /** Koleksiyon içi parça slug eşleştirme anahtarı (otomatik CRM/ERP parça eşleştirme için) */
  pieceSlugHint?: string;
  src: string;
  alt: string;
  /** 1920x1072 (16:9) sahne tuvalinde sol kenar yüzdesi (%) */
  leftPct: number;
  /** Sahne alt kenarından yukarıya zemin/süpürgelik hiza yüzdesi (%) */
  bottomPct: number;
  /** Sahne yüksekliğine göre yükseklik yüzdesi (%) — en-boy oranı naturalWidth/Height ile korunur */
  heightPct: number;
  aspectRatio: string;
  zIndex: number;
  entranceY: number;
  entranceDelaySec: number;
  eyebrow: string;
  label: string;
  dimensions?: string;
  link: string;
}

export interface SceneDecorItem {
  id: string;
  src: string;
  alt: string;
  side: 'left' | 'right';
  leftPct?: number;
  rightPct?: number;
  bottomPct: number;
  /** Sahne genişliğine göre genişlik yüzdesi (%) */
  widthPct: number;
  aspectRatio: string;
  zIndex: number;
  entranceX: number;
  parallaxFactorX: number;
  parallaxFactorY: number;
}

export interface CollectionSceneConfig {
  id: string;
  collectionSlugMatch: string;
  stageAspectRatio: string;
  badgeText: string;
  background: SceneBackgroundConfig;
  modules: SceneModuleItem[];
  decors: SceneDecorItem[];
}

/**
 * Bergamo Kahve Köşesi referans sahne yerleşimi:
 * 16:9 (1920x1072) arka plan üzerinde solda Tek Vitrinli Orta Modül (dolap-2),
 * ortada Kompakt Küçük Modül (dolap-1), sağda Çift Vitrinli Büyük Modül (dolap-3),
 * ön planda ise sol bar masası/tabureler (dekor-sol) ve sağ deri koltuk/sehpa (dekor-sag).
 */
export const BERGAMO_SCENE_CONFIG: CollectionSceneConfig = {
  id: 'bergamo-interactive-scene-v1',
  collectionSlugMatch: 'bergamo',
  stageAspectRatio: '1920 / 1072',
  badgeText: 'Etkileşimli 3 Modüllü Sahne · İncelemek İçin Modüle Gelin',
  background: {
    src: '/hero/bg.jpg',
    alt: 'Bergamo Kahve Köşesi Tuğla ve Sıva Duvarlı Showroom Mekânı',
    initialScale: 1.06,
    targetScale: 1.0,
    entranceDurationSec: 1.2,
    parallaxStrengthPx: 8,
  },
  modules: [
    {
      id: 'bergamo-orta-sol',
      pieceSlugHint: 'orta-kahve-kosesi',
      src: '/hero/dolap-2.png',
      alt: 'Bergamo Orta Boy Tek Vitrinli Kahve Köşesi Modülü',
      leftPct: 16.9,
      bottomPct: 14.3,
      heightPct: 63.2,
      aspectRatio: '900 / 1447',
      zIndex: 21,
      entranceY: -100,
      entranceDelaySec: 0.08,
      eyebrow: 'Tek Vitrinli Modül',
      label: 'Bergamo Orta Modül',
      dimensions: '140 × 210 × 45 cm',
      link: 'urun.html?id=bergamo-kahve-kosesi-61kf-orta-kahve-kosesi-2',
    },
    {
      id: 'bergamo-kucuk-merkez',
      pieceSlugHint: 'kucuk-kahve-kosesi',
      src: '/hero/dolap-1.png',
      alt: 'Bergamo Küçük Boy Kahve Köşesi Modülü',
      leftPct: 41.6,
      bottomPct: 14.3,
      heightPct: 65.0,
      aspectRatio: '900 / 1897',
      zIndex: 22,
      entranceY: -100,
      entranceDelaySec: 0.23,
      eyebrow: 'Kompakt İstasyon',
      label: 'Bergamo Küçük Modül',
      dimensions: '100 × 210 × 45 cm',
      link: 'urun.html?id=bergamo-kahve-kosesi-61kf-kucuk-kahve-kosesi-1',
    },
    {
      id: 'bergamo-buyuk-sag',
      pieceSlugHint: 'buyuk-kahve-kosesi',
      src: '/hero/dolap-3.png',
      alt: 'Bergamo Büyük Boy Çift Vitrinli Kahve Köşesi Modülü',
      leftPct: 62.5,
      bottomPct: 13.8,
      heightPct: 64.6,
      aspectRatio: '1000 / 1229',
      zIndex: 23,
      entranceY: -100,
      entranceDelaySec: 0.38,
      eyebrow: 'Çift Vitrinli Amiral',
      label: 'Bergamo Büyük Modül',
      dimensions: '180 × 210 × 45 cm',
      link: 'urun.html?id=bergamo-kahve-kosesi-61kf-buyuk-kahve-kosesi-3',
    },
  ],
  decors: [
    {
      id: 'bergamo-dekor-sol',
      src: '/hero/dekor-sol.png',
      alt: 'Ön Plan Bar Masası ve Metal Tabure Dekoru',
      side: 'left',
      leftPct: 0,
      bottomPct: 0,
      widthPct: 22.13,
      aspectRatio: '609 / 613',
      zIndex: 31,
      entranceX: -72,
      parallaxFactorX: 1.35,
      parallaxFactorY: 1.0,
    },
    {
      id: 'bergamo-dekor-sag',
      src: '/hero/dekor-sag.png',
      alt: 'Ön Plan Deri Berjer ve Kahve Sehpası Dekoru',
      side: 'right',
      rightPct: 0,
      bottomPct: 0,
      widthPct: 17.22,
      aspectRatio: '474 / 569',
      zIndex: 32,
      entranceX: 72,
      parallaxFactorX: 1.55,
      parallaxFactorY: 1.15,
    },
  ],
};

export const COLLECTION_SCENES: Record<string, CollectionSceneConfig> = {
  bergamo: BERGAMO_SCENE_CONFIG,
};

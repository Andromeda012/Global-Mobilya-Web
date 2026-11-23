/**
 * Global Kapak Mobilya — Etkileşimli Koleksiyon Sahnesi Yapılandırma Şeması
 * -------------------------------------------------------------------------
 * Gelecekteki Supabase / ERP entegrasyonu için tüm çok katmanlı sahne görselleri,
 * yüzde koordinatları, ışık/gölge ayarları ve tooltip ürün verileri tek şemada tutulur.
 */

export interface SceneBackgroundConfig {
  src: string;
  alt: string;
  initialScale: number;
  targetScale: number;
  entranceDurationSec: number;
}

export interface SceneModuleItem {
  id: string;
  pieceSlugHint?: string;
  src: string;
  alt: string;
  leftPct: number;
  bottomPct: number;
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
  widthPct: number;
  aspectRatio: string;
  zIndex: number;
  entranceX: number;
}

export interface CollectionSceneConfig {
  id: string;
  collectionSlugMatch: string;
  fullBleedStage: boolean;
  hideFlatPiecesTray: boolean;
  stageAspectRatio: string;
  background: SceneBackgroundConfig;
  modules: SceneModuleItem[];
  decors: SceneDecorItem[];
}

export const BERGAMO_SCENE_CONFIG: CollectionSceneConfig = {
  id: 'bergamo-interactive-scene-v2',
  collectionSlugMatch: 'bergamo',
  fullBleedStage: true,
  hideFlatPiecesTray: true,
  stageAspectRatio: '1920 / 1072',
  background: {
    src: '/hero/bg.jpg',
    alt: 'Bergamo Kahve Köşesi Tuğla ve Sıva Duvarlı Showroom Mekânı',
    initialScale: 1.05,
    targetScale: 1.0,
    entranceDurationSec: 1.15,
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
      entranceY: -96,
      entranceDelaySec: 0.08,
      eyebrow: 'Tek Vitrinli Modül',
      label: 'Orta Boy Modül',
      dimensions: '120 / 200 / 45',
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
      entranceY: -96,
      entranceDelaySec: 0.23,
      eyebrow: 'Kompakt İstasyon',
      label: 'Küçük Boy Modül',
      dimensions: '80 / 200 / 45',
      link: 'urun.html?id=bergamo-kahve-kosesi-61kf-kucuk-kahve-kosesi-1',
    },
    {
      id: 'bergamo-buyuk-sag',
      pieceSlugHint: 'buyuk-kahve-kosesi',
      src: '/hero/dolap-3.png',
      alt: 'Bergamo Büyük Boy Çift Vitrinli Kahve Köşesi Modülü',
      leftPct: 62.5,
      bottomPct: 14.0,
      heightPct: 64.6,
      aspectRatio: '1000 / 1229',
      zIndex: 23,
      entranceY: -96,
      entranceDelaySec: 0.38,
      eyebrow: 'Çift Vitrinli Amiral',
      label: 'Büyük Boy Modül',
      dimensions: '160 / 200 / 45',
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
      entranceX: -64,
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
      entranceX: 64,
    },
  ],
};

export const COLLECTION_SCENES: Record<string, CollectionSceneConfig> = {
  bergamo: BERGAMO_SCENE_CONFIG,
};

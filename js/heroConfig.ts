/**
 * Global Kapak Mobilya — Etkileşimli Koleksiyon Sahnesi Yapılandırma Şeması
 * -------------------------------------------------------------------------
 * Gelecekteki Supabase / ERP entegrasyonu için çok katmanlı giriş animasyonu,
 * tam kompozit master geçişi (`finalMaster`) ve görünmez etkileşimli modül
 * hotspot bölgeleri tek bir veri şemasında tutulur.
 */

export interface SceneBackgroundConfig {
  src: string;
  alt: string;
  initialScale: number;
  targetScale: number;
  entranceDurationSec: number;
}

export interface SceneMasterOverlayConfig {
  src: string;
  alt: string;
  revealDelaySec: number;
  fadeDurationSec: number;
}

export interface SceneModuleItem {
  id: string;
  pieceSlugHint?: string;
  src: string;
  alt: string;
  leftPct: number;
  bottomPct: number;
  widthPct: number;
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
  finalMaster?: SceneMasterOverlayConfig;
  modules: SceneModuleItem[];
  decors: SceneDecorItem[];
}

export const BERGAMO_SCENE_CONFIG: CollectionSceneConfig = {
  id: 'bergamo-interactive-scene-v3',
  collectionSlugMatch: 'bergamo',
  fullBleedStage: true,
  hideFlatPiecesTray: true,
  stageAspectRatio: '1024 / 571',
  background: {
    src: '/hero/bg.jpg',
    alt: 'Bergamo Kahve Köşesi Tuğla ve Sıva Duvarlı Showroom Mekânı',
    initialScale: 1.03,
    targetScale: 1.0,
    entranceDurationSec: 0.78,
  },
  finalMaster: {
    src: '/hero/bergamo-final.jpg',
    alt: 'Bergamo Kahve Köşesi Tam Kompozit Stüdyo Sahnesi',
    revealDelaySec: 0.68,
    fadeDurationSec: 0.58,
  },
  modules: [
    {
      id: 'bergamo-orta-sol',
      pieceSlugHint: 'orta-kahve-kosesi',
      src: '/hero/bergamo-sol-drop.png',
      alt: 'Bergamo Orta Boy Tek Vitrinli Kahve Köşesi Modülü',
      leftPct: 16.80,
      bottomPct: 13.13,
      widthPct: 21.48,
      heightPct: 70.23,
      aspectRatio: '220 / 401',
      zIndex: 21,
      entranceY: -90,
      entranceDelaySec: 0,
      eyebrow: 'Tek Vitrinli Modül',
      label: 'Orta Boy Modül',
      dimensions: '120 / 200 / 45',
      link: 'urun.html?id=bergamo-kahve-kosesi-61kf-orta-kahve-kosesi-2',
    },
    {
      id: 'bergamo-kucuk-merkez',
      pieceSlugHint: 'kucuk-kahve-kosesi',
      src: '/hero/bergamo-orta-drop.png',
      alt: 'Bergamo Küçük Boy Kahve Köşesi Modülü',
      leftPct: 41.60,
      bottomPct: 13.13,
      widthPct: 17.77,
      heightPct: 70.23,
      aspectRatio: '182 / 401',
      zIndex: 22,
      entranceY: -90,
      entranceDelaySec: 0,
      eyebrow: 'Kompakt İstasyon',
      label: 'Küçük Boy Modül',
      dimensions: '80 / 200 / 45',
      link: 'urun.html?id=bergamo-kahve-kosesi-61kf-kucuk-kahve-kosesi-1',
    },
    {
      id: 'bergamo-buyuk-sag',
      pieceSlugHint: 'buyuk-kahve-kosesi',
      src: '/hero/bergamo-sag-drop.png',
      alt: 'Bergamo Büyük Boy Çift Vitrinli Kahve Köşesi Modülü',
      leftPct: 62.79,
      bottomPct: 13.13,
      widthPct: 30.66,
      heightPct: 70.23,
      aspectRatio: '314 / 401',
      zIndex: 23,
      entranceY: -90,
      entranceDelaySec: 0,
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
      entranceX: -56,
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
      entranceX: 56,
    },
  ],
};

export const COLLECTION_SCENES: Record<string, CollectionSceneConfig> = {
  bergamo: BERGAMO_SCENE_CONFIG,
};

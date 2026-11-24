/**
 * Global Kapak Mobilya — Etkileşimli Koleksiyon Sahnesi Yapılandırma Şeması
 * -------------------------------------------------------------------------
 * Gelecekteki Supabase / ERP entegrasyonu için yavaşlatılmış eşzamanlı giriş
 * koreografisi, tam kompozit master geçişi (`finalMaster`) ve etkileşimli
 * modül hotspot verilerini merkezi olarak tanımlar.
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
  entranceDurationSec: number;
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
  entranceDelaySec: number;
  entranceDurationSec: number;
}

export interface CollectionSceneConfig {
  id: string;
  collectionSlugMatch: string;
  stageAspectRatio: string;
  background: SceneBackgroundConfig;
  finalMaster?: SceneMasterOverlayConfig;
  modules: SceneModuleItem[];
  decors: SceneDecorItem[];
}

export const BERGAMO_SCENE_CONFIG: CollectionSceneConfig = {
  id: 'bergamo-interactive-scene-v4',
  collectionSlugMatch: 'bergamo',
  stageAspectRatio: '1024 / 571',
  background: {
    src: '/hero/bg.jpg',
    alt: 'Bergamo Kahve Köşesi Tuğla ve Sıva Duvarlı Showroom Mekânı',
    initialScale: 1.05,
    targetScale: 1.0,
    entranceDurationSec: 1.5,
  },
  finalMaster: {
    src: '/hero/bergamo-final.jpg',
    alt: 'Bergamo Kahve Köşesi Tam Kompozit Stüdyo Sahnesi',
    revealDelaySec: 1.68,
    fadeDurationSec: 0.85,
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
      entranceY: -145,
      entranceDelaySec: 0.22,
      entranceDurationSec: 1.42,
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
      entranceY: -145,
      entranceDelaySec: 0.22,
      entranceDurationSec: 1.42,
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
      entranceY: -145,
      entranceDelaySec: 0.22,
      entranceDurationSec: 1.42,
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
      entranceX: -85,
      entranceDelaySec: 0.28,
      entranceDurationSec: 1.3,
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
      entranceX: 85,
      entranceDelaySec: 0.28,
      entranceDurationSec: 1.3,
    },
  ],
};

export const COLLECTION_SCENES: Record<string, CollectionSceneConfig> = {
  bergamo: BERGAMO_SCENE_CONFIG,
};

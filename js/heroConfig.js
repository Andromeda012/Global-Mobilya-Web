/**
 * Global Mobilya — Koleksiyon Şehir / Koordinat / Atmosfer & Etkileşimli Sahne Kayıt Defteri
 * -------------------------------------------------------------------------------------------
 * `collectionsConfig`: Şehir adı, ülke, koordinatlar ve aurora renk tonlarını sağlar;
 * `SkyElevatorTransition` ve `koleksiyon.html` doğrudan buradan beslenir.
 */

export const collectionsConfig = {
  bergamo: {
    key: 'bergamo',
    city: 'BERGAMO',
    country: 'İTALYA',
    coords: '45.6983° K, 9.6773° D',
    aurora: {
      base: '#231309',
      c1: '#F59E0B',
      c2: '#EA580C',
      c3: '#FBBF24',
      c4: '#B45309',
      accent: '#F6C86E',
      swatches: ['#543C24', '#8E765E', '#CC9C3C', '#E4DAD0'],
    },
  },
  lahey: {
    key: 'lahey',
    city: 'LAHEY',
    country: 'HOLLANDA',
    coords: '52.0705° K, 4.3007° D',
    aurora: {
      base: '#0B241D',
      c1: '#10B981',
      c2: '#FACC15',
      c3: '#06B6D4',
      c4: '#84CC16',
      accent: '#9AE6B4',
      swatches: ['#6C6C54', '#84846C', '#CCB484', '#EFE9DF'],
    },
  },
  marsilya: {
    key: 'marsilya',
    city: 'MARSİLYA',
    country: 'FRANSA',
    coords: '43.2965° K, 5.3698° D',
    aurora: {
      base: '#081F37',
      c1: '#0EA5E9',
      c2: '#FACC15',
      c3: '#2563EB',
      c4: '#FBBF24',
      accent: '#FDE047',
      swatches: ['#1E88E5', '#FACC15', '#6C543C', '#F3EFEA'],
    },
  },
  palermo: {
    key: 'palermo',
    city: 'PALERMO',
    country: 'SİCİLYA / İTALYA',
    coords: '38.1157° K, 13.3615° D',
    aurora: {
      base: '#281014',
      c1: '#F97316',
      c2: '#FBBF24',
      c3: '#14B8A6',
      c4: '#F43F5E',
      accent: '#FDBA74',
      swatches: ['#6C543C', '#B49C84', '#CC843C', '#E9DFD7'],
    },
  },
  toronto: {
    key: 'toronto',
    city: 'TORONTO',
    country: 'KANADA',
    coords: '43.6532° K, 79.3832° B',
    aurora: {
      base: '#0A162B',
      c1: '#3B82F6',
      c2: '#06B6D4',
      c3: '#EAB308',
      c4: '#8B5CF6',
      accent: '#93C5FD',
      swatches: ['#543C3C', '#848484', '#B4B4B4', '#B48424'],
    },
  },
  troyes: {
    key: 'troyes',
    city: 'TROYES',
    country: 'FRANSA',
    coords: '48.2973° K, 4.0744° D',
    aurora: {
      base: '#270D19',
      c1: '#E11D48',
      c2: '#F59E0B',
      c3: '#D946EF',
      c4: '#EA580C',
      accent: '#FDA4AF',
      swatches: ['#3C2424', '#6C543C', '#9C5424', '#B48454'],
    },
  },
  bohem: {
    key: 'bohem',
    city: 'BOHEM ATÖLYE',
    country: 'EGE & AKDENİZ',
    coords: '38.4237° K, 27.1428° D',
    aurora: {
      base: '#231024',
      c1: '#EC4899',
      c2: '#14B8A6',
      c3: '#F59E0B',
      c4: '#A855F7',
      accent: '#F9A8D4',
      swatches: ['#242424', '#543C3C', '#6C5454', '#B49C9C'],
    },
  },
  fallback: {
    key: 'fallback',
    city: 'İSTANBUL ATÖLYE',
    country: 'TÜRKİYE',
    coords: '41.0082° K, 28.9784° D',
    aurora: {
      base: '#0E1C26',
      c1: '#0EA5E9',
      c2: '#F59E0B',
      c3: '#10B981',
      c4: '#8B5CF6',
      accent: '#DFC793',
      swatches: ['#3D352E', '#5E7462', '#C5A059', '#F0ECE4'],
    },
  },
};

export const BERGAMO_SCENE_CONFIG = {
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
    revealDelaySec: 1.65,
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
      entranceDelaySec: 0.15,
      entranceDurationSec: 1.4,
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
      entranceDelaySec: 0.15,
      entranceDurationSec: 1.4,
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
      entranceDelaySec: 0.15,
      entranceDurationSec: 1.4,
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
      entranceDelaySec: 0.22,
      entranceDurationSec: 1.25,
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
      entranceDelaySec: 0.22,
      entranceDurationSec: 1.25,
    },
  ],
};

export const COLLECTION_SCENES = {
  bergamo: BERGAMO_SCENE_CONFIG,
};

const isLegacyKapak = (v) =>
  typeof v === 'string' && /membran|vakum\s*pres|mdf|viyana|siena|porto|milano|verona/i.test(v);

export function getCollectionWorldEntry(collectionOrSlug) {
  const s = typeof collectionOrSlug === 'string'
    ? collectionOrSlug.toLowerCase()
    : String(collectionOrSlug?.slug || collectionOrSlug?.name || '').toLowerCase();
  const key = Object.keys(collectionsConfig).find((k) => k !== 'fallback' && s.includes(k));
  return collectionsConfig[key || 'fallback'];
}

function enrichModulesFromPieces(modules, collection) {
  const pieces = Array.isArray(collection?.pieces) ? collection.pieces : [];
  if (!pieces.length) return modules;

  return modules.map((mod) => {
    const hint = String(mod.pieceSlugHint || '').toLowerCase();
    const matched = hint
      ? pieces.find((p) => String(p.slug || '').toLowerCase().includes(hint))
      : null;

    if (!matched) return mod;

    const cleanName = String(matched.name || matched.title || '').trim();
    const validName =
      cleanName &&
      !isLegacyKapak(cleanName) &&
      cleanName.toLowerCase() !== String(collection.name || '').toLowerCase()
        ? cleanName
        : mod.label;
    const dims = String(matched.dimensions || matched.olcu || '').trim();

    return {
      ...mod,
      label: validName,
      dimensions: dims && !isLegacyKapak(dims) ? dims : mod.dimensions,
      link: matched.slug ? `urun.html?id=${encodeURIComponent(matched.slug)}` : mod.link,
    };
  });
}

export function resolveCollectionSceneConfig(collection) {
  if (!collection) return null;

  let base = null;
  if (
    collection.scene_config &&
    typeof collection.scene_config === 'object' &&
    Array.isArray(collection.scene_config.modules)
  ) {
    base = collection.scene_config;
  } else {
    const slug = String(collection.slug || '').toLowerCase();
    const name = String(collection.name || '').toLowerCase();
    const key = Object.keys(COLLECTION_SCENES).find((k) => slug.includes(k) || name.includes(k));
    if (key) base = COLLECTION_SCENES[key];
  }

  if (!base) return null;

  return {
    ...base,
    modules: enrichModulesFromPieces(base.modules || [], collection),
  };
}

if (typeof window !== 'undefined') {
  window.GKM_HERO_CONFIG = {
    collectionsConfig,
    BERGAMO_SCENE_CONFIG,
    COLLECTION_SCENES,
    getCollectionWorldEntry,
    resolveCollectionSceneConfig,
  };
}

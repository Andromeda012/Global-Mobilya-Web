/**
 * Global Mobilya — Etkileşimli Koleksiyon Sahnesi Yapılandırma ve Otomasyon Kayıt Defteri
 * --------------------------------------------------------------------------------------
 * Modüller yukarıdan aynı anda (delay: 0) referans koordinatlara iner; yerleşim tamamlanırken
 * master kompozit fotoğraf (`finalMaster`) kesintisiz çözünme ile sahneye sabitlenir ve
 * görünmez etkileşimli hotspot bölgeleri üzerinden ürün detaylarına erişilir.
 */

export const BERGAMO_SCENE_CONFIG = {
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

export const COLLECTION_SCENES = {
  bergamo: BERGAMO_SCENE_CONFIG,
};

const isLegacyKapak = (v) =>
  typeof v === 'string' && /membran|vakum\s*pres|mdf|viyana|siena|porto|milano|verona/i.test(v);

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
    BERGAMO_SCENE_CONFIG,
    COLLECTION_SCENES,
    resolveCollectionSceneConfig,
  };
}

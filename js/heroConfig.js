/**
 * Global Mobilya — Etkileşimli Koleksiyon Sahnesi Yapılandırma ve Otomasyon Kayıt Defteri
 * --------------------------------------------------------------------------------------
 * Her koleksiyon için çok katmanlı (arka plan + modül dolaplar + ön plan dekorlar)
 * sahne tanımlarını tutar. İleride Supabase `collections.scene_config` JSONB sütunundan
 * doğrudan beslendiğinde yeni koleksiyonlar kod değişikliği olmadan otomatik sahne alır.
 */

export const BERGAMO_SCENE_CONFIG = {
  id: 'bergamo-interactive-scene-v1',
  collectionSlugMatch: 'bergamo',
  stageAspectRatio: '1920 / 1072',
  badgeText: 'Etkileşimli Modül Sahnesi · İncelemek İçin Üzerine Gelin',
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

/**
 * Verilen koleksiyon kaydı için etkileşimli sahne yapılandırmasını çözer.
 * 1) Öncelik Supabase/CRM kaydındaki `collection.scene_config` alanındadır.
 * 2) İkincil olarak yerel `COLLECTION_SCENES` kayıt defteri koleksiyon slug'ı ile eşleştirilir.
 * 3) Eşleşen modüller canlı `collection.pieces` verisiyle zenginleştirilir.
 */
export function resolveCollectionSceneConfig(collection) {
  if (!collection) return null;

  let base = null;
  if (collection.scene_config && typeof collection.scene_config === 'object' && Array.isArray(collection.scene_config.modules)) {
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

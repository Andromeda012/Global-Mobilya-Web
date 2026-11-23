/**
 * Global Mobilya — Kusursuz Geçişli Tam Ekran Koleksiyon Sahnesi (Framer Motion + React 18)
 * -----------------------------------------------------------------------------------------
 * 1) Katman 1 (z-10): Temiz arka plan mekân görseli (1.03 -> 1.0 yerleşme).
 * 2) Katman 2 (z-20): Tüm dolap modülleri AYNI ANDA (stagger olmadan) yukarıdan aşağıya iner;
 *    referans kompozitle 1:1 piksel koordinatlarına sabitlenir.
 * 3) Katman 3 (z-30): Sol ve sağ ön plan dekorları eşzamanlı sahneye yerleşir.
 * 4) Katman 4 (z-36): Yerleşim tamamlanırken tam kompozit master fotoğraf (`finalMaster`)
 *    sıfır sıçrama ve sıfır kopuklukla (`opacity: 0 -> 1`) pürüzsüzce sabitlenir.
 * 5) Katman 5 (z-42): Görünmez etkileşimli hotspot bölgeleri üzerinden her modüle ait
 *    vurgulama ve ürün detay kartı (`Detayları Gör →`) çalışır.
 */

import React, { useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import {
  AnimatePresence,
  MotionConfig,
  motion,
} from 'https://esm.sh/framer-motion@11.11.17?deps=react@18.3.1,react-dom@18.3.1';
import { resolveCollectionSceneConfig } from './heroConfig.js';

const h = React.createElement;
const ACTIVE_ROOTS = new Map();

function DroppingModuleVisual({ item }) {
  return h(
    motion.div,
    {
      className: 'scase-module-slot',
      style: {
        left: `${item.leftPct}%`,
        bottom: `${item.bottomPct}%`,
        width: `${item.widthPct}%`,
        height: `${item.heightPct}%`,
        zIndex: item.zIndex,
      },
      initial: { y: item.entranceY ?? -90, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      viewport: { once: true, amount: 0.15 },
      transition: {
        y: { type: 'spring', stiffness: 74, damping: 16, delay: item.entranceDelaySec ?? 0 },
        opacity: { duration: 0.36, delay: item.entranceDelaySec ?? 0 },
      },
    },
    h('span', { className: 'scase-contact-shadow scase-contact-module', 'aria-hidden': 'true' }),
    h('img', {
      src: item.src,
      alt: item.alt,
      className: 'scase-module-img',
      draggable: false,
    })
  );
}

function InteractiveHotspotZone({ item, isActive, isDimmed, onActivate, onDeactivate, onToggleTap }) {
  return h(
    'div',
    {
      className: `scase-hotspot-zone${isActive ? ' is-hovered' : ''}${isDimmed ? ' is-dimmed' : ''}`,
      'data-module-id': item.id,
      style: {
        left: `${item.leftPct}%`,
        bottom: `${item.bottomPct}%`,
        width: `${item.widthPct}%`,
        height: `${item.heightPct}%`,
        zIndex: isActive ? 48 : 42,
      },
      onMouseEnter: () => onActivate(item.id),
      onMouseLeave: () => onDeactivate(item.id),
      onClick: (e) => {
        if (e.target.closest('a')) return;
        e.stopPropagation();
        onToggleTap(item.id);
      },
    },
    h('div', { className: 'scase-hotspot-halo', 'aria-hidden': 'true' }),
    h(
      AnimatePresence,
      null,
      isActive
        ? h(
            motion.div,
            {
              key: `tip-${item.id}`,
              className: 'scase-tooltip',
              role: 'dialog',
              'aria-label': item.label,
              initial: { opacity: 0, y: 8, scale: 0.94 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: 6, scale: 0.94 },
              transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
              onClick: (e) => e.stopPropagation(),
            },
            h('span', { className: 'scase-tooltip-eyebrow' }, item.eyebrow),
            h('strong', { className: 'scase-tooltip-title' }, item.label),
            item.dimensions
              ? h('span', { className: 'scase-tooltip-dim' }, item.dimensions)
              : null,
            h(
              'a',
              {
                href: item.link,
                className: 'scase-tooltip-link',
              },
              'Detayları Gör →'
            )
          )
        : null
    )
  );
}

function StaticAnchoredDecorLayer({ decor }) {
  const posStyle = {
    bottom: `${decor.bottomPct}%`,
    width: `${decor.widthPct}%`,
    aspectRatio: decor.aspectRatio,
    zIndex: decor.zIndex,
  };
  if (decor.side === 'left') posStyle.left = `${decor.leftPct ?? 0}%`;
  else posStyle.right = `${decor.rightPct ?? 0}%`;

  return h(
    motion.div,
    {
      className: `scase-decor-slot scase-decor-${decor.side}`,
      style: posStyle,
      initial: { x: decor.entranceX ?? (decor.side === 'left' ? -56 : 56), opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      viewport: { once: true, amount: 0.15 },
      transition: { duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] },
    },
    h('span', { className: 'scase-contact-shadow scase-contact-decor', 'aria-hidden': 'true' }),
    h('img', {
      src: decor.src,
      alt: decor.alt,
      className: 'scase-decor-img',
      draggable: false,
    })
  );
}

function CollectionShowcaseStage({ scene }) {
  const [hoveredId, setHoveredId] = useState(null);
  const modules = scene.modules || [];
  const decors = scene.decors || [];
  const finalMaster = scene.finalMaster;

  return h(
    MotionConfig,
    { reducedMotion: 'never' },
    h(
      'div',
      { className: 'scase-stage-shell' },
      h(
        'div',
        {
          className: 'scase-stage',
          style: { aspectRatio: scene.stageAspectRatio || '1024 / 571' },
          onMouseLeave: () => setHoveredId(null),
          onClick: () => setHoveredId(null),
        },
        // Katman 1 (z-10): Temiz Arka Plan Mekânı
        h(
          'div',
          { className: 'scase-layer-bg' },
          h(motion.img, {
            src: scene.background.src,
            alt: scene.background.alt,
            className: 'scase-bg-img',
            initial: { scale: scene.background.initialScale ?? 1.03 },
            whileInView: { scale: scene.background.targetScale ?? 1.0 },
            viewport: { once: true, amount: 0.15 },
            transition: {
              duration: scene.background.entranceDurationSec ?? 0.78,
              ease: [0.22, 1, 0.36, 1],
            },
            draggable: false,
          })
        ),

        // Katman 2 (z-20): Tüm Modül Dolapları Yukarıdan AYNI ANDA İner
        h(
          'div',
          { className: 'scase-layer-modules', 'aria-hidden': 'true' },
          modules.map((mod, idx) => h(DroppingModuleVisual, { key: mod.id || idx, item: mod }))
        ),

        // Katman 3 (z-30): Sol ve Sağ Ön Plan Dekorları
        h(
          'div',
          { className: 'scase-layer-decors', 'aria-hidden': 'true' },
          decors.map((d) => h(StaticAnchoredDecorLayer, { key: d.id, decor: d }))
        ),

        // Katman 3.5 (z-34): Sıcak Ortam Işığı Ton Bütünleştirici
        h('div', { className: 'scase-warm-blend', 'aria-hidden': 'true' }),

        // Katman 4 (z-36): Yerleşim biterken sıçramasız tam kompozit final görseline çözünme
        finalMaster
          ? h(motion.img, {
              src: finalMaster.src,
              alt: finalMaster.alt,
              className: 'scase-master-overlay',
              initial: { opacity: 0 },
              whileInView: { opacity: 1 },
              viewport: { once: true, amount: 0.15 },
              transition: {
                duration: finalMaster.fadeDurationSec ?? 0.58,
                delay: finalMaster.revealDelaySec ?? 0.68,
                ease: [0.22, 1, 0.36, 1],
              },
              draggable: false,
            })
          : null,

        // Katman 5 (z-42): Final Fotoğraf Üstünde Görünmez İnteraktif Modül Hotspotları
        h(
          'div',
          { className: 'scase-layer-hotspots', 'aria-label': 'Koleksiyon Modülleri Etkileşim Katmanı' },
          modules.map((mod) =>
            h(InteractiveHotspotZone, {
              key: `hot-${mod.id}`,
              item: mod,
              isActive: hoveredId === mod.id,
              isDimmed: Boolean(hoveredId && hoveredId !== mod.id),
              onActivate: (id) => setHoveredId(id),
              onDeactivate: (id) => setHoveredId((prev) => (prev === id ? null : prev)),
              onToggleTap: (id) => setHoveredId((prev) => (prev === id ? null : id)),
            })
          )
        )
      ),

      // Sahne altı tam genişlikli modül etkileşim şeridi
      modules.length
        ? h(
            'div',
            { className: 'scase-dock-bar', 'aria-label': 'Seri Modülleri Hızlı İnceleme' },
            h(
              'span',
              { className: 'scase-dock-label' },
              'Modülü sahnede vurgulamak için üzerine gelin veya dokunun:'
            ),
            h(
              'div',
              { className: 'scase-dock-pills' },
              modules.map((mod) =>
                h(
                  'a',
                  {
                    key: `dock-${mod.id}`,
                    href: mod.link,
                    className: `scase-dock-pill${hoveredId === mod.id ? ' is-active' : ''}`,
                    onMouseEnter: () => setHoveredId(mod.id),
                    onMouseLeave: () => setHoveredId(null),
                  },
                  h('strong', null, mod.label),
                  mod.dimensions ? h('span', null, mod.dimensions) : null,
                  h('em', null, 'Detaya Git →')
                )
              )
            )
          )
        : null
    )
  );
}

export function mountAllCollectionScenes(collections = []) {
  for (const [el, root] of ACTIVE_ROOTS.entries()) {
    if (!document.body.contains(el)) {
      root.unmount();
      ACTIVE_ROOTS.delete(el);
    }
  }

  const mountNodes = document.querySelectorAll('[data-collection-scene]');
  mountNodes.forEach((node) => {
    const slug = node.getAttribute('data-collection-scene') || '';
    const matchedCol = collections.find((c) => String(c.slug || '') === slug) || { slug };
    const scene = resolveCollectionSceneConfig(matchedCol);
    if (!scene) return;

    let root = ACTIVE_ROOTS.get(node);
    if (!root) {
      root = createRoot(node);
      ACTIVE_ROOTS.set(node, root);
    }
    root.render(h(CollectionShowcaseStage, { scene }));
  });
}

if (typeof window !== 'undefined') {
  window.GKM_COLLECTION_STAGE = {
    mountAll: mountAllCollectionScenes,
    resolveScene: resolveCollectionSceneConfig,
  };

  if (Array.isArray(window.__GKM_COLLECTIONS_CACHE)) {
    mountAllCollectionScenes(window.__GKM_COLLECTIONS_CACHE);
  }
}

/**
 * Global Mobilya — Kamera Hızına Senkronize Koleksiyon Sahnesi (Framer Motion + React 18)
 * -----------------------------------------------------------------------------------------
 * GİRİŞ ('entering'):
 *   1) Kamera aşağı inerken dolap modülleri aynı hızda yay fiziğiyle yukarıdan iner (~0.88s).
 *   2) Modüller yerleşir yerleşmez çok kısa farkla (0.80s) ön plan dekorları sağdan ve soldan gelir.
 *   3) En sonda (1.38s -> 1.94s) master stüdyo fotoğrafı sıçramasız oturur ve hotspotlar aktif olur.
 * ÇIKIŞ ('exiting'):
 *   Kamera yukarı bulutlara çıkarken dolaplar aşağı doğru ('125%'), dekorlar yanlara açılır.
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
const STAGE_ENTRIES = new Map();
let _collectionsList = [];
let _activeSlug = '';
let _exitingSlug = '';

function DroppingModuleVisual({ item, phase }) {
  const isEntering = phase === 'entering';
  const isExiting = phase === 'exiting';

  const target = isExiting
    ? { y: '125%', opacity: 0 }
    : isEntering
      ? { y: 0, opacity: 1 }
      : { y: item.entranceY ?? -135, opacity: 0 };

  const transition = isExiting
    ? {
        y: { duration: 0.68, ease: [0.45, 0, 0.85, 0.38] },
        opacity: { duration: 0.48, delay: 0.14 },
      }
    : {
        y: {
          type: 'spring',
          stiffness: 76,
          damping: 16,
          mass: 1.0,
          delay: item.entranceDelaySec ?? 0.08,
        },
        opacity: {
          duration: 0.36,
          delay: item.entranceDelaySec ?? 0.08,
          ease: [0.22, 1, 0.36, 1],
        },
      };

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
      initial: { y: item.entranceY ?? -135, opacity: 0 },
      animate: target,
      transition,
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
              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
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

function StaticAnchoredDecorLayer({ decor, phase }) {
  const posStyle = {
    bottom: `${decor.bottomPct}%`,
    width: `${decor.widthPct}%`,
    aspectRatio: decor.aspectRatio,
    zIndex: decor.zIndex,
  };
  if (decor.side === 'left') posStyle.left = `${decor.leftPct ?? 0}%`;
  else posStyle.right = `${decor.rightPct ?? 0}%`;

  const initX = decor.entranceX ?? (decor.side === 'left' ? -85 : 85);
  const isEntering = phase === 'entering';
  const isExiting = phase === 'exiting';

  const target = isExiting
    ? { x: initX * 1.1, y: 50, opacity: 0 }
    : isEntering
      ? { x: 0, y: 0, opacity: 1 }
      : { x: initX, y: 0, opacity: 0 };

  const transition = isExiting
    ? { duration: 0.5, ease: [0.45, 0, 0.85, 0.38] }
    : {
        x: {
          type: 'spring',
          stiffness: 88,
          damping: 17,
          delay: decor.entranceDelaySec ?? 0.8,
        },
        opacity: {
          duration: 0.38,
          delay: decor.entranceDelaySec ?? 0.8,
        },
      };

  return h(
    motion.div,
    {
      className: `scase-decor-slot scase-decor-${decor.side}`,
      style: posStyle,
      initial: { x: initX, y: 0, opacity: 0 },
      animate: target,
      transition,
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

function CollectionShowcaseStage({ scene, phase, activationKey }) {
  const [hoveredId, setHoveredId] = useState(null);
  const modules = scene.modules || [];
  const decors = scene.decors || [];
  const finalMaster = scene.finalMaster;

  const isEntering = phase === 'entering';
  const isExiting = phase === 'exiting';

  return h(
    MotionConfig,
    { reducedMotion: 'never' },
    h(
      'div',
      { className: 'scase-stage-shell' },
      h(
        'div',
        {
          key: `stage-${activationKey}`,
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
            initial: { scale: scene.background.initialScale ?? 1.04 },
            animate: isEntering ? { scale: scene.background.targetScale ?? 1.0 } : { scale: 1.03 },
            transition: {
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            },
            draggable: false,
          })
        ),

        // Katman 2 (z-20): Dolaplar kamerayla aynı hızda yukarıdan iner; çıkışta aşağı iner
        h(
          'div',
          { className: 'scase-layer-modules', 'aria-hidden': 'true' },
          modules.map((mod, idx) =>
            h(DroppingModuleVisual, { key: mod.id || idx, item: mod, phase })
          )
        ),

        // Katman 3 (z-30): Ürünler yerleşince kısa farkla dekorlar sağdan/soldan gelir
        h(
          'div',
          { className: 'scase-layer-decors', 'aria-hidden': 'true' },
          decors.map((d) =>
            h(StaticAnchoredDecorLayer, { key: d.id, decor: d, phase })
          )
        ),

        // Katman 3.5 (z-34): Sıcak Ortam Işığı Ton Bütünleştirici
        h('div', { className: 'scase-warm-blend', 'aria-hidden': 'true' }),

        // Katman 4 (z-36): En sonda nihai stüdyo fotoğrafı oturur; çıkışta kesilmiş parçalara yer açar
        finalMaster
          ? h(motion.img, {
              src: finalMaster.src,
              alt: finalMaster.alt,
              className: 'scase-master-overlay',
              initial: { opacity: 0 },
              animate: isExiting ? { opacity: 0 } : isEntering ? { opacity: 1 } : { opacity: 0 },
              transition: isExiting
                ? { duration: 0.14 }
                : {
                    duration: finalMaster.fadeDurationSec ?? 0.56,
                    delay: finalMaster.revealDelaySec ?? 1.38,
                    ease: [0.22, 1, 0.36, 1],
                  },
              draggable: false,
            })
          : null,

        // Katman 5 (z-42): Görünmez Etkileşimli Modül Hotspot Katmanı
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

      // Sahne altı modül seçici barı
      modules.length
        ? h(
            'div',
            { className: 'scase-dock-bar', 'aria-label': 'Seri Modülleri Hızlı İnceleme' },
            h('span', { className: 'scase-dock-label' }, 'Modüller:'),
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

function renderEntry(node, entry) {
  const phase =
    _exitingSlug === entry.slug
      ? 'exiting'
      : _activeSlug === entry.slug
        ? 'entering'
        : 'idle';
  entry.root.render(
    h(CollectionShowcaseStage, {
      scene: entry.scene,
      phase,
      activationKey: entry.playCount,
    })
  );
}

export function mountAllCollectionScenes(collections = [], activeSlug = _activeSlug) {
  _collectionsList = Array.isArray(collections) ? collections : [];
  if (activeSlug !== undefined) _activeSlug = activeSlug;
  _exitingSlug = '';

  for (const [el, entry] of STAGE_ENTRIES.entries()) {
    if (!document.body.contains(el)) {
      entry.root.unmount();
      STAGE_ENTRIES.delete(el);
    }
  }

  const mountNodes = document.querySelectorAll('[data-collection-scene]');
  mountNodes.forEach((node) => {
    const slug = node.getAttribute('data-collection-scene') || '';
    const matchedCol = _collectionsList.find((c) => String(c.slug || '') === slug) || { slug };
    const scene = resolveCollectionSceneConfig(matchedCol);
    if (!scene) return;

    let entry = STAGE_ENTRIES.get(node);
    if (!entry) {
      entry = { root: createRoot(node), scene, slug, playCount: 0 };
      STAGE_ENTRIES.set(node, entry);
    } else {
      entry.scene = scene;
    }

    if (_activeSlug === slug) {
      entry.playCount += 1;
    }
    renderEntry(node, entry);
  });
}

export function activateSceneSlide(slug = '') {
  _exitingSlug = '';
  _activeSlug = slug;
  for (const [node, entry] of STAGE_ENTRIES.entries()) {
    if (entry.slug === slug) {
      entry.playCount += 1;
    }
    renderEntry(node, entry);
  }
}

export function exitSceneSlide(slug = '') {
  if (!slug) return;
  _exitingSlug = slug;
  for (const [node, entry] of STAGE_ENTRIES.entries()) {
    if (entry.slug === slug) {
      renderEntry(node, entry);
    }
  }
}

if (typeof window !== 'undefined') {
  window.GKM_COLLECTION_STAGE = {
    mountAll: mountAllCollectionScenes,
    activateSlide: activateSceneSlide,
    exitSlide: exitSceneSlide,
    resolveScene: resolveCollectionSceneConfig,
  };

  if (Array.isArray(window.__GKM_COLLECTIONS_CACHE)) {
    mountAllCollectionScenes(window.__GKM_COLLECTIONS_CACHE, window.__GKM_ACTIVE_SCENE_SLUG || '');
  }
}

/**
 * Global Mobilya — Fotogerçekçi Işıklı & Sabitlenebilen Koleksiyon Sahnesi Engine
 * ---------------------------------------------------------------------------------
 * 1) Katman 1 (z-10): Mekân arka planı (tüm sahneyi kaplar, 1.05 -> 1.0 smooth yerleşim).
 * 2) Katman 2 (z-20): Dolap modülleri — tabanında yüksek bulanıklıklı temas gölgesi
 *    (contact shadow) + arkaya doğru çok katmanlı drop-shadow + sabitlenmiş yerleşim
 *    (fare hareketiyle kaymaz; yalnızca hover vurgusu ve ürün bilgi kartı açılır).
 * 3) Katman 3 (z-30): Ön plan dekorları — taban temas gölgesi + gölge derinliği,
 *    giriş animasyonundan sonra konumunda sabit kalır.
 * 4) Katman 4 (z-38): pointer-events-none sıcak ton bütünleştirici katman (`mix-blend-mode: multiply`).
 * 5) Alt İnteraktif Modül Şeridi: Düz kart tekrarı yerine sahne üzerindeki ürünleri
 *    vurgulayıp doğrudan ürün detayına yönlendiren etkileşimli kontrol barı.
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

function InteractiveModuleSlot({ item, index, isActive, isDimmed, onActivate, onDeactivate, onToggleTap }) {
  return h(
    motion.div,
    {
      className: `scase-module-slot${isActive ? ' is-hovered' : ''}${isDimmed ? ' is-dimmed' : ''}`,
      'data-module-id': item.id,
      style: {
        left: `${item.leftPct}%`,
        bottom: `${item.bottomPct}%`,
        height: `${item.heightPct}%`,
        aspectRatio: item.aspectRatio,
        zIndex: isActive ? 45 : item.zIndex,
      },
      initial: { y: item.entranceY ?? -96, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      viewport: { once: true, amount: 0.15 },
      transition: {
        y: { type: 'spring', stiffness: 65, damping: 14, delay: item.entranceDelaySec ?? index * 0.15 },
        opacity: { duration: 0.45, delay: item.entranceDelaySec ?? index * 0.15 },
        scale: { type: 'spring', stiffness: 280, damping: 24 },
      },
      whileHover: { scale: 1.016 },
      onMouseEnter: () => onActivate(item.id),
      onMouseLeave: () => onDeactivate(item.id),
      onClick: (e) => {
        if (e.target.closest('a')) return;
        e.stopPropagation();
        onToggleTap(item.id);
      },
    },
    // Zemin temas gölgesi (blur-md eşdeğeri koyu elips AO)
    h('span', { className: 'scase-contact-shadow scase-contact-module', 'aria-hidden': 'true' }),
    h('img', {
      src: item.src,
      alt: item.alt,
      className: 'scase-module-img',
      draggable: false,
    }),
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
      initial: { x: decor.entranceX ?? (decor.side === 'left' ? -64 : 64), opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      viewport: { once: true, amount: 0.15 },
      transition: { duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] },
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
          style: { aspectRatio: scene.stageAspectRatio || '1920 / 1072' },
          onMouseLeave: () => setHoveredId(null),
          onClick: () => setHoveredId(null),
        },
        // Katman 1 (z-10): Sabitlenebilen Tam Arka Plan
        h(
          'div',
          { className: 'scase-layer-bg' },
          h(motion.img, {
            src: scene.background.src,
            alt: scene.background.alt,
            className: 'scase-bg-img',
            initial: { scale: scene.background.initialScale ?? 1.05 },
            whileInView: { scale: scene.background.targetScale ?? 1.0 },
            viewport: { once: true, amount: 0.15 },
            transition: {
              duration: scene.background.entranceDurationSec ?? 1.15,
              ease: [0.22, 1, 0.36, 1],
            },
            draggable: false,
          })
        ),

        // Katman 2 (z-20): Referans Konumlarına Sabitlenen Modüller (fare ile kayma yok)
        h(
          'div',
          { className: 'scase-layer-modules', 'aria-label': 'Koleksiyon Modülleri' },
          modules.map((mod, idx) =>
            h(InteractiveModuleSlot, {
              key: mod.id || idx,
              item: mod,
              index: idx,
              isActive: hoveredId === mod.id,
              isDimmed: Boolean(hoveredId && hoveredId !== mod.id),
              onActivate: (id) => setHoveredId(id),
              onDeactivate: (id) => setHoveredId((prev) => (prev === id ? null : prev)),
              onToggleTap: (id) => setHoveredId((prev) => (prev === id ? null : id)),
            })
          )
        ),

        // Katman 3 (z-30): Sabitlenen Ön Plan Dekorları (temas gölgeli, kayma yok)
        h(
          'div',
          { className: 'scase-layer-decors', 'aria-hidden': 'true' },
          decors.map((d) => h(StaticAnchoredDecorLayer, { key: d.id, decor: d }))
        ),

        // Katman 4 (z-38): Sıcak Ortam Işığı Ton Bütünleştirici (mix-blend-mode: multiply, pointer-events-none)
        h('div', { className: 'scase-warm-blend', 'aria-hidden': 'true' })
      ),

      // Sahne altı kompakt etkileşimli modül seçici barı
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

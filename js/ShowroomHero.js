/**
 * Global Mobilya — Otomatik Çok Katmanlı Etkileşimli Koleksiyon Sahnesi (Framer Motion + React 18)
 * -----------------------------------------------------------------------------------------------
 * Koleksiyon sayfasında (`koleksiyon.html`) tanımlı `scene_config` veya `COLLECTION_SCENES`
 * eşleşmesi olan her seri için otomatik olarak şu katmanlı yapıyı üretir:
 *   - Katman 1 (z-10): Arka Plan mekân görseli (1.06 -> 1.0 smooth zoom-out + mouse parallax)
 *   - Katman 2 (z-20): Referans ölçülerine yüzdeyle kilitli modül dolapları
 *     (yukarıdan aşağıya yay fiziği + 0.15s stagger + hover/dokunma vurgusu + ürün tooltip'i)
 *   - Katman 3 (z-30): Sol & sağ ön plan dekorları (yatay giriş + derinlikli mouse parallax)
 */

import React, { useEffect, useRef, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
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
      initial: { y: item.entranceY ?? -100, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      viewport: { once: true, amount: 0.2 },
      transition: {
        y: { type: 'spring', stiffness: 65, damping: 14, delay: item.entranceDelaySec ?? index * 0.15 },
        opacity: { duration: 0.48, delay: item.entranceDelaySec ?? index * 0.15 },
        scale: { type: 'spring', stiffness: 280, damping: 22 },
      },
      whileHover: { scale: 1.022 },
      onMouseEnter: () => onActivate(item.id),
      onMouseLeave: () => onDeactivate(item.id),
      onClick: (e) => {
        if (e.target.closest('a')) return;
        e.stopPropagation();
        onToggleTap(item.id);
      },
    },
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

function InteractiveDecorLayer({ decor, normX, normY }) {
  const pxRange = 14 * (decor.parallaxFactorX ?? 1.2);
  const pyRange = 8 * (decor.parallaxFactorY ?? 1.0);
  const x = useTransform(normX, [-0.5, 0.5], [-pxRange, pxRange]);
  const y = useTransform(normY, [-0.5, 0.5], [-pyRange, pyRange]);

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
      initial: { x: decor.entranceX ?? (decor.side === 'left' ? -72 : 72), opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
    },
    h(
      motion.div,
      { className: 'scase-decor-parallax', style: { x, y } },
      h('img', {
        src: decor.src,
        alt: decor.alt,
        className: 'scase-decor-img',
        draggable: false,
      })
    )
  );
}

function CollectionShowcaseStage({ scene }) {
  const stageRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 900 : true
  );

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 95, damping: 24, mass: 0.65 });
  const smoothY = useSpring(rawY, { stiffness: 95, damping: 24, mass: 0.65 });

  const bgStrength = scene.background?.parallaxStrengthPx ?? 8;
  const bgX = useTransform(smoothX, [-0.5, 0.5], [bgStrength, -bgStrength]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [bgStrength * 0.6, -bgStrength * 0.6]);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleMouseMove = (e) => {
    if (!isDesktop || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(nx);
    rawY.set(ny);
  };

  const handleMouseLeaveStage = () => {
    rawX.set(0);
    rawY.set(0);
    setHoveredId(null);
  };

  const modules = scene.modules || [];
  const decors = scene.decors || [];

  return h(
    MotionConfig,
    { reducedMotion: 'never' },
    h(
      'div',
      {
        ref: stageRef,
        className: 'scase-stage',
        style: { aspectRatio: scene.stageAspectRatio || '1920 / 1072' },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeaveStage,
        onClick: () => setHoveredId(null),
      },
      // Katman 1 (z-10): Arka Plan + Scale 1.06 -> 1.0 + İnce Mouse Parallax
      h(
        motion.div,
        {
          className: 'scase-layer-bg',
          style: isDesktop ? { x: bgX, y: bgY } : undefined,
        },
        h(motion.img, {
          src: scene.background.src,
          alt: scene.background.alt,
          className: 'scase-bg-img',
          initial: { scale: scene.background.initialScale ?? 1.06 },
          whileInView: { scale: scene.background.targetScale ?? 1.0 },
          viewport: { once: true, amount: 0.2 },
          transition: {
            duration: scene.background.entranceDurationSec ?? 1.2,
            ease: [0.22, 1, 0.36, 1],
          },
          draggable: false,
        })
      ),

      // Katman 2 (z-20): Referans Ölçü ve Konumlarda Modül Dolapları
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

      // Katman 3 (z-30): Ön Plan Dekorları + Desktop Parallax
      h(
        'div',
        { className: 'scase-layer-decors', 'aria-hidden': 'true' },
        decors.map((d) =>
          h(InteractiveDecorLayer, {
            key: d.id,
            decor: d,
            normX: smoothX,
            normY: smoothY,
          })
        )
      ),

      // Bilgilendirme Rozeti
      scene.badgeText
        ? h('div', { className: 'scase-hint-pill' }, scene.badgeText)
        : null
    )
  );
}

/**
 * Sayfadaki tüm `[data-collection-scene]` kapsayıcılarına ilgili koleksiyon sahnesini
 * otomatik kurar; filtre değişimlerinde eski React ağaçlarını temizler.
 */
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

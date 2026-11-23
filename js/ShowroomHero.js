/**
 * Global Kapak Mobilya — Framer Motion Çok Katmanlı Etkileşimli Showroom Hero Bileşeni
 * Veri kaynağı tamamen ./heroConfig.js içindeki HeroSceneConfig yapısından beslenir.
 */
import React, { useEffect, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useMotionValue,
  useSpring,
  useTransform
} from 'https://esm.sh/framer-motion@11.11.17?deps=react@18.3.1,react-dom@18.3.1';
import { HERO_SCENE_CONFIG, resolveHeroSceneConfig } from './heroConfig.js';

const h = React.createElement;

function ShowroomHeroScene({ initialConfig }) {
  const [config, setConfig] = useState(initialConfig || HERO_SCENE_CONFIG);
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  // Masaüstü fare parallax değerleri (Framer Motion useMotionValue + useSpring)
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const smoothX = useSpring(rawMouseX, { stiffness: 70, damping: 20, mass: 0.6 });
  const smoothY = useSpring(rawMouseY, { stiffness: 70, damping: 20, mass: 0.6 });

  const bgParallaxX = useTransform(smoothX, v => v * -10);
  const bgParallaxY = useTransform(smoothY, v => v * -6);
  const leftDecorX = useTransform(smoothX, v => v * (config.decors[0]?.parallaxStrengthX ?? 22));
  const leftDecorY = useTransform(smoothY, v => v * (config.decors[0]?.parallaxStrengthY ?? 12));
  const rightDecorX = useTransform(smoothX, v => v * (config.decors[1]?.parallaxStrengthX ?? -24));
  const rightDecorY = useTransform(smoothY, v => v * (config.decors[1]?.parallaxStrengthY ?? 14));

  useEffect(() => {
    let mounted = true;
    resolveHeroSceneConfig().then(remoteCfg => {
      if (mounted && remoteCfg) setConfig(remoteCfg);
    });
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      mounted = false;
      window.removeEventListener('resize', onResize);
    };
  }, []);

  function handleMouseMove(e) {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rawMouseX.set(nx);
    rawMouseY.set(ny);
  }

  function handleMouseLeave() {
    rawMouseX.set(0);
    rawMouseY.set(0);
    setHoveredId(null);
  }

  const leftDecor = (config.decors || []).find(d => d.side === 'left');
  const rightDecor = (config.decors || []).find(d => d.side === 'right');

  return h(
    MotionConfig,
    { reducedMotion: 'never' },
    h(
      'section',
      {
        id: 'heroStage',
        className: 'fhero-stage',
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        'aria-label': 'Global Mobilya Etkileşimli Showroom Vitrin'
      },
      [
        // ── KATMAN 1 (z-10): ARKA PLAN MEKAN ──
        h(
          motion.div,
          {
            key: 'layer-bg',
            className: 'fhero-layer-bg',
            style: isMobile ? undefined : { x: bgParallaxX, y: bgParallaxY }
          },
          [
            h(motion.img, {
              src: config.background.image,
              alt: config.background.alt,
              className: 'fhero-bg-img',
              initial: { scale: config.background.initialScale ?? 1.06 },
              animate: { scale: config.background.targetScale ?? 1.0 },
              transition: {
                duration: config.background.durationSec ?? 1.2,
                ease: [0.16, 1, 0.3, 1]
              }
            }),
            h('div', { className: 'fhero-bg-ambient' })
          ]
        ),

        // ── KATMAN 2 (z-20): ANA ÜRÜN MODÜLLERİ (STAGGER SPRING DROP-IN) ──
        h(
          'div',
          {
            key: 'layer-cabinets',
            className: 'fhero-layer-cabinets',
            style: { bottom: `${config.background.floorLineBottomPct ?? 14.8}%` }
          },
          (config.cabinets || []).map((cab, idx) => {
            const isActive = hoveredId === cab.id;
            const delay = 0.24 + (cab.staggerOrder ?? idx) * 0.15;

            return h(
              motion.div,
              {
                key: cab.id,
                className: `fhero-cabinet-slot ${isActive ? 'is-hovered' : ''}`,
                style: {
                  '--cab-h': `${cab.heightPctDesktop}%`,
                  '--cab-ar': String(cab.aspectRatio || 0.65)
                },
                initial: { y: -120, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                transition: {
                  type: 'spring',
                  stiffness: 65,
                  damping: 14,
                  delay
                },
                whileHover: { scale: cab.hoverScale ?? 1.02 },
                onMouseEnter: () => setHoveredId(cab.id),
                onMouseLeave: () => setHoveredId(prev => (prev === cab.id ? null : prev)),
                onClick: () => setHoveredId(prev => (prev === cab.id ? null : cab.id))
              },
              [
                // İnteraktif Ürün Tooltip Kartı
                h(
                  AnimatePresence,
                  null,
                  isActive
                    ? h(
                        motion.div,
                        {
                          key: `tip-${cab.id}`,
                          className: 'fhero-tooltip',
                          initial: { opacity: 0, y: 10, scale: 0.94 },
                          animate: { opacity: 1, y: 0, scale: 1 },
                          exit: { opacity: 0, y: 8, scale: 0.94 },
                          transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] }
                        },
                        [
                          h('span', { className: 'fhero-tooltip-sub' }, cab.subtitle || 'Modül'),
                          h('strong', { className: 'fhero-tooltip-title' }, cab.title),
                          h(
                            'a',
                            {
                              href: cab.detailsUrl,
                              className: 'fhero-tooltip-link',
                              onClick: ev => ev.stopPropagation()
                            },
                            'Detayları Gör →'
                          )
                        ]
                      )
                    : null
                ),
                h('img', {
                  src: cab.image,
                  alt: cab.alt || cab.title,
                  className: 'fhero-cabinet-img',
                  draggable: false
                })
              ]
            );
          })
        ),

        // ── KATMAN 3 (z-30): ÖN PLAN DEKORLARI + FARE PARALLAX ──
        h(
          'div',
          { key: 'layer-decor', className: 'fhero-layer-decors' },
          [
            leftDecor
              ? h(
                  motion.div,
                  {
                    key: leftDecor.id,
                    className: 'fhero-decor fhero-decor-left',
                    style: {
                      '--dec-h': `${leftDecor.heightPctDesktop ?? 40}%`,
                      ...(isMobile ? {} : { x: leftDecorX, y: leftDecorY })
                    },
                    initial: { x: leftDecor.initialX ?? -80, opacity: 0 },
                    animate: { x: 0, opacity: 1 },
                    transition: { duration: 1.0, delay: 0.42, ease: [0.16, 1, 0.3, 1] }
                  },
                  h('img', {
                    src: leftDecor.image,
                    alt: leftDecor.alt,
                    className: 'fhero-decor-img',
                    draggable: false
                  })
                )
              : null,
            rightDecor
              ? h(
                  motion.div,
                  {
                    key: rightDecor.id,
                    className: 'fhero-decor fhero-decor-right',
                    style: {
                      '--dec-h': `${rightDecor.heightPctDesktop ?? 37}%`,
                      ...(isMobile ? {} : { x: rightDecorX, y: rightDecorY })
                    },
                    initial: { x: rightDecor.initialX ?? 80, opacity: 0 },
                    animate: { x: 0, opacity: 1 },
                    transition: { duration: 1.0, delay: 0.52, ease: [0.16, 1, 0.3, 1] }
                  },
                  h('img', {
                    src: rightDecor.image,
                    alt: rightDecor.alt,
                    className: 'fhero-decor-img',
                    draggable: false
                  })
                )
              : null
          ]
        ),

        // ── KATMAN 4 (z-40): TİPOGRAFİ & CTA KARTI ──
        h(
          motion.div,
          {
            key: 'layer-typo',
            className: 'fhero-layer-typography',
            initial: { opacity: 0, y: 26 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
          },
          h('div', { className: 'fhero-glass-card' }, [
            h('span', { className: 'fhero-eyebrow' }, config.typography.eyebrow),
            h('h1', { className: 'fhero-title', id: 'domHeroBaslik' }, [
              config.typography.titleLine1,
              h('br'),
              h('em', null, config.typography.titleAccent)
            ]),
            h(
              'p',
              { className: 'fhero-desc', id: 'domHeroAciklama' },
              config.typography.description
            ),
            h('div', { className: 'fhero-cta-row' }, [
              h(
                'a',
                { href: config.typography.ctaUrl, className: 'btn-hg-wipe' },
                h('span', { className: 'btn-hg-wipe-inner' }, [
                  h('span', { className: 'btn-hg-wipe-row main' }, `${config.typography.ctaLabel} →`),
                  h(
                    'span',
                    { className: 'btn-hg-wipe-row clone', 'aria-hidden': 'true' },
                    `${config.typography.ctaLabel} →`
                  )
                ])
              ),
              h(
                'a',
                { href: config.typography.secondaryUrl, className: 'fhero-secondary-btn' },
                config.typography.secondaryLabel
              )
            ])
          ])
        )
      ]
    )
  );
}

const mountEl = document.getElementById('heroShowroomMount');
if (mountEl) {
  createRoot(mountEl).render(h(ShowroomHeroScene, { initialConfig: HERO_SCENE_CONFIG }));
}

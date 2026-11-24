/**
 * Global Mobilya — Dikey Gökyüzü ve Bulut Asansörü (SkyElevatorTransition)
 * -------------------------------------------------------------------------------
 * Hiçbir harici video/PNG yüklemeden tamamen Framer Motion ve GPU hızlandırmalı
 * SVG/CSS katmanlarıyla dimdik dikey eksende (rotasyon/eğim olmadan) çalışır:
 *   1) Yükseliş (0.0s - 0.5s): Mevcut sahne aşağı kayar; gündüz gökyüzü perdesi açılır.
 *   2) Bulut Denizi (0.4s - 1.3s): 3 paralaks hız katmanlı yumuşak SVG/blur bulutlar
 *      yukarıdan aşağı akar; zirvede lens flare + şehir/ülke/koordinat göstergesi belirir.
 *   3) İniş (1.2s - 1.8s): Bulutlar alttan yukarıya akar; son 0.4s içinde hedef koleksiyon
 *      verisi güncellenir, sahne yukarıdan aşağı (-30% -> 0%) oturur ve perde erir.
 */

import React, { useEffect, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { MotionConfig, motion } from 'https://esm.sh/framer-motion@11.11.17?deps=react@18.3.1,react-dom@18.3.1';
import { getCollectionWorldEntry } from './heroConfig.js';

const h = React.createElement;

let _elevatorRoot = null;
let _triggerFn = null;

/**
 * Yumuşak çok loblu prosedürel SVG bulut kümesi (Gaussian + CSS blur ile atmosferik derinlik)
 */
function ProceduralCloudCluster({ idPrefix, variant = 'mid', tint = '#ffffff' }) {
  const opacity = variant === 'back' ? 0.62 : variant === 'mid' ? 0.82 : 0.92;
  return h(
    'svg',
    {
      viewBox: '0 0 1600 540',
      preserveAspectRatio: 'none',
      className: `sky-cloud-svg sky-cloud-svg-${variant}`,
      'aria-hidden': 'true',
    },
    h(
      'defs',
      null,
      h(
        'linearGradient',
        { id: `${idPrefix}-${variant}`, x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
        h('stop', { offset: '0%', stopColor: '#ffffff', stopOpacity: opacity }),
        h('stop', { offset: '62%', stopColor: tint, stopOpacity: opacity * 0.85 }),
        h('stop', { offset: '100%', stopColor: '#e0f2fe', stopOpacity: '0' })
      )
    ),
    variant === 'back'
      ? h(
          'g',
          { fill: `url(#${idPrefix}-${variant})` },
          h('ellipse', { cx: '260', cy: '290', rx: '340', ry: '140' }),
          h('ellipse', { cx: '640', cy: '250', rx: '410', ry: '170' }),
          h('ellipse', { cx: '1080', cy: '280', rx: '390', ry: '155' }),
          h('ellipse', { cx: '1420', cy: '310', rx: '310', ry: '135' }),
          h('rect', { x: '0', y: '270', width: '1600', height: '210', opacity: '0.55' })
        )
      : variant === 'mid'
        ? h(
            'g',
            { fill: `url(#${idPrefix}-${variant})` },
            h('circle', { cx: '190', cy: '260', r: '155' }),
            h('circle', { cx: '390', cy: '215', r: '185' }),
            h('circle', { cx: '620', cy: '245', r: '165' }),
            h('circle', { cx: '860', cy: '195', r: '210' }),
            h('circle', { cx: '1120', cy: '240', r: '180' }),
            h('circle', { cx: '1360', cy: '220', r: '195' }),
            h('circle', { cx: '1520', cy: '280', r: '150' }),
            h('ellipse', { cx: '800', cy: '320', rx: '860', ry: '140' })
          )
        : h(
            'g',
            { fill: `url(#${idPrefix}-${variant})` },
            h('ellipse', { cx: '180', cy: '260', rx: '260', ry: '115' }),
            h('ellipse', { cx: '560', cy: '220', rx: '290', ry: '130' }),
            h('ellipse', { cx: '1020', cy: '245', rx: '310', ry: '125' }),
            h('ellipse', { cx: '1440', cy: '230', rx: '280', ry: '120' })
          )
  );
}

function SkyElevatorOverlay({ activeFlight }) {
  if (!activeFlight) return null;

  const { key, phase, hudStage, fromWorld, toWorld } = activeFlight;
  const isAscending = phase === 'ascend' || phase === 'peak';
  const showTargetMeta = hudStage === 'target';
  const currentMeta = showTargetMeta ? toWorld : fromWorld;

  return h(
    MotionConfig,
    { reducedMotion: 'never' },
    h(
      motion.div,
      {
        key: `sky-curtain-${key}`,
        className: 'sky-elev-curtain',
        initial: { opacity: 0 },
        animate: { opacity: phase === 'fadeout' ? 0 : 1 },
        transition: {
          duration: phase === 'fadeout' ? 0.44 : 0.36,
          ease: [0.22, 1, 0.36, 1],
        },
        'aria-hidden': 'true',
      },
      // Gündüz Gökyüzü Gradyanı (#38bdf8 -> #bae6fd -> #ffffff) + Bulut Üstü Derinlik
      h('div', {
        className: `sky-elev-gradient${phase === 'peak' ? ' is-peak' : ''}`,
      }),

      // Zirve Güneş Lens Flare Parlaması
      h(motion.div, {
        className: 'sky-elev-lens-flare',
        initial: { opacity: 0, scale: 0.72 },
        animate:
          phase === 'peak'
            ? { opacity: 0.96, scale: 1.18 }
            : phase === 'ascend'
              ? { opacity: 0.45, scale: 0.9 }
              : { opacity: 0, scale: 0.85 },
        transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
      }),

      // Bulut Katmanı 1 (Arka — En Yavaş Paralaks + blur-3xl)
      h(
        motion.div,
        {
          key: `cloud-back-${key}-${isAscending ? 'down' : 'up'}`,
          className: 'sky-cloud-layer sky-cloud-back',
          initial: { y: isAscending ? '-120%' : '120%' },
          animate: { y: isAscending ? '120%' : '-120%' },
          transition: {
            duration: isAscending ? 0.95 : 0.76,
            delay: isAscending ? 0.16 : 0,
            ease: 'linear',
          },
        },
        h(ProceduralCloudCluster, { idPrefix: `c-${key}-a`, variant: 'back', tint: '#f0f9ff' }),
        h(ProceduralCloudCluster, { idPrefix: `c-${key}-b`, variant: 'back', tint: '#e0f2fe' })
      ),

      // Bulut Katmanı 2 (Orta — Hızlı Paralaks + blur-2xl)
      h(
        motion.div,
        {
          key: `cloud-mid-${key}-${isAscending ? 'down' : 'up'}`,
          className: 'sky-cloud-layer sky-cloud-mid',
          initial: { y: isAscending ? '-120%' : '120%' },
          animate: { y: isAscending ? '120%' : '-120%' },
          transition: {
            duration: isAscending ? 0.82 : 0.65,
            delay: isAscending ? 0.22 : 0.03,
            ease: 'linear',
          },
        },
        h(ProceduralCloudCluster, { idPrefix: `c-${key}-m`, variant: 'mid', tint: '#ffffff' })
      ),

      // Bulut Katmanı 3 (Ön — En Hızlı Paralaks + yumuşak sis kırpıntıları)
      h(
        motion.div,
        {
          key: `cloud-front-${key}-${isAscending ? 'down' : 'up'}`,
          className: 'sky-cloud-layer sky-cloud-front',
          initial: { y: isAscending ? '-120%' : '120%' },
          animate: { y: isAscending ? '120%' : '-120%' },
          transition: {
            duration: isAscending ? 0.7 : 0.56,
            delay: isAscending ? 0.28 : 0.05,
            ease: 'linear',
          },
        },
        h(ProceduralCloudCluster, { idPrefix: `c-${key}-f`, variant: 'front', tint: '#ffffff' })
      ),

      // Merkez Yarı Saydam (backdrop-blur-md) Şehir & Koordinat Uçuş Göstergesi
      h(
        motion.div,
        {
          className: 'sky-flight-hud-wrap',
          initial: { opacity: 0, y: 14, scale: 0.95 },
          animate:
            phase === 'fadeout'
              ? { opacity: 0, y: -10, scale: 0.96 }
              : { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        },
        h(
          'div',
          { className: 'sky-flight-hud-card' },
          h(
            'div',
            { className: 'sky-flight-kicker-row' },
            h('span', { className: 'sky-flight-pulse' }),
            h(
              'span',
              { className: 'sky-flight-kicker' },
              isAscending ? 'BULUT KATMANINA YÜKSELİNİYOR' : 'YENİ LOKASYONA İNİLİYOR'
            )
          ),
          h(
            motion.div,
            {
              key: `${currentMeta.city}-${currentMeta.coords}`,
              className: 'sky-flight-city-block',
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            },
            h('span', { className: 'sky-flight-country' }, currentMeta.country),
            h('strong', { className: 'sky-flight-main' }, `${currentMeta.city} • ${currentMeta.coords}`)
          )
        )
      )
    )
  );
}

function SkyElevatorController() {
  const [activeFlight, setActiveFlight] = useState(null);

  useEffect(() => {
    let timers = [];
    const clearAll = () => {
      timers.forEach((id) => clearTimeout(id));
      timers = [];
    };

    _triggerFn = ({ fromCollection, toCollection, onAscendStart, onSwapContent, onComplete }) => {
      clearAll();
      const flightKey = Date.now();
      const resolveWorld = (col) =>
        col?.isIntro
          ? {
              city: col.city || 'VİTRİN',
              country: col.country || 'GLOBAL MOBİLYA',
              coords: col.coords || '41.0082° K, 28.9784° D',
            }
          : getCollectionWorldEntry(col);
      const fromWorld = resolveWorld(fromCollection);
      const toWorld = resolveWorld(toCollection);

      onAscendStart?.();

      // 0.00s: Yükseliş ve bulutlara çıkış
      setActiveFlight({
        key: flightKey,
        phase: 'ascend',
        hudStage: 'origin',
        fromWorld,
        toWorld,
      });

      // 0.65s: Zirve anı — lens flare + hedef şehir & koordinatlarına animasyonlu geçiş
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) =>
            prev && prev.key === flightKey
              ? { ...prev, phase: 'peak', hudStage: 'target' }
              : prev
          );
        }, 660)
      );

      // 1.15s: Bulutlar ters yönde alttan yukarı akar -> İniş başlar
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) =>
            prev && prev.key === flightKey
              ? { ...prev, phase: 'descend', hudStage: 'target' }
              : prev
          );
        }, 1150)
      );

      // 1.38s (inişin son 0.4s'i): Arka plandaki aktif koleksiyon verisini hedef olarak güncelle + yukarıdan aşağı oturma
      timers.push(
        setTimeout(() => {
          onSwapContent?.();
          setActiveFlight((prev) =>
            prev && prev.key === flightKey
              ? { ...prev, phase: 'fadeout', hudStage: 'target' }
              : prev
          );
        }, 1380)
      );

      // 1.84s: Perde tamamen erir ve kilit açılır
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) => (prev && prev.key === flightKey ? null : prev));
          onComplete?.();
        }, 1840)
      );
    };

    return () => {
      clearAll();
      _triggerFn = null;
    };
  }, []);

  return h(SkyElevatorOverlay, { activeFlight });
}

export function initSkyElevator() {
  const mount = document.getElementById('skyElevatorMount');
  if (!mount) return;
  if (!_elevatorRoot) {
    _elevatorRoot = createRoot(mount);
  }
  _elevatorRoot.render(h(SkyElevatorController));
}

if (typeof window !== 'undefined') {
  window.GKM_SKY_ELEVATOR = {
    init: initSkyElevator,
    startFlight(opts) {
      if (_triggerFn) {
        _triggerFn(opts);
        return true;
      }
      return false;
    },
  };
  initSkyElevator();
}

/**
 * Global Mobilya — Fotogerçekçi Dikey Gökyüzü & Bulut Asansörü (SkyElevatorTransition)
 * ------------------------------------------------------------------------------------
 * Harici PNG/MP4 yüklemeden tamamen Framer Motion ve GPU hızlandırmalı SVG Turbulence /
 * Rayleigh gökyüzü katmanlarıyla dimdik dikey eksende çalışır:
 *   1) Yükseliş (0.0s - 0.55s): Mevcut sahne aşağı kayar; gündüz gökyüzü açılır.
 *   2) Bulut Denizi (0.3s - 1.15s): Organik SVG türbülanslı üstü aydınlık/altı gölgeli
 *      3 katmanlı hacimsel bulut kümeleri aşağı akar; güneş & sade geçiş etiketi belirir.
 *   3) Yumuşak İniş (1.05s - 2.25s): Bulutlar yavaşlayarak yukarı açılır; hedef sahne
 *      uzun yastıklamalı inişle (-48vh -> 0) süzülerek oturur ve gökyüzü kadife gibi erir.
 */

import React, { useEffect, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { MotionConfig, motion } from 'https://esm.sh/framer-motion@11.11.17?deps=react@18.3.1,react-dom@18.3.1';

const h = React.createElement;

let _elevatorRoot = null;
let _triggerFn = null;

/**
 * Gerçekçi üstü güneş aydınlıklı, altı gölgeli ve feTurbulence kıvrımlı SVG bulut kümesi
 */
function VolumetricCloudBank({ idPrefix, variant = 'mid' }) {
  const filterId = `${idPrefix}-turb-${variant}`;
  const gradLitId = `${idPrefix}-lit-${variant}`;
  const gradShadeId = `${idPrefix}-shade-${variant}`;
  const scaleDisp = variant === 'back' ? 38 : variant === 'mid' ? 52 : 64;
  const freq = variant === 'back' ? '0.008 0.014' : variant === 'mid' ? '0.012 0.022' : '0.016 0.03';

  return h(
    'svg',
    {
      viewBox: '0 0 1600 620',
      preserveAspectRatio: 'none',
      className: `sky-cloud-svg sky-cloud-svg-${variant}`,
      'aria-hidden': 'true',
    },
    h(
      'defs',
      null,
      // Doğal kabarık bulut kenarları için fraktal türbülans filtresi
      h(
        'filter',
        { id: filterId, x: '-15%', y: '-15%', width: '130%', height: '130%' },
        h('feTurbulence', {
          type: 'fractalNoise',
          baseFrequency: freq,
          numOctaves: '4',
          seed: variant === 'back' ? '11' : variant === 'mid' ? '29' : '47',
          result: 'noise',
        }),
        h('feDisplacementMap', {
          in: 'SourceGraphic',
          in2: 'noise',
          scale: scaleDisp,
          xChannelSelector: 'R',
          yChannelSelector: 'G',
        })
      ),
      // Üstten güneş alan sıcak beyaz katman
      h(
        'linearGradient',
        { id: gradLitId, x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
        h('stop', { offset: '0%', stopColor: '#ffffff', stopOpacity: variant === 'front' ? '0.96' : '0.9' }),
        h('stop', { offset: '55%', stopColor: '#f8fafc', stopOpacity: variant === 'front' ? '0.88' : '0.78' }),
        h('stop', { offset: '86%', stopColor: '#cbd5e1', stopOpacity: '0.35' }),
        h('stop', { offset: '100%', stopColor: '#94a3b8', stopOpacity: '0' })
      ),
      // Bulut alt gölge hacmi
      h(
        'linearGradient',
        { id: gradShadeId, x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
        h('stop', { offset: '0%', stopColor: '#e2e8f0', stopOpacity: '0.52' }),
        h('stop', { offset: '65%', stopColor: '#93c5fd', stopOpacity: '0.36' }),
        h('stop', { offset: '100%', stopColor: '#64748b', stopOpacity: '0' })
      )
    ),
    h(
      'g',
      { filter: `url(#${filterId})` },
      // Alt gölge tabanı
      h(
        'g',
        { fill: `url(#${gradShadeId})`, transform: 'translate(0, 26)' },
        h('ellipse', { cx: '220', cy: '330', rx: '310', ry: '140' }),
        h('ellipse', { cx: '580', cy: '305', rx: '360', ry: '155' }),
        h('ellipse', { cx: '990', cy: '315', rx: '380', ry: '150' }),
        h('ellipse', { cx: '1390', cy: '335', rx: '320', ry: '140' })
      ),
      // Güneşle yıkanmış kabarık üst kümeler
      h(
        'g',
        { fill: `url(#${gradLitId})` },
        h('circle', { cx: '140', cy: '300', r: '185' }),
        h('circle', { cx: '360', cy: '250', r: '220' }),
        h('circle', { cx: '610', cy: '275', r: '205' }),
        h('circle', { cx: '855', cy: '225', r: '245' }),
        h('circle', { cx: '1120', cy: '260', r: '215' }),
        h('circle', { cx: '1365', cy: '240', r: '220' }),
        h('circle', { cx: '1540', cy: '295', r: '180' }),
        h('ellipse', { cx: '800', cy: '355', rx: '890', ry: '150' })
      )
    )
  );
}

function SkyElevatorOverlay({ activeFlight }) {
  if (!activeFlight) return null;

  const { key, phase, label } = activeFlight;
  const isAscending = phase === 'ascend' || phase === 'peak';
  const isFadeOut = phase === 'fadeout';

  return h(
    MotionConfig,
    { reducedMotion: 'never' },
    h(
      motion.div,
      {
        key: `sky-curtain-${key}`,
        className: 'sky-elev-curtain',
        initial: { opacity: 0 },
        animate: { opacity: isFadeOut ? 0 : 1 },
        transition: {
          duration: isFadeOut ? 0.92 : 0.42,
          ease: isFadeOut ? [0.33, 1, 0.68, 1] : [0.22, 1, 0.36, 1],
        },
        'aria-hidden': 'true',
      },
      // Fotogerçekçi Rayleigh Gündüz Gökyüzü Gradyanı (#0284c7 -> #38bdf8 -> #bae6fd -> #fffdf7)
      h('div', {
        className: `sky-elev-gradient${phase === 'peak' ? ' is-peak' : ''}`,
      }),

      // Güneş Diski, Hüzme Işınları ve Zirve Lens Flare
      h(motion.div, {
        className: 'sky-elev-sunbeams',
        initial: { opacity: 0, scale: 0.9 },
        animate:
          phase === 'peak'
            ? { opacity: 0.85, scale: 1.05 }
            : phase === 'ascend'
              ? { opacity: 0.45, scale: 0.96 }
              : { opacity: 0.15, scale: 1.0 },
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      }),
      h(motion.div, {
        className: 'sky-elev-lens-flare',
        initial: { opacity: 0, scale: 0.72 },
        animate:
          phase === 'peak'
            ? { opacity: 1, scale: 1.15 }
            : phase === 'ascend'
              ? { opacity: 0.5, scale: 0.9 }
              : { opacity: 0, scale: 0.85 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }),

      // Katman 1: Arka Ufuk Bulut Denizi (En yavaş paralaks + geniş atmosferik yumuşatma)
      h(
        motion.div,
        {
          key: `cloud-back-${key}-${isAscending ? 'down' : 'up'}`,
          className: 'sky-cloud-layer sky-cloud-back',
          initial: { y: isAscending ? '-105%' : '45%' },
          animate: { y: isAscending ? '45%' : '-120%' },
          transition: isAscending
            ? { duration: 1.05, delay: 0.08, ease: [0.35, 0.05, 0.65, 0.95] }
            : { duration: 1.18, delay: 0.0, ease: [0.22, 0.8, 0.36, 1] },
        },
        h(VolumetricCloudBank, { idPrefix: `cb1-${key}`, variant: 'back' }),
        h(VolumetricCloudBank, { idPrefix: `cb2-${key}`, variant: 'back' })
      ),

      // Katman 2: Orta Hacimli Kümülüs Bulutları (Orta-hızlı paralaks)
      h(
        motion.div,
        {
          key: `cloud-mid-${key}-${isAscending ? 'down' : 'up'}`,
          className: 'sky-cloud-layer sky-cloud-mid',
          initial: { y: isAscending ? '-110%' : '52%' },
          animate: { y: isAscending ? '52%' : '-125%' },
          transition: isAscending
            ? { duration: 0.92, delay: 0.14, ease: [0.35, 0.05, 0.65, 0.95] }
            : { duration: 1.06, delay: 0.04, ease: [0.22, 0.8, 0.36, 1] },
        },
        h(VolumetricCloudBank, { idPrefix: `cm1-${key}`, variant: 'mid' }),
        h(VolumetricCloudBank, { idPrefix: `cm2-${key}`, variant: 'mid' })
      ),

      // Katman 3: Yakın Plan Sis ve Bulut Kırpıntıları (En hızlı paralaks)
      h(
        motion.div,
        {
          key: `cloud-front-${key}-${isAscending ? 'down' : 'up'}`,
          className: 'sky-cloud-layer sky-cloud-front',
          initial: { y: isAscending ? '-115%' : '62%' },
          animate: { y: isAscending ? '62%' : '-132%' },
          transition: isAscending
            ? { duration: 0.82, delay: 0.18, ease: [0.35, 0.05, 0.65, 0.95] }
            : { duration: 0.94, delay: 0.06, ease: [0.22, 0.8, 0.36, 1] },
        },
        h(VolumetricCloudBank, { idPrefix: `cf1-${key}`, variant: 'front' }),
        h(VolumetricCloudBank, { idPrefix: `cf2-${key}`, variant: 'front' })
      ),

      // Merkez Sade & Zarif Uçuş Göstergesi (Şehir/koordinat yok — yalın mesaj)
      h(
        motion.div,
        {
          className: 'sky-flight-hud-wrap',
          initial: { opacity: 0, y: 12, scale: 0.96 },
          animate: isFadeOut
            ? { opacity: 0, y: -12, scale: 0.97 }
            : { opacity: 1, y: 0, scale: 1 },
          transition: { duration: isFadeOut ? 0.52 : 0.34, ease: [0.22, 1, 0.36, 1] },
        },
        h(
          'div',
          { className: 'sky-flight-hud-card' },
          h('span', { className: 'sky-flight-pulse', 'aria-hidden': 'true' }),
          h('strong', { className: 'sky-flight-simple-text' }, label || 'Diğer Koleksiyona Geçiliyor')
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

    _triggerFn = ({ label, onAscendStart, onSwapContent, onComplete }) => {
      clearAll();
      const flightKey = Date.now();

      onAscendStart?.();

      // 0.00s: Yükseliş ve bulutlara çıkış
      setActiveFlight({
        key: flightKey,
        phase: 'ascend',
        label: label || 'Diğer Koleksiyona Geçiliyor',
      });

      // 0.62s: Zirve anı — güneş parlaması ve bulut üstü masmavi gökyüzü
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) =>
            prev && prev.key === flightKey ? { ...prev, phase: 'peak' } : prev
          );
        }, 620)
      );

      // 1.05s: İniş başlar — bulut katmanları alttan yukarıya yumuşayarak çekilir
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) =>
            prev && prev.key === flightKey ? { ...prev, phase: 'descend' } : prev
          );
        }, 1050)
      );

      // 1.24s: Yeni koleksiyon arka planda uyanır ve 1.1s süren ipeksi inişle sahneye iner
      timers.push(
        setTimeout(() => {
          onSwapContent?.();
          setActiveFlight((prev) =>
            prev && prev.key === flightKey ? { ...prev, phase: 'fadeout' } : prev
          );
        }, 1240)
      );

      // 2.28s: Gökyüzü tamamen erimiş ve yeni koleksiyon oturmuştur; kilit açılır
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) => (prev && prev.key === flightKey ? null : prev));
          onComplete?.();
        }, 2280)
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

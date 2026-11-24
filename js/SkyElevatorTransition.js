/**
 * Global Mobilya — Tüm Donanımlarda Birebir Aynı Görünümlü Dikey Bulut Asansörü
 * ------------------------------------------------------------------------------------
 * SVG <feTurbulence> donanım/tarayıcı farklılıklarını ortadan kaldırmak için periyodik
 * çok oktavlı FBM bulut dokularını deterministic olarak bellek içi <canvas> üzerinde üretir:
 *   - Sıfır harici PNG/MP4 isteği, sıfır bulut arası dikey boşluk (kesintisiz bulut örtüsü).
 *   - Tüm bilgisayarlarda (şirket PC'si / ev PC'si / mobil) piksel düzeyinde özdeş doku.
 *   - Eşit hızda Yükseliş (850ms) -> Zirve (280ms) -> Eşit hızda İniş (850ms) fiziği.
 */

import React, { useEffect, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { MotionConfig, motion } from 'https://esm.sh/framer-motion@11.11.17?deps=react@18.3.1,react-dom@18.3.1';

const h = React.createElement;

let _elevatorRoot = null;
let _triggerFn = null;
let _cachedCloudUrls = null;

/**
 * Periyodik 5 oktavlı CPU FBM gürültüsü ile kesintisiz yatay+dikey döşenebilir gerçekçi bulut dokuları üretir
 */
function buildProceduralCloudTextures() {
  if (_cachedCloudUrls) return _cachedCloudUrls;
  if (typeof document === 'undefined') return null;

  const makeLayer = (W, H, seed, baseFreqX, baseFreqY, minDens, maxDens, shadeR, shadeG, shadeB) => {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(W, H);
    const data = imgData.data;

    const hash2 = (ix, iy, pX, pY, s) => {
      const wx = ((ix % pX) + pX) % pX;
      const wy = ((iy % pY) + pY) % pY;
      const n = Math.sin(wx * 127.1 + wy * 311.7 + s * 74.7) * 43758.5453123;
      return n - Math.floor(n);
    };

    const periodicNoise = (x, y, freqX, freqY, s) => {
      const fx = x * freqX;
      const fy = y * freqY;
      const ix = Math.floor(fx);
      const iy = Math.floor(fy);
      const tx = fx - ix;
      const ty = fy - iy;
      // Quintic Hermite interpolation -> tamamen pürüzsüz kabarık bulut kenarları
      const ux = tx * tx * tx * (tx * (tx * 6 - 15) + 10);
      const uy = ty * ty * ty * (ty * (ty * 6 - 15) + 10);
      const a = hash2(ix, iy, freqX, freqY, s);
      const b = hash2(ix + 1, iy, freqX, freqY, s);
      const c = hash2(ix, iy + 1, freqX, freqY, s);
      const d = hash2(ix + 1, iy + 1, freqX, freqY, s);
      return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    };

    for (let y = 0; y < H; y++) {
      const ny = y / H;
      for (let x = 0; x < W; x++) {
        const nx = x / W;
        let val = 0;
        let amp = 0.52;
        let norm = 0;
        let fx = baseFreqX;
        let fy = baseFreqY;

        for (let o = 0; o < 5; o++) {
          val += amp * periodicNoise(nx, ny, fx, fy, seed + o * 19);
          norm += amp;
          amp *= 0.5;
          fx *= 2;
          fy *= 2;
        }
        val /= norm;

        // Dikey güneş aydınlatma gradyanı (yönelim: üst kenar parlak beyaz, alt kenar serin gölge)
        const upLit = periodicNoise(nx, ((ny - 0.035 + 1) % 1), baseFreqX * 2, baseFreqY * 2, seed + 5);
        const rimBoost = Math.max(0, Math.min(1, 0.65 + (val - upLit) * 2.2));

        const densityRaw = (val - minDens) / Math.max(0.05, maxDens - minDens);
        const alpha = Math.max(0, Math.min(1, densityRaw));
        const smoothAlpha = alpha * alpha * (3 - 2 * alpha);

        const idx = (y * W + x) * 4;
        data[idx]     = Math.round(shadeR + (255 - shadeR) * rimBoost);
        data[idx + 1] = Math.round(shadeG + (255 - shadeG) * rimBoost);
        data[idx + 2] = Math.round(shadeB + (255 - shadeB) * rimBoost);
        data[idx + 3] = Math.round(smoothAlpha * 238);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png');
  };

  _cachedCloudUrls = {
    // Arka katman: geniş, yumuşak atmosferik kümülüs örtüsü (yüksek yoğunluk -> sıfır boşluk)
    back: makeLayer(360, 220, 11, 3, 2, 0.24, 0.68, 198, 224, 250),
    // Orta katman: detaylı kabarık bulut denizleri
    mid: makeLayer(360, 220, 37, 4, 3, 0.3, 0.72, 212, 232, 252),
    // Ön katman: belirgin güneş aydınlatmalı yakın bulut kırpıntıları
    front: makeLayer(320, 200, 73, 5, 4, 0.36, 0.76, 226, 240, 255),
  };
  return _cachedCloudUrls;
}

const SYMMETRIC_EASE = [0.32, 0, 0.68, 1];

function SkyElevatorOverlay({ activeFlight }) {
  if (!activeFlight) return null;

  const { key, phase, label } = activeFlight;
  const isAscending = phase === 'ascend' || phase === 'peak';
  const isFadeOut = phase === 'fadeout';
  const textures = buildProceduralCloudTextures();

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
          duration: isFadeOut ? 0.85 : 0.42,
          ease: [0.22, 1, 0.36, 1],
        },
        'aria-hidden': 'true',
      },
      // Rayleigh Gündüz Gökyüzü Gradyanı (#0284c7 -> #38bdf8 -> #bae6fd -> #fffdf7)
      h('div', {
        className: `sky-elev-gradient${phase === 'peak' ? ' is-peak' : ''}`,
      }),

      // Güneş Hüzmeleri ve Zirve Lens Parlaması
      h(motion.div, {
        className: 'sky-elev-sunbeams',
        initial: { opacity: 0, scale: 0.92 },
        animate:
          phase === 'peak'
            ? { opacity: 0.88, scale: 1.04 }
            : phase === 'ascend'
              ? { opacity: 0.45, scale: 0.98 }
              : { opacity: 0.2, scale: 1.0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }),
      h(motion.div, {
        className: 'sky-elev-lens-flare',
        initial: { opacity: 0, scale: 0.75 },
        animate:
          phase === 'peak'
            ? { opacity: 0.96, scale: 1.12 }
            : phase === 'ascend'
              ? { opacity: 0.46, scale: 0.9 }
              : { opacity: 0, scale: 0.88 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }),

      // Kesintisiz Döşenen 3 Katmanlı Prosedürel Bulut Denizleri (GPU'dan bağımsız özdeş)
      textures
        ? [
            h(motion.div, {
              key: `cb-${key}-${isAscending ? 'down' : 'up'}`,
              className: 'sky-cloud-tile sky-cloud-tile-back',
              style: { backgroundImage: `url("${textures.back}")` },
              initial: { y: isAscending ? '-52%' : '0%' },
              animate: { y: isAscending ? '0%' : '-52%' },
              transition: { duration: 1.05, ease: SYMMETRIC_EASE },
            }),
            h(motion.div, {
              key: `cm-${key}-${isAscending ? 'down' : 'up'}`,
              className: 'sky-cloud-tile sky-cloud-tile-mid',
              style: { backgroundImage: `url("${textures.mid}")` },
              initial: { y: isAscending ? '-56%' : '0%' },
              animate: { y: isAscending ? '0%' : '-56%' },
              transition: { duration: 0.92, ease: SYMMETRIC_EASE },
            }),
            h(motion.div, {
              key: `cf-${key}-${isAscending ? 'down' : 'up'}`,
              className: 'sky-cloud-tile sky-cloud-tile-front',
              style: { backgroundImage: `url("${textures.front}")` },
              initial: { y: isAscending ? '-62%' : '0%' },
              animate: { y: isAscending ? '0%' : '-62%' },
              transition: { duration: 0.82, ease: SYMMETRIC_EASE },
            }),
          ]
        : null,

      // Merkez Sade & Zarif Uçuş Göstergesi
      h(
        motion.div,
        {
          className: 'sky-flight-hud-wrap',
          initial: { opacity: 0, y: 12, scale: 0.96 },
          animate: isFadeOut
            ? { opacity: 0, y: -12, scale: 0.97 }
            : { opacity: 1, y: 0, scale: 1 },
          transition: { duration: isFadeOut ? 0.5 : 0.34, ease: [0.22, 1, 0.36, 1] },
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
    // Dokuları arka planda önceden ısıt -> ilk geçiş sıfır takılma ile başlar
    setTimeout(() => {
      try {
        buildProceduralCloudTextures();
      } catch (_) {}
    }, 120);

    let timers = [];
    const clearAll = () => {
      timers.forEach((id) => clearTimeout(id));
      timers = [];
    };

    _triggerFn = ({ label, onAscendStart, onSwapContent, onComplete }) => {
      clearAll();
      const flightKey = Date.now();

      onAscendStart?.();

      // 0.00s: Yükseliş (850ms) — bulut katmanları aşağı iner
      setActiveFlight({
        key: flightKey,
        phase: 'ascend',
        label: label || 'Diğer Koleksiyona Geçiliyor',
      });

      // 0.72s: Zirve güneş parlaması
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) =>
            prev && prev.key === flightKey ? { ...prev, phase: 'peak' } : prev
          );
        }, 720)
      );

      // 1.12s: Eşit hızda İniş (850ms) + hedef sahne içeriği hemen yukarıdan -100vh -> 0 olarak iner
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) =>
            prev && prev.key === flightKey ? { ...prev, phase: 'descend' } : prev
          );
          onSwapContent?.();
        }, 1120)
      );

      // 1.32s: Gökyüzü perdesi alçalırken kadife gibi erir -> inen oda + mobilyalar görünür olur
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) =>
            prev && prev.key === flightKey ? { ...prev, phase: 'fadeout' } : prev
          );
        }, 1320)
      );

      // 2.18s: İniş ve erime tamamlandı -> kilit açılır
      timers.push(
        setTimeout(() => {
          setActiveFlight((prev) => (prev && prev.key === flightKey ? null : prev));
          onComplete?.();
        }, 2180)
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

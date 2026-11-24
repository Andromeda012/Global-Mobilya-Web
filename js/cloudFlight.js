/**
 * Global Mobilya — WebGL2 GLSL Prosedürel Bulut Uçuş Motoru
 * ------------------------------------------------------------------
 * Kamera bir koleksiyondan yükselip bulut katmanlarına çıktığında ve
 * ardından yeni şehir koleksiyonuna süzülerek indiğinde 60fps prosedürel
 * FBM hacimsel bulut geçişi üretir. Durgun halde rAF döngüsünü durdurur.
 */
(function () {
  const VERT_SRC = `#version 300 es
    in vec2 aPos;
    out vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  const FRAG_SRC = `#version 300 es
    precision highp float;
    in vec2 vUv;
    out vec4 fragColor;

    uniform float uTime;
    uniform float uProgress;   // 0..1 tam uçuş zaman çizelgesi
    uniform float uOpacity;    // 0..1 genel yoğunluk zarfı
    uniform vec3 uSkyTint;     // Hedef şehre ait atmosfer tonu
    uniform vec2 uResolution;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float amp = 0.5;
      mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 5; i++) {
        v += amp * noise(p);
        p = rot * p * 2.02 + vec2(17.1, 31.7);
        amp *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 aspectUv = (vUv - 0.5) * vec2(uResolution.x / max(1.0, uResolution.y), 1.0);

      // Yukarı çıkarken (0..0.5) bulutlar hızla aşağı akar; inerken (0.5..1) yukarı açılır
      float dir = uProgress < 0.5 ? -1.0 : 1.0;
      float speedPhase = smoothstep(0.0, 0.5, uProgress) * 1.4 + smoothstep(0.5, 1.0, uProgress) * 1.4;
      float zoomScale = mix(1.5, 0.65, sin(uProgress * 3.14159265));

      vec2 uvFar  = aspectUv * (2.2 * zoomScale) + vec2(uTime * 0.08, dir * speedPhase * 1.25);
      vec2 uvMid  = aspectUv * (3.4 * zoomScale) + vec2(-uTime * 0.11 + 4.2, dir * speedPhase * 2.1);
      vec2 uvNear = aspectUv * (5.2 * zoomScale) + vec2(uTime * 0.14 + 9.1, dir * speedPhase * 3.2);

      float cFar  = fbm(uvFar);
      float cMid  = fbm(uvMid);
      float cNear = fbm(uvNear);

      // İrtifa doruk noktasında yoğunlaşan üç katmanlı bulut denizi
      float density = clamp(cFar * 0.45 + cMid * 0.42 + cNear * 0.35 - 0.24, 0.0, 1.0);
      density = smoothstep(0.05, 0.86, density);

      // Radyal derinlik geçişi — ortadaki kamera koridorundan kenarlara yayılan bulut örtüsü
      float radialMask = mix(0.82, 1.0, length(aspectUv));
      float peakCover = smoothstep(0.18, 0.48, uProgress) * (1.0 - smoothstep(0.56, 0.92, uProgress));
      float cloudAlpha = clamp((density * radialMask * 0.92 + peakCover * 0.55) * uOpacity, 0.0, 0.96);

      // Güneş ışığıyla aydınlanan üst kenar (silver lining) ve hedef şehir tonlaması
      vec3 brightCloud = mix(vec3(0.96, 0.97, 0.99), uSkyTint, 0.24);
      vec3 shadowCloud = mix(vec3(0.46, 0.52, 0.62), uSkyTint * 0.62, 0.45);
      float highlight = smoothstep(0.25, 0.85, cMid * 0.6 + cFar * 0.4);
      vec3 col = mix(shadowCloud, brightCloud, highlight);

      fragColor = vec4(col, cloudAlpha);
    }
  `;

  function hexToVec3(hex) {
    const clean = String(hex || '#93c5fd').replace('#', '');
    if (clean.length === 3) {
      return [
        parseInt(clean[0] + clean[0], 16) / 255,
        parseInt(clean[1] + clean[1], 16) / 255,
        parseInt(clean[2] + clean[2], 16) / 255,
      ];
    }
    const n = parseInt(clean.slice(0, 6), 16) || 0x93c5fd;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  let canvas = null;
  let gl = null;
  let prog = null;
  let uLocs = null;
  let rafId = 0;

  function initWebGL(el) {
    canvas = el;
    gl = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return false;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VERT_SRC);
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, FRAG_SRC);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS) || !gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      return false;
    }

    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    uLocs = {
      uTime: gl.getUniformLocation(prog, 'uTime'),
      uProgress: gl.getUniformLocation(prog, 'uProgress'),
      uOpacity: gl.getUniformLocation(prog, 'uOpacity'),
      uSkyTint: gl.getUniformLocation(prog, 'uSkyTint'),
      uResolution: gl.getUniformLocation(prog, 'uResolution'),
    };
    return true;
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.floor(window.innerWidth * dpr));
    const h = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      if (gl) gl.viewport(0, 0, w, h);
    }
  }

  function playCloudFlight(options = {}) {
    const durationMs = options.durationMs || 1550;
    const tint = hexToVec3(options.tintHex || '#93C5FD');
    const el = document.getElementById('cloudFlightCanvas');
    if (!el) return;

    if (!gl && !initWebGL(el)) {
      // Minimal 2D CSS/canvas yedek bulut geçişi
      el.style.opacity = '0';
      return;
    }

    if (rafId) cancelAnimationFrame(rafId);
    resizeCanvas();

    const startTs = performance.now();
    el.style.display = 'block';

    function frame(now) {
      const elapsed = now - startTs;
      const t = Math.min(1, elapsed / durationMs);

      // Yumuşak S-eğrisiyle açılıp kapanan yoğunluk zarfı
      const env = Math.sin(t * Math.PI);
      const opacity = Math.pow(env, 0.72) * 0.95;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(prog);
      gl.uniform1f(uLocs.uTime, now * 0.001);
      gl.uniform1f(uLocs.uProgress, t);
      gl.uniform1f(uLocs.uOpacity, opacity);
      gl.uniform3f(uLocs.uSkyTint, tint[0], tint[1], tint[2]);
      gl.uniform2f(uLocs.uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (t < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        el.style.display = 'none';
        rafId = 0;
      }
    }

    rafId = requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resizeCanvas);
  window.GKM_CLOUDS = { playFlight: playCloudFlight };
})();

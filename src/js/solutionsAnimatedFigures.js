export const solutionsAnimatedFigures = () => {
  function initCircleParticles() {
    // Generate particle elements dynamically
    const wrap = document.querySelector('.anim-particles.is-circle');
    if (!wrap) return;

    // Parameters (mirroring your SASS variables)
    const total = 800; // number of particles
    const time = 14; // seconds

    for (let i = 0; i < total; i++) {
      const particle = document.createElement('div');
      particle.className = 'p1';
      wrap.appendChild(particle);
    }

    // Create <style> element
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    styleEl.setAttribute('id', 'particles-circle');

    // Base CSS
    let css = '';

    // Generate particle-specific rules
    for (let i = 1; i <= total; i++) {
      const z = Math.floor(Math.random() * 360);
      const y = Math.floor(Math.random() * 360);

      css += `
    .p1:nth-child(${i}) {
      animation: orbit${i} ${time}s infinite;
      animation-delay: ${i * 0.01}s;
      background-color: white; /* white particles */
    }
    @keyframes orbit${i} {
      20% { opacity: 1; }
      30%, 100% {
        transform: rotateZ(-${z}deg) rotateY(${y}deg) translateX(var(--orb-size)) rotateZ(${z}deg);
        opacity: 1;
      }
    }
    `;
    }

    // Inject CSS into <style>
    styleEl.innerHTML = css;
  }

  initCircleParticles();

  function initAToBParticles() {
    // Generate particle elements dynamically
    const wrap = document.querySelector('.anim-particles.is-a-to-b');
    if (!wrap) return;

    // Parameters (mirroring your SASS variables)
    const total = 800;
    const time = 8; // seconds
    const startX = -150;
    const endX = 150;
    const numPaths = 24;
    const arcStep = 25;

    for (let i = 0; i < total; i++) {
      const particle = document.createElement('div');
      particle.className = 'p2';
      wrap.appendChild(particle);
    }

    // Create <style> element
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    // Base CSS + shared keyframes
    let css = '';

    // Generate per-particle rules
    for (let i = 1; i <= total; i++) {
      const pathNumber = (i % numPaths) + 1;
      const delay = (i / total) * time;

      // Base arc height band
      const arcBase = (pathNumber - (numPaths + 1) / 2) * arcStep;

      // Flip arcs up/down
      const curveDirection = pathNumber % 2 === 0 ? -1 : 1;
      const controlYBase = arcBase * curveDirection;

      // Jitter indices
      const cxJitterIndex = ((i * 13) % 11) - 5; // -5..5
      const cyJitterIndex = ((i * 7) % 9) - 4; // -4..4

      const controlX = cxJitterIndex * 12;
      const controlY = controlYBase + cyJitterIndex * 4;

      // Duration variation
      const durationFactor = 0.8 + (i % 10) / 50; // ~0.8..0.98
      const duration = time * durationFactor;

      css += `
  .p2:nth-child(${i}) {
    offset-path: path('M ${startX} 0 Q ${controlX} ${controlY} ${endX} 0');
    animation: move-along-path ${duration}s infinite;
    animation-delay: ${delay}s;
    animation-timing-function: ease-in-out;
  }
  `;
    }

    // Inject CSS
    styleEl.innerHTML = css;
  }

  initAToBParticles();

  function initWaveParticles() {
    const canvas = document.querySelector('canvas.anim-particles.is-wave');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, dpr;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = canvas.getBoundingClientRect().width;
      height = canvas.getBoundingClientRect().height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    // ---------------- CONFIG ----------------

    // Core particle count
    const NUM_PARTICLES = 4000;

    // Two bands: main (upper) + lower (shadow)
    const MAIN_BAND_SHARE = 0.8;

    // Wave pattern (pre-perspective)
    const MAIN_BASE_Y = 0.4;
    const LOWER_BASE_Y = 0.6;
    const MAIN_AMP = 0.12;
    const LOWER_AMP = 0.08;

    // Horizontal span (narrow band, not full width)
    const H_SPAN = 0.35; // 35% of screen width
    const H_MARGIN = (1 - H_SPAN) / 2; // centered

    // Base scroll speeds for wave pattern
    const SCROLL_SPEED_MAIN = 0.03;
    const SCROLL_SPEED_LOWER = 0.02;

    // Local noise
    const NOISE_SCALE = 0.03;
    const NOISE_SPEED = 0.4;

    // Perspective: far horizon vs near foreground
    const HORIZON_Y = 0.2; // far “horizon”
    const FOREGROUND_Y = 0.9; // near surface

    // Depth-graded colour from light grey → white (still "reads" as white)
    const NEAR_COLOR = { r: 255, g: 255, b: 255 }; // near: pure white
    const FAR_COLOR = { r: 220, g: 220, b: 220 }; // far: soft grey-white

    const MIN_SIZE = 1.0;
    const MAX_SIZE = 2.8;

    // Edge fade (how wide the fade regions are)
    const H_FADE_WIDTH = 0.15 * H_SPAN; // fade near left/right edges of the band
    const V_FADE_WIDTH = 0.12; // fade near top/bottom of screen

    // ---------------- UTIL ----------------

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    // smoothstep(0, 1, x) style curve
    function smoothstep(edge0, edge1, x) {
      const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    }

    // ---------------- PARTICLE SETUP ----------------

    /*
   Each particle:
    - band: 0 = main, 1 = lower
    - x0: base x in [0, 1] along the *wave span*
    - offset: local vertical offset within the band [-1, 1]
    - depth: 0..1 (0 = far, 1 = near)
    - noisePhase: phase for jitter
  */
    const particles = [];

    function createParticles() {
      particles.length = 0;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const band = Math.random() < MAIN_BAND_SHARE ? 0 : 1;
        const x0 = Math.random(); // 0..1 across span

        // Depth
        const depth = Math.random(); // 0 (far) → 1 (near)

        // Offset: far particles looser, near ones tight to the band
        const baseRand = Math.random();
        const sign = Math.random() < 0.5 ? -1 : 1;
        const bandSpreadFactor = band === 0 ? 1.0 : 1.3;

        // Far: large, noisy spread; Near: tight cluster
        const farWeight = 1 - depth; // 1 at far, 0 at near
        const spreadBase = 0.6 + 1.8 * farWeight; // ~2.4 far, ~0.6 near
        const offsetMag = Math.pow(baseRand, 2) * spreadBase;
        const offset = offsetMag * sign * bandSpreadFactor;

        const noisePhase = Math.random() * Math.PI * 2;

        particles.push({ band, x0, offset, depth, noisePhase });
      }
    }
    createParticles();

    // ---------------- WAVE SHAPE ----------------

    function wavePatternYNorm(xNorm, t, band, depth) {
      const base = band === 0 ? MAIN_BASE_Y : LOWER_BASE_Y;
      const baseAmp = band === 0 ? MAIN_AMP : LOWER_AMP;

      // Depth-based amplitude scaling (nearer waves swell more)
      const amp = baseAmp * (0.6 + depth * 0.9); // far ~0.6x, near ~1.5x

      const freq1 = band === 0 ? 1.2 : 1.0;
      const freq2 = band === 0 ? 0.7 : 0.5;

      const phase1 = 2 * Math.PI * (xNorm * freq1 + t * 0.05);
      const phase2 = 2 * Math.PI * (xNorm * freq2 - t * 0.03);

      const y = base + amp * Math.sin(phase1) + amp * 0.4 * Math.sin(phase2);

      return y; // normalized 0..1 BEFORE perspective
    }

    // ---------------- RENDER LOOP ----------------

    let lastTime = performance.now();

    function render(now) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff00';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const d = p.depth; // 0 far → 1 near

        // Horizontal scroll: nearer move faster
        const baseScroll = p.band === 0 ? SCROLL_SPEED_MAIN : SCROLL_SPEED_LOWER;
        const scrollSpeed = baseScroll * lerp(0.4, 1.9, d);

        // x within [0,1] span
        let xSpanNorm = (p.x0 + t * scrollSpeed) % 1;
        if (xSpanNorm < 0) xSpanNorm += 1;

        // Map span to screen width with margins
        const xNorm = H_MARGIN + xSpanNorm * H_SPAN;
        const x = xNorm * width;

        // Wave centre in pattern space with depth-inflated amplitude
        const waveCenterPattern = wavePatternYNorm(xSpanNorm, t, p.band, d);

        // Perspective remap: pattern y → horizon..foreground with depth
        const depthBias = 0.25 + d * 1.0; // far ~0.25, near ~1.25
        const patternY = waveCenterPattern * depthBias;
        let waveBaseNorm = lerp(HORIZON_Y, FOREGROUND_Y, patternY);

        // Local band spread – inverted for depth
        const bandSpreadBase = p.band === 0 ? 0.22 : 0.18;
        const bandSpread = bandSpreadBase * lerp(1.6, 0.35, d); // far wide, near tight

        const offsetNorm = p.offset * bandSpread;

        // Additional jitter – far particles wobble more & independently
        const jitterAmplitude = NOISE_SCALE * lerp(1.6, 0.5, d);
        const jitter =
          jitterAmplitude * Math.sin(p.noisePhase + t * NOISE_SPEED * lerp(1.4, 0.7, d));

        let yNorm = waveBaseNorm + offsetNorm + jitter;

        // clamp vertical
        if (yNorm < 0) yNorm = 0;
        if (yNorm > 1) yNorm = 1;

        const y = yNorm * height;

        // Depth-graded size
        const size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * d;

        // Depth-graded colour (light grey → white)
        const r = FAR_COLOR.r + (NEAR_COLOR.r - FAR_COLOR.r) * d;
        const g = FAR_COLOR.g + (NEAR_COLOR.g - FAR_COLOR.g) * d;
        const b = FAR_COLOR.b + (NEAR_COLOR.b - FAR_COLOR.b) * d;

        // Base alpha by depth
        let alpha = 0.22 + 0.78 * d;

        // ----- EDGE FADES -----

        // Horizontal fade within the wave span
        const leftEdge = H_MARGIN;
        const rightEdge = H_MARGIN + H_SPAN;

        const distLeft = xNorm - leftEdge;
        const distRight = rightEdge - xNorm;

        let hFade = 1.0;
        if (distLeft < H_FADE_WIDTH) {
          hFade *= smoothstep(0, H_FADE_WIDTH, distLeft);
        }
        if (distRight < H_FADE_WIDTH) {
          hFade *= smoothstep(0, H_FADE_WIDTH, distRight);
        }

        // Vertical fade near top/bottom
        let vFade = 1.0;
        if (yNorm < V_FADE_WIDTH) {
          vFade *= smoothstep(0, V_FADE_WIDTH, yNorm);
        }
        if (1 - yNorm < V_FADE_WIDTH) {
          vFade *= smoothstep(0, V_FADE_WIDTH, 1 - yNorm);
        }

        const edgeFade = hFade * vFade;
        alpha *= edgeFade;

        if (alpha <= 0.01) continue;

        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  initWaveParticles();
};

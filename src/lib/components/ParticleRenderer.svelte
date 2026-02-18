<script>
  import { onMount } from 'svelte';

  /** Default fallback; actual accent read from CSS in resize() */
  let particleColor = '#58a6ff';
  const PARTICLE_COUNT = 48;
  const PARTICLE_SIZE_MIN = 1;
  const PARTICLE_SIZE_MAX = 2.5;
  const SPEED = 0.22;
  const OPACITY_MIN = 0.25;
  const OPACITY_MAX = 0.7;

  let canvasEl;
  let rafId;
  let particles = [];

  function parseColor(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function createParticles(width, height) {
    const [r, g, b] = parseColor(particleColor);
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -SPEED - Math.random() * 0.5,
      size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
      opacity: OPACITY_MIN + Math.random() * (OPACITY_MAX - OPACITY_MIN)
    }));
  }

  function draw(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    const [r, g, b] = parseColor(particleColor);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -p.size * 2) {
        p.y = height + p.size * 2;
        p.x = Math.random() * width;
      }
      if (p.x < -p.size || p.x > width + p.size) p.x = (p.x + width) % width;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
      ctx.fill();
    }
  }

  onMount(() => {
    const canvas = canvasEl;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    function resize() {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
      if (accent) particleColor = accent;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height);
    }

    function loop() {
      draw(ctx, width, height);
      rafId = requestAnimationFrame(loop);
    }

    resize();
    loop();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  });
</script>

<div class="particles-container" aria-hidden="true">
  <div class="particles-gradient"></div>
  <canvas bind:this={canvasEl} class="particles-canvas"></canvas>
</div>

<style>
  .particles-container {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    height: max(32vh, 140px);
    margin-bottom: calc(-1 * max(32vh, 140px));
    z-index: 0;
    pointer-events: none;
    flex-shrink: 0;
    mask-image: radial-gradient(
      ellipse 80% 70% at 50% 100%,
      black 0%,
      rgba(0, 0, 0, 0.85) 25%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.2) 75%,
      transparent 100%
    );
    -webkit-mask-image: radial-gradient(
      ellipse 80% 70% at 50% 100%,
      black 0%,
      rgba(0, 0, 0, 0.85) 25%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.2) 75%,
      transparent 100%
    );
  }

  .particles-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(88, 166, 255, 0.12) 0%,
      rgba(88, 166, 255, 0.05) 35%,
      transparent 100%
    );
    z-index: 0;
  }

  .particles-canvas {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>

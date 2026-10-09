interface Glyph {
  /** grid cell coords (pre-wave) — top-left of the cell, in canvas px */
  bx: number;
  by: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 0..1 across the band — drives color + glyph density */
  depth: number;
  /** color bucket index (pre-sorted for batched fills) */
  bucket: number;
  /** base glyph and its denser variant for the interaction glow */
  ch: string;
  chLit: string;
  /** interaction glow, decays per frame */
  lit: number;
}

const PALETTE: [number, number, number][] = [
  [91, 33, 182], // #5b21b6
  [109, 40, 217],
  [124, 58, 237], // #7c3aed
  [139, 92, 246],
  [154, 118, 248],
  [167, 139, 250], // #a78bfa
  [196, 181, 253],
  [221, 214, 254], // #ddd6fe
];

/** density ramp, lightest → solidest block glyph */
const RAMP = ['░', '▒', '▓', '█'];

const FONT_SIZE = 15;
const FONT_STACK =
  'ui-monospace, "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace';
const FONT = `${FONT_SIZE}px ${FONT_STACK}`;
const CELL_H = FONT_SIZE * 1.16;

const BUCKETS = PALETTE.length;
const INTERACT_RADIUS = 150;
const REPEL_STIFFNESS = 2.6;
const SPRING = 0.055;
const DAMPING = 0.845;
const MAX_GLYPHS = 2600;

export function initPixelWave(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let cellW = FONT_SIZE * 0.6;
  let glyphs: Glyph[] = [];
  let raf = 0;
  let running = false;
  let phase = 0;
  let lastTime = 0;

  const pointer = { x: -9999, y: -9999, active: false };

  /** S-band centerline in canvas px — sweeps bottom-left up to top-right */
  const centerY = (x: number): number => {
    const t = x / w;
    return h * 0.78 - t * h * 0.62 + Math.sin(t * Math.PI * 1.45 - 0.35) * h * 0.14;
  };

  const bandWidth = (x: number): number => {
    const t = x / w;
    // widest in the middle, tapers at both ends
    return h * (0.06 + 0.16 * Math.sin(Math.min(1, Math.max(0, t)) * Math.PI) ** 0.8);
  };

  function build() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.font = FONT;
    ctx!.textBaseline = 'top';
    // cell width follows the mono advance so glyphs tile without gaps
    cellW = ctx!.measureText('█').width || FONT_SIZE * 0.6;

    const next: Glyph[] = [];
    const cols = Math.ceil(w / cellW);
    const rows = Math.ceil(h / CELL_H);

    for (let gy = 0; gy <= rows; gy++) {
      for (let gx = 0; gx <= cols; gx++) {
        const bx = gx * cellW;
        const by = gy * CELL_H;
        const cy = by + CELL_H * 0.5;
        const d = Math.abs(cy - centerY(bx));
        const bw = bandWidth(bx);
        if (d >= bw) continue;

        const intensity = 1 - (d / bw) ** 2;
        // dither the soft edges — the faintest cells drop out first
        if (intensity < Math.random() * 0.35) continue;

        const depth = d / bw;
        const bucket = Math.min(BUCKETS - 1, Math.floor(depth * BUCKETS));
        const ramp = Math.min(
          RAMP.length - 1,
          Math.max(0, Math.round(intensity * (RAMP.length - 1))),
        );
        next.push({
          bx,
          by,
          x: bx,
          y: by,
          vx: 0,
          vy: 0,
          depth,
          bucket,
          ch: RAMP[ramp],
          chLit: RAMP[Math.min(RAMP.length - 1, ramp + 1)],
          lit: 0,
        });
      }
    }

    // keep the hottest glyphs near the core, trim the tail if over budget
    if (next.length > MAX_GLYPHS) {
      next.sort((a, b) => a.depth - b.depth);
      next.length = MAX_GLYPHS;
    }
    // sort by bucket so fillStyle changes are rare
    next.sort((a, b) => a.bucket - b.bucket);
    glyphs = next;
  }

  function step(time: number) {
    if (!running) return;
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;
    phase += dt * 0.55;

    const ctx2 = ctx!;
    ctx2.clearRect(0, 0, w, h);

    const px = pointer.x;
    const py = pointer.y;
    const active = pointer.active;
    const r2 = INTERACT_RADIUS * INTERACT_RADIUS;

    let currentBucket = -1;
    let currentLit = -1;

    // pass 1 — base wave, batched by color bucket
    for (let i = 0; i < glyphs.length; i++) {
      const p = glyphs[i];

      // dynamic home: keep the glyph's band offset, undulate the whole ribbon
      const t = p.bx / w;
      const homeY = p.by + Math.sin(t * Math.PI * 2.2 + phase) * h * 0.018;
      const homeX = p.bx + Math.cos(t * Math.PI * 1.7 + phase * 0.8) * 6;

      // spring toward home
      p.vx += (homeX - p.x) * SPRING;
      p.vy += (homeY - p.y) * SPRING;

      // cursor repulsion
      if (active) {
        const dx = p.x - px;
        const dy = p.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2 && d2 > 0.01) {
          const dist = Math.sqrt(d2);
          const fall = 1 - dist / INTERACT_RADIUS;
          const force = (fall * fall * REPEL_STIFFNESS) / dist;
          p.vx += dx * force;
          p.vy += dy * force;
          p.lit = Math.max(p.lit, fall);
        }
      }

      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x += p.vx;
      p.y += p.vy;
      p.lit *= 0.93;

      if (p.bucket !== currentBucket) {
        currentBucket = p.bucket;
        const c = PALETTE[currentBucket];
        ctx2.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
      }
      ctx2.fillText(p.ch, p.x, p.y);
    }

    // pass 2 — lit glyphs brighten toward white and densify one step
    for (let i = 0; i < glyphs.length; i++) {
      const p = glyphs[i];
      if (p.lit < 0.03) continue;
      const base = PALETTE[p.bucket];
      const k = p.lit * 0.9;
      const r = Math.round(base[0] + (255 - base[0]) * k);
      const g = Math.round(base[1] + (255 - base[1]) * k);
      const b = Math.round(base[2] + (255 - base[2]) * k);
      const key = r * 65536 + g * 256 + b;
      if (key !== currentLit) {
        currentLit = key;
        ctx2.fillStyle = `rgb(${r},${g},${b})`;
      }
      ctx2.fillText(p.lit > 0.45 ? p.chLit : p.ch, p.x, p.y);
    }

    raf = requestAnimationFrame(step);
  }

  function drawStatic() {
    const ctx2 = ctx!;
    ctx2.clearRect(0, 0, w, h);
    ctx2.font = FONT;
    ctx2.textBaseline = 'top';
    let currentBucket = -1;
    for (const p of glyphs) {
      if (p.bucket !== currentBucket) {
        currentBucket = p.bucket;
        const c = PALETTE[currentBucket];
        ctx2.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
      }
      ctx2.fillText(p.ch, p.x, p.y);
    }
  }

  function start() {
    if (running || reduced) return;
    running = true;
    lastTime = performance.now();
    raf = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function onPointerMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  }

  function onPointerLeave() {
    pointer.active = false;
  }

  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }

  // the canvas wrapper is pointer-events:none so clicks pass through —
  // listen on the enclosing section instead
  const host = canvas.closest('section') ?? canvas.parentElement ?? canvas;

  build();
  if (reduced) {
    drawStatic();
  } else {
    start();
  }

  const ro = new ResizeObserver(() => {
    build();
    if (reduced) drawStatic();
  });
  ro.observe(host);

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) start();
        else stop();
      }
    },
    { threshold: 0 },
  );
  io.observe(canvas);

  host.addEventListener('pointermove', onPointerMove, { passive: true });
  host.addEventListener('pointerleave', onPointerLeave, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    host.removeEventListener('pointermove', onPointerMove);
    host.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

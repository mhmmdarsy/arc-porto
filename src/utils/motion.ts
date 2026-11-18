/**
 * Exact CSS cubic-bezier solver so GSAP follows CSS easing tokens
 * (--ease-drawer and --ease-out) without approximations.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (u: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveT = (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-6) return t;
      const d = sampleDerivativeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= dx / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const currentX = sampleX(t);
      if (Math.abs(currentX - x) < 1e-6) return t;
      if (x > currentX) lo = t;
      else hi = t;
      t = (lo + hi) * 0.5;
      if (hi - lo < 1e-6) break;
    }
    return t;
  };

  return (u: number) => {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    return sampleY(solveT(u));
  };
}

export const easeDrawer = cubicBezier(0.32, 0.72, 0, 1); // --ease-drawer
export const easeOut = cubicBezier(0.23, 1, 0.32, 1); // --ease-out

/** Return true when the user requests reduced motion. */
export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Return true when the primary pointer supports fine hovering. */
export const canHoverFine = (): boolean =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

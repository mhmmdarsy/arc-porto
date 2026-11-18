import Lenis from 'lenis';
import { prefersReducedMotion } from '@/utils/motion';

/** Initialize Lenis smooth scrolling unless the user prefers reduced motion. */
export function initSmoothScroll(): void {
  if (prefersReducedMotion()) return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
  });

  let rafId = 0;
  const raf = (time: number) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  document.addEventListener('astro:before-swap', () => {
    cancelAnimationFrame(rafId);
    lenis.destroy();
  });
}

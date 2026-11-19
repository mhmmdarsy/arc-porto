import gsap from 'gsap';
import { easeDrawer, prefersReducedMotion } from '@/utils/motion';
import type { Theme } from '@/scripts/theme/storage';

/** Synchronize or animate the Dark/Light label pair inside the theme toggle button. */
export function syncThemeLabelPair(
  darkEl: HTMLElement | null,
  lightEl: HTMLElement | null,
  theme: Theme,
  animate: boolean,
): void {
  if (!darkEl || !lightEl) return;

  const reduced = prefersReducedMotion();
  const darkProps = {
    y: 0,
    yPercent: reduced ? 0 : theme === 'dark' ? 0 : -100,
    opacity: theme === 'dark' ? 1 : 0,
  };
  const lightProps = {
    y: 0,
    yPercent: reduced ? 0 : theme === 'light' ? 0 : 100,
    opacity: theme === 'light' ? 1 : 0,
  };

  if (!animate) {
    gsap.set(darkEl, darkProps);
    gsap.set(lightEl, lightProps);
    return;
  }

  const duration = reduced ? 0.25 : 0.45;
  gsap.to(darkEl, { ...darkProps, duration, ease: easeDrawer, overwrite: 'auto' });
  gsap.to(lightEl, { ...lightProps, duration, ease: easeDrawer, overwrite: 'auto' });
}

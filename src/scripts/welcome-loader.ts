import gsap from 'gsap';
import { easeDrawer, easeOut, prefersReducedMotion } from '@/utils/motion';

interface ProgressSegment {
  to: number;
  duration: number;
  ease: string;
}

/**
 * Smoothly paced 1% -> 100% progression segments with gentle decelerations
 * so the counter feels organic and unhurried without abrupt jumps.
 */
const PROGRESS_SEGMENTS: ProgressSegment[] = [
  { to: 22, duration: 0.42, ease: 'power2.out' },
  { to: 25, duration: 0.32, ease: 'sine.inOut' },
  { to: 54, duration: 0.48, ease: 'power2.inOut' },
  { to: 57, duration: 0.34, ease: 'sine.inOut' },
  { to: 82, duration: 0.46, ease: 'power2.inOut' },
  { to: 85, duration: 0.3, ease: 'sine.inOut' },
  { to: 96, duration: 0.34, ease: 'power2.out' },
  { to: 100, duration: 0.28, ease: 'power2.out' },
];

/** Initialize the inverted welcome loader and its GSAP slide-left reveal into #page-shell. */
export function initWelcomeLoader(): void {
  const root = document.documentElement;
  const loader = document.getElementById('welcome-loader');
  const percentEl = document.getElementById('welcome-loader-percent');
  const hundredsEl = percentEl?.querySelector<HTMLElement>('[data-digit="hundreds"]');
  const tensEl = percentEl?.querySelector<HTMLElement>('[data-digit="tens"]');
  const onesEl = percentEl?.querySelector<HTMLElement>('[data-digit="ones"]');
  const pageShell = document.getElementById('page-shell');

  const cleanup = () => {
    delete root.dataset.loader;
    if (loader) {
      loader.style.display = 'none';
      loader.setAttribute('aria-hidden', 'true');
    }
    if (pageShell) {
      gsap.set(pageShell, { clearProps: 'transform,opacity,willChange' });
    }
  };

  if (
    !loader ||
    !percentEl ||
    !hundredsEl ||
    !tensEl ||
    !onesEl ||
    !pageShell ||
    prefersReducedMotion()
  ) {
    cleanup();
    return;
  }

  const state = { progress: 1 };
  let lastRendered = -1;

  const renderProgress = () => {
    const current = Math.min(100, Math.max(1, Math.round(state.progress)));
    if (current === lastRendered) return;
    lastRendered = current;

    const hundreds = current >= 100 ? String(Math.floor(current / 100)) : '';
    const tens = current >= 10 ? String(Math.floor((current % 100) / 10)) : '';
    const ones = String(current % 10);

    if (hundredsEl.textContent !== hundreds) hundredsEl.textContent = hundreds;
    if (tensEl.textContent !== tens) tensEl.textContent = tens;
    if (onesEl.textContent !== ones) onesEl.textContent = ones;
  };

  gsap.set(loader, { opacity: 0, xPercent: 0, willChange: 'transform, opacity' });
  gsap.set(pageShell, { x: 96, opacity: 0, willChange: 'transform, opacity' });

  const tl = gsap.timeline({
    onComplete: cleanup,
  });

  // 1. Initial appearance: smooth fade only.
  tl.to(loader, {
    opacity: 1,
    duration: 0.45,
    ease: easeOut,
  });

  // 2. Smoothly paced 1% -> 100% counter.
  for (const segment of PROGRESS_SEGMENTS) {
    tl.to(state, {
      progress: segment.to,
      duration: segment.duration,
      ease: segment.ease,
      onUpdate: renderProgress,
    });
  }

  // Brief beat at 100% before transitioning out.
  tl.to({}, { duration: 0.22 });

  // 3. Exit loader to the left while main content slides in from the right.
  tl.to(loader, {
    xPercent: -100,
    duration: 1.0,
    ease: easeDrawer,
  });

  tl.to(
    pageShell,
    {
      x: 0,
      opacity: 1,
      duration: 1.05,
      ease: easeDrawer,
    },
    '<+0.04',
  );
}

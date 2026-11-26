import gsap from 'gsap';
import { easeDrawer, easeOut, prefersReducedMotion } from '@/utils/motion';

interface ProgressSegment {
  to: number;
  duration: number;
  ease: string;
  status?: string;
}

/**
 * Stuttered 1% -> 100% progression segments.
 * Deliberate pauses and micro-steps create a tactile, non-linear loading feel.
 */
const PROGRESS_SEGMENTS: ProgressSegment[] = [
  { to: 18, duration: 0.22, ease: 'power2.out', status: 'Initializing' },
  { to: 21, duration: 0.18, ease: 'none' },
  { to: 47, duration: 0.24, ease: 'power3.out', status: 'Loading layout' },
  { to: 49, duration: 0.22, ease: 'steps(2)' },
  { to: 78, duration: 0.26, ease: 'power2.inOut', status: 'Preparing motion' },
  { to: 81, duration: 0.2, ease: 'steps(3)' },
  { to: 94, duration: 0.18, ease: 'power2.out' },
  { to: 96, duration: 0.18, ease: 'none' },
  { to: 100, duration: 0.14, ease: 'power3.out', status: 'Ready' },
];

/** Initialize the inverted welcome loader and its GSAP slide-up reveal into #page-shell. */
export function initWelcomeLoader(): void {
  const root = document.documentElement;
  const loader = document.getElementById('welcome-loader');
  const percentEl = document.getElementById('welcome-loader-percent');
  const hundredsEl = percentEl?.querySelector<HTMLElement>('[data-digit="hundreds"]');
  const tensEl = percentEl?.querySelector<HTMLElement>('[data-digit="tens"]');
  const onesEl = percentEl?.querySelector<HTMLElement>('[data-digit="ones"]');
  const barEl = document.getElementById('welcome-loader-bar');
  const statusEl = document.getElementById('welcome-loader-status');
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
    !barEl ||
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
    if (current !== lastRendered) {
      lastRendered = current;
      const hundreds = current >= 100 ? String(Math.floor(current / 100)) : '';
      const tens = current >= 10 ? String(Math.floor((current % 100) / 10)) : '';
      const ones = String(current % 10);

      if (hundredsEl.textContent !== hundreds) hundredsEl.textContent = hundreds;
      if (tensEl.textContent !== tens) tensEl.textContent = tens;
      if (onesEl.textContent !== ones) onesEl.textContent = ones;
    }
    barEl.style.transform = `scaleX(${(state.progress / 100).toFixed(4)})`;
  };

  gsap.set(loader, { opacity: 0, yPercent: 0, willChange: 'transform, opacity' });
  gsap.set(pageShell, { y: 96, opacity: 0, willChange: 'transform, opacity' });

  const tl = gsap.timeline({
    onComplete: cleanup,
  });

  // 1. Initial appearance: fade only.
  tl.to(loader, {
    opacity: 1,
    duration: 0.35,
    ease: easeOut,
  });

  // 2. Stuttered 1% -> 100% counter.
  for (const segment of PROGRESS_SEGMENTS) {
    tl.to(state, {
      progress: segment.to,
      duration: segment.duration,
      ease: segment.ease,
      onStart: () => {
        if (segment.status && statusEl) {
          statusEl.textContent = segment.status;
        }
      },
      onUpdate: renderProgress,
    });
  }

  // Brief beat at 100% before transitioning out.
  tl.to({}, { duration: 0.16 });

  // 3. Exit loader upward while main content slides up from below.
  tl.to(loader, {
    yPercent: -100,
    duration: 0.85,
    ease: easeDrawer,
  });

  tl.to(
    pageShell,
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: easeDrawer,
    },
    '<+0.03',
  );
}

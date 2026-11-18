import gsap from 'gsap';
import { siteMeta } from '@/data/portfolio';
import { easeDrawer, easeOut, prefersReducedMotion } from '@/utils/motion';

type Theme = 'dark' | 'light';

/** Initialize the theme toggle button, persistence, label transition, and circular reveal stage. */
export function initThemeToggle(): void {
  const themeBtn = document.getElementById('theme-btn') as HTMLButtonElement | null;
  const pageShell = document.getElementById('page-shell') as HTMLDivElement | null;
  const transitionStage = document.getElementById('theme-transition-stage') as HTMLDivElement | null;

  if (!themeBtn) return;

  const darkLabel = themeBtn.querySelector<HTMLElement>('[data-theme-label="dark"]');
  const lightLabel = themeBtn.querySelector<HTMLElement>('[data-theme-label="light"]');

  let activeTheme: Theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  let stageTheme: Theme | null = null;
  let isStageVisible = false;
  let activeStageTween: gsap.core.Tween | null = null;
  const clipState = { r: 0 };
  let originX = 0;
  let originY = 0;
  let maxRadius = 0;
  let clonedShell: HTMLElement | null = null;
  let cloneDarkLabel: HTMLElement | null = null;
  let cloneLightLabel: HTMLElement | null = null;
  let scrollListenerAttached = false;

  const persistTheme = (theme: Theme) => {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Ignore storage errors in restricted contexts.
    }
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'light' ? siteMeta.themeColors.light : siteMeta.themeColors.dark,
      );
    }
  };

  const syncLabelPair = (
    darkEl: HTMLElement | null,
    lightEl: HTMLElement | null,
    theme: Theme,
    animate: boolean,
  ) => {
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
  };

  const updateButtonState = (theme: Theme, animate: boolean) => {
    themeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    syncLabelPair(darkLabel, lightLabel, theme, animate);
    if (cloneDarkLabel && cloneLightLabel) {
      syncLabelPair(cloneDarkLabel, cloneLightLabel, theme, animate);
    }
  };

  const syncCloneScroll = () => {
    if (!clonedShell) return;
    clonedShell.style.transform = `translate3d(0, -${window.scrollY}px, 0)`;
  };

  const attachScrollSync = () => {
    if (scrollListenerAttached) return;
    window.addEventListener('scroll', syncCloneScroll, { passive: true });
    scrollListenerAttached = true;
  };

  const detachScrollSync = () => {
    if (!scrollListenerAttached) return;
    window.removeEventListener('scroll', syncCloneScroll);
    scrollListenerAttached = false;
  };

  const getCircleMetrics = () => {
    const rect = themeBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const r = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );
    return { cx, cy, r };
  };

  const finalizeStage = (commitTheme: Theme) => {
    activeStageTween = null;
    document.documentElement.dataset.theme = commitTheme;
    isStageVisible = false;
    stageTheme = null;
    detachScrollSync();

    if (transitionStage) {
      transitionStage.style.visibility = 'hidden';
      transitionStage.style.clipPath = '';
      transitionStage.style.opacity = '';
      transitionStage.removeAttribute('data-theme');
      transitionStage.replaceChildren();
    }

    clonedShell = null;
    cloneDarkLabel = null;
    cloneLightLabel = null;
  };

  // Sync initial button label state on mount.
  updateButtonState(activeTheme, false);

  themeBtn.addEventListener('click', () => {
    const prevTheme = activeTheme;
    activeTheme = prevTheme === 'dark' ? 'light' : 'dark';
    persistTheme(activeTheme);

    if (!transitionStage || !pageShell) {
      document.documentElement.dataset.theme = activeTheme;
      updateButtonState(activeTheme, true);
      return;
    }

    const reduced = prefersReducedMotion();
    const metrics = getCircleMetrics();
    originX = metrics.cx;
    originY = metrics.cy;
    maxRadius = metrics.r;

    if (!isStageVisible) {
      const clone = pageShell.cloneNode(true) as HTMLElement;
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
      clone.setAttribute('inert', '');
      clone.style.willChange = 'transform';

      clonedShell = clone;
      cloneDarkLabel = clone.querySelector<HTMLElement>('[data-theme-label="dark"]');
      cloneLightLabel = clone.querySelector<HTMLElement>('[data-theme-label="light"]');
      cloneDarkLabel?.removeAttribute('style');
      cloneLightLabel?.removeAttribute('style');

      stageTheme = activeTheme;
      isStageVisible = true;
      transitionStage.dataset.theme = activeTheme;
      transitionStage.replaceChildren(clone);
      syncCloneScroll();
      attachScrollSync();

      if (reduced) {
        syncLabelPair(cloneDarkLabel, cloneLightLabel, activeTheme, false);
        themeBtn.setAttribute('aria-pressed', activeTheme === 'light' ? 'true' : 'false');
        syncLabelPair(darkLabel, lightLabel, activeTheme, true);

        transitionStage.style.clipPath = '';
        transitionStage.style.opacity = '0';
        transitionStage.style.visibility = 'visible';

        activeStageTween = gsap.to(transitionStage, {
          opacity: 1,
          duration: 0.3,
          ease: easeOut,
          overwrite: 'auto',
          onComplete: () => finalizeStage(activeTheme),
        });
        return;
      }

      // Start clone labels at prevTheme so they animate in lockstep inside the expanding circle.
      syncLabelPair(cloneDarkLabel, cloneLightLabel, prevTheme, false);
      updateButtonState(activeTheme, true);

      clipState.r = 0;
      transitionStage.style.opacity = '1';
      transitionStage.style.clipPath = `circle(0px at ${originX}px ${originY}px)`;
      transitionStage.style.visibility = 'visible';

      activeStageTween = gsap.to(clipState, {
        r: maxRadius,
        duration: 1.0,
        ease: easeDrawer,
        onUpdate: () => {
          transitionStage.style.clipPath = `circle(${clipState.r}px at ${originX}px ${originY}px)`;
        },
        onComplete: () => finalizeStage(activeTheme),
      });
      return;
    }

    // Interrupted mid-flight while stage is visible and html.dataset.theme hasn't flipped yet.
    activeStageTween?.kill();
    updateButtonState(activeTheme, true);

    if (reduced) {
      const targetOpacity = activeTheme === stageTheme ? 1 : 0;
      activeStageTween = gsap.to(transitionStage, {
        opacity: targetOpacity,
        duration: 0.3,
        ease: easeOut,
        overwrite: 'auto',
        onComplete: () => finalizeStage(activeTheme),
      });
      return;
    }

    const expandingToStage = activeTheme === stageTheme;
    const targetRadius = expandingToStage ? maxRadius : 0;
    const duration = expandingToStage ? 1.0 : 0.75;

    activeStageTween = gsap.to(clipState, {
      r: targetRadius,
      duration,
      ease: easeDrawer,
      onUpdate: () => {
        transitionStage.style.clipPath = `circle(${clipState.r}px at ${originX}px ${originY}px)`;
      },
      onComplete: () => finalizeStage(activeTheme),
    });
  });
}

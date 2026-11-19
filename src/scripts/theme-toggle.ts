import gsap from 'gsap';
import { easeDrawer, easeOut, prefersReducedMotion } from '@/utils/motion';
import { createClonedShell, getCircleMetrics } from '@/scripts/theme/circle-reveal';
import { syncThemeLabelPair } from '@/scripts/theme/label-animation';
import {
  getActiveDocumentTheme,
  persistTheme,
  type Theme,
} from '@/scripts/theme/storage';

/** Initialize the theme toggle button, persistence, label transition, and circular reveal stage. */
export function initThemeToggle(): void {
  const themeBtn = document.getElementById('theme-btn') as HTMLButtonElement | null;
  const pageShell = document.getElementById('page-shell') as HTMLDivElement | null;
  const transitionStage = document.getElementById('theme-transition-stage') as HTMLDivElement | null;

  if (!themeBtn) return;

  const darkLabel = themeBtn.querySelector<HTMLElement>('[data-theme-label="dark"]');
  const lightLabel = themeBtn.querySelector<HTMLElement>('[data-theme-label="light"]');

  let activeTheme: Theme = getActiveDocumentTheme();
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

  const updateButtonState = (theme: Theme, animate: boolean) => {
    themeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    syncThemeLabelPair(darkLabel, lightLabel, theme, animate);
    if (cloneDarkLabel && cloneLightLabel) {
      syncThemeLabelPair(cloneDarkLabel, cloneLightLabel, theme, animate);
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
    const metrics = getCircleMetrics(themeBtn);
    originX = metrics.cx;
    originY = metrics.cy;
    maxRadius = metrics.r;

    if (!isStageVisible) {
      const cloned = createClonedShell(pageShell);
      clonedShell = cloned.clone;
      cloneDarkLabel = cloned.cloneDarkLabel;
      cloneLightLabel = cloned.cloneLightLabel;

      stageTheme = activeTheme;
      isStageVisible = true;
      transitionStage.dataset.theme = activeTheme;
      transitionStage.replaceChildren(cloned.clone);
      syncCloneScroll();
      attachScrollSync();

      if (reduced) {
        syncThemeLabelPair(cloneDarkLabel, cloneLightLabel, activeTheme, false);
        themeBtn.setAttribute('aria-pressed', activeTheme === 'light' ? 'true' : 'false');
        syncThemeLabelPair(darkLabel, lightLabel, activeTheme, true);

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
      syncThemeLabelPair(cloneDarkLabel, cloneLightLabel, prevTheme, false);
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

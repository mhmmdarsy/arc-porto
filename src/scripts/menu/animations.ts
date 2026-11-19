import gsap from 'gsap';
import { easeDrawer, easeOut, prefersReducedMotion } from '@/utils/motion';

export interface MenuAnimationTargets {
  menuBtn: HTMLButtonElement;
  panel: HTMLDivElement;
  backdrop: HTMLDivElement;
  menuItems: HTMLElement[];
  activeIndicator: HTMLDivElement | null;
}

/** Calculate panel origin offsets relative to the menu trigger button. */
export function getOriginOffsets(menuBtn: HTMLElement, panel: HTMLElement) {
  const btnRect = menuBtn.getBoundingClientRect();
  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;

  // offsetLeft/Top/Width/Height ignore active CSS transforms, giving the exact
  // centered identity rect even if interrupted mid-flight.
  const panelWidth = panel.offsetWidth || 426;
  const panelHeight = panel.offsetHeight || 373;
  const panelCenterX = panel.offsetLeft + panelWidth / 2;
  const panelCenterY = panel.offsetTop + panelHeight / 2;

  return {
    dx: btnCenterX - panelCenterX,
    dy: btnCenterY - panelCenterY,
    sx: Math.max(0.18, menuBtn.offsetWidth / panelWidth),
    sy: Math.max(0.12, menuBtn.offsetHeight / panelHeight),
  };
}

function getKillTargets(targets: MenuAnimationTargets): gsap.TweenTarget[] {
  return [
    targets.panel,
    targets.backdrop,
    targets.menuBtn,
    targets.activeIndicator,
    ...targets.menuItems,
  ].filter(Boolean) as gsap.TweenTarget[];
}

/** Run opening transitions for the menu panel, backdrop, items, and active indicator. */
export function animateMenuOpen(
  targets: MenuAnimationTargets,
  onReady: () => void,
): void {
  const { menuBtn, panel, backdrop, menuItems, activeIndicator } = targets;
  const wasAnimating = gsap.isTweening(panel);

  gsap.killTweensOf(getKillTargets(targets));

  if (prefersReducedMotion()) {
    gsap.set(panel, {
      visibility: 'visible',
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    });
    gsap.to(panel, { opacity: 1, duration: 0.18, ease: easeOut });
    gsap.to(backdrop, { opacity: 1, duration: 0.18, ease: easeOut });
    gsap.set(menuItems, { opacity: 1, y: 0 });
    if (activeIndicator) gsap.set(activeIndicator, { opacity: 1 });
    gsap.to(menuBtn, { opacity: 0, duration: 0.18, ease: easeOut });
    onReady();
    return;
  }

  const { dx, dy, sx, sy } = getOriginOffsets(menuBtn, panel);

  if (!wasAnimating) {
    gsap.set(panel, {
      visibility: 'visible',
      x: dx,
      y: dy,
      scaleX: sx,
      scaleY: sy,
      opacity: 0,
    });
  } else {
    gsap.set(panel, { visibility: 'visible' });
  }

  gsap.to(panel, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    duration: 1.0,
    ease: easeDrawer,
    overwrite: 'auto',
  });

  gsap.to(backdrop, {
    opacity: 1,
    duration: 0.85,
    ease: easeOut,
    overwrite: 'auto',
  });

  gsap.to(menuBtn, {
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    ease: easeOut,
    overwrite: 'auto',
  });

  gsap.fromTo(
    menuItems,
    { opacity: 0, y: 8 },
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.05,
      delay: wasAnimating ? 0.05 : 0.22,
      ease: easeOut,
      overwrite: 'auto',
    },
  );

  onReady();

  if (activeIndicator) {
    gsap.fromTo(
      activeIndicator,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.35,
        delay: wasAnimating ? 0.05 : 0.22,
        ease: easeOut,
        overwrite: 'auto',
      },
    );
  }
}

/** Run closing transitions for the menu panel, backdrop, items, and active indicator. */
export function animateMenuClose(
  targets: MenuAnimationTargets,
  isStillClosed: () => boolean,
): void {
  const { menuBtn, panel, backdrop, menuItems, activeIndicator } = targets;

  gsap.killTweensOf(getKillTargets(targets));

  if (prefersReducedMotion()) {
    gsap.to(panel, {
      opacity: 0,
      duration: 0.18,
      ease: easeOut,
      onComplete: () => {
        if (isStillClosed()) gsap.set(panel, { visibility: 'hidden' });
      },
    });
    gsap.to(backdrop, { opacity: 0, duration: 0.18, ease: easeOut });
    if (activeIndicator) gsap.set(activeIndicator, { opacity: 0 });
    gsap.to(menuBtn, { opacity: 1, duration: 0.18, ease: easeOut });
    return;
  }

  const { dx, dy, sx, sy } = getOriginOffsets(menuBtn, panel);

  gsap.to(menuItems, {
    opacity: 0,
    duration: 0.3,
    ease: easeOut,
    overwrite: 'auto',
  });

  if (activeIndicator) {
    gsap.to(activeIndicator, {
      opacity: 0,
      duration: 0.25,
      ease: easeOut,
      overwrite: 'auto',
    });
  }

  gsap.to(panel, {
    x: dx,
    y: dy,
    scaleX: sx,
    scaleY: sy,
    opacity: 0,
    duration: 1.0,
    ease: easeDrawer,
    overwrite: 'auto',
    onComplete: () => {
      if (isStillClosed()) gsap.set(panel, { visibility: 'hidden' });
    },
  });

  gsap.to(backdrop, {
    opacity: 0,
    duration: 0.85,
    ease: easeOut,
    overwrite: 'auto',
  });

  gsap.to(menuBtn, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    delay: 0.55,
    ease: easeOut,
    overwrite: 'auto',
  });
}

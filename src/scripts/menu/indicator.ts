import { prefersReducedMotion } from '@/utils/motion';

export interface SetActiveIndexOptions {
  focusLink?: boolean;
  immediate?: boolean;
}

export interface MenuIndicatorController {
  getActiveIndex: () => number;
  syncIndicator: (immediate?: boolean) => void;
  setActiveIndex: (index: number, options?: SetActiveIndexOptions) => void;
}

/** Manage active link state, focus synchronization, and sliding indicator geometry. */
export function createMenuIndicatorController(
  navLinks: HTMLAnchorElement[],
  activeIndicator: HTMLDivElement | null,
): MenuIndicatorController {
  let activeIndex = 0;

  const syncIndicator = (immediate = false) => {
    const target = navLinks[activeIndex];
    if (!activeIndicator || !target) return;
    const y = target.offsetTop;
    const h = target.offsetHeight;
    activeIndicator.style.height = `${h}px`;

    if (immediate || prefersReducedMotion()) {
      activeIndicator.setAttribute('data-immediate', 'true');
      activeIndicator.style.transform = `translate3d(0, ${y}px, 0)`;
      void activeIndicator.offsetHeight;
      activeIndicator.removeAttribute('data-immediate');
    } else {
      activeIndicator.style.transform = `translate3d(0, ${y}px, 0)`;
    }
  };

  const setActiveIndex = (
    index: number,
    options: SetActiveIndexOptions = {},
  ) => {
    if (!navLinks.length) return;
    const { focusLink = true, immediate = false } = options;
    activeIndex = (index + navLinks.length) % navLinks.length;

    navLinks.forEach((link, idx) => {
      const active = idx === activeIndex;
      link.setAttribute('data-active', active ? 'true' : 'false');
      if (active) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    syncIndicator(immediate);

    if (focusLink) {
      navLinks[activeIndex]?.focus({ preventScroll: true });
    }
  };

  return {
    getActiveIndex: () => activeIndex,
    syncIndicator,
    setActiveIndex,
  };
}

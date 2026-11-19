import gsap from 'gsap';
import { canHoverFine, easeDrawer, easeOut, prefersReducedMotion } from '@/utils/motion';

/** Initialize the menu dialog overlay animations, keyboard navigation, and Cmd/Ctrl+K shortcut. */
export function initMenuOverlay(): void {
  const menuBtn = document.getElementById('menu-toggle-btn') as HTMLButtonElement | null;
  const overlay = document.getElementById('menu-overlay') as HTMLDivElement | null;
  const backdrop = document.getElementById('menu-backdrop') as HTMLDivElement | null;
  const panel = document.getElementById('menu-panel') as HTMLDivElement | null;
  const closeBtn = document.getElementById('menu-close-btn') as HTMLButtonElement | null;

  if (!menuBtn || !overlay || !backdrop || !panel) return;

  const menuItems = Array.from(panel.querySelectorAll<HTMLElement>('[data-menu-item]'));
  const navLinks = Array.from(panel.querySelectorAll<HTMLAnchorElement>('.menu-nav-link'));
  const activeIndicator = document.getElementById('menu-active-indicator') as HTMLDivElement | null;

  let isOpen = false;
  let activeIndex = 0;
  let lastFocusedEl: HTMLElement | null = null;
  let lastPointerX = -1;
  let lastPointerY = -1;

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
    options: { focusLink?: boolean; immediate?: boolean } = {},
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

  const getOriginOffsets = () => {
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
  };

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    lastFocusedEl = document.activeElement as HTMLElement | null;

    menuBtn.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.remove('pointer-events-none');
    overlay.classList.add('pointer-events-auto');

    const wasAnimating = gsap.isTweening(panel);
    gsap.killTweensOf(
      [panel, backdrop, menuBtn, activeIndicator, ...menuItems].filter(Boolean) as gsap.TweenTarget[],
    );

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
      setActiveIndex(0, { focusLink: true, immediate: true });
      return;
    }

    const { dx, dy, sx, sy } = getOriginOffsets();

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

    setActiveIndex(0, { focusLink: true, immediate: true });

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
  };

  const closeMenu = (restoreFocus = true) => {
    if (!isOpen) return;
    isOpen = false;

    menuBtn.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('pointer-events-auto');
    overlay.classList.add('pointer-events-none');

    gsap.killTweensOf(
      [panel, backdrop, menuBtn, activeIndicator, ...menuItems].filter(Boolean) as gsap.TweenTarget[],
    );

    if (prefersReducedMotion()) {
      gsap.to(panel, {
        opacity: 0,
        duration: 0.18,
        ease: easeOut,
        onComplete: () => {
          if (!isOpen) gsap.set(panel, { visibility: 'hidden' });
        },
      });
      gsap.to(backdrop, { opacity: 0, duration: 0.18, ease: easeOut });
      if (activeIndicator) gsap.set(activeIndicator, { opacity: 0 });
      gsap.to(menuBtn, { opacity: 1, duration: 0.18, ease: easeOut });
      if (restoreFocus && lastFocusedEl) {
        lastFocusedEl.focus({ preventScroll: true });
      }
      return;
    }

    const { dx, dy, sx, sy } = getOriginOffsets();

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
        if (!isOpen) gsap.set(panel, { visibility: 'hidden' });
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

    if (restoreFocus && lastFocusedEl) {
      lastFocusedEl.focus({ preventScroll: true });
    }
  };

  menuBtn.addEventListener('click', () => {
    if (isOpen) closeMenu();
    else openMenu();
  });

  closeBtn?.addEventListener('click', () => closeMenu());
  backdrop.addEventListener('click', () => closeMenu());

  navLinks.forEach((link, idx) => {
    link.addEventListener('pointerenter', (e) => {
      if (!isOpen || !canHoverFine()) return;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      if (activeIndex !== idx) {
        setActiveIndex(idx, { focusLink: true });
      }
    });

    link.addEventListener('pointermove', (e) => {
      if (!isOpen || !canHoverFine()) return;
      if (e.clientX === lastPointerX && e.clientY === lastPointerY) return;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      if (activeIndex !== idx) {
        setActiveIndex(idx, { focusLink: true });
      }
    });

    link.addEventListener('focus', () => {
      if (isOpen && activeIndex !== idx) {
        setActiveIndex(idx, { focusLink: false });
      }
    });

    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;
      closeMenu(false);

      if (href === '#') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
        return;
      }

      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        target?.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      }
    });
  });

  window.addEventListener('resize', () => {
    if (isOpen) syncIndicator(true);
  });

  window.addEventListener('keydown', (e) => {
    if (isOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((activeIndex + 1) % navLinks.length);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((activeIndex - 1 + navLinks.length) % navLinks.length);
        return;
      }

      if (e.key === 'Enter') {
        if (document.activeElement !== closeBtn) {
          e.preventDefault();
          navLinks[activeIndex]?.click();
          return;
        }
      }
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (isOpen) closeMenu();
      else openMenu();
    }
  });
}

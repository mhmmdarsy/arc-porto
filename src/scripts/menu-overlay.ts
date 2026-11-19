import { canHoverFine } from '@/utils/motion';
import { animateMenuClose, animateMenuOpen } from '@/scripts/menu/animations';
import { createMenuIndicatorController } from '@/scripts/menu/indicator';
import { handleMenuLinkClick } from '@/scripts/menu/navigation';

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

  const indicator = createMenuIndicatorController(navLinks, activeIndicator);
  const animationTargets = { menuBtn, panel, backdrop, menuItems, activeIndicator };

  let isOpen = false;
  let lastFocusedEl: HTMLElement | null = null;
  let lastPointerX = -1;
  let lastPointerY = -1;

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    lastFocusedEl = document.activeElement as HTMLElement | null;

    menuBtn.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.remove('pointer-events-none');
    overlay.classList.add('pointer-events-auto');

    animateMenuOpen(animationTargets, () => {
      indicator.setActiveIndex(0, { focusLink: true, immediate: true });
    });
  };

  const closeMenu = (restoreFocus = true) => {
    if (!isOpen) return;
    isOpen = false;

    menuBtn.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('pointer-events-auto');
    overlay.classList.add('pointer-events-none');

    animateMenuClose(animationTargets, () => !isOpen);

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
      if (indicator.getActiveIndex() !== idx) {
        indicator.setActiveIndex(idx, { focusLink: true });
      }
    });

    link.addEventListener('pointermove', (e) => {
      if (!isOpen || !canHoverFine()) return;
      if (e.clientX === lastPointerX && e.clientY === lastPointerY) return;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      if (indicator.getActiveIndex() !== idx) {
        indicator.setActiveIndex(idx, { focusLink: true });
      }
    });

    link.addEventListener('focus', () => {
      if (isOpen && indicator.getActiveIndex() !== idx) {
        indicator.setActiveIndex(idx, { focusLink: false });
      }
    });

    link.addEventListener('click', (e) => {
      handleMenuLinkClick(link, e, closeMenu);
    });
  });

  window.addEventListener('resize', () => {
    if (isOpen) indicator.syncIndicator(true);
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
        indicator.setActiveIndex((indicator.getActiveIndex() + 1) % navLinks.length);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        indicator.setActiveIndex(
          (indicator.getActiveIndex() - 1 + navLinks.length) % navLinks.length,
        );
        return;
      }

      if (e.key === 'Enter') {
        if (document.activeElement !== closeBtn) {
          e.preventDefault();
          navLinks[indicator.getActiveIndex()]?.click();
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

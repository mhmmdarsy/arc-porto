import { prefersReducedMotion } from '@/utils/motion';

/** Handle menu link clicks by closing the menu and smoothly scrolling to the target section. */
export function handleMenuLinkClick(
  link: HTMLAnchorElement,
  event: MouseEvent,
  closeMenu: (restoreFocus?: boolean) => void,
): void {
  const href = link.getAttribute('href');
  if (!href) return;
  closeMenu(false);

  if (href === '#') {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    return;
  }

  if (href.startsWith('#')) {
    event.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }
}

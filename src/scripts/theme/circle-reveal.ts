export interface CircleMetrics {
  cx: number;
  cy: number;
  r: number;
}

export interface ClonedShellRefs {
  clone: HTMLElement;
  cloneDarkLabel: HTMLElement | null;
  cloneLightLabel: HTMLElement | null;
}

/** Compute center origin and maximum corner radius from the theme toggle button. */
export function getCircleMetrics(themeBtn: HTMLElement): CircleMetrics {
  const rect = themeBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const r = Math.hypot(
    Math.max(cx, window.innerWidth - cx),
    Math.max(cy, window.innerHeight - cy),
  );
  return { cx, cy, r };
}

/** Clone #page-shell for the circular reveal stage without duplicate IDs or interactivity. */
export function createClonedShell(pageShell: HTMLElement): ClonedShellRefs {
  const clone = pageShell.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
  clone.setAttribute('inert', '');
  clone.style.willChange = 'transform';

  const cloneDarkLabel = clone.querySelector<HTMLElement>('[data-theme-label="dark"]');
  const cloneLightLabel = clone.querySelector<HTMLElement>('[data-theme-label="light"]');
  cloneDarkLabel?.removeAttribute('style');
  cloneLightLabel?.removeAttribute('style');

  return { clone, cloneDarkLabel, cloneLightLabel };
}

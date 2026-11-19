import { siteMeta } from '@/data/site';

export type Theme = 'dark' | 'light';

/** Read the active theme from the document root. */
export function getActiveDocumentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Persist the selected theme to localStorage and update the theme-color meta tag. */
export function persistTheme(theme: Theme): void {
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
}

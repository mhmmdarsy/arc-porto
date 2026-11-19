export interface NavItem {
  index: string;
  label: string;
  href: string;
}

export const navItems: readonly NavItem[] = [
  { index: '01', label: 'Home', href: '#' },
  { index: '02', label: 'About', href: '#hero-heading' },
  { index: '03', label: 'Experience', href: '#experience' },
  { index: '04', label: 'Projects', href: '#projects' },
  { index: '05', label: 'Social', href: '#social' },
];

export const menuUiText = {
  triggerLabel: 'Menu',
  shortcutKey: 'K',
  shortcutAriaLabel: 'Shortcut: Command K',
  title: 'Menu',
  closeLabel: 'Close',
  closeKey: 'Esc',
  footerHints: '↑↓ Navigate · ↵ Select · ESC',
} as const;

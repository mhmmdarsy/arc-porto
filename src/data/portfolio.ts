export interface NavItem {
  index: string;
  label: string;
  href: string;
}

export interface ExperienceItem {
  role: string;
  period: string;
}

export interface ProjectItem {
  name: string;
  year: string;
  link: string;
}

export interface SocialItem {
  platform: string;
  handle: string;
  url: string;
}

export const siteMeta = {
  title: 'Arsy - Software Engineer',
  description:
    'Software Engineer based in Samarinda, Indonesia. Interested in Website Developer & UI/UX to build web with nice looking interfaces.',
  menuBrand: 'arsy',
  footerBrand: 'arc',
  location: 'Samarinda, Indonesia',
  utcLabel: 'UTC+8',
  timezoneTitle: 'Waktu Indonesia Tengah (WITA / UTC+8)',
  themeColors: {
    dark: '#060e13',
    light: '#f8fafb',
  },
} as const;

export const navItems: readonly NavItem[] = [
  { index: '01', label: 'Home', href: '#' },
  { index: '02', label: 'About', href: '#hero-heading' },
  { index: '03', label: 'Experience', href: '#experience' },
  { index: '04', label: 'Projects', href: '#projects' },
  { index: '05', label: 'Social', href: '#social' },
];

export const experiences: readonly ExperienceItem[] = [
  {
    role: 'Software Engineer Freelance',
    period: 'Apr 2026 - Now',
  },
  {
    role: 'UI/UX Designer Intern',
    period: 'Jan - May 2026',
  },
  {
    role: 'Laboratory Assistant',
    period: 'Sep - Nov 2025 & Feb - Apr 2026',
  },
  {
    role: 'Web Development Bootcamp (ASAH Program)',
    period: 'Aug 2025 - Jan 2026',
  },
];

export const projects: readonly ProjectItem[] = [
  {
    name: 'RANA',
    year: '2026',
    link: '#',
  },
];

export const socials: readonly SocialItem[] = [
  {
    platform: 'GitHub',
    handle: 'mhmmdarsy',
    url: 'https://github.com/mhmmdarsy',
  },
  {
    platform: 'LinkedIn',
    handle: 'mhmdarsy',
    url: 'https://linkedin.com/in/mhmdarsy',
  },
  {
    platform: 'X (formerly Twitter)',
    handle: 'nvr_arc',
    url: 'https://x.com/nvr_arc',
  },
];

export const contactEmail = 'muhammadarsyalfahd@gmail.com';

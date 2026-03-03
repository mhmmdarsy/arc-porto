export interface NavigationLink {
  label: string;
  href: string;
}

export interface NavigationCardItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: NavigationLink[];
}

export interface StaggeredMenuItem {
  label: string;
  link: string;
  ariaLabel?: string;
}

export interface SocialItem {
  label: string;
  link: string;
}

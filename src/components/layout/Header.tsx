import StaggeredMenu from '../StaggeredMenu';
import type {
  NavigationCardItem,
  StaggeredMenuItem,
} from '../../types/navigation';

interface HeaderProps {
  menuItems?: NavigationCardItem[];
  accentColor?: string;
  headerOffset?: string;
}

export default function Header({
  menuItems = [],
  accentColor = '#5227FF',
  headerOffset = '-1rem',
}: HeaderProps) {
  const items: StaggeredMenuItem[] = menuItems.map((item) => ({
    label: item.label,
    link: item.links?.[0]?.href || '#',
    ariaLabel: item.label,
  }));

  return (
    <div className="w-full max-w-5xl px-4">
      <StaggeredMenu
        position="right"
        items={items}
        displaySocials
        displayItemNumbering
        isFixed
        headerOffset={headerOffset}
        colors={['#111', '#3A29FF']}
        menuButtonColor="#fff"
        openMenuButtonColor="#111"
        changeMenuColorOnOpen
        accentColor={accentColor}
      />
    </div>
  );
}

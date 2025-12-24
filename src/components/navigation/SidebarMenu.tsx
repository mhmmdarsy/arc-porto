import { useTheme } from '../../contexts/ThemeContext';

interface MenuItem {
  label: string;
  href: string;
  number: string;
}

interface SidebarMenuProps {
  location: string;
  currentTime: string;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: MenuItem[] = [
  { label: 'ABOUT', href: '#about', number: '01' },
  { label: 'PROJECTS', href: '#projects', number: '02' },
  { label: 'CONTACT', href: '#contact', number: '03' },
];

export function SidebarMenu({ location, currentTime, isOpen, onClose }: SidebarMenuProps) {
  const { isDark } = useTheme();
  return (
    <div 
      className={`fixed top-0 right-0 h-screen z-40 transition-all duration-500 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${isDark ? 'bg-white' : 'bg-black'}`}
      style={{ width: '450px' }}
    >
      {/* Strip on left - inverted in light theme */}
      <div className={`absolute left-0 top-0 bottom-0 w-6 ${isDark ? 'bg-black' : 'bg-white'}`} />
      
      {/* Header */}
      <div className={`flex items-center justify-between px-12 py-6 border-b ${isDark ? 'border-gray-200' : 'border-gray-800'}`}>
        <span className={`text-sm ${isDark ? 'text-black' : 'text-white'}`}>{location} {currentTime}</span>
        <button 
          onClick={onClose}
          className={`hover:opacity-50 transition-opacity flex items-center gap-2 ${isDark ? 'text-black' : 'text-white'}`}
        >
          <span>close</span>
          <span className="text-2xl">×</span>
        </button>
      </div>

      {/* Menu Items */}
      <div className="px-12 pt-16">
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="flex items-start justify-between group hover:opacity-50 transition-opacity"
            >
              <span className={`text-7xl tracking-tight ${isDark ? 'text-black' : 'text-white'}`} style={{ fontWeight: 900 }}>
                {item.label}
              </span>
              <span className="text-blue-500 text-xl mt-2" style={{ fontWeight: 600 }}>
                {item.number}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

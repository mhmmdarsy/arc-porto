import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  location: string;
  currentTime: string;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function Navbar({ location, currentTime, isMenuOpen, onMenuToggle }: NavbarProps) {
  const { isDark, toggleTheme } = useTheme();
  
  const getTextColor = () => {
    if (isMenuOpen) return 'text-black';
    return isDark ? 'text-white' : 'text-black';
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors ${isDark ? 'bg-black/30' : 'bg-white/30'}`}>
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between bg-[rgba(255,255,255,0)]">
        <div className="flex items-center">
          <span className={`transition-colors ${getTextColor()}`}>
            arc
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`hover:opacity-70 transition-opacity ${getTextColor()}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <span className={`text-sm transition-colors ${getTextColor()}`}>
              {location} {currentTime}
            </span>
          </div>
          <button 
            onClick={onMenuToggle}
            className={`hover:opacity-70 transition-all flex items-center gap-2 ${getTextColor()}`}
          >
            <span>menu</span>
            <span className="text-2xl">{isMenuOpen ? '×' : '+'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

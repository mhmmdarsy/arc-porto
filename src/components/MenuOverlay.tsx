import { useTheme } from '../contexts/ThemeContext';

interface MenuOverlayProps {
  isVisible: boolean;
  onClick: () => void;
}

export function MenuOverlay({ isVisible, onClick }: MenuOverlayProps) {
  const { isDark } = useTheme();
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed inset-0 bg-opacity-50 z-30 ${isDark ? 'bg-black' : 'bg-white'}`}
      onClick={onClick}
    />
  );
}

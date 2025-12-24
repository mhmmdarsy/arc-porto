import { useTheme } from '../../../contexts/ThemeContext';

export function HeroDescription() {
  const { isDark } = useTheme();
  
  return (
    <div className="mt-8">
      <p className={`transition-colors ${isDark ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600 }}>
        crafting digital experiences through code and design
      </p>
      <p className={`mt-2 transition-colors ${isDark ? 'text-white' : 'text-black'}`} style={{ fontWeight: 600 }}>
        based in samarinda, indonesia
      </p>
    </div>
  );
}

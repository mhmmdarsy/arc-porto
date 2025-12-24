import { useTheme } from '../../../contexts/ThemeContext';

export function HeroTitle() {
  const { isDark } = useTheme();
  
  return (
    <div className="lg:col-span-8">
      <div className="relative">
        <h1 
          className={`text-[16rem] leading-none tracking-tighter transition-colors ${isDark ? 'text-white' : 'text-black'}`}
          style={{ fontWeight: 900, wordSpacing: '-1.5em', lineHeight: '0.8' }}
        >
          WEB DEVELOPER
        </h1>
      </div>
    </div>
  );
}

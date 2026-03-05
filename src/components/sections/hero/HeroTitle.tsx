import { useTheme } from '../../../contexts/ThemeContext';

export function HeroTitle() {
  const { isDark } = useTheme();

  return (
    <div className="lg:col-span-8">
      <div className="relative">
        <h1
          className={`grid grid-cols-12 text-[clamp(3.5rem,13vw,11rem)] leading-[0.82] tracking-tight transition-colors ${
            isDark ? 'text-white' : 'text-black'
          }`}
          style={{ fontWeight: 900 }}
        >
          <span className="col-span-12 whitespace-nowrap">CREATIVE</span>
          <span className="col-span-6 sm:col-span-5 whitespace-nowrap">
            WEB
          </span>
          <span className="col-span-12 whitespace-nowrap">DEVELOPER</span>
        </h1>
      </div>
    </div>
  );
}

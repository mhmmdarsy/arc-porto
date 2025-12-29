import { useTheme } from '../../../contexts/ThemeContext';

export function AboutSection() {
  const { isDark } = useTheme();

  return (
    <section
      id="about"
      className={`py-32 transition-colors ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Number */}
        <div className="mb-16">
          <span className="text-sm uppercase tracking-widest opacity-40">
            01 — About
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Big Title */}
          <div className="lg:col-span-5">
            <h2 className="text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.9]">
              Creative
              <br />
              Developer
            </h2>
          </div>

          {/* Right: Description & Info */}
          <div className="lg:col-span-7 space-y-12">
            {/* Bio */}
            <div className="max-w-2xl">
              <p className="text-lg md:text-xl leading-relaxed opacity-80 mb-6">
                I'm a web developer passionate about creating beautiful,
                functional, and user-centered digital experiences.
              </p>
              <p className="leading-relaxed opacity-60">
                With a focus on modern web technologies and clean code, I build
                applications that not only look great but perform exceptionally.
                I believe in the power of minimalist design combined with robust
                functionality.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-3">
                  Location
                </p>
                <p className="text-lg">Samarinda, Indonesia</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-3">
                  Experience
                </p>
                <p className="text-lg">5+ Years</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-3">
                  Specialization
                </p>
                <p className="text-lg">Frontend & UI/UX</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-3">
                  Availability
                </p>
                <p className="text-lg">Open for Projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

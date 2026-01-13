import { useTheme } from '../contexts/ThemeContext';

export function ContactSection() {
  const { isDark } = useTheme();

  return (
    <section
      id="contact"
      className={`py-32 transition-colors ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Number */}
        <div className="mb-16">
          <span className="text-sm uppercase tracking-widest opacity-40">
            05 — Contact
          </span>
        </div>

        {/* Main CTA */}
        <div className="mb-20">
          <h2 className="text-6xl md:text-7xl lg:text-9xl uppercase tracking-tighter leading-[0.85] mb-12">
            Let's
            <br />
            Work
            <br />
            Together
          </h2>
          <p className="text-lg md:text-xl max-w-2xl opacity-70 leading-relaxed">
            Have a project in mind or want to collaborate? I'm always open to
            discussing new opportunities. Let's get in touch!
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Email */}
          <div
            className={`border-t-2 pt-8 transition-colors ${
              isDark ? 'border-white/20' : 'border-black/20'
            }`}
          >
            <p className="text-xs uppercase tracking-widest opacity-40 mb-4">
              Email
            </p>
            <a
              href="mailto:hello@arc.dev"
              className="text-2xl md:text-3xl uppercase tracking-tight hover:opacity-60 transition-opacity inline-block"
            >
              muhammadarsyalfahd@gmail.com
            </a>
          </div>

          {/* Social */}
          <div
            className={`border-t-2 pt-8 transition-colors ${
              isDark ? 'border-white/20' : 'border-black/20'
            }`}
          >
            <p className="text-xs uppercase tracking-widest opacity-40 mb-4">
              Social
            </p>
            <div className="space-y-3">
              <a
                href="https://github.com/mhmmdarsy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl uppercase tracking-tight hover:opacity-60 transition-opacity block"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/mhmdarsy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl uppercase tracking-tight hover:opacity-60 transition-opacity block"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-12">
          <a
            href="mailto:muhammadarsyalfahd@gmail.com"
            className={`inline-block border-4 px-12 py-6 text-xl uppercase tracking-wide transition-all hover:scale-105 ${
              isDark
                ? 'border-white text-white hover:bg-white hover:text-black'
                : 'border-black text-black hover:bg-black hover:text-white'
            }`}
          >
            Reach Me Out
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <p className="text-sm opacity-40 mb-2">
            Currently available for freelance projects
          </p>
          <p className="text-xs uppercase tracking-widest opacity-30">
            Response time: 1-2 hours
          </p>
        </div>
      </div>
    </section>
  );
}

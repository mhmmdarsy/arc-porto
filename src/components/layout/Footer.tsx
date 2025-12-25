import { useTheme } from "../../contexts/ThemeContext";

export function Footer() {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t transition-colors ${
      isDark ? 'border-white/20 bg-black text-white' : 'border-black/20 bg-white text-black'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main Grid - Spacious */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand Section */}
          <div className="md:col-span-5">
            <h2 className="text-5xl mb-6 uppercase tracking-tight">
              ARC
            </h2>
            <p className="text-sm uppercase tracking-widest mb-8 opacity-60">
              Web Developer
            </p>
            <p className="max-w-xs opacity-70 leading-relaxed">
              Crafting digital experiences with clean code and thoughtful design.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-widest mb-6 opacity-60">
              Navigate
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#about"
                  className="hover:opacity-60 transition-opacity"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:opacity-60 transition-opacity"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  className="hover:opacity-60 transition-opacity"
                >
                  Experience
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:opacity-60 transition-opacity"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-4">
            <h3 className="text-xs uppercase tracking-widest mb-6 opacity-60">
              Connect
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-60 transition-opacity"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-60 transition-opacity"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-60 transition-opacity"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://dribbble.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-60 transition-opacity"
                >
                  Dribbble
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Info */}
        <div className={`pt-12 border-t transition-colors ${
          isDark ? 'border-white/10' : 'border-black/10'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-xs uppercase tracking-widest opacity-40">
              © {currentYear} Arc Portfolio
            </p>
            <div className="flex gap-8">
              <a
                href="#privacy"
                className="text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                Privacy
              </a>
              <a
                href="#terms"
                className="text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
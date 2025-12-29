import { useTheme } from '../../../contexts/ThemeContext';
import { ProjectsGrid } from './ProjectsGrid';

export function ProjectsSection() {
  const { isDark } = useTheme();

  return (
    <section
      id="projects"
      className={`py-32 transition-colors ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Number */}
        <div className="mb-16">
          <span className="text-sm uppercase tracking-widest opacity-40">
            04 — Projects
          </span>
        </div>

        {/* Projects Grid */}
        <ProjectsGrid />
      </div>
    </section>
  );
}

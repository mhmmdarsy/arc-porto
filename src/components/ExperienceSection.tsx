import { useTheme } from "../contexts/ThemeContext";

interface Experience {
  year: string;
  title: string;
  company: string;
  description: string;
}

const experiences: Experience[] = [
  {
    year: "2023 — Now",
    title: "Senior Frontend Developer",
    company: "Tech Startup Inc.",
    description: "Leading frontend architecture and design system implementation for enterprise applications.",
  },
  {
    year: "2021 — 2023",
    title: "Full Stack Developer",
    company: "Digital Agency",
    description: "Developed and maintained multiple client projects using React, Node.js, and modern web technologies.",
  },
  {
    year: "2019 — 2021",
    title: "Frontend Developer",
    company: "Creative Studio",
    description: "Built responsive websites and web applications with focus on performance and user experience.",
  },
  {
    year: "2018 — 2019",
    title: "Junior Developer",
    company: "Startup Company",
    description: "Started career building web interfaces and learning modern JavaScript frameworks.",
  },
];

export function ExperienceSection() {
  const { isDark } = useTheme();

  return (
    <section id="experience" className={`py-32 transition-colors ${
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Number */}
        <div className="mb-16">
          <span className="text-sm uppercase tracking-widest opacity-40">
            02 — Experience
          </span>
        </div>

        {/* Title */}
        <div className="mb-20">
          <h2 className="text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.9]">
            Work
            <br />
            History
          </h2>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-12 gap-6 py-12 border-t transition-colors ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}
            >
              {/* Year */}
              <div className="md:col-span-3">
                <p className="text-sm uppercase tracking-widest opacity-40">
                  {exp.year}
                </p>
              </div>

              {/* Role & Company */}
              <div className="md:col-span-4">
                <h3 className="text-2xl md:text-3xl uppercase tracking-tight mb-2">
                  {exp.title}
                </h3>
                <p className="text-sm uppercase tracking-wider opacity-60">
                  {exp.company}
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="leading-relaxed opacity-70">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
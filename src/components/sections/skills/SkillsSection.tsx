// ...existing code from SkillsSection.tsx will be copied here...
import { useTheme } from "../../../contexts/ThemeContext";

interface SkillCategory {
  category: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Vue.js",
    ],
  },
  {
    category: "Backend",
    skills: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "REST API",
    ],
  },
  {
    category: "Tools",
    skills: ["Git", "Figma", "VS Code", "Docker", "Webpack"],
  },
  {
    category: "Design",
    skills: [
      "UI/UX",
      "Responsive Design",
      "Typography",
      "Animation",
      "Prototyping",
    ],
  },
];

export function SkillsSection() {
  const { isDark } = useTheme();

  return (
    <section
      id="skills"
      className={`py-32 transition-colors ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Number */}
        <div className="mb-16">
          <span className="text-sm uppercase tracking-widest opacity-40">
            03 — Skills
          </span>
        </div>

        {/* Title */}
        <div className="mb-20">
          <h2 className="text-6xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.9]">
            Tech
            <br />
            Stack
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className={`border-l-2 pl-8 transition-colors ${
                isDark ? "border-white/20" : "border-black/20"
              }`}
            >
              <h3 className="text-xs uppercase tracking-widest opacity-40 mb-6">
                {category.category}
              </h3>
              <ul className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <li
                    key={skillIndex}
                    className="text-xl md:text-2xl uppercase tracking-tight opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="mt-32">
          <h3 className="text-xs uppercase tracking-widest opacity-40 mb-12">
            What I Offer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`border p-8 transition-colors ${
                isDark ? "border-white/20" : "border-black/20"
              }`}
            >
              <h4 className="text-2xl uppercase tracking-tight mb-4">
                Web Development
              </h4>
              <p className="opacity-60 leading-relaxed">
                Full-stack web applications with modern
                frameworks and best practices.
              </p>
            </div>
            <div
              className={`border p-8 transition-colors ${
                isDark ? "border-white/20" : "border-black/20"
              }`}
            >
              <h4 className="text-2xl uppercase tracking-tight mb-4">
                UI/UX Design
              </h4>
              <p className="opacity-60 leading-relaxed">
                User-centered design solutions that balance
                aesthetics and functionality.
              </p>
            </div>
            <div
              className={`border p-8 transition-colors ${
                isDark ? "border-white/20" : "border-black/20"
              }`}
            >
              <h4 className="text-2xl uppercase tracking-tight mb-4">
                Consulting
              </h4>
              <p className="opacity-60 leading-relaxed">
                Technical guidance and code reviews for web
                development projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
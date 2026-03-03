import './App.css';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Navigation } from './components/navigation/Navigation';
import { HeroSection } from './components/sections/hero/HeroSection';
import { AboutSection } from './components/sections/about/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/sections/skills/SkillsSection';
import { ProjectsSection } from './components/sections/projects/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/layout/Footer';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { isDark } = useTheme();
  useSmoothScroll();

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
    >
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

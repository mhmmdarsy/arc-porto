// ...existing code from ProjectsGrid.tsx will be copied here...
import { ProjectPreview } from './ProjectPreview';

interface Project {
  number: string;
  title: string;
  description: string;
  accentColor: string;
  offset: string;
}

const projects: Project[] = [
  { 
    number: '01', 
    title: 'WORKS', 
    description: 'PORTFOLIO SHOWCASE',
    accentColor: 'bg-blue-500',
    offset: 'max-w-5xl ml-0'
  },
  { 
    number: '02', 
    title: 'DESIGN', 
    description: 'CREATIVE SOLUTIONS',
    accentColor: 'bg-red-500',
    offset: 'max-w-5xl ml-auto mr-0'
  },
  { 
    number: '03', 
    title: 'CODE', 
    description: 'TECHNICAL EXCELLENCE',
    accentColor: 'bg-yellow-400',
    offset: 'max-w-5xl ml-0'
  },
];

export function ProjectsGrid() {
  return (
    <div className="mt-32 space-y-32">
      {projects.map((project, index) => (
        <ProjectPreview 
          key={index}
          projectNumber={project.number}
          title={project.title}
          description={project.description}
          accentColor={project.accentColor}
          offset={project.offset}
        />
      ))}
    </div>
  );
}

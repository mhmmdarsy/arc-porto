import { useTheme } from '../../../contexts/ThemeContext';

interface ProjectPreviewProps {
  projectNumber: string;
  title: string;
  description: string;
  accentColor: string;
  offset: string;
}

export function ProjectPreview({
  projectNumber,
  title,
  description,
  accentColor,
  offset,
}: ProjectPreviewProps) {
  const { isDark } = useTheme();
  return (
    <div className={`${offset}`}>
      {/* Project Number Badge */}
      <div className="flex items-start gap-2 mb-8">
        <div
          className={`${accentColor} text-black px-6 py-3 border-4 border-black`}
          style={{ fontWeight: 900 }}
        >
          {projectNumber}
        </div>
        <div className="px-6 py-3">
          <span
            className={`uppercase tracking-wider transition-colors ${
              isDark ? 'text-white' : 'text-black'
            }`}
            style={{ fontWeight: 700 }}
          >
            {description}
          </span>
        </div>
      </div>

      {/* Main Card with Big Typography */}
      <div className="relative group cursor-pointer overflow-visible">
        {/* Shadow layer */}
        <div
          className={`absolute inset-0 ${accentColor} translate-x-4 translate-y-4 border-8 border-black`}
        ></div>

        {/* Main content - overflow visible untuk big type */}
        <div
          className="relative bg-white text-black border-8 border-black 
                        transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2
                        overflow-hidden h-[400px]"
        >
          {/* BIG TYPOGRAPHY - Cropped & Overflowing */}
          <div className="absolute inset-0 flex items-center justify-center overflow-visible">
            <h2
              className="uppercase tracking-tighter leading-none select-none pointer-events-none"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(10rem, 25vw, 20rem)',
                letterSpacing: '-0.05em',
                lineHeight: 0.8,
              }}
            >
              {title}
            </h2>
          </div>

          {/* Overlay Info */}
          <div className="absolute top-8 left-8 z-10">
            <div
              className={`px-4 py-2 border-4 border-black transition-colors ${
                isDark ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              <span style={{ fontWeight: 900 }}>VIEW PROJECT</span>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="absolute bottom-8 right-8 z-10">
            <div
              className={`w-16 h-16 flex items-center justify-center border-4 border-black transition-colors ${
                isDark
                  ? 'bg-black group-hover:bg-white'
                  : 'bg-white group-hover:bg-black'
              }`}
            >
              <svg
                className={`w-8 h-8 transition-colors ${
                  isDark
                    ? 'text-white group-hover:text-black'
                    : 'text-black group-hover:text-white'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="square"
                  strokeWidth={4}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>

          {/* Decorative bars - positioned absolute */}
          <div className="absolute bottom-8 left-8 flex gap-2 z-10">
            <div className="h-3 w-20 bg-black border-2 border-black"></div>
            <div
              className={`h-3 w-32 ${accentColor} border-2 border-black`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

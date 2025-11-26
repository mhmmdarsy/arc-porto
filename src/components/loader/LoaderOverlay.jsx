import { useEffect, useState } from 'react';
import CountUp from './CountUp';

const LoaderOverlay = ({
  show,
  onHidden,
  duration = 1,
  fadeDuration = 350,
  backgroundClass = 'bg-white',
  textClass = 'text-slate-900',
}) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (show) setIsFading(false);
  }, [show]);

  useEffect(() => {
    if (!isFading) return;
    const timer = setTimeout(() => {
      if (typeof onHidden === 'function') onHidden();
    }, fadeDuration);
    return () => clearTimeout(timer);
  }, [isFading, fadeDuration, onHidden]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center transition-opacity ${backgroundClass} ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${fadeDuration}ms` }}
    >
      <div className={`text-center ${textClass}`}>
        <div className="text-xl font-bold tracking-tight">
          <CountUp
            to={100}
            duration={duration}
            className="inline"
            onEnd={() => setIsFading(true)}
          />
          <span>%</span>
        </div>
      </div>
    </div>
  );
};

export default LoaderOverlay;

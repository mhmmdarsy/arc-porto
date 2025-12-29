import { useState } from 'react';
import LoaderOverlay from '../components/loader/LoaderOverlay';

export default function HomePage() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      <LoaderOverlay
        show={showLoader}
        onHidden={() => setShowLoader(false)}
        duration={0.6}
      />

      <div
        className={`relative min-h-screen flex justify-center pt-0 overflow-hidden transition-[filter] duration-300 ${
          showLoader ? 'pointer-events-none blur-md' : 'blur-0'
        }`}
      ></div>
    </>
  );
}

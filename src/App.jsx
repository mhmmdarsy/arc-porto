import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import './App.css';
import HomePage from './pages/HomePage';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function App() {
  const smootherRef = useRef(null);

  useLayoutEffect(() => {
    if (smootherRef.current) return; // guard StrictMode double-invoke

    smootherRef.current = ScrollSmoother.create({
      smooth: 4,
      effects: true,
    });

    return () => smootherRef.current?.kill();
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <HomePage />
        <div>
          <section className="section footer text-cyan-50 py-36">
            <div className="container">
              <p>© 2024 Arc Porto. All rights reserved.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;

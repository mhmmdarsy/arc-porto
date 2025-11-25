import { useEffect, useRef, useState } from "react";
import CardNav from "../components/CardNav";
import Aurora from "../components/Aurora";
import CountUp from "../components/CountUp";
import logo from "../assets/react.svg";
import { navigationItems } from "../data/navigation";

export default function HomePage() {
  const items = navigationItems;
  const [showLoader, setShowLoader] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const fadeTimerRef = useRef(null);

  useEffect(() => {
    if (!isFading) return;
    fadeTimerRef.current = setTimeout(() => setShowLoader(false), 350);
    return () => clearTimeout(fadeTimerRef.current);
  }, [isFading]);

  useEffect(
    () => () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    },
    []
  );

  const handleCountEnd = () => {
    setIsFading(true);
  };

  return (
    <>
      {showLoader && (
        <div
          className={`fixed inset-0 z-[70] flex items-center justify-center bg-white transition-all duration-10 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="text-center text-slate-900">
            <div className="text-xl font-bold tracking-tight text-slate-900">
              <CountUp
                to={100}
                duration={0.6}
                className="inline"
                onEnd={handleCountEnd}
              />
              <span>%</span>
            </div>
          </div>
        </div>
      )}

      <div
        className={`relative min-h-screen bg-black flex justify-center pt-28 overflow-hidden transition-[filter] duration-300 ${
          showLoader ? "pointer-events-none blur-md" : "blur-0"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-80 pointer-events-none z-0">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        {/* Navbar */}
        <CardNav
          logo={logo}
          items={items}
          buttonBgColor="#111"
          buttonTextColor="#fff"
        />
      </div>
    </>
  );
}

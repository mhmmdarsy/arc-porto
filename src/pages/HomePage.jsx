import { useState } from "react";
import Aurora from "../components/Aurora";
import LoaderOverlay from "../components/LoaderOverlay";
import StaggeredMenu from "../components/StaggeredMenu";
import { navigationItems } from "../data/navigation";

export default function HomePage() {
  const menuItems = navigationItems.map((item) => ({
    label: item.label,
    link: item.links?.[0]?.href || "#",
    ariaLabel: item.label,
  }));
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      <LoaderOverlay show={showLoader} onHidden={() => setShowLoader(false)} duration={0.6} />

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

        {/* Menu */}
        <div className="w-full max-w-5xl px-4">
          <StaggeredMenu
            position="right"
            items={menuItems}
            displaySocials={true}
            displayItemNumbering={true}
            isFixed
            colors={["#111", "#3A29FF"]}
            menuButtonColor="#fff"
            openMenuButtonColor="#111"
            changeMenuColorOnOpen
          />
        </div>
      </div>
    </>
  );
}

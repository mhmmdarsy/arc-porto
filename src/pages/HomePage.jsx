import CardNav from "../components/CardNav";
import Aurora from "../components/Aurora";
import logo from "../assets/react.svg";
import { navigationItems } from "../data/navigation";

export default function HomePage() {
  const items = navigationItems;

  return (
    <div className="relative min-h-screen bg-black flex justify-center pt-28 overflow-hidden">
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
  );
}

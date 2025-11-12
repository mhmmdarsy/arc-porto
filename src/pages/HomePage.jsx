import CardNav from "../components/CardNav";
import Aurora from "../components/Aurora";
import logo from "../assets/react.svg";

export default function HomePage() {
  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", href: "#about" },
        { label: "Careers", href: "#careers" },
      ],
    },
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", href: "#projects" },
        { label: "Case Studies", href: "#cases" },
      ],
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Email", href: "mailto:info@example.com" },
        { label: "Twitter", href: "https://twitter.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
      ],
    },
  ];

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

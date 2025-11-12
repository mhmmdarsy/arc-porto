import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";

const CardNav = ({
  logo,
  logoAlt = "Logo",
  items = [],
  ease = "power3.out",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  // === GSAP Animation ===
  const createTimeline = () => {
    const cards = cardsRef.current;
    gsap.set(cards, { y: 40, opacity: 0, filter: "blur(8px)" });

    const tl = gsap.timeline({ paused: true });
    tl.to(navRef.current, { height: "auto", duration: 0.45, ease })
      .to(
        cards,
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.4,
          ease,
          stagger: 0.1,
        },
        "-=0.25"
      );
    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => tl?.kill();
  }, [items, ease]);

  const toggleMenu = () => {
    if (!tlRef.current) return;
    if (isOpen) {
      tlRef.current.reverse();
      setIsOpen(false);
    } else {
      tlRef.current.play(0);
      setIsOpen(true);
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[900px]">
      <div
        ref={navRef}
        className="relative h-[64px] overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-white/10 backdrop-blur-xl transition-all duration-500"
      >
        {/* === Top Nav Bar === */}
        <div className="absolute inset-x-0 top-0 h-[64px] flex items-center justify-between px-5 z-10">
          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="group flex flex-col gap-1.5 w-10 h-10 items-center justify-center text-white"
          >
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                isOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                isOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 text-white">
            <img src={logo} alt={logoAlt} className="h-7" />
            <span className="font-semibold text-lg tracking-tight">
              React Bits
            </span>
          </div>

          {/* CTA */}
          <button
            className="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            Get Started
          </button>
        </div>

        {/* === Expandable Cards === */}
        <div className="flex flex-col md:flex-row gap-3 p-4 mt-[64px]">
          {items.map((item, idx) => (
            <div
              key={idx}
              ref={setCardRef(idx)}
              className="flex-1 rounded-xl p-4 text-white shadow-inner"
              style={{ backgroundColor: item.bgColor }}
            >
              <h3 className="text-lg font-semibold mb-2">{item.label}</h3>
              <ul className="flex flex-col gap-1">
                {item.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                    >
                      <GoArrowUpRight className="text-white text-sm" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardNav;

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
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div
        ref={navRef}
        className="relative h-[72px] overflow-hidden rounded-[1.75rem] border border-black/10 bg-white text-slate-900 shadow-[0_25px_45px_rgba(15,23,42,0.15)] transition-all duration-500"
      >
        <div className="absolute inset-x-0 top-0 h-[72px] flex items-center justify-between px-6 z-10">
          <button
            onClick={toggleMenu}
            className="group flex flex-col gap-1.5 w-10 h-10 items-center justify-center text-current"
          >
            <span
              className={`block w-7 h-0.5 rounded-full bg-current transition-all duration-300 ${
                isOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-7 h-0.5 rounded-full bg-current transition-all duration-300 ${
                isOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            <img src={logo} alt={logoAlt} className="h-7 w-7 object-contain" />
            <span className="font-semibold text-lg tracking-tight text-slate-900">
              React Bits
            </span>
          </div>

          <button
            className="inline-flex items-center rounded-xl border border-black/10 bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_rgba(255,255,255,0.4)] transition-colors hover:bg-black"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            Get Started
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 pb-6 pt-[88px] md:flex-row">
          {items.map((item, idx) => (
            <div
              key={idx}
              ref={setCardRef(idx)}
              className="flex-1 min-h-[160px] rounded-2xl border border-white/10 p-5 text-white shadow-[inset_0_1px_rgba(255,255,255,0.1)]"
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <h3 className="mb-3 text-lg font-semibold">{item.label}</h3>
              <ul className="flex flex-col gap-1.5 text-sm">
                {item.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="flex items-center gap-1 transition-opacity hover:opacity-80"
                    >
                      <GoArrowUpRight className="text-xs" />
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
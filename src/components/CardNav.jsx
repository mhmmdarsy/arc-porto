import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";

const MenuToggle = ({ isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="flex h-10 w-10 items-center justify-center rounded-full text-current transition hover:bg-black/5"
  >
    {isOpen ? (
      <HiOutlineXMark className="h-6 w-6" />
    ) : (
      <HiOutlineBars3 className="h-6 w-6" />
    )}
  </button>
);

const Brand = ({brandText }) => (
  <div className="flex items-center gap-2">
    <span className="text-lg font-semibold tracking-tight text-slate-900">
      {brandText}
    </span>
  </div>
);

const CTAButton = ({ label, background, color }) => (
  <button
    className="inline-flex items-center rounded-xl border border-black/10 px-5 py-2 text-sm font-semibold shadow-[inset_0_1px_rgba(255,255,255,0.4)] transition-colors hover:bg-black/80"
    style={{ backgroundColor: background, color }}
  >
    {label}
  </button>
);

const NavCard = forwardRef(({ label, bgColor, textColor, links }, ref) => (
  <div
    ref={ref}
    className="flex-1 min-h-[160px] rounded-2xl border border-white/10 p-5 text-white shadow-[inset_0_1px_rgba(255,255,255,0.1)]"
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    <h3 className="mb-3 text-lg font-semibold">{label}</h3>
    <ul className="flex flex-col gap-1.5 text-sm">
      {links.map((link, i) => (
        <li key={`${label}-${link.label}-${i}`}>
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
));

const CardsGrid = forwardRef(({ items, setCardRef }, ref) => (
  <div
    ref={ref}
    className="flex flex-col gap-4 px-6 pb-6 pt-[88px] md:flex-row"
  >
    {items.map((item, idx) => (
      <NavCard key={item.label} ref={setCardRef(idx)} {...item} />
    ))}
  </div>
));

const CardNav = ({
  // logo,
  // logoAlt = "Logo",
  brandText = "arc",
  ctaLabel = "Get Started",
  items = [],
  ease = "power3.out",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const cardsWrapperRef = useRef(null);
  const cardsRef = useRef([]);
  const animationRef = useRef(null);
  const CLOSED_HEIGHT = 72;
  const expandedHeightRef = useRef(CLOSED_HEIGHT);

  const getCards = () => cardsRef.current.filter(Boolean);

  const measureHeights = () => {
    const wrapper = cardsWrapperRef.current;
    if (!wrapper) return;
    const measured = wrapper.offsetHeight;
    expandedHeightRef.current = measured > 0 ? measured : CLOSED_HEIGHT;
  };

  useLayoutEffect(() => {
    measureHeights();
    const handleResize = () => measureHeights();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [items]);

  useLayoutEffect(() => {
    const wrapper = cardsWrapperRef.current;
    const cards = getCards();
    if (wrapper) gsap.set(wrapper, { autoAlpha: 0 });
    if (cards.length) {
      gsap.set(cards, { y: 40, opacity: 0, filter: "blur(8px)" });
    }
  }, []);

  const playOpen = () => {
    const nav = navRef.current;
    const wrapper = cardsWrapperRef.current;
    const cards = getCards();
    if (!nav || !wrapper || !cards.length) return;

    animationRef.current?.kill();
    const tl = gsap.timeline();
    tl.set(cards, { y: 40, opacity: 0, filter: "blur(8px)" })
      .set(wrapper, { autoAlpha: 0 })
      .to(nav, { height: expandedHeightRef.current, duration: 0.1, ease })
      .to(wrapper, { autoAlpha: 1, duration: 0.1, ease: "power1.out" })
      .to(cards, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.4,
        ease,
        stagger: 0.1,
      });
    animationRef.current = tl;
  };

  const playClose = () => {
    const nav = navRef.current;
    const wrapper = cardsWrapperRef.current;
    const cards = getCards();
    if (!nav || !wrapper || !cards.length) return;

    animationRef.current?.kill();
    const tl = gsap.timeline();
    tl.to(
      [...cards].reverse(),
      {
        y: 40,
        opacity: 0,
        filter: "blur(8px)",
        duration: 3,
        ease,
        stagger: 0.08,
      },
      0
    )
      .to(wrapper, { autoAlpha: 0, duration: 0.15, ease: "power1.in" }, "<+0.05")
      .to(nav, { height: CLOSED_HEIGHT, duration: 0.2, ease: "power2.inOut" }, "<");
    animationRef.current = tl;
  };

  useLayoutEffect(
    () => () => {
      animationRef.current?.kill();
    },
    []
  );

  const toggleMenu = () => {
    if (isOpen) {
      playClose();
      setIsOpen(false);
    } else {
      playOpen();
      setIsOpen(true);
    }
  };

  const setCardRef = (i) => (el) => {
    cardsRef.current[i] = el;
  };

  return (
    <div className="fixed top-10 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4">
      <div
        ref={navRef}
        className="relative h-[72px] overflow-hidden rounded-[1.75rem] border border-black/10 bg-white text-slate-900 shadow-[0_25px_45px_rgba(15,23,42,0.15)] transition-all duration-500"
      >
        <div className="absolute inset-x-0 top-0 z-10 flex h-[72px] items-center justify-between px-6">
          <MenuToggle isOpen={isOpen} onToggle={toggleMenu} />
          <Brand brandText={brandText} />
          <CTAButton
            label={ctaLabel}
            background={buttonBgColor}
            color={buttonTextColor}
          />
        </div>

        <CardsGrid ref={cardsWrapperRef} items={items} setCardRef={setCardRef} />
      </div>
    </div>
  );
};

export default CardNav;

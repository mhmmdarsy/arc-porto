import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import MenuToggle from "./CardNav/MenuToggle";
import Brand from "./CardNav/Brand";
import CTAButton from "./CardNav/CTAButton";
import CardsGrid from "./CardNav/CardsGrid";

const CardNav = ({
  // logo,
  // logoAlt = "Logo",
  brandText = "arc",
  items = [],
  ease = "power3.out",
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
    <>
      <div className="fixed top-10 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4">
        <div
          ref={navRef}
          className="relative h-[72px] overflow-hidden rounded-[1.75rem] border border-black/10 bg-white text-slate-900 shadow-[0_25px_45px_rgba(15,23,42,0.15)] transition-all duration-500"
        >
          <div className="absolute inset-x-0 top-0 z-10 flex h-[72px] items-center justify-between px-6">
            <MenuToggle isOpen={isOpen} onToggle={toggleMenu} />
            <Brand brandText={brandText} />
          </div>

          <CardsGrid ref={cardsWrapperRef} items={items} setCardRef={setCardRef} />
        </div>
      </div>
    </>
  );
};

export default CardNav;

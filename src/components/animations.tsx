import { useEffect, useRef, useState, type Ref } from "react";
import { motion, useInView, type HTMLMotionProps } from "framer-motion";
import { useNavigationType } from "react-router-dom";

// Tuned to tomtau.be: a short 12px rise over a long 700ms decelerate reads as a drift,
// not a jump. `custom` carries a queue delay (see Reveal); when it's absent, a parent's
// staggerChildren still drives the timing.
export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay?: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const, ...(delay !== undefined && { delay }) },
  }),
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// Set once the app has mounted, so a genuine in-app back/forward (returning from a
// subpage) can skip the intro fades. A fresh load/refresh is also navigationType "POP",
// hence the flag.
export const appNav = { hasNavigated: false };

// Page-wide reveal queue. Each element fades in when IT enters the viewport; elements
// that enter together (first screen, two cards side by side) take 150ms slots in DOM
// order, so the page always reads top-down, left-to-right. An element scrolling in
// alone starts immediately.
const SLOT = 0.15;
let nextSlot = 0;
function claimDelay() {
  const now = performance.now() / 1000;
  const start = Math.max(now, nextSlot);
  nextSlot = start + SLOT;
  return start - now;
}

type RevealTag = "div" | "p" | "h1" | "a";
type RevealProps = HTMLMotionProps<"div"> &
  Pick<HTMLMotionProps<"a">, "href" | "target" | "rel"> & { as?: RevealTag; ref?: Ref<HTMLDivElement> };

export function Reveal({ as = "div", ref, ...props }: RevealProps) {
  const local = useRef<HTMLDivElement | null>(null);
  const inView = useInView(local, { once: true, margin: "0px 0px -60px 0px" });
  const navType = useNavigationType();
  // Decided once at mount: re-evaluating it would flip to true on the first re-render
  // after the app mounts, and every element would skip its fade.
  const [restored] = useState(() => appNav.hasNavigated && navType === "POP");
  const [delay, setDelay] = useState<number | null>(null);

  useEffect(() => {
    if (inView && delay === null && !restored) setDelay(claimDelay());
  }, [inView, delay, restored]);

  const setRef = (el: HTMLDivElement | null) => {
    local.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      ref={setRef}
      variants={fadeUp}
      initial={restored ? false : "hidden"}
      animate={restored || delay !== null ? "visible" : "hidden"}
      custom={delay ?? 0}
      {...props}
    />
  );
}

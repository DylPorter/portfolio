import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Tuned to tomtau.be: a short 12px rise over a long 700ms decelerate reads as a drift,
// not a jump; 150ms between siblings makes the cascade legible.
export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// Sections already on screen at page load wait for the hero's cascade to finish
// (6 pieces x 150ms), so the whole page reads top-down instead of every band at once.
export const HERO_CASCADE = 0.9;
export const bandStagger = {
  visible: (delay = 0) => ({ transition: { staggerChildren: 0.15, delayChildren: delay } }),
};

export function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
    >
      {children}
    </motion.section>
  );
}

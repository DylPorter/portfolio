import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Squircles in a gradient across our sage colour scheme — no icons, no shouty colours.
const TOYS = [
  { bg: "linear-gradient(145deg, hsl(146 42% 66%), hsl(148 46% 52%))", rim: "hsl(148 46% 37%)" },
  { bg: "linear-gradient(145deg, hsl(151 44% 61%), hsl(153 48% 48%))", rim: "hsl(153 48% 34%)" },
  { bg: "linear-gradient(145deg, hsl(156 46% 56%), hsl(158 50% 44%))", rim: "hsl(158 50% 31%)" },
  { bg: "linear-gradient(145deg, hsl(161 46% 51%), hsl(163 50% 40%))", rim: "hsl(163 50% 28%)" },
  { bg: "linear-gradient(145deg, hsl(166 46% 47%), hsl(168 50% 37%))", rim: "hsl(168 50% 26%)" },
];

// Secret combo (visible button numbers 1–5): 4 · 3 · 2 · 5 · 1 → a billboard colour cycle.
const COMBO = [4, 3, 2, 5, 1];

export function ButtonToy() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [billboard, setBillboard] = useState(false);
  const seqRef = useRef<number[]>([]);
  const timerRef = useRef<number | undefined>(undefined);

  // On open, smooth-scroll to the very bottom so the revealed toys come into view
  // (they expand the footer downward) — nothing gets hidden, the page just glides down.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(
      () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }),
      60
    );
    return () => window.clearTimeout(t);
  }, [open]);

  const press = (n: number) => {
    setCount((c) => c + 1);
    const seq = [...seqRef.current, n].slice(-COMBO.length);
    seqRef.current = seq;
    if (seq.length === COMBO.length && seq.every((v, i) => v === COMBO[i])) {
      seqRef.current = [];
      setBillboard(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setBillboard(false), 2900);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* The discoverable trigger */}
      <button
        type="button"
        className="toy-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Hide the button toy" : "Reveal a little surprise"}
      >
        <span className="toy-dot" /><span className="toy-dot" /><span className="toy-dot" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col items-center gap-3"
            role="group"
            aria-label="button toy"
          >
            <div className={`flex items-center gap-3 ${billboard ? "billboard" : ""}`}>
              {TOYS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => press(i + 1)}
                  aria-label={`toy button ${i + 1}`}
                  className="toy-key"
                  style={{ ["--toy-bg" as string]: t.bg, ["--toy-rim" as string]: t.rim }}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
              {count} presses · just for fun
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

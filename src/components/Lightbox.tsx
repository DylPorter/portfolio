import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Lightbox({ src, alt, onClose }: { src: string | null; alt: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
    }
    if (src) {
      window.addEventListener("keydown", onKey, true);
      ref.current?.focus();
    }
    return () => window.removeEventListener("keydown", onKey, true);
  }, [src, onClose]);

  // Portal to <body> so the fixed overlay escapes the modal's transformed/clipped
  // stacking context (a CSS transform ancestor would otherwise contain it).
  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — expanded image`}
          tabIndex={-1}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 cursor-zoom-out outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}
        >
          <motion.img
            src={src}
            alt={alt}
            className="max-h-[85vh] max-w-[min(90vw,960px)] rounded-2xl shadow-2xl object-contain border border-white/10"
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            draggable={false}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

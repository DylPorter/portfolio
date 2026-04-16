import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center"
          initial={{ backgroundColor: "rgba(0,0,0,0)" }}
          animate={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          exit={{ backgroundColor: "rgba(0,0,0,0)" }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{ backdropFilter: "blur(4px)" }}
        >
          <motion.div
            className="relative w-[90vw] max-w-4xl flex flex-col items-center pointer-events-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="mb-3 w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors shadow-lg cursor-pointer border border-neutral-300 dark:border-neutral-700 pointer-events-auto"
            >
              <LuX size={18} />
            </button>

            <div className="w-full h-[75vh] overflow-y-auto overscroll-contain p-8 bg-white dark:bg-neutral-900 border-t border-x border-neutral-200 dark:border-neutral-800 rounded-t-2xl shadow-2xl pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

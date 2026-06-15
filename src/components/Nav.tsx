import { useState, useEffect } from "react";
import { LuSun, LuMoon, LuX, LuMenu } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [["Projects", "projects"], ["Writing", "writing"]] as const;

export function Nav({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50); }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: id === "top" ? 0 : top, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full pointer-events-none transition-all duration-1000 md:mx-auto md:px-8 md:py-6 ${
        scrolled ? "md:max-w-[520px]" : "md:max-w-3xl"
      }`}
    >
      <div className="relative">
        <nav className="flex items-center justify-between pointer-events-auto overflow-hidden px-4 py-3 bg-white/80 dark:bg-neutral-950/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 transition-all duration-500 md:px-6 md:py-4 md:rounded-2xl md:border md:shadow md:dark:shadow-lg/50 md:dark:shadow-black md:bg-white/75 md:dark:bg-neutral-900/75">
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); scrollToSection("top"); }}
            className="wordmark text-xl font-bold leading-none relative -top-[2px] pl-2 hover:opacity-70 transition-opacity duration-500"
          >
            <span className="text-[var(--accent)] transition-colors duration-500">tdp</span><span className="text-[var(--ink)] transition-colors duration-500">orter</span>
          </a>

          <div className="flex items-center gap-1 md:gap-4">
            <ul className="hidden md:flex gap-8 mr-2 relative -top-px">
              {navItems.map(([label, id]) => (
                <li key={id}><a href={`#${id}`} className="link text-sm font-medium" onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>{label}</a></li>
              ))}
            </ul>
            <button onClick={toggleTheme} className="p-3 hover-button">
              {theme === "dark" ? <LuMoon /> : <LuSun />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:!hidden p-3 hover-button hover:cursor-pointer">
              {mobileMenuOpen ? <LuX size={18} /> : <LuMenu size={18} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden card absolute left-2 right-2 top-full mt-2 p-4 pointer-events-auto"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="flex flex-col gap-3 text-center">
                {navItems.map(([label, id]) => (
                  <li key={id}><a href={`#${id}`} className="link text-sm font-medium block py-1" onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>{label}</a></li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

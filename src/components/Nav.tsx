import { useState, useEffect } from "react";
import { LuSun, LuMoon, LuX, LuMenu } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [["Home", "top"], ["Projects", "projects"], ["Writing", "writing"]] as const;

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
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  }

  return (
    <header className={`sticky top-0 z-50 mx-auto px-4 py-8 md:px-8 transition-all pointer-events-none ${scrolled ? "duration-1000 max-w-[280px] md:max-w-[500px]" : "duration-1000 max-w-full md:max-w-3xl"}`}>
      <nav className="card flex pl-4 md:pl-8 p-4 items-center justify-between overflow-hidden pointer-events-auto">
        <ul className="hidden md:flex gap-8">
          {navItems.map(([label, id]) => (
            <li key={id}><a href={`#${id}`} className="link" onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>{label}</a></li>
          ))}
        </ul>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:!hidden p-3 hover-button hover:cursor-pointer">
          {mobileMenuOpen ? <LuX size={18} /> : <LuMenu size={18} />}
        </button>
        <button onClick={toggleTheme} className="p-3 hover-button">
          {theme === "dark" ? <LuMoon /> : <LuSun />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden card mt-2 p-4 pointer-events-auto"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="flex flex-col gap-3 text-center">
              {navItems.map(([label, id]) => (
                <li key={id}><a href={`#${id}`} className="link block py-1" onClick={(e) => { e.preventDefault(); scrollToSection(id); }}>{label}</a></li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

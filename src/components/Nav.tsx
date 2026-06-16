import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuSun, LuMoon } from "react-icons/lu";

const navItems = [["Projects", "projects"], ["Writing", "writing"]] as const;

export function Nav({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === "/";

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
  }

  // On home, intercept and smooth-scroll. Elsewhere, let the Link navigate to
  // /#id and ScrollManager scrolls once home renders.
  function handleNav(e: React.MouseEvent, id: string) {
    if (onHome) {
      e.preventDefault();
      scrollToSection(id);
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full pointer-events-none px-2 pt-2 md:px-8 md:pt-6 mx-auto transition-[max-width] duration-500 ease-out ${
        scrolled ? "md:max-w-3xl" : "md:max-w-6xl"
      }`}
    >
      <nav className="flex items-center justify-between pointer-events-auto px-4 py-2.5 md:px-6 md:py-3.5 rounded-2xl border-1 border-neutral-200 dark:border-neutral-800 bg-white/75 dark:bg-neutral-900/75 backdrop-blur shadow dark:shadow-lg/50 dark:shadow-black transition-colors duration-200">
        <Link
          to="/"
          onClick={(e) => { if (onHome) { e.preventDefault(); scrollToSection("top"); } }}
          className="wordmark text-lg md:text-xl font-bold leading-none relative -top-[2px] pl-2 hover:opacity-70 transition-opacity duration-200"
        >
          <span className="text-[var(--accent)] transition-colors duration-200">tdp</span><span className="text-[var(--ink)] transition-colors duration-200">orter</span>
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          <ul className="flex items-center gap-4 md:gap-7 relative -top-px">
            {navItems.map(([label, id]) => (
              <li key={id}><Link to={`/#${id}`} className="link text-sm font-medium" onClick={(e) => handleNav(e, id)}>{label}</Link></li>
            ))}
          </ul>
          <button onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="hover-button p-2">
            {theme === "dark" ? <LuMoon size={18} /> : <LuSun size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}

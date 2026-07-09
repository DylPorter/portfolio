import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuSun, LuMoon, LuChevronDown, LuArrowUpRight, LuGithub } from "react-icons/lu";
import { projects } from "../data/projects";

export function Nav({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
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

  // On home, intercept and smooth-scroll. Elsewhere, navigate to /#id and let
  // ScrollManager scroll once home renders.
  function goToSection(e: React.MouseEvent, id: string) {
    e.preventDefault();
    if (onHome) scrollToSection(id);
    else navigate(`/#${id}`);
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full pointer-events-none px-2 pt-2 md:px-8 md:pt-6 mx-auto transition-[max-width] duration-500 ease-out ${
        scrolled ? "md:max-w-3xl" : "md:max-w-6xl"
      }`}
    >
      {/* The nav element itself carries NO backdrop-filter — an ancestor with
          backdrop-filter would leave the dropdown (a descendant) with no page
          backdrop to blur. The glass lives on an absolute sibling layer (.nav-bar)
          so the mega dropdown keeps a clean backdrop and blurs identically. */}
      <nav className="relative flex items-center justify-between pointer-events-auto px-3 py-2 md:px-6 md:py-3 rounded-2xl">
        <span className="nav-bar" aria-hidden />

        {/* Left — wordmark */}
        <Link
          to="/"
          onClick={(e) => { if (onHome) { e.preventDefault(); scrollToSection("top"); } }}
          className="relative z-10 wordmark text-lg md:text-xl font-bold leading-none -top-[2px] pl-1 md:pl-2 hover:opacity-70 transition-opacity duration-200"
        >
          <span className="text-[var(--accent)] transition-colors duration-200">tdp</span><span className="text-[var(--ink)] transition-colors duration-200">orter</span>
        </Link>

        {/* Center — Work · Writing · Contact (absolutely centered on desktop, inline on mobile) */}
        <ul className="relative z-10 flex items-center gap-4 md:gap-7 md:absolute md:left-1/2 md:-translate-x-1/2">
          <li className="nav-group">
            <button
              type="button"
              className="nav-trigger link text-sm font-medium"
              aria-haspopup="true"
              onClick={(e) => { const t = e.currentTarget; goToSection(e, "projects"); t.blur(); }}
            >
              Work <LuChevronDown className="nav-chev" size={14} />
            </button>

            <div className="mega" role="menu">
              <div className="mega-grid">
                {projects.map((p) => (
                  <Link key={p.id} to={`/projects/${p.id}`} role="menuitem" className="mega-tile">
                    <span className="mega-name">{p.title}</span>
                    <span className="mega-role">{p.role}</span>
                    <LuArrowUpRight className="mega-arrow" size={15} />
                  </Link>
                ))}
                <a
                  href="https://github.com/dylporter"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  className="mega-tile mega-all"
                >
                  <LuGithub className="mega-github" size={15} />
                  <span className="mega-name">Also built</span>
                  <span className="mega-role">sims &amp; tools on GitHub</span>
                </a>
              </div>
            </div>
          </li>

          <li>
            <Link to="/#writing" className="link text-sm font-medium" onClick={(e) => goToSection(e, "writing")}>Writing</Link>
          </li>
          <li>
            <Link to="/#contact" className="link text-sm font-medium" onClick={(e) => goToSection(e, "contact")}>Contact</Link>
          </li>
        </ul>

        {/* Right — theme toggle (tactile chunky icon button, like the socials) */}
        <button onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="relative z-10 icon-button">
          {theme === "dark" ? <LuMoon size={16} /> : <LuSun size={16} />}
        </button>
      </nav>
    </header>
  );
}

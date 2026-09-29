import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FaLinkedinIn, FaGithub, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";
import { LuArrowUpRight } from "react-icons/lu";
import { MotionConfig } from "framer-motion";

import { Reveal, appNav } from "./components/animations";
import { Nav } from "./components/Nav";
import { FontSwitcher } from "./components/FontSwitcher";
import { ButtonToy } from "./components/ButtonToy";
import { Hero } from "./components/Hero";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectPage } from "./components/ProjectPage";
import { ScrollManager } from "./components/ScrollManager";
import { GmdStudios } from "./gmd/GmdStudios";
import { projects } from "./data/projects";

const EMAIL = "info@tdporter.dev";

// Flipped true once the app has mounted, so a genuine in-app back/forward (POP) can
// skip the intro fade-in, while the initial load/refresh — also POP — still plays it.

const EXPERIENCE = [
  { logo: "/collective_logo.jpg", name: "Collective Global", role: "Full Stack AI Engineer", date: "2024 — Present", note: "Shipping production AI apps across healthcare, EdTech & SaaS." },
  { logo: "/bsdeducation_logo.jpg", name: "BSD Education", role: "Coding Instructor", date: "2025 — Present", note: "Teaching 100+ kids aged 7–14 to build with code." },
];
const EDUCATION = [
  { logo: "/hku_logo.jpeg", name: "University of Hong Kong", role: "BEng Computer Science", date: "2024 — 2028", note: "Internal Affairs Sec, Ricci Hall · ex-IBM Z Ambassador." },
  { logo: "/dsc_logo.jpg", name: "DSC International School", role: "Ontario Secondary School Diploma", date: "2017 — 2024", note: "Top of the graduating class · Governor General's Medal." },
];

// Kicker copy should ADD something (a stance / a claim), not restate the title —
// the Devansh/Vadim "subheader that has something to say" pattern.
function SectionHead({ id, kicker, title, align = "left", action }: { id?: string; kicker?: string; title: string; align?: "left" | "right"; action?: React.ReactNode }) {
  return (
    <Reveal as="div" id={id} className={`flex flex-col gap-2 scroll-mt-28 ${align === "right" ? "md:items-end md:text-right" : ""}`}>
      {kicker && <span className="eyebrow">✦ {kicker}</span>}
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em]">{title}</h2>
        {action}
      </div>
    </Reveal>
  );
}

function ResumeEntry({ logo, name, role, date, note }: { logo: string; name: string; role: string; date: string; note: string }) {
  return (
    <div className="flex gap-4">
      <img src={logo} alt={`${name} logo`} loading="lazy" decoding="async" className="icon flex-shrink-0" />
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-[var(--ink)]">{name}</span>
        <span className="text-sm text-[var(--body)]">{role} · {date}</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">{note}</span>
      </div>
    </div>
  );
}

/* Full-bleed section band — the background spans the viewport, content stays centered.
   `alt` tints the band a hair off the base bg; a hairline top border divides sections.
   `line` drops a staggered vertical guide-rule in the side gutter. */
function Band({ id, alt = false, first = false, line, inner = "py-12 md:py-20 gap-8", children }: { id?: string; alt?: boolean; first?: boolean; line?: "left" | "right"; inner?: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className={`relative w-full transition-colors duration-200 ${line ? "overflow-x-clip" : ""} ${id ? "scroll-mt-24" : ""} ${alt ? "band-alt bg-[var(--section-alt)]" : ""} ${first ? "" : "border-t border-[var(--section-border)]"}`}
    >
      {line && <span className={`band-line band-line-${line}`} aria-hidden />}
      {/* Children reveal themselves (see Reveal) as each one enters the viewport */}
      <div className={`relative z-10 max-w-6xl mx-auto px-6 md:px-8 flex flex-col ${inner}`}>
        {children}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-[var(--section-border)] transition-colors duration-200">
      <Reveal className="max-w-6xl mx-auto px-6 md:px-8 pt-8 pb-10">
        <div className="flex flex-col-reverse items-center md:flex-row md:justify-between gap-4">
          <span className="text-neutral-400 dark:text-neutral-500 text-xs">© 2026 Dylan Porter · Hong Kong</span>
          <div className="flex items-center gap-2.5">
            <a href={`mailto:${EMAIL}`} aria-label="Email" className="icon-button"><FaRegEnvelope size={14} /></a>
            <a href="https://x.com/tdporterdev" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="icon-button"><FaXTwitter size={14} /></a>
            <a href="https://linkedin.com/in/tdporter" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-button"><FaLinkedinIn size={14} /></a>
            <a href="https://github.com/dylporter" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon-button"><FaGithub size={14} /></a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}

function Home() {
  const featuredProject = projects.find((p) => p.id === "sourcinggpt") ?? projects[0];
  const otherProjects = projects.filter((p) => p.featured && p.id !== featuredProject.id);

  return (
    <>
      <main className="w-full">

        {/* ── HERO ─────────────────────────────────────── */}
        <Band first inner="pt-12 md:pt-20 pb-12 md:pb-20">
          <Hero />
        </Band>

        {/* ── PROJECTS — cards link to /projects/:id (no more popup modals) ─── */}
        <Band alt line="left">
          <SectionHead
            id="projects"
            title="Projects"
            action={
              <Link to="/projects" className="link inline-flex items-center gap-1 text-sm font-medium pb-1">
                See more <LuArrowUpRight size={14} />
              </Link>
            }
          />

          <div className="flex flex-col gap-5">
            {/* Featured */}
            <Reveal as="div">
              <Link
                to={`/projects/${featuredProject.id}`}
                className="group card card-interactive border-l-2 border-l-[var(--accent)] overflow-hidden text-left flex flex-col lg:flex-row"
              >
                <div className="lg:w-1/2 h-60 lg:h-auto lg:min-h-[280px] flex-shrink-0 overflow-hidden">
                  {featuredProject.images.length > 0 ? (
                    <img src={featuredProject.images[0]} alt={featuredProject.title} loading="lazy" decoding="async" className="w-full h-full object-cover object-[50%_0%] transition-transform duration-500 group-hover:scale-[1.03]" draggable={false} />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900" />
                  )}
                </div>
                <div className="lg:w-1/2 p-8 flex flex-col gap-3 justify-center relative">
                  <LuArrowUpRight className="absolute top-6 right-6 text-[var(--accent)] opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" size={18} />
                  <span className="eyebrow">{featuredProject.role}</span>
                  <span className="serif text-3xl font-semibold text-[var(--ink)]">{featuredProject.title}</span>
                  <span className="text-sm text-[var(--body)] leading-relaxed">{featuredProject.tagline}</span>
                </div>
              </Link>
            </Reveal>

            {/* The rest */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {otherProjects.map((p) => (
                <Reveal key={p.id}>
                  <Link
                    to={`/projects/${p.id}`}
                    className="group card card-interactive p-6 h-full text-left flex flex-col gap-2 relative"
                  >
                    <LuArrowUpRight className="absolute top-5 right-5 text-[var(--accent)] opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" size={17} />
                    <span className="eyebrow">{p.role}</span>
                    <span className="serif text-2xl font-semibold text-[var(--ink)]">{p.title}</span>
                    <span className="text-sm text-[var(--body)] leading-relaxed">{p.tagline}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Band>

        {/* ── BACKGROUND ───────────────────────────────── */}
        <Band line="right" inner="py-12 md:py-20 gap-12">
          <SectionHead title="Experience & Education" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <Reveal as="div" className="flex flex-col gap-6">
              <span className="eyebrow">Experience</span>
              {EXPERIENCE.map((e) => <ResumeEntry key={e.name} {...e} />)}
            </Reveal>
            <Reveal as="div" className="flex flex-col gap-6">
              <span className="eyebrow">Education</span>
              {EDUCATION.map((e) => <ResumeEntry key={e.name} {...e} />)}
            </Reveal>
          </div>

          <Reveal as="a" href="/Dylan_Porter_Resume.pdf" target="_blank" rel="noopener noreferrer" className="group link-accent text-sm w-fit inline-flex items-center gap-1">
            See the full résumé
            <LuArrowUpRight size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Reveal>
        </Band>

        {/* ── CTA ──────────────────────────────────────── */}
        <Band id="contact" alt line="left" inner="py-12 md:py-20 gap-6">
          <Reveal as="div" className="card p-10 md:p-16 grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-10 md:gap-14 md:items-stretch">
            {/* Left — the pitch (centered on mobile, right-aligns toward the divider on desktop) */}
            <div className="flex flex-col justify-center gap-4 items-center text-center md:items-end md:text-right">
              <span className="eyebrow">Let's talk</span>
              <h2 className="text-4xl font-bold tracking-[-0.02em]">Let's build<br />something <span className="text-[var(--accent)]">together</span>.</h2>
              <p className="text-[var(--body)] leading-relaxed max-w-sm">If you've got something in mind, whether it's a product, a hard AI problem, or an idea that needs shipping, I'd like to hear about it.</p>
            </div>
            {/* Centered divider (desktop only) */}
            <div className="hidden md:block bg-neutral-200 dark:bg-neutral-800" />
            {/* Right — availability + contact (centered on mobile, left-aligned on desktop) */}
            <div className="flex flex-col justify-center gap-5 items-center text-center md:items-start md:text-left">
              <div className="flex flex-col gap-2">
                <p className="text-[var(--body)] leading-relaxed max-w-sm">Open to freelance, startups, and new projects, remote or in Hong Kong (UTC+8).</p>
              </div>
              <a href={`mailto:${EMAIL}`} className="btn-chunky text-sm w-fit">
                <span className="btn-ico"><FaRegEnvelope size={13} /></span>{EMAIL}
              </a>
            </div>
          </Reveal>

          {/* Easter egg — part of this section (sits above the footer). Toys expand
              down + the page smooth-scrolls to the bottom on open. */}
          <ButtonToy />
        </Band>

      </main>
    </>
  );
}

function App() {
  // The GMD Studios kanban is a standalone app surface — no site chrome.
  const isGmd = useLocation().pathname.startsWith("/gmd-studios");
  // Default dark; honour the visitor's persisted choice (set pre-paint in index.html to avoid FOUC)
  const [theme, setTheme] = useState(() =>
    (typeof localStorage !== "undefined" && localStorage.getItem("theme")) || "dark"
  );

  // Keep <html> in sync with state on mount (covers a stored light theme)
  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.style.backgroundColor = theme === "dark" ? "#121212" : "#f5f5f5";
  }, [theme]);

  // After the first mount, later POP navigations are genuine in-app back/forward.
  useEffect(() => { appNav.hasNavigated = true; }, []);

  const toggleTheme = () => setTheme((prev) => {
    const next = prev === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    return next;
  });

  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <div id="top" className={`${theme === "dark" ? "dark" : ""} bg-neutral-100 dark:bg-neutral-950 text-[var(--body)] min-h-screen w-full transition-colors duration-200`}>
        {!isGmd && <Nav theme={theme} toggleTheme={toggleTheme} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/gmd-studios" element={<GmdStudios />} />
        </Routes>
        {!isGmd && <Footer />}
        {import.meta.env.DEV && <FontSwitcher />}
      </div>
    </MotionConfig>
  );
}

export default App;

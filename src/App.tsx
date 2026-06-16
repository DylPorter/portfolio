import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, Link, useSearchParams, useNavigate, useNavigationType } from "react-router-dom";
import { FaLinkedinIn, FaGithub, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";
import { motion, MotionConfig, useInView } from "framer-motion";

import { fadeUp, stagger } from "./components/animations";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { ProjectModal } from "./components/ProjectModal";
import { PostPage } from "./components/PostPage";
import { ScrollManager } from "./components/ScrollManager";
import { projects } from "./data/projects";
import { posts } from "./data/posts";

const EMAIL = "info@tdporter.dev";

const EXPERIENCE = [
  { logo: "/collective_logo.jpg", name: "Collective Global", role: "Full Stack AI Engineer", date: "2024 — Present", note: "Shipping production AI apps across healthcare, EdTech & SaaS." },
  { logo: "/bsdeducation_logo.jpg", name: "BSD Education", role: "Coding Instructor", date: "2025 — Present", note: "Teaching 100+ kids aged 7–14 to build with code." },
];
const EDUCATION = [
  { logo: "/hku_logo.jpeg", name: "University of Hong Kong", role: "BEng Computer Science", date: "2024 — 2028", note: "Internal Affairs Sec, Ricci Hall · ex-IBM Z Ambassador." },
  { logo: "/dsc_logo.jpg", name: "DSC International School", role: "Ontario Secondary School Diploma", date: "2017 — 2024", note: "Top of the graduating class · Governor General's Medal." },
];

function SectionHead({ id, eyebrow, title }: { id?: string; eyebrow: string; title: string }) {
  return (
    <motion.div id={id} variants={fadeUp} className="flex flex-col gap-1.5 scroll-mt-28">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-3xl md:text-4xl font-medium tracking-[-0.02em]">{title}</h2>
    </motion.div>
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
   `alt` tints the band a hair off the base bg; a hairline top border divides sections. */
function Band({ id, alt = false, first = false, inner = "py-12 md:py-20 gap-8", children }: { id?: string; alt?: boolean; first?: boolean; inner?: string; children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  // On back/forward (POP) the home remounts — render sections instantly (no
  // re-played fade-in) so returning from a post looks like you never left.
  const restored = useNavigationType() === "POP";
  return (
    <section
      id={id}
      className={`w-full transition-colors duration-200 ${id ? "scroll-mt-24" : ""} ${alt ? "bg-[var(--section-alt)]" : ""} ${first ? "" : "border-t border-[var(--section-border)]"}`}
    >
      <motion.div
        ref={ref}
        initial={restored ? false : "hidden"}
        animate={restored || inView ? "visible" : "hidden"}
        variants={stagger}
        className={`max-w-6xl mx-auto px-6 md:px-8 flex flex-col ${inner}`}
      >
        {children}
      </motion.div>
    </section>
  );
}

function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const restored = useNavigationType() === "POP";
  return (
    <footer className="w-full border-t border-[var(--section-border)] transition-colors duration-200">
      <motion.div ref={ref} initial={restored ? false : "hidden"} animate={restored || inView ? "visible" : "hidden"} variants={fadeUp} className="max-w-6xl mx-auto px-6 md:px-8 pt-8 pb-10">
        <div className="flex flex-col-reverse items-center md:flex-row md:justify-between gap-4">
          <span className="text-neutral-400 dark:text-neutral-500 text-xs">© 2026 Dylan Porter · Hong Kong</span>
          <div className="flex items-center gap-2.5">
            <a href={`mailto:${EMAIL}`} aria-label="Email" className="icon-button"><FaRegEnvelope size={14} /></a>
            <a href="https://x.com/tdporterdev" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="icon-button"><FaXTwitter size={14} /></a>
            <a href="https://linkedin.com/in/tdporter" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-button"><FaLinkedinIn size={14} /></a>
            <a href="https://github.com/dylporter" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon-button"><FaGithub size={14} /></a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

function Home() {
  // Project modal state lives in the URL (?project=id) so the browser/phone back
  // button closes it instead of leaving the site, and links are shareable.
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectModal = searchParams.get("project");
  const activeProject = projects.find((p) => p.id === projectModal);

  const openProject = useCallback((id: string) => setSearchParams({ project: id }), [setSearchParams]);
  const closeProject = useCallback(() => {
    // Pop the pushed entry if we opened it in-session; else just clear the param.
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else setSearchParams({}, { replace: true });
  }, [navigate, setSearchParams]);

  const featuredProject = projects.find((p) => p.id === "sourcinggpt") ?? projects[0];
  const otherProjects = projects.filter((p) => p.id !== featuredProject.id);
  const featuredPost = posts[0];

  return (
    <>
      <main className="w-full">

        {/* ── HERO ─────────────────────────────────────── */}
        <Band first inner="pt-12 md:pt-20 pb-12 md:pb-20">
          <Hero />
        </Band>

        {/* ── PROJECTS ─────────────────────────────────── */}
        <Band alt>
          <SectionHead id="projects" eyebrow="Selected work" title="Projects" />

          <div className="flex flex-col gap-5">
            {/* Featured */}
            <motion.button
              variants={fadeUp}
              onClick={() => openProject(featuredProject.id)}
              className="card card-interactive border-l-2 border-l-[var(--accent)] overflow-hidden text-left flex flex-col lg:flex-row"
            >
              <div className="lg:w-1/2 h-60 lg:h-auto lg:min-h-[280px] flex-shrink-0 overflow-hidden">
                {featuredProject.images.length > 0 ? (
                  <img src={featuredProject.images[0]} alt={featuredProject.title} loading="lazy" decoding="async" className="w-full h-full object-cover object-[50%_0%]" draggable={false} />
                ) : (
                  <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900" />
                )}
              </div>
              <div className="lg:w-1/2 p-8 flex flex-col gap-3 justify-center">
                <span className="eyebrow">{featuredProject.role}</span>
                <span className="serif text-3xl font-medium text-[var(--ink)]">{featuredProject.title}</span>
                <span className="text-sm text-[var(--body)] leading-relaxed">{featuredProject.tagline}</span>
              </div>
            </motion.button>

            {/* The rest */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {otherProjects.map((p) => (
                <motion.button
                  key={p.id}
                  variants={fadeUp}
                  onClick={() => openProject(p.id)}
                  className="card card-interactive p-6 text-left flex flex-col gap-2"
                >
                  <span className="eyebrow">{p.role}</span>
                  <span className="serif text-xl font-medium text-[var(--ink)]">{p.title}</span>
                  <span className="text-sm text-[var(--body)] leading-relaxed">{p.tagline}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </Band>

        {/* ── WRITING ──────────────────────────────────── */}
        <Band>
          <SectionHead id="writing" eyebrow="Notes" title="Writing" />
          {featuredPost && (
            <motion.div variants={fadeUp}>
              <Link
                to={`/writing/${featuredPost.slug}`}
                className="card card-interactive p-8 md:p-10 text-left flex flex-col gap-3"
              >
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{featuredPost.date} · {featuredPost.readingTime}</span>
                <span className="serif text-2xl md:text-3xl font-medium text-[var(--ink)]">{featuredPost.title}</span>
                <span className="text-[var(--body)] leading-relaxed max-w-2xl">{featuredPost.summary}</span>
              </Link>
            </motion.div>
          )}
          <motion.a variants={fadeUp} href="https://tdporter.substack.com" target="_blank" rel="noopener noreferrer" className="link-accent text-sm w-fit">
            More notes on Substack →
          </motion.a>
        </Band>

        {/* ── BACKGROUND ───────────────────────────────── */}
        <Band alt inner="py-12 md:py-20 gap-12">
          <SectionHead eyebrow="Background" title="Experience & Education" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <motion.div variants={fadeUp} className="flex flex-col gap-6">
              <span className="eyebrow">Experience</span>
              {EXPERIENCE.map((e) => <ResumeEntry key={e.name} {...e} />)}
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col gap-6">
              <span className="eyebrow">Education</span>
              {EDUCATION.map((e) => <ResumeEntry key={e.name} {...e} />)}
            </motion.div>
          </div>

          <motion.a variants={fadeUp} href="/Dylan_Porter_Resume.pdf" target="_blank" rel="noopener noreferrer" className="link-accent text-sm w-fit">
            See the full résumé →
          </motion.a>
        </Band>

        {/* ── CTA ──────────────────────────────────────── */}
        <Band inner="py-12 md:py-20">
          <motion.div variants={fadeUp} className="card p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            {/* Left — the pitch (right-aligns toward the divider on desktop, left on mobile) */}
            <div className="flex flex-col gap-5 items-start text-left md:items-end md:text-right">
              <h2 className="text-4xl font-bold tracking-[-0.02em]">Let's build<br />something <span className="text-[var(--accent)]">together</span>.</h2>
              <p className="text-[var(--body)] leading-relaxed max-w-sm">If you've got something in mind, whether it's a product, a hard AI problem, or an idea that needs shipping, I'd like to hear about it.</p>
            </div>
            {/* Right — availability + contact (always left-aligned) */}
            <div className="flex flex-col gap-5 items-start text-left md:pl-14 md:border-l md:border-neutral-200 md:dark:border-neutral-800">
              <div className="flex flex-col gap-2">
                <span className="eyebrow">Available</span>
                <p className="text-[var(--body)] leading-relaxed">Open to freelance and new projects, remote or in Hong Kong (UTC+8).</p>
              </div>
              <a href={`mailto:${EMAIL}`} className="px-5 py-2.5 button gap-2 text-sm w-fit">
                <FaRegEnvelope size={13} />{EMAIL}
              </a>
            </div>
          </motion.div>
        </Band>

      </main>

      <ProjectModal project={activeProject} onClose={closeProject} />
    </>
  );
}

function App() {
  // Default dark; honour the visitor's persisted choice (set pre-paint in index.html to avoid FOUC)
  const [theme, setTheme] = useState(() =>
    (typeof localStorage !== "undefined" && localStorage.getItem("theme")) || "dark"
  );

  // Keep <html> in sync with state on mount (covers a stored light theme)
  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.style.backgroundColor = theme === "dark" ? "#0a0a0a" : "#f5f5f5";
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => {
    const next = prev === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    return next;
  });

  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <div id="top" className={`${theme === "dark" ? "dark" : ""} bg-neutral-100 dark:bg-neutral-950 text-[var(--body)] min-h-screen w-full transition-colors duration-200`}>
        <Nav theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing/:slug" element={<PostPage />} />
        </Routes>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;

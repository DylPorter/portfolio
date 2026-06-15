import { useState, useCallback } from "react";
import { FaLinkedinIn, FaGithub, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

import { fadeUp, stagger, Section } from "./components/animations";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { ProjectModal } from "./components/ProjectModal";
import { PostModal } from "./components/PostModal";
import { projects } from "./data/projects";
import { posts } from "./data/posts";

const EMAIL = "info@tdporter.dev";

const EXPERIENCE = [
  { logo: "./collective_logo.jpg", name: "Collective Global", role: "Full Stack AI Engineer", date: "2024 — Present", note: "Shipping production AI apps across healthcare, EdTech & SaaS." },
  { logo: "./bsdeducation_logo.jpg", name: "BSD Education", role: "Coding Instructor", date: "2025 — Present", note: "Teaching 100+ kids aged 7–14 to build with code." },
];
const EDUCATION = [
  { logo: "./hku_logo.jpeg", name: "University of Hong Kong", role: "BEng Computer Science", date: "2024 — 2028", note: "Internal Affairs Sec, Ricci Hall · ex-IBM Z Ambassador." },
  { logo: "./dsc_logo.jpg", name: "DSC International School", role: "Ontario Secondary School Diploma", date: "2017 — 2024", note: "Top of class · Governor General's Academic Medal." },
];

function SectionHead({ n, eyebrow, title }: { n: string; eyebrow: string; title: string }) {
  return (
    <motion.div variants={fadeUp} className="flex items-baseline gap-5">
      <span className="text-sm font-semibold text-[var(--accent)] tabular-nums">{n}</span>
      <div className="flex flex-col gap-1.5">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="text-3xl md:text-4xl font-medium tracking-[-0.02em]">{title}</h2>
      </div>
    </motion.div>
  );
}

function ResumeEntry({ logo, name, role, date, note }: { logo: string; name: string; role: string; date: string; note: string }) {
  return (
    <div className="flex gap-4">
      <img src={logo} alt={name} className="icon flex-shrink-0" />
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-[var(--ink)]">{name}</span>
        <span className="text-sm text-[var(--body)]">{role} · {date}</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">{note}</span>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState("dark");
  const [projectModal, setProjectModal] = useState<string | null>(null);
  const [postModal, setPostModal] = useState<string | null>(null);

  const toggleTheme = () => setTheme((prev) => {
    const next = prev === "dark" ? "light" : "dark";
    document.documentElement.className = next;
    document.documentElement.style.backgroundColor = next === "dark" ? "#0a0a0a" : "#f5f5f5";
    return next;
  });

  const activeProject = projects.find((p) => p.id === projectModal);
  const activePost = posts.find((p) => p.slug === postModal);

  const featuredProject = projects.find((p) => p.id === "sourcinggpt") ?? projects[0];
  const otherProjects = projects.filter((p) => p.id !== featuredProject.id);
  const featuredPost = posts[0];

  return (
    <div id="top" className={`${theme === "dark" ? "dark" : ""} bg-neutral-100 dark:bg-neutral-950 text-[var(--body)] min-h-screen w-full transition-colors duration-200`}>

      <Nav theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-6xl px-4 md:px-8 mx-auto flex flex-col gap-20 lg:gap-28 max-md:pt-6 pb-12">

        {/* ── HERO (unwrapped, full width) ─────────────── */}
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <Hero />
        </motion.div>

        {/* ── 01 · PROJECTS ────────────────────────────── */}
        <Section id="projects" className="scroll-mt-28 flex flex-col gap-8">
          <SectionHead n="01" eyebrow="Selected work" title="Projects" />

          {/* Featured */}
          <motion.button
            variants={fadeUp}
            onClick={() => setProjectModal(featuredProject.id)}
            className="card card-interactive border-l-2 border-l-[var(--accent)] overflow-hidden text-left flex flex-col lg:flex-row"
          >
            <div className="lg:w-1/2 h-60 lg:h-auto lg:min-h-[280px] flex-shrink-0 overflow-hidden">
              {featuredProject.images.length > 0 ? (
                <img src={featuredProject.images[0]} alt={featuredProject.title} className="w-full h-full object-cover object-[50%_0%]" draggable={false} />
              ) : (
                <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900" />
              )}
            </div>
            <div className="lg:w-1/2 p-8 flex flex-col gap-3 justify-center">
              <span className="eyebrow">{featuredProject.role}</span>
              <span className="text-3xl font-bold text-[var(--ink)]">{featuredProject.title}</span>
              <span className="text-sm text-[var(--body)] leading-relaxed">{featuredProject.tagline}</span>
              <div className="flex flex-wrap gap-2 mt-1 text-xs">
                {featuredProject.tech.slice(0, 4).map((t) => <span key={t} className="pill">{t}</span>)}
              </div>
            </div>
          </motion.button>

          {/* The rest */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {otherProjects.map((p) => (
              <motion.button
                key={p.id}
                variants={fadeUp}
                onClick={() => setProjectModal(p.id)}
                className="card card-interactive p-5 text-left flex items-center gap-4"
              >
                {p.images.length > 0 ? (
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover object-[50%_0%]" draggable={false} />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-900" />
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-lg font-bold text-[var(--ink)]">{p.title}</span>
                  <span className="text-sm text-[var(--body)] leading-relaxed">{p.tagline}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </Section>

        {/* ── 02 · WRITING ─────────────────────────────── */}
        <Section id="writing" className="scroll-mt-28 flex flex-col gap-8">
          <SectionHead n="02" eyebrow="Notes" title="Writing" />
          {featuredPost && (
            <motion.button
              variants={fadeUp}
              onClick={() => setPostModal(featuredPost.slug)}
              className="card card-interactive p-8 md:p-10 text-left flex flex-col gap-3"
            >
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{featuredPost.date} · {featuredPost.readingTime}</span>
              <span className="text-2xl md:text-3xl font-bold text-[var(--ink)]">{featuredPost.title}</span>
              <span className="text-[var(--body)] leading-relaxed max-w-2xl">{featuredPost.summary}</span>
            </motion.button>
          )}
          <motion.a variants={fadeUp} href="https://tdporter.substack.com" target="_blank" className="link-accent text-sm w-fit">
            More notes on Substack →
          </motion.a>
        </Section>

        {/* ── 03 · BACKGROUND ──────────────────────────── */}
        <Section className="scroll-mt-28 flex flex-col gap-8">
          <SectionHead n="03" eyebrow="Background" title="Experience & Education" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <motion.div variants={fadeUp} className="flex flex-col gap-6">
              <span className="eyebrow">Experience</span>
              {EXPERIENCE.map((e) => <ResumeEntry key={e.name} {...e} />)}
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col gap-6">
              <span className="eyebrow">Education</span>
              {EDUCATION.map((e) => <ResumeEntry key={e.name} {...e} />)}
            </motion.div>
          </div>
          <motion.a variants={fadeUp} href="./Dylan_Porter_Resume.pdf" target="_blank" className="link-accent text-sm w-fit">
            See the full résumé →
          </motion.a>
        </Section>

        {/* ── CTA ──────────────────────────────────────── */}
        <Section className="scroll-mt-28">
          <motion.div variants={fadeUp} className="card p-10 md:p-16 flex flex-col items-start gap-5">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] max-w-xl">Let's build something together.</h2>
            <p className="text-[var(--body)] max-w-md leading-relaxed">If you're working on something interesting, I'd like to hear about it — whether that's building it together or just trading ideas.</p>
            <a href={`mailto:${EMAIL}`} className="px-5 py-2.5 button gap-2 text-sm mt-1">
              <FaRegEnvelope size={13} />{EMAIL}
            </a>
          </motion.div>
        </Section>

      </main>

      <Section id="footer" className="max-w-6xl mx-auto px-4 md:px-8 mb-8">
        <motion.footer variants={fadeUp} className="border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-200 pt-8 text-sm">
          <div className="flex flex-col-reverse items-center md:flex-row md:justify-between gap-4">
            <span className="text-neutral-400 dark:text-neutral-500 text-xs">© 2026<a href="" className="link" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{" "}tdporter.dev</a></span>
            <div className="flex items-center gap-3">
              <a href={`mailto:${EMAIL}`} className="p-2 hover-button"><FaRegEnvelope size={14} /></a>
              <a href="https://x.com/tdporterdev" target="_blank" className="p-2 hover-button"><FaXTwitter size={14} /></a>
              <a href="https://linkedin.com/in/tdporter" target="_blank" className="p-2 hover-button"><FaLinkedinIn size={14} /></a>
              <a href="https://github.com/dylporter" target="_blank" className="p-2 hover-button"><FaGithub size={14} /></a>
            </div>
          </div>
        </motion.footer>
      </Section>

      <ProjectModal project={activeProject} onClose={useCallback(() => setProjectModal(null), [])} />
      <PostModal post={activePost} onClose={useCallback(() => setPostModal(null), [])} />
    </div>
  );
}

export default App;

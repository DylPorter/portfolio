import { useState, useCallback, useRef } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FaLinkedinIn, FaGithub, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

import { fadeUp, stagger, Section } from "./components/animations";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { ExperienceEntry } from "./components/ExperienceEntry";
import { EducationEntry } from "./components/EducationEntry";
import { BsdSection } from "./components/BsdSection";
import { ProjectCarousel } from "./components/ProjectCarousel";
import { AboutModal } from "./components/AboutModal";
import { ProjectModal } from "./components/ProjectModal";
import { PostModal } from "./components/PostModal";
import { projects } from "./data/projects";
import { posts } from "./data/posts";

const EMAIL = "info@tdporter.dev";

function App() {
  const [theme, setTheme] = useState('dark');
  const [active, setActive] = useState("experience");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [projectModal, setProjectModal] = useState<string | null>(null);
  const [postModal, setPostModal] = useState<string | null>(null);
  const carouselNav = useRef<{ prev: () => void; next: () => void }>({ prev: () => {}, next: () => {} });
  const handleCarouselApi = useCallback((prev: () => void, next: () => void) => { carouselNav.current = { prev, next }; }, []);

  const toggleTheme = () => setTheme((prev) => {
    const next = prev === "dark" ? "light" : "dark";
    document.documentElement.className = next;
    document.documentElement.style.backgroundColor = next === "dark" ? "#0a0a0a" : "#f5f5f5";
    return next;
  });

  const activeProject = projects.find((p) => p.id === projectModal);
  const activePost = posts.find((p) => p.slug === postModal);

  return (
    <div id="top" className={`${theme === "dark" ? "dark" : ""} bg-neutral-100 dark:bg-neutral-950 text-[var(--body)] min-h-screen w-full transition-colors duration-500`}>

      <Nav theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-3xl px-4 md:px-8 mx-auto flex flex-col gap-4 max-md:pt-6">

        {/* ── Hero + Experience/Education ─────────────── */}
        <motion.section id="home" className="flex flex-col gap-4" initial="hidden" animate="visible" variants={stagger}>
          <Hero onAboutOpen={() => setAboutOpen(true)} />

          <motion.div variants={fadeUp} className="card p-2 mt-4">
            <div className="flex gap-2 w-full h-full rounded-lg">
              <button className={`w-1/2 py-1.5 text-sm rounded-lg hover:cursor-pointer transition-colors duration-500 ${active === "experience" ? "bg-[oklch(0.95_0_0)] dark:bg-neutral-800" : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/40 hover:text-neutral-700 dark:hover:text-neutral-200"}`} onClick={() => setActive("experience")}>Experience</button>
              <button className={`w-1/2 py-1.5 text-sm rounded-lg hover:cursor-pointer transition-colors duration-500 ${active === "education" ? "bg-[oklch(0.95_0_0)] dark:bg-neutral-800" : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/40 hover:text-neutral-700 dark:hover:text-neutral-200"}`} onClick={() => setActive("education")}>Education</button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="relative">
            <AnimatePresence mode="wait">
              {active === "experience" ? (
                <motion.div key="exp" className="card p-8 text-sm flex flex-col gap-6" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                  <ExperienceEntry
                    logo="./collective_logo.jpg"
                    company="Collective Global"
                    role="Full Stack AI Engineer"
                    date="Jul 2024 – Present"
                    description="Built and shipped production AI applications for clients across healthcare, EdTech, and SaaS. Handled everything from LLM integration and AWS infrastructure to React frontends and client communication. SourcingGPT and VETsage both came out of this."
                  />
                  <hr className="border-t border-neutral-300 dark:border-neutral-700 transition-colors duration-500" />
                  <BsdSection />
                </motion.div>
              ) : (
                <motion.div key="edu" className="card p-8 text-sm flex flex-col gap-6" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.25 }}>
                  <EducationEntry logo="./hku_logo.jpeg" school="The University of Hong Kong" degree="BEng in Computer Science" date="Sep 2024 – Jun 2028">
                    <div className="flex flex-col gap-2">
                      <p>Coursework in data structures &amp; algorithms, linear algebra, probability &amp; statistics, discrete mathematics, and object-oriented programming.</p>
                      <p>Activities &amp; societies: Internal Affairs Secretary of the Ricci Hall Students' Association (2026–27), former IBM Z Student Ambassador (spoke to 1,000+ at IBM Z Day 2025 and LinuxONE Community Day), and finalist in the GenAI Hackathon for SDGs 2024.</p>
                    </div>
                  </EducationEntry>
                  <hr className="border-t border-neutral-300 dark:border-neutral-700 transition-colors duration-500" />
                  <EducationEntry logo="./dsc_logo.jpg" school="DSC International School" degree="Ontario Secondary School Diploma" date="Jan 2017 – Jun 2024">
                    <p>Graduated top of class. Governor General's Academic Medal, Student of the Year 2024, Harvard Prize Book, and Fermat Contest School Champion.</p>
                  </EducationEntry>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        {/* ── Projects ───────────────────────────────── */}
        <Section id="projects" className="pt-32 -mt-24 flex flex-col gap-8">
          <motion.div variants={fadeUp} className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Projects</h2>
            <div className="flex gap-2">
              <button onClick={() => carouselNav.current.prev()} className="p-2 hover-button hover:cursor-pointer"><LuChevronLeft size={18} /></button>
              <button onClick={() => carouselNav.current.next()} className="p-2 hover-button hover:cursor-pointer"><LuChevronRight size={18} /></button>
            </div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <ProjectCarousel onSelect={setProjectModal} onApi={handleCarouselApi} />
          </motion.div>
        </Section>

        {/* ── Writing ───────────────────────────────── */}
        <Section id="writing" className="pt-32 -mt-24 flex flex-col gap-8">
          <motion.div variants={fadeUp} className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Writing</h2>
            {/* Substack link hidden until the first post is published there — restore once it's live:
            <a href="https://tdporter.substack.com" target="_blank" className="link text-sm">More on Substack &rarr;</a>
            */}
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            {posts.map((post) => (
              <button
                key={post.slug}
                onClick={() => setPostModal(post.slug)}
                className="card card-interactive p-6 text-left flex flex-col gap-2"
              >
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{post.date} · {post.readingTime}</span>
                <span className="text-lg font-semibold text-[var(--ink)]">{post.title}</span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{post.summary}</span>
              </button>
            ))}
          </motion.div>
        </Section>

        {/* ── Contact / CTA ──────────────────────────── */}
        <Section id="contact" className="pt-32 -mt-24">
          <motion.div variants={fadeUp} className="card p-10 md:p-14 flex flex-col items-center text-center gap-5">
            <h2 className="text-3xl md:text-4xl font-bold">Let's build something together</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md text-balance">If you're working on something interesting, I'd like to hear about it — whether that's building it together or just trading ideas.</p>
            <a href={`mailto:${EMAIL}`} className="px-5 py-2.5 button gap-2 text-sm mt-1">
              <FaRegEnvelope size={13} />{EMAIL}
            </a>
          </motion.div>
        </Section>

      </main>

      <Section id="footer" className="max-w-3xl mx-auto px-4 md:px-8 mt-16 mb-8">
        <motion.footer variants={fadeUp} className="border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500 pt-8 text-sm">
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

      <AboutModal open={aboutOpen} onClose={useCallback(() => setAboutOpen(false), [])} />
      <ProjectModal project={activeProject} onClose={useCallback(() => setProjectModal(null), [])} />
      <PostModal post={activePost} onClose={useCallback(() => setPostModal(null), [])} />
    </div>
  );
}

export default App;

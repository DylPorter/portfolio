import { useState, useCallback, useRef } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FaLinkedinIn, FaGithub, FaRegEnvelope } from "react-icons/fa6";
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
import { projects } from "./data/projects";

const EMAIL = "info@tdporter.dev";

function App() {
  const [theme, setTheme] = useState('dark');
  const [active, setActive] = useState("experience");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [projectModal, setProjectModal] = useState<string | null>(null);
  const carouselNav = useRef<{ prev: () => void; next: () => void }>({ prev: () => {}, next: () => {} });
  const handleCarouselApi = useCallback((prev: () => void, next: () => void) => { carouselNav.current = { prev, next }; }, []);

  const toggleTheme = () => setTheme((prev) => {
    const next = prev === "dark" ? "light" : "dark";
    document.documentElement.className = next;
    document.documentElement.style.backgroundColor = next === "dark" ? "#0a0a0a" : "#f5f5f5";
    return next;
  });

  const activeProject = projects.find((p) => p.id === projectModal);

  return (
    <div id="top" className={`${theme === "dark" ? "dark" : ""} bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen w-full transition-colors duration-500`}>

      <Nav theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-3xl px-4 md:px-8 mx-auto flex flex-col gap-4">

        {/* ── Hero + Experience/Education ─────────────── */}
        <motion.section id="home" className="flex flex-col gap-4" initial="hidden" animate="visible" variants={stagger}>
          <Hero onAboutOpen={() => setAboutOpen(true)} />

          <motion.div variants={fadeUp} className="card p-2 mt-4">
            <div className="flex gap-2 w-full h-full rounded-lg">
              <button className={`w-1/2 py-1.5 text-sm rounded-lg hover:cursor-pointer transition-colors duration-500 ${active === "experience" ? "bg-[oklch(0.95_0_0)] dark:bg-neutral-800" : "text-neutral-500 dark:text-neutral-400"}`} onClick={() => setActive("experience")}>Experience</button>
              <button className={`w-1/2 py-1.5 text-sm rounded-lg hover:cursor-pointer transition-colors duration-500 ${active === "education" ? "bg-[oklch(0.95_0_0)] dark:bg-neutral-800" : "text-neutral-500 dark:text-neutral-400"}`} onClick={() => setActive("education")}>Education</button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="relative">
            <AnimatePresence mode="wait">
              {active === "experience" ? (
                <motion.div key="exp" className="card p-8 text-sm flex flex-col gap-6" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.25 }}>
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
                <motion.div key="edu" className="card p-8 text-sm flex flex-col gap-6" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                  <EducationEntry logo="./hku_logo.jpeg" school="The University of Hong Kong" degree="BEng in Computer Science" date="Sep 2024 – Jun 2028">
                    <div className="flex flex-col gap-2">
                      <p>Coursework in data structures &amp; algorithms, linear algebra, probability &amp; statistics, discrete mathematics, and object-oriented programming.</p>
                      <p>IBM Z Student Ambassador — grew a student community at HKU and spoke at IBM Z Day 2025 and LinuxONE Community Day 2025 to 1,000+ attendees. Finalist in the GenAI Hackathon for SDGs 2024.</p>
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

        {/* ── Writing ────────────────────────────────── */}
        <Section id="writing" className="pt-32 -mt-24 flex flex-col gap-8">
          <motion.div variants={fadeUp} className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Writing</h2>
            <a href="https://tdporter.substack.com" target="_blank" className="link text-sm">Subscribe on Substack &rarr;</a>
          </motion.div>
          <motion.div variants={fadeUp} className="card p-10 text-center">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Coming soon — documenting what I'm learning as I build.</p>
          </motion.div>
        </Section>

      </main>

      <Section id="footer" className="max-w-3xl mx-auto px-4 md:px-8 mt-16 mb-8">
        <motion.footer variants={fadeUp} className="border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-500 pt-8 text-sm">
          <div className="flex flex-col items-center md:items-center md:flex-row md:justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-neutral-500 dark:text-neutral-400">Want to build something together?</span>
              <div className="flex items-center gap-3">
                <a href={`mailto:${EMAIL}`} className="px-4 py-1.5 button gap-2 text-xs">
                  <FaRegEnvelope size={12} />{EMAIL}
                </a>
                <a href="https://linkedin.com/in/tdporter" target="_blank" className="p-2 hover-button"><FaLinkedinIn size={14} /></a>
                <a href="https://github.com/dylporter" target="_blank" className="p-2 hover-button"><FaGithub size={14} /></a>
              </div>
            </div>
            <span className="text-neutral-400 dark:text-neutral-500 text-xs">© 2026<a href="" className="link" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{" "}tdporter.dev</a></span>
          </div>
        </motion.footer>
      </Section>

      <AboutModal open={aboutOpen} onClose={useCallback(() => setAboutOpen(false), [])} />
      <ProjectModal project={activeProject} onClose={useCallback(() => setProjectModal(null), [])} />
    </div>
  );
}

export default App;

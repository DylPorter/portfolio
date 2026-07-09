import { Link } from "react-router-dom";
import { LuArrowLeft, LuArrowUpRight } from "react-icons/lu";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "./animations";
import { projects } from "../data/projects";

export function ProjectsPage() {
  return (
    <main className="max-w-6xl px-6 md:px-8 mx-auto pt-8 pb-20">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeUp}>
          <Link to="/#projects" className="link inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium mb-8">
            <LuArrowLeft size={13} /> Home
          </Link>
          <h1 className="serif text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-[var(--ink)] mb-2">Projects</h1>
          <p className="text-[var(--body)] leading-relaxed mb-10 max-w-xl">Production systems and things I've built end to end — sourcing, healthcare, EdTech, and the odd solo experiment.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <Link to={`/projects/${p.id}`} className="group card card-interactive overflow-hidden h-full flex flex-col text-left">
                {p.images.length > 0 && (
                  <div className="h-48 overflow-hidden">
                    <img src={p.images[0]} alt={p.title} loading="lazy" decoding="async" className="w-full h-full object-cover object-[50%_0%] transition-transform duration-500 group-hover:scale-[1.03]" draggable={false} />
                  </div>
                )}
                <div className="p-6 flex flex-col gap-2 relative flex-1">
                  <LuArrowUpRight className="absolute top-5 right-5 text-[var(--accent)] opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" size={17} />
                  <span className="eyebrow">{p.role}</span>
                  <span className="serif text-2xl font-semibold text-[var(--ink)]">{p.title}</span>
                  <span className="text-sm text-[var(--body)] leading-relaxed">{p.tagline}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

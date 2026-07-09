import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuExternalLink, LuLock, LuExpand } from "react-icons/lu";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";
import { Lightbox } from "./Lightbox";
import { projects } from "../data/projects";

export function ProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const project = projects.find((p) => p.id === slug);
  if (!project) return <Navigate to="/projects" replace />;

  // Prefer real history-back (restores prior scroll); fall back to the projects index.
  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate("/#projects");
  };

  return (
    <main className="max-w-3xl px-6 md:px-8 mx-auto pt-8 pb-20">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <button onClick={goBack} className="link inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium mb-8 cursor-pointer">
          <LuArrowLeft size={13} /> Projects
        </button>

        {project.images.length > 0 && (
          <button
            onClick={() => setLightbox(project.images[0])}
            aria-label={`Expand ${project.title} screenshot`}
            className="group relative block w-full mb-8 rounded-2xl overflow-hidden max-h-96 cursor-zoom-in border border-neutral-200 dark:border-neutral-800"
          >
            <img
              src={project.images[0]}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-[50%_0%] transition-transform duration-500 group-hover:scale-[1.03]"
              draggable={false}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="flex items-center gap-1.5 text-white text-xs font-medium bg-black/55 px-3 py-1.5 rounded-full">
                <LuExpand size={13} /> Expand
              </span>
            </span>
          </button>
        )}

        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <h1 className="serif text-4xl font-semibold tracking-[-0.02em] text-[var(--ink)]">{project.title}</h1>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">{project.role}</span>
        </div>
        {project.status && <p className="eyebrow mb-4">{project.status}</p>}

        <p className="leading-relaxed text-[var(--body)] mb-8">{project.description}</p>

        <h2 className="serif text-2xl font-semibold text-[var(--ink)] mb-3">What I built</h2>
        <ul className="list-disc list-outside ml-4 flex flex-col gap-2 mb-10 text-[var(--body)] leading-relaxed">
          {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>

        {project.url ? (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-chunky text-sm">
            <span className="btn-ico"><LuExternalLink size={14} /></span>Visit {project.title}
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500">
            <LuLock size={14} />Private during the build
          </span>
        )}
      </motion.div>

      <Lightbox src={lightbox} alt={project.title} onClose={() => setLightbox(null)} />
    </main>
  );
}

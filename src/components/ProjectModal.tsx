import { useState, useEffect } from "react";
import { LuExternalLink, LuLock, LuExpand } from "react-icons/lu";
import { Modal } from "./Modal";
import { Lightbox } from "./Lightbox";
import type { Project } from "../data/projects";

export function ProjectModal({ project, onClose }: { project: Project | undefined; onClose: () => void }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Reset the lightbox when the modal closes, so it doesn't reappear on reopen.
  useEffect(() => { if (!project) setLightbox(null); }, [project]);

  return (
    <Modal open={!!project} onClose={onClose}>
      {project && (
        <>
          {project.images.length > 0 ? (
            <button
              onClick={() => setLightbox(project.images[0])}
              aria-label={`Expand ${project.title} screenshot`}
              className="group relative block w-full mb-6 rounded-xl overflow-hidden max-h-80 cursor-zoom-in"
            >
              <img
                src={project.images[0]}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-[50%_0%] transition-transform duration-500 group-hover:scale-[1.04]"
                draggable={false}
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="flex items-center gap-1.5 text-white text-xs font-medium bg-black/55 px-3 py-1.5 rounded-full">
                  <LuExpand size={13} /> Expand
                </span>
              </span>
            </button>
          ) : (
            <div className="w-full rounded-xl mb-6 h-44 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800/80 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">{project.status ?? "Coming soon"}</span>
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-1 flex-wrap">
            <h2 className="text-3xl font-semibold tracking-[-0.02em]">{project.title}</h2>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{project.role}</span>
          </div>
          <p className="text-sm leading-relaxed mt-3 mb-5 text-[var(--body)]">{project.description}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-2">What I built</p>
          <ul className="text-sm list-disc list-outside ml-4 flex flex-col gap-1.5 mb-6 text-[var(--body)]">
            {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 text-sm button gap-2">
              <LuExternalLink size={14} />Visit {project.title}
            </a>
          ) : (
            <span className="inline-flex items-center px-4 py-2 text-sm text-neutral-400 dark:text-neutral-500 gap-2">
              <LuLock size={14} />Private during the build
            </span>
          )}

          <Lightbox src={lightbox} alt={project.title} onClose={() => setLightbox(null)} />
        </>
      )}
    </Modal>
  );
}

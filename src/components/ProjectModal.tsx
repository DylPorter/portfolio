import { LuExternalLink, LuLock } from "react-icons/lu";
import { Modal } from "./Modal";
import { ImageCarousel } from "./ImageCarousel";
import type { Project } from "../data/projects";

export function ProjectModal({ project, onClose }: { project: Project | undefined; onClose: () => void }) {
  return (
    <Modal open={!!project} onClose={onClose}>
      {project && (
        <>
          {project.images.length > 0 ? (
            <ImageCarousel images={project.images} alt={project.title} />
          ) : (
            <div className="w-full rounded-xl mb-6 h-44 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800/80 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">{project.status ?? "Coming soon"}</span>
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-1 flex-wrap">
            <h2 className="text-3xl font-bold">{project.title}</h2>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{project.role}</span>
          </div>
          <p className="text-sm leading-relaxed mt-3 mb-5">{project.description}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-2">What I built</p>
          <ul className="text-sm list-disc list-outside ml-4 flex flex-col gap-1.5 mb-6">
            {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
          {project.url ? (
            <a href={project.url} target="_blank" className="inline-flex items-center px-4 py-2 text-sm button gap-2">
              <LuExternalLink size={14} />Visit {project.title}
            </a>
          ) : (
            <span className="inline-flex items-center px-4 py-2 text-sm text-neutral-400 dark:text-neutral-500 gap-2">
              <LuLock size={14} />Private during the build
            </span>
          )}
        </>
      )}
    </Modal>
  );
}

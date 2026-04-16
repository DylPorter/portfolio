import { LuExternalLink } from "react-icons/lu";
import { Modal } from "./Modal";
import type { Project } from "../data/projects";

export function ProjectModal({ project, onClose }: { project: Project | undefined; onClose: () => void }) {
  return (
    <Modal open={!!project} onClose={onClose}>
      {project && (
        <>
          {project.images.length > 0 && (
            <div className="w-full overflow-hidden rounded-xl mb-6 max-h-72">
              <img className="w-full h-full object-cover object-[50%_0%]" alt={project.title} src={project.images[0]} />
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="text-3xl font-bold">{project.title}</h2>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{project.role}</span>
          </div>
          <p className="text-sm leading-relaxed mt-3 mb-5">{project.description}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-2">What I built</p>
          <ul className="text-sm list-disc list-outside ml-4 flex flex-col gap-1.5 mb-5">
            {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
          <div className="flex flex-row flex-wrap text-xs gap-1 mb-6">
            {project.tech.map((t) => <div key={t} className="pill">{t}</div>)}
          </div>
          <a href={project.url} target="_blank" className="inline-flex items-center px-4 py-2 text-sm button gap-2">
            <LuExternalLink size={14} />Visit {project.title}
          </a>
        </>
      )}
    </Modal>
  );
}

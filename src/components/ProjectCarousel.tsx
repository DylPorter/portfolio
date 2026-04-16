import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { projects } from "../data/projects";

export function ProjectCarousel({ onSelect, onApi }: { onSelect: (id: string) => void; onApi: (prev: () => void, next: () => void) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (!container || !inner) return;
      const style = getComputedStyle(container);
      const contentArea = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const maxDrag = -(inner.scrollWidth - contentArea);
      setConstraints({ left: Math.min(maxDrag, 0), right: 0 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const scrollByCard = useCallback((dir: -1 | 1) => {
    const card = innerRef.current?.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step = card.offsetWidth + 16;
    const target = dir === 1
      ? Math.max(constraints.left, Math.round((x.get() - step) / step) * step)
      : Math.min(0, Math.round((x.get() + step) / step) * step);
    animate(x, Math.min(constraints.right, Math.max(constraints.left, target)), {
      type: "tween", duration: 0.35, ease: "easeOut",
    });
  }, [constraints, x]);

  useEffect(() => {
    onApi(() => scrollByCard(-1), () => scrollByCard(1));
  }, [onApi, scrollByCard]);

  return (
    <div ref={containerRef} className="overflow-x-clip overflow-y-visible py-2 -mx-3 px-3">
      <motion.div
        ref={innerRef}
        className="flex gap-4 cursor-grab active:cursor-grabbing"
        drag="x"
        style={{ x }}
        dragConstraints={constraints}
        dragElastic={0.15}
        dragTransition={{ power: 0.3, timeConstant: 200, bounceStiffness: 400, bounceDamping: 40 }}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 50); }}
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="card p-6 flex flex-col flex-shrink-0 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer select-none"
            style={{ width: "calc((100% - 16px) / 2)", minWidth: "280px" }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => { if (!isDragging.current) onSelect(project.id); }}
          >
            {project.images.length > 0 && (
              <div className="w-full overflow-hidden rounded-xl h-40 mb-4">
                <img className="w-full h-full object-cover object-[50%_0%]" alt={project.title} src={project.images[0]} draggable={false} />
              </div>
            )}
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="mt-2 mb-3 text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-500 leading-relaxed">{project.tagline}</p>
            <div className="flex flex-row flex-wrap text-xs gap-1 mt-auto">
              {project.tech.map((t) => <div key={t} className="pill">{t}</div>)}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

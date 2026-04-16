import { useState, useEffect, useRef } from "react";

export function BsdSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState({ top: 0, height: 0, left: 0 });

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const logo = logoRef.current;
      const dot = dotRef.current;
      if (!container || !logo || !dot) return;

      const cRect = container.getBoundingClientRect();
      const lRect = logo.getBoundingClientRect();
      const dRect = dot.getBoundingClientRect();

      setLine({
        top: lRect.bottom - cRect.top,
        height: dRect.top - lRect.bottom,
        left: lRect.left - cRect.left + lRect.width / 2,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    const timer = setTimeout(measure, 100);
    return () => { window.removeEventListener("resize", measure); clearTimeout(timer); };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {line.height > 0 && (
        <div
          className="absolute w-0.5 bg-neutral-300 dark:bg-neutral-700 transition-colors duration-500"
          style={{ top: line.top, height: line.height, left: line.left - 1 }}
        />
      )}

      <div className="flex items-center mb-3">
        <img ref={logoRef} className="icon mr-4" src="./bsdeducation_logo.jpg" />
        <div className="flex flex-col gap-0.25">
          <p className="font-bold text-base">BSD Education</p>
          <p className="-mt-0.5">Coding Instructor</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-500">May 2025 – Present</p>
        </div>
      </div>
      <p className="ml-16 pr-4 leading-relaxed">Teaching web development, Python, AI, and game development to 100+ students aged 7–14 through classes, camps, and online curriculum.</p>

      <div className="flex items-center mb-3 mt-5">
        <div className="w-12 mr-4 flex justify-center">
          <div ref={dotRef} className="w-2.5 h-2.5 rounded-full bg-neutral-400 dark:bg-neutral-600 transition-colors duration-500" />
        </div>
        <div className="flex flex-col gap-0.25">
          <p>Software Engineering Intern</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-500">Sep 2023 – Mar 2024</p>
        </div>
      </div>
      <p className="ml-16 pr-4 leading-relaxed">Built a LLaMA 2 chatbot on AWS EC2 to help educators with lesson planning, back in 2023 before local LLM tooling was mature. Wrote the API, the web interface, and managed the infrastructure. The broader platform served 150K+ students across 26 countries.</p>
    </div>
  );
}

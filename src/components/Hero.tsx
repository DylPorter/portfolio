import { useLayoutEffect, useRef } from "react";
import { LuExternalLink } from "react-icons/lu";
import { FaLinkedinIn, FaGithub, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const EMAIL = "info@tdporter.dev";

const ROLES = [
  { label: "Developer @", org: "Collective Global", href: "https://www.collectiveglobal.net/" },
  { label: "Instructor @", org: "BSD Education", href: "https://bsd.education" },
  { label: "Student @", org: "HKU", href: "https://hku.hk" },
];

export function Hero() {
  const roleListRef = useRef<HTMLDivElement>(null);

  // Flag the first role on each visual line so we can drop its leading "·" dot. The dots
  // are absolutely positioned (zero layout width), so toggling one never reflows the row —
  // no wrap flip-flop, no phantom gutter. A role starts a new line when its top no longer
  // matches the previous role's. Re-runs on resize via ResizeObserver.
  useLayoutEffect(() => {
    const list = roleListRef.current;
    if (!list) return;
    const sync = () => {
      let prevTop: number | null = null;
      list.querySelectorAll<HTMLElement>("[data-role]").forEach((el) => {
        const top = el.getBoundingClientRect().top;
        const firstOnLine = prevTop === null || Math.abs(top - prevTop) > 2;
        el.toggleAttribute("data-first-on-line", firstOnLine);
        prevTop = top;
      });
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-8 md:gap-14 items-center">
      <div className="w-full md:w-[44%] md:order-last flex-shrink-0 h-[320px] md:h-[440px] overflow-hidden rounded-2xl">
        <img className="w-full h-full object-cover object-top" alt="Dylan Porter" src="/profile_pic.webp" />
      </div>
      <div className="flex flex-col md:flex-1 items-center text-center md:items-start md:text-left">
        <h1 className="text-6xl md:text-7xl font-bold tracking-[-0.03em] leading-[0.95]">Hi, I'm Dylan.</h1>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-[var(--body)] max-w-2xl">
          I build production AI systems across sourcing, healthcare, and education as a full-stack AI engineer in Hong Kong.
        </p>
        <p className="mt-3 text-base leading-relaxed text-neutral-500 dark:text-neutral-500 max-w-2xl">
          I ship your products end to end — agentic pipelines, AWS infrastructure, React frontends — and write about how they actually get made.
        </p>
        <div ref={roleListRef} className="role-list mt-6 flex flex-row flex-wrap items-center gap-x-6 gap-y-2 justify-center md:justify-start text-sm text-[var(--body)]">
          {ROLES.map((r) => (
            <p key={r.org} data-role className="role">
              {r.label}{" "}<a href={r.href} target="_blank" rel="noopener noreferrer" className="link-accent">{r.org}</a>
            </p>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-8">
          <a href="/Dylan_Porter_Resume.pdf" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm button button-flat gap-2"><LuExternalLink size={14} />Résumé</a>
          <a href={`mailto:${EMAIL}`} className="icon-button" title={EMAIL} aria-label="Email"><FaRegEnvelope size={15} /></a>
          <a href="https://x.com/tdporterdev" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="icon-button"><FaXTwitter size={15} /></a>
          <a href="https://linkedin.com/in/tdporter" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-button"><FaLinkedinIn size={15} /></a>
          <a href="https://github.com/dylporter" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon-button"><FaGithub size={15} /></a>
        </div>
      </div>
    </motion.div>
  );
}

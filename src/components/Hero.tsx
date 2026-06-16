import { LuExternalLink } from "react-icons/lu";
import { FaLinkedinIn, FaGithub, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const EMAIL = "info@tdporter.dev";

export function Hero() {
  return (
    <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-8 md:gap-14 items-center">
      <div className="w-full md:w-[38%] flex-shrink-0 h-[320px] md:h-[440px] overflow-hidden rounded-2xl">
        <img className="w-full h-full object-cover object-top" alt="Dylan Porter" src="/profile_pic.webp" />
      </div>
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-6xl md:text-7xl font-bold tracking-[-0.03em] leading-[0.95]">Hi, I'm Dylan.</h1>
        <p className="mt-7 text-lg md:text-xl leading-relaxed text-balance text-[var(--body)] max-w-xl">
          I'm a full-stack AI engineer in Hong Kong, building production AI systems across sourcing, healthcare, and education.
        </p>
        <p className="mt-3 text-base leading-relaxed text-balance text-neutral-500 dark:text-neutral-500 max-w-xl">
          I ship things end to end — LLM pipelines, AWS infrastructure, React frontends — and write about how they actually get made.
        </p>
        <div className="mt-6 flex flex-row flex-wrap gap-x-5 gap-y-1 justify-center md:justify-start text-sm text-[var(--body)]">
          <p>Developer @{" "}<a href="https://www.collectiveglobal.net/" target="_blank" rel="noopener noreferrer" className="link-accent">Collective Global</a></p>
          <p>Instructor @{" "}<a href="https://bsd.education" target="_blank" rel="noopener noreferrer" className="link-accent">BSD Education</a></p>
          <p>Student @{" "}<a href="https://hku.hk" target="_blank" rel="noopener noreferrer" className="link-accent">HKU</a></p>
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

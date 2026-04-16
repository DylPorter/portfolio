import { useState } from "react";
import { LuCopyCheck, LuExternalLink, LuUser } from "react-icons/lu";
import { FaLinkedinIn, FaGithub, FaRegEnvelope } from "react-icons/fa6";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const EMAIL = "info@tdporter.dev";

export function Hero({ onAboutOpen }: { onAboutOpen: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div variants={fadeUp} className="card p-10 items-center flex flex-col md:flex-row gap-8 md:gap-12 justify-between">
      <div className="w-full md:w-2/5 flex-shrink-0 h-[275px] md:h-auto md:self-stretch overflow-hidden rounded-xl">
        <img className="w-full h-full object-cover md:scale-140 object-[50%_25%] md:translate-y-8 md:-translate-x-2" alt="Photo of me" src="./IMG-20250131-WA0057.jpg" />
      </div>
      <div className="flex flex-col items-center md:items-stretch md:justify-center md:pt-2">
        <h1 className="text-5xl font-bold">Hi, I'm Dylan.</h1>
        <div className="mt-5 flex flex-row flex-wrap gap-x-6 md:flex-col items-center justify-center md:items-start">
          <p>Developer<a href="https://collectiveglobal.net" target="_blank" className="link">{" "}@ Collective Global</a></p>
          <p>Instructor<a href="https://bsd.education" target="_blank" className="link">{" "}@ BSD Education</a></p>
          <p>Student<a href="https://hku.hk" target="_blank" className="link">{" "}@ The University of Hong Kong</a></p>
        </div>
        <p className="mt-4 text-balance text-center md:text-left">I build AI systems for startups and teach students in Hong Kong.</p>
        <div className="flex items-center gap-3 mt-5">
          <button onClick={onAboutOpen} className="px-4 py-2 text-sm button gap-2 hover:cursor-pointer"><LuUser size={14} />About</button>
          <a href="./resume.pdf" target="_blank" className="px-4 py-2 text-sm button gap-2"><LuExternalLink size={14} />Résumé</a>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <a href="https://linkedin.com/in/tdporter" target="_blank" className="p-3 hover-button"><FaLinkedinIn /></a>
          <a href="https://github.com/dylporter" target="_blank" className="p-3 hover-button"><FaGithub /></a>
          <button onClick={copyEmail} className="p-3 hover-button hover:cursor-pointer relative" title={EMAIL}>
            {copied ? <LuCopyCheck /> : <FaRegEnvelope />}
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 px-2 py-1 rounded whitespace-nowrap dropdown-enter">Copied!</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

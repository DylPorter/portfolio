import { LuExternalLink, LuUser } from "react-icons/lu";
import { FaLinkedinIn, FaGithub, FaRegEnvelope, FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const EMAIL = "info@tdporter.dev";

export function Hero({ onAboutOpen }: { onAboutOpen: () => void }) {
  return (
    <motion.div variants={fadeUp} className="card p-10 items-center flex flex-col md:flex-row gap-8 md:gap-12 justify-between">
      <div className="w-full md:w-2/5 flex-shrink-0 h-[275px] md:h-auto md:self-stretch overflow-hidden rounded-xl">
        <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Photo of me" src="./profile_pic.webp" />
      </div>
      <div className="flex flex-col items-center md:items-stretch md:justify-center md:pt-2">
        <h1 className="text-5xl font-bold text-center md:text-left">Hi, I'm Dylan.</h1>
        <div className="mt-5 flex flex-row flex-wrap gap-x-6 md:flex-col items-center justify-center md:items-start">
          <p>Developer @{" "}<a href="https://www.collectiveglobal.net/" target="_blank" className="link-accent">Collective Global</a></p>
          <p>Instructor @{" "}<a href="https://bsd.education" target="_blank" className="link-accent">BSD Education</a></p>
          <p>Student @{" "}<a href="https://hku.hk" target="_blank" className="link-accent">The University of Hong Kong</a></p>
        </div>
        <p className="mt-4 text-balance text-center md:text-left">I build production AI systems for startups, and I write about how they actually get made.</p>
        <div className="flex items-center gap-3 mt-5">
          <button onClick={onAboutOpen} className="px-4 py-2 text-sm button gap-2 hover:cursor-pointer"><LuUser size={14} />About</button>
          <a href="./Dylan_Porter_Resume.pdf" target="_blank" className="px-4 py-2 text-sm button gap-2"><LuExternalLink size={14} />Résumé</a>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <a href={`mailto:${EMAIL}`} className="p-3 hover-button" title={EMAIL}><FaRegEnvelope /></a>
          <a href="https://x.com/tdporterdev" target="_blank" className="p-3 hover-button"><FaXTwitter /></a>
          <a href="https://linkedin.com/in/tdporter" target="_blank" className="p-3 hover-button"><FaLinkedinIn /></a>
          <a href="https://github.com/dylporter" target="_blank" className="p-3 hover-button"><FaGithub /></a>
        </div>
      </div>
    </motion.div>
  );
}

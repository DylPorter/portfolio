import { Modal } from "./Modal";

const highlights = [
  "Antler Inception SG20", "Governor General's Medal", "Harvard Prize Book",
  "Student of the Year 2024", "IBM Z Day Speaker", "GenAI Hackathon Finalist",
];

export function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-3xl font-bold mb-6">About Me</h2>
      <div className="flex flex-col gap-4 text-sm leading-relaxed">
        <p>I'm a full-stack AI engineer based in Hong Kong, building production AI systems across sourcing, healthcare, and education. I work at{" "}<a href="https://collectiveglobal.net" target="_blank" className="link font-medium">Collective Global</a> where I ship end-to-end AI applications for startup clients — everything from LLM pipelines and AWS infrastructure to React frontends.</p>
        <p>Two products I've built there:{" "}<a href="https://sourcinggpt.ai" target="_blank" className="link font-medium">SourcingGPT</a>, an agentic B2B supplier sourcing platform (founding team, selected for{" "}<a href="https://antler.co" target="_blank" className="link font-medium">Antler</a> Inception SG20), and{" "}<a href="https://app.vetsage.ai" target="_blank" className="link font-medium">VETsage</a>, a RAG-powered clinical report system used by veterinary clinics across multiple countries.</p>
        <p>I'm also a second-year CS student at The University of Hong Kong, an IBM Z Student Ambassador (spoke at IBM Z Day and LinuxONE Community Day 2025 to 1,000+ attendees), and a coding instructor at BSD Education teaching 100+ kids aged 7-14.</p>
        <p>Half Vietnamese, half British. Fluent in English, Vietnamese, and French. Learning Cantonese.</p>
        <div className="mt-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-3">Highlights</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {highlights.map((h) => <span key={h} className="pill">{h}</span>)}
          </div>
        </div>
      </div>
    </Modal>
  );
}

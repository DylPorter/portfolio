export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  highlights: string[];
  tech: string[];
  images: string[];
  url: string;
  status?: string;
};

export const projects: Project[] = [
  {
    id: "sourcinggpt",
    title: "SourcingGPT",
    tagline: "A B2B sourcing agent that finds and ranks suppliers from a product request, then drafts the outreach email.",
    description: "B2B sourcing usually means hours in search tabs and supplier directories, then copy-pasting cold emails. SourcingGPT does the whole loop: it reads a product request, searches and ranks suppliers against it, and drafts the first outreach. I built it as a founding engineer through Antler Inception SG20.",
    role: "Founding Engineer",
    highlights: [
      "The agentic loop that reads a request, decides what to query, and ranks suppliers against it — the system picks its next step instead of following a fixed script.",
      "Hybrid retrieval (keyword + semantic) over the supplier database, so a vague or oddly-worded request still surfaces the right matches.",
      "A multi-step pipeline in n8n — match, enrich, draft outreach — wired so each stage can fail and retry on its own.",
      "The React and TypeScript app with Firebase auth on top, deployed on AWS.",
    ],
    tech: ["LLMs", "RAG", "n8n", "TypeScript", "React", "Firebase", "AWS", "PostgreSQL"],
    images: ["/sourcinggpt1.png"],
    url: "https://sourcinggpt.ai",
  },
  {
    id: "vetsage",
    title: "VETsage",
    tagline: "Turns a vet clinic's messy records — scanned PDFs, photos, handwriting — into structured clinical reports.",
    description: "Vet clinics sit on piles of unstructured records: scanned patient histories, lab PDFs, photos of handwritten notes. VETsage reads all of it and produces a clean, structured clinical report a vet can actually work from. I built it end to end at Collective Global, and it's used by veterinary clinics across multiple countries.",
    role: "Full Stack Developer",
    highlights: [
      "An ingestion pipeline that pairs OCR with retrieval to make sense of low-quality, inconsistent document formats — getting reliable structure out of scans and handwriting was the hard part.",
      "LLM-driven report generation that returns consistent clinical sections instead of free-form text.",
      "The clinic-facing React frontend, on a Python and AWS backend.",
      "Deployed and running in production for veterinary clinics across multiple countries.",
    ],
    tech: ["LLMs", "RAG", "OCR", "Python", "n8n", "React", "AWS"],
    images: ["/vetsage1.png"],
    url: "https://vetsage.webflow.io/",
  },
  {
    id: "pacl",
    title: "PACL",
    tagline: "An intermediary that watches a whole team of AI agents and pushes back coordination nobody asked for.",
    description: "Everyone on a team now runs their own AI agent, and the context dies at every handoff. PACL makes it visible: agents connect over MCP and report what they're working on, and a central Gemini intermediary reasons over the combined state — flagging overlapping work, turning blockers into tickets, and handing new agents the context an earlier one already produced. Built solo for the Google Cloud Rapid Agent Hackathon, Arize track.",
    role: "Solo project",
    highlights: [
      "Agents talk to PACL through four MCP tools — update intent, share context, report activity, query — and coordination comes back piggybacked on the next tool response.",
      "The intermediary is itself a Gemini agent: it reads the combined state, decides whether anything needs coordinating, then pushes an alert or writes a structured ticket.",
      "Traced end to end in Arize Phoenix, with an online self-evaluation loop scoring the intermediary's coordination calls.",
    ],
    tech: ["LLMs", "MCP", "Python", "Gemini", "Phoenix", "Cloud Run"],
    images: ["/pacl1.png"],
    url: "https://github.com/DylPorter/pacl",
    status: "Shipped · open source",
  },
];

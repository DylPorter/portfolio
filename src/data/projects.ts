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
    images: ["./sourcinggpt1.png", "./sourcinggpt2.png"],
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
    images: ["./vetsage1.png", "./vetsage2.png"],
    url: "https://vetsage.webflow.io/",
  },
  {
    id: "pacl",
    title: "PACL",
    tagline: "Personal Agent Communication Layer — lets your AI agent talk to someone else's directly, instead of routing everything through the humans in between.",
    description: "Everyone's starting to run their own AI agents, but those agents have no clean way to talk to each other. PACL is my attempt at the missing layer: a shared channel where my agent can hand off context, negotiate, or schedule with your agent directly, without a human relaying messages in between. Building v0 toward a June 2026 ship.",
    role: "Personal project",
    highlights: [
      "A message-passing layer agents use to exchange structured intents over an async queue.",
      "Built on Google's Agent Development Kit with Gemini, traced end to end in Phoenix so I can see why an agent made each call.",
      "Came out of a problem I kept hitting in real work — context dying every time it crosses from one person's AI to another's.",
    ],
    tech: ["LLMs", "Python", "Google ADK", "Gemini", "asyncio", "Phoenix"],
    images: [],
    url: "",
    status: "Shipping June 2026",
  },
];

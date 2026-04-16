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
};

export const projects: Project[] = [
  {
    id: "sourcinggpt",
    title: "SourcingGPT",
    tagline: "An agentic AI system designed to automate and enhance the sourcing process.",
    description: "SourcingGPT is a B2B supplier sourcing platform where users describe their needs in plain language and the system finds, matches, and initiates outreach to suppliers — fully autonomously. Built as a founding team member through Antler Inception SG20.",
    role: "Founding Engineer",
    highlights: [
      "Agentic workflows using LLMs to understand sourcing requirements, match suppliers, and draft outreach",
      "RAG pipeline over a supplier database for intelligent retrieval and ranking",
      "n8n workflow orchestration for multi-step automation across the sourcing pipeline",
      "React + TypeScript frontend with Firebase auth, deployed on AWS",
    ],
    tech: ["LLMs", "RAG", "AWS", "n8n", "TypeScript", "React", "Firebase", "PostgreSQL"],
    images: ["./sourcinggpt1.png", "./sourcinggpt2.png"],
    url: "https://app.sourcinggpt.ai",
  },
  {
    id: "vetsage",
    title: "VETsage",
    tagline: "A retrieval-augmented generation AI system created to streamline veterinary workflows.",
    description: "VETsage helps veterinary clinics process medical documents — PDFs, scanned records, images — and generates structured clinical reports. Used by vet clinics across multiple countries.",
    role: "Full Stack Developer",
    highlights: [
      "RAG + OCR pipelines to ingest and understand diverse medical document formats",
      "DeepSeek-powered report generation producing structured clinical output",
      "React frontend for clinic staff with Python + AWS backend",
      "Deployed and used in production by veterinary clinics internationally",
    ],
    tech: ["LLMs", "RAG", "AWS", "n8n", "Python", "React", "PostgreSQL"],
    images: ["./vetsage1.png", "./vetsage2.png"],
    url: "https://app.vetsage.ai",
  },
  {
    id: "arfixit",
    title: "ARFixit",
    tagline: "An augmented reality mobile application developed for do-it-yourself home repair solutions.",
    description: "ARFixit overlays step-by-step repair instructions onto real-world objects through your phone camera. Built as a team project exploring AR for practical everyday use cases.",
    role: "Developer",
    highlights: [
      "Vuforia Engine for image target recognition and AR overlay rendering",
      "3D model creation and positioning for interactive repair guides",
      "Cross-platform Unity build targeting iOS and Android",
    ],
    tech: ["Unity", "C#", "Vuforia Engine", "Vuforia MTG", "3D Modelling"],
    images: ["./arfixit1.png", "./arfixit2.png"],
    url: "https://arfixit.co",
  },
  {
    id: "twintoys",
    title: "TwinToys",
    tagline: "An AI-powered tool to convert 2D images of toys into immersive and usable 3D models.",
    description: "TwinToys lets users upload a photo of a toy and generates a 3D model from it, using AI-powered mesh generation. Built for an e-commerce client exploring digital twin technology.",
    role: "Developer",
    highlights: [
      "Meshy API integration for AI-driven 2D-to-3D mesh generation",
      "AWS backend handling image upload, processing queue, and model delivery",
      "WordPress frontend with embedded 3D viewer for model previews",
    ],
    tech: ["Python", "JavaScript", "AWS", "Meshy API", "WordPress"],
    images: ["./twintoys1.png", "./twintoys2.png"],
    url: "https://twintoys.co",
  },
];

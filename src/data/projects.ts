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
  {
    id: "claude-telegram",
    title: "claude-telegram",
    tagline: "Claude Code on my phone: a Telegram bot that runs my real Claude Code setup, plus the scheduled bots built on top of it.",
    description: "The most useful AI assistant I have lives in my terminal, and I'm not always at my laptop. claude-telegram bridges it to Telegram: each message runs a real Claude Code session on my own machine, with my memory, tools and MCP servers, on my existing Max plan instead of per-token API costs. The same repo now runs my scheduled bots: a morning signal brief, a job-listing sifter, an HK events digest and a daily X-post drafter.",
    role: "Solo project",
    highlights: [
      "Each message runs claude -p --resume as a real Claude Code session, so CLAUDE.md, memory, skills and MCP servers all work the same as on the desktop.",
      "One placeholder message per thinking cycle, edited exactly once. That avoids Telegram's edit throttle and gives a clear signal when a turn is done.",
      "Runs as a systemd user service and only answers one Telegram user ID.",
      "Scheduled Python jobs push into the same chat through a localhost endpoint: the morning brief, job sift, HK events and daily X drafts.",
    ],
    tech: ["Claude Code", "TypeScript", "Node.js", "Python", "Telegram", "systemd"],
    images: ["/claude-telegram1.svg"],
    url: "https://github.com/DylPorter/claude-telegram",
    status: "Open source · runs daily",
  },
  {
    id: "asterisk",
    title: "Asterisk",
    tagline: "Fact-checks YouTube Shorts while you watch, as a floating badge over the YouTube app.",
    description: "An agent that lives where people already spend time, not a chatbox you have to go to. An Android accessibility service reads the video's title and channel from the screen, a resolver finds the video and its captions, and an agent reads the transcript, picks the claims worth checking and returns a 1 to 5 score with sources. Built at AI Tinkerers Hong Kong, \"Agents Everywhere\".",
    role: "Hackathon project",
    highlights: [
      "The agent has seconds and three searches, so it ranks claims by whether being wrong would change how a viewer acts, and reports what it skipped.",
      "Reads only public text already on screen, the title and channel handle. No screenshots, audio or screen recording.",
      "Refuses to score what it can't check: unidentified videos, opinion content and low coverage get an honest blank instead of a confident badge.",
    ],
    tech: ["Kotlin", "Android", "Python", "FastAPI", "Gemini", "Exa"],
    images: ["/asterisk1.svg"],
    url: "https://github.com/DylPorter/asterisk",
    status: "Hackathon build · open source",
  },
];

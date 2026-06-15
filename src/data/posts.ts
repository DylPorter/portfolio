export type PostBlock =
  | { type: "h"; text: string }
  | { type: "p"; text: string };

export type Post = {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  summary: string;
  body: PostBlock[];
  repoUrl?: string;
};

export const posts: Post[] = [
  {
    slug: "building-pacl",
    title: "Building PACL: getting AI agents to coordinate without being told",
    date: "Jun 2026",
    readingTime: "4 min read",
    summary:
      "Everyone on a team runs their own AI agent now, and the context dies at every handoff. PACL is the layer I built to close that gap — and the strange part was two agents from different companies coordinating live with no rule from me.",
    repoUrl: "https://github.com/DylPorter/pacl",
    body: [
      { type: "h", text: "The problem" },
      {
        type: "p",
        text: "Everyone on a team runs their own AI agent now, and the most useful part of anyone's work — what they're actually doing, and why they're doing it that way — ends up locked inside that agent and lost the moment the work crosses over to someone else.",
      },
      {
        type: "p",
        text: "My coding agent has the full picture of my piece, a teammate's agent has theirs, and whoever handed the work out in the first place is carrying some third version of it around in their head, so nearly everything useful dies at the boundary between people. I kept running into this in real work, and eventually got annoyed enough to build something for it.",
      },
      { type: "h", text: "What PACL is" },
      {
        type: "p",
        text: "PACL is a coordination layer for teams of AI agents. The agents connect to it over MCP and report what they're working on as they go, and a central intermediary reads the whole combined picture and pushes back coordination that nobody explicitly asked for — it'll flag when two agents are about to do the same work, turn a blocker that one agent hits into a structured ticket for whoever can actually clear it, and hand a freshly-started agent the context that an earlier one already worked out.",
      },
      {
        type: "p",
        text: "There are four tools an agent can call — update intent, share context, report activity, and query — and everything they send lands in a shared markdown substrate that the intermediary reasons over.",
      },
      { type: "h", text: "The part I didn't plan for" },
      {
        type: "p",
        text: "I'd been running it in what I called agnostic mode, where the intermediary gets a single objective — keep the team coherent — along with a couple of example situations and nothing else, so there are no hardcoded rules for spotting overlaps or deciding when to escalate.",
      },
      {
        type: "p",
        text: "To see how far that would actually stretch, I pointed two agents from completely different companies at the same repo, with Claude Code on one side and Codex on the other, and one of them started adding rate limiting to a checkout file while the other asked PACL what was going on, got told that checkout was already being worked on, and decided on its own to go and pick up a different part of the code instead.",
      },
      {
        type: "p",
        text: "Two agents from two different vendors coordinating live, and I never wrote a single rule telling them to, because the model just reasoned over the shared state and worked out for itself what was worth saying.",
      },
      { type: "h", text: "What it actually is" },
      {
        type: "p",
        text: "I'll be upfront that this isn't a new protocol and I'm not going to pretend it is one, since it runs on top of MCP and a pile of plain markdown. The part I find genuinely interesting is that the coordination is proactive instead of something the agents have to go looking for — they never poll for messages, they just keep working and the layer answers back on their next tool call, piggybacked onto whatever response was already on its way out, which matters because no MCP client today does anything useful with a server that tries to push to it unprompted.",
      },
      {
        type: "p",
        text: "Underneath all of it, Gemini does the actual reasoning through the Agent Development Kit, MCP is the interface the agents speak, and Arize Phoenix traces every decision the intermediary makes, right down to it grading its own past alerts by reading back its own traces to check whether the agent it nudged actually did anything about it.",
      },
      { type: "h", text: "Where it's going" },
      {
        type: "p",
        text: "For now the substrate is just local disk and the whole thing runs single-tenant, but I was careful not to bake either of those choices into the design itself, so moving to shared storage and multiple teams should come down to a config change rather than a rewrite.",
      },
      {
        type: "p",
        text: "It's open source under AGPL, so if you've got a handful of agents tripping over each other, you can point them at it and see what comes out.",
      },
    ],
  },
];

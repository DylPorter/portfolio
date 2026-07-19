import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa6";

// Self-contained theme for this page only (fonts self-hosted via @font-face in pacl.css).
import "./pacl.css";

const REPO = "https://github.com/DylPorter/pacl";

/* ── the signature: a compact "intermediary watching the team" diagram ─────────
   Four agent nodes wired to one central PACL node. It's the product in one glance,
   which is the whole reason it's the hero and not a stock gradient blob. */
function CoordinationDiagram() {
  const nodes = [
    { x: 46, y: 40, label: "agent A", anchor: "middle", ly: 26 },
    { x: 274, y: 40, label: "agent B", anchor: "middle", ly: 26 },
    { x: 46, y: 160, label: "agent C", anchor: "middle", ly: -16 },
    { x: 274, y: 160, label: "agent D", anchor: "middle", ly: -16 },
  ];
  const cx = 160;
  const cy = 100;
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label="Four coding agents wired to a central PACL intermediary that watches all of them at once">
      {nodes.map((n) => (
        <line key={`w-${n.label}`} className="pwire" x1={cx} y1={cy} x2={n.x} y2={n.y} />
      ))}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle className="pnode" cx={n.x} cy={n.y} r="8" />
          <text className="pnode-label" x={n.x} y={n.y + n.ly} textAnchor={n.anchor}>{n.label}</text>
        </g>
      ))}
      <circle className="pcore-halo" cx={cx} cy={cy} r="26" />
      <circle className="pcore" cx={cx} cy={cy} r="26" />
      <text className="pcore-label" x={cx} y={cy - 2} textAnchor="middle">PACL</text>
      <text className="pcore-sub" x={cx} y={cy + 10} textAnchor="middle">watching</text>
    </svg>
  );
}

type FormState = "idle" | "sending" | "done" | "error";

function useWaitlist() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function submit(email: string, hp: string) {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setState("error");
      setError("That doesn't look like an email — check it and try again.");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: value, hp }),
      });
      if (!res.ok && res.status !== 409) throw new Error(String(res.status));
      setState("done");
    } catch {
      setState("error");
      setError("Couldn't reach the server — try again in a moment.");
    }
  }
  return { state, error, submit };
}

function Check({ off = false }: { off?: boolean }) {
  return off ? (
    <svg className="mk mk--no" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) : (
    <svg className="mk mk--yes" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Feature({ children, off = false, planned = false }: { children: React.ReactNode; off?: boolean; planned?: boolean }) {
  return (
    <div className={`pacl-feature${off ? " is-off" : ""}`}>
      <Check off={off} />
      <span className="fbody">
        {children}
        {planned && <span className="pacl-pill pacl-pill--planned pacl-pill--mini">Planned</span>}
      </span>
    </div>
  );
}

export function PaclLanding() {
  const { state, error, submit } = useWaitlist();
  const heroInput = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot

  useEffect(() => {
    document.title = "PACL — coordination layer for AI coding agents";
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(email, hp);
  };

  const focusHero = () => {
    heroInput.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    heroInput.current?.focus({ preventScroll: true });
  };

  return (
    <main className="pacl">
      {/* honeypot: bots fill it, humans never see it */}
      <input
        type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={hp} onChange={(e) => setHp(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      {/* top bar */}
      <div className="pacl-wrap pacl-top">
        <span className="pacl-mark"><span className="dot" />PACL</span>
        <span className="meta">AGPL-3.0 · open source</span>
      </div>

      {/* hero */}
      <section className="pacl-wrap pacl-hero">
        <div>
          <span className="eyebrow"><span className="tick" />Coordination layer for AI coding agents</span>
          <h1>Your agents don't talk to each other.<br /><span className="blue">PACL makes them.</span></h1>
          <p className="lede">
            Point a team of MCP coding agents at PACL and a central intermediary watches all of them at
            once — catching duplicate work before it happens, turning escalations into tickets, and handing
            a fresh agent the context an earlier one already built.
          </p>

          <form className="pacl-capture" onSubmit={onSubmit}>
            {state === "done" ? (
              <div className="pacl-done">
                <Check />
                <span>You're on the list. I'll email you when hosting's ready — nothing before then.</span>
              </div>
            ) : (
              <>
                <div className="pacl-field">
                  <input
                    ref={heroInput}
                    className="pacl-input"
                    type="email"
                    placeholder="you@company.com"
                    aria-label="Email address for the hosted waitlist"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="pacl-btn pacl-btn--dark" type="submit" disabled={state === "sending"}>
                    {state === "sending" ? "Joining…" : "Join the waitlist"}
                  </button>
                </div>
                {state === "error" && <span className="pacl-err">{error}</span>}
                <span className="pacl-hint">For the hosted version. Self-host is free today ↓</span>
              </>
            )}
          </form>
        </div>

        <div className="pacl-diagram">
          <div className="dhead">
            <span>Live coordination</span>
            <span className="live"><span className="pip" />Intermediary</span>
          </div>
          <CoordinationDiagram />
          <p className="dcap">
            <b>Overlap detected.</b> A and B are both about to touch <span className="code">auth/session.ts</span> —
            PACL flags it before either commits.
          </p>
        </div>
      </section>

      {/* works with */}
      <div className="pacl-rule">
        <section className="pacl-wrap pacl-works">
          <span className="eyebrow eyebrow--muted"><span className="tick" />Works with — MCP-compatible coding agents</span>
          <div className="row">
            <span>Claude Code</span>
            <span>Codex</span>
            <span>Cursor</span>
            <span>opencode</span>
            <span className="any">…any MCP client</span>
          </div>
          <p className="note">
            Compatibility, not endorsement. PACL exposes four MCP tools; anything that speaks MCP can connect.
            None of the above is affiliated with or endorsing PACL.
          </p>
        </section>
      </div>

      {/* dark band — what the intermediary does */}
      <section className="pacl-dark">
        <div className="pacl-wrap grid">
          <div>
            <span className="eyebrow eyebrow--lift"><span className="tick" />What the intermediary does</span>
            <h2 style={{ marginTop: "1.1rem" }}>One agent watches the <span className="lift">whole team</span>, and speaks up first.</h2>
          </div>
          <div className="pacl-feats">
            <div className="pacl-feat">
              <div className="ft"><span className="fdot" />Overlap detection</div>
              <p>When two agents declare intents that collide, PACL flags it live — before both write the same file twice.</p>
            </div>
            <div className="pacl-feat">
              <div className="ft"><span className="fdot" />Escalation <span className="arrow">→</span> ticket</div>
              <p>An agent that hits a wall raises it, and PACL turns the raw escalation into a structured ticket the team can act on.</p>
            </div>
            <div className="pacl-feat">
              <div className="ft"><span className="fdot" />Context handoff</div>
              <p>A newly started agent gets the context an earlier one already produced, instead of re-deriving it from scratch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* free vs hosted */}
      <section className="pacl-wrap pacl-plans">
        <span className="eyebrow eyebrow--muted"><span className="tick" />Free vs hosted</span>
        <h2 style={{ marginTop: "1rem", fontSize: "clamp(1.7rem, 3.4vw, 2.3rem)", letterSpacing: "-0.025em" }}>
          Free to self-host. Hosted when it's ready.
        </h2>
        <p className="lede">
          The free tier is everything in the repo today. The hosted tier is a waitlist — most of it isn't
          built yet, and it's marked as such.
        </p>

        <div className="pacl-cards">
          {/* FREE */}
          <div className="pacl-card">
            <div>
              <div className="kicker">Self-host · AGPL-3.0</div>
              <div className="tier" style={{ marginTop: "0.5rem" }}>
                <h3>Free</h3>
                <span className="pacl-pill pacl-pill--now">Available now</span>
              </div>
              <p className="tier-note" style={{ marginTop: "0.6rem" }}>
                Run it yourself. Clone the repo, bring your own Gemini key, run the MCP server.
              </p>
            </div>
            <a className="pacl-btn pacl-btn--ghost pacl-btn--wide" href={REPO} target="_blank" rel="noreferrer">
              <FaGithub aria-hidden="true" /> Get the repo
            </a>
            <div>
              <div className="pacl-group">
                <div className="gh">Coordination</div>
                <Feature>Four MCP tools<span className="fsub">update_intent · share_context · report_activity · query</span></Feature>
                <Feature>Live overlap detection between agents</Feature>
                <Feature>Escalation → structured ticket</Feature>
                <Feature>Context handoff to new agents</Feature>
                <Feature>Arize Phoenix self-evaluation</Feature>
              </div>
              <div className="pacl-group">
                <div className="gh">Run &amp; support</div>
                <Feature>Self-host with your own Gemini key</Feature>
                <Feature>Community support (GitHub issues)</Feature>
                <Feature off>Managed hosting — you run the server</Feature>
              </div>
            </div>
            <div className="foot">github.com/DylPorter/pacl</div>
          </div>

          {/* HOSTED */}
          <div className="pacl-card pacl-card--hosted">
            <div>
              <div className="kicker">Managed · Waitlist</div>
              <div className="tier" style={{ marginTop: "0.5rem" }}>
                <h3>Hosted</h3>
                <span className="pacl-pill pacl-pill--planned">Planned</span>
              </div>
              <p className="tier-note" style={{ marginTop: "0.6rem" }}>
                We run it — eventually. Nothing here is live yet; this page collects demand. Everything below is planned.
              </p>
            </div>
            <button className="pacl-btn pacl-btn--blue pacl-btn--wide" type="button" onClick={focusHero}>
              Join the waitlist
            </button>
            <div>
              <div className="pacl-group">
                <div className="gh">Hosting</div>
                <Feature planned>Managed hosting — no infra to run</Feature>
                <Feature planned>Higher rate limits</Feature>
                <Feature planned>Multi-tenant workspaces</Feature>
              </div>
              <div className="pacl-group">
                <div className="gh">Security &amp; ops</div>
                <Feature planned>SSO / RBAC</Feature>
                <Feature planned>Usage dashboard</Feature>
                <Feature planned>Audit logs</Feature>
              </div>
            </div>
            <div className="foot">no price yet · no card · no spam</div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="pacl-wrap pacl-foot">
        <div className="row">
          <p>
            Built by one developer. The free version is real and runs today; the hosted version is a
            waitlist for something not yet built.
          </p>
          <div className="fright">
            <a href={REPO} target="_blank" rel="noreferrer">github.com/DylPorter/pacl ↗</a>
            <a href={REPO + "/blob/main/LICENSE"} target="_blank" rel="noreferrer">AGPL-3.0</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

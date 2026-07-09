import { useEffect, useState } from "react";

/**
 * DEV-ONLY heading-serif switcher. Rewrites --font-display live so Dylan can pick
 * the display serif by eye on the real site. Loads each candidate on demand
 * (Google Fonts, or the maintained Linux-Libertine fork "Libertinus" via jsDelivr).
 * Mounted only under import.meta.env.DEV — never ships to production.
 *
 * To add a licensed font (e.g. Begum via Adobe Fonts, or a self-hosted Rapida),
 * add an entry with `preloaded: true` and load its @font-face elsewhere first.
 */
type Font = {
  label: string;
  family: string;
  /** Google Fonts css2 `family=` value; omit if loaded another way. */
  google?: string;
  /** jsDelivr @fontsource CSS URLs to inject. */
  cdn?: string[];
  /** already available (in index.html or an Adobe kit) — no injection needed. */
  preloaded?: boolean;
  note?: string;
};

const FONTS: Font[] = [
  { label: "Libertinus", family: "Libertinus Serif", preloaded: true, note: "your pick — self-hosted, size-adjusted" },
  { label: "Instrument Serif", family: "Instrument Serif", google: "Instrument+Serif:ital@0;1", note: "high-contrast, single-weight — elegant + thin" },
  { label: "Newsreader", family: "Newsreader", google: "Newsreader:opsz,ital,wght@6..72,0,400;6..72,0,500;6..72,0,600;6..72,1,400", note: "literary, weighted" },
  { label: "Merriweather", family: "Merriweather", google: "Merriweather:ital,wght@0,400;0,700;0,900;1,400", note: "classic newspaper" },
  { label: "Playfair Display", family: "Playfair Display", google: "Playfair+Display:ital,wght@0,400..900;1,400..700", note: "high-contrast display" },
  { label: "Spectral", family: "Spectral", google: "Spectral:ital,wght@0,400;0,500;0,700;1,400", note: "calm, readable" },
  { label: "Fraunces (old)", family: "Fraunces", google: "Fraunces:opsz,wght@9..144,400..700", note: "the previous font, for reference" },
];

const FALLBACK = `"Fraunces", Georgia, "Times New Roman", serif`;
const STORE_KEY = "dev-serif";
const loaded = new Set<string>();

function inject(href: string) {
  if (loaded.has(href)) return;
  loaded.add(href);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadFont(f: Font) {
  if (f.preloaded) return;
  if (f.google) inject(`https://fonts.googleapis.com/css2?family=${f.google}&display=swap`);
  f.cdn?.forEach(inject);
}

function apply(f: Font) {
  loadFont(f);
  document.documentElement.style.setProperty("--font-display", `"${f.family}", ${FALLBACK}`);
}

export function FontSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(() => localStorage.getItem(STORE_KEY) ?? "Libertinus Serif");

  // Re-apply the saved choice on mount (and preload any non-default choice).
  useEffect(() => {
    const f = FONTS.find((x) => x.family === active);
    if (f) apply(f);
  }, [active]);

  const pick = (f: Font) => {
    setActive(f.family);
    localStorage.setItem(STORE_KEY, f.family);
    apply(f);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        bottom: 12,
        zIndex: 9999,
        fontFamily: "ui-monospace, monospace",
        fontSize: 12,
      }}
    >
      {open && (
        <div
          style={{
            marginBottom: 8,
            padding: 6,
            borderRadius: 12,
            background: "var(--btn-face)",
            border: "1px solid var(--btn-border)",
            boxShadow: "0 12px 32px -12px rgba(0,0,0,.5)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 210,
          }}
        >
          {FONTS.map((f) => {
            const on = f.family === active;
            return (
              <button
                key={f.family}
                onClick={() => pick(f)}
                title={f.note}
                style={{
                  textAlign: "left",
                  padding: "7px 9px",
                  borderRadius: 8,
                  border: "1px solid transparent",
                  background: on ? "color-mix(in srgb, var(--accent) 16%, transparent)" : "transparent",
                  color: "var(--ink)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <span style={{ fontFamily: `"${f.family}", ${FALLBACK}`, fontSize: 16 }}>{f.label}</span>
                <span style={{ color: "var(--body)", fontSize: 10 }}>{f.note}</span>
              </button>
            );
          })}
          <span style={{ color: "var(--body)", fontSize: 10, padding: "4px 9px 2px" }}>
            dev only · Begum/Rapida need a licence
          </span>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          padding: "6px 11px",
          borderRadius: 999,
          background: "var(--btn-face)",
          border: "1px solid var(--btn-border)",
          color: "var(--ink)",
          cursor: "pointer",
          boxShadow: "0 6px 18px -8px rgba(0,0,0,.5)",
        }}
      >
        Aa <span style={{ color: "var(--body)" }}>{active}</span>
      </button>
    </div>
  );
}

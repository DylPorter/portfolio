import { useEffect, useState } from "react";
import { LuTriangleAlert, LuCopy, LuDownload } from "react-icons/lu";
import { Modal } from "../components/Modal";
import type { Card as CardT } from "./api";
import { saveCardBody, ConflictError, relativeTime } from "./api";

export function CardDetail({
  card,
  onClose,
  onSaved,
}: {
  card: CardT;
  onClose: () => void;
  onSaved: (updated: CardT) => void;
}) {
  const [draft, setDraft] = useState(card.body);
  const [version, setVersion] = useState(card.version);
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState<CardT | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Re-seed the draft only when opening a different card (not on every re-render).
  useEffect(() => {
    setDraft(card.body);
    setVersion(card.version);
    setConflict(null);
    setSavedAt(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);

  async function save() {
    setSaving(true);
    setConflict(null);
    try {
      const updated = await saveCardBody(card.id, draft, version);
      setVersion(updated.version);
      setSavedAt(Date.now());
      onSaved(updated);
    } catch (err) {
      if (err instanceof ConflictError) {
        // Do NOT discard the user's draft — surface the banner + keep their text.
        setConflict(err.current);
      } else {
        throw err;
      }
    } finally {
      setSaving(false);
    }
  }

  async function copyMyChanges() {
    try {
      await navigator.clipboard.writeText(draft);
    } catch {
      /* clipboard may be unavailable; nothing else to do */
    }
  }

  function loadLatest() {
    if (!conflict) return;
    setDraft(conflict.body);
    setVersion(conflict.version);
    setConflict(null);
  }

  return (
    <Modal open onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow">Brainstorm card</span>
          <h2 className="serif text-2xl font-semibold text-[var(--ink)]">{card.title}</h2>
          <span className="text-xs text-neutral-500">
            {card.author ? `${card.author} · ` : ""}updated {relativeTime(card.updated_at)}
          </span>
        </div>

        {conflict && (
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
              <LuTriangleAlert size={16} className="text-[var(--accent)]" />
              Someone else edited this card.
            </div>
            <p className="text-xs text-[var(--body)] leading-relaxed">
              Your changes are still here in the box below. Copy them somewhere safe, or load the latest
              version and re-apply your edits.
            </p>
            <div className="flex items-center gap-2">
              <button onClick={copyMyChanges} className="btn-chunky text-xs">
                <span className="btn-ico">
                  <LuCopy size={13} />
                </span>
                Copy my changes
              </button>
              <button onClick={loadLatest} className="btn-chunky text-xs">
                <span className="btn-ico">
                  <LuDownload size={13} />
                </span>
                Load latest
              </button>
            </div>
          </div>
        )}

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={10}
          placeholder="Flesh out the idea — mechanics, vibe, why it slaps…"
          className="w-full resize-y rounded-xl border border-[var(--section-border)] bg-white/60 dark:bg-neutral-900/60 px-4 py-3 text-sm text-[var(--ink)] leading-relaxed outline-none focus:border-[var(--accent)]"
        />

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="btn-chunky text-sm disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
          {savedAt && !conflict && <span className="text-xs text-neutral-500">Saved.</span>}
          <button onClick={onClose} className="text-sm text-neutral-500 hover:text-[var(--ink)] ml-auto">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

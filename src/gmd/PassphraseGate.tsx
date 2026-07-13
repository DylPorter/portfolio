import { useState } from "react";
import { LuLock } from "react-icons/lu";
import { authenticate } from "./api";

export function PassphraseGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const ok = await authenticate(value);
    setBusy(false);
    if (ok) onUnlock();
    else {
      setError(true);
      setValue("");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <form onSubmit={submit} className="card p-8 md:p-10 w-full max-w-sm flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="eyebrow flex items-center gap-1.5">
            <LuLock size={13} /> Members only
          </span>
          <h1 className="serif text-3xl font-semibold text-[var(--ink)]">GMD Studios</h1>
          <p className="text-sm text-[var(--body)] leading-relaxed">
            The war room where we cook up games. Say the magic word.
          </p>
        </div>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Passphrase"
          className={`w-full rounded-xl border bg-white/60 dark:bg-neutral-900/60 px-4 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] ${
            error ? "border-red-400" : "border-[var(--section-border)]"
          }`}
        />
        {error && <span className="text-xs text-red-500 -mt-2">Nope. Try again.</span>}
        <button type="submit" disabled={busy || !value} className="btn-chunky text-sm disabled:opacity-50">
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

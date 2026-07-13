import { useCallback, useEffect, useRef, useState } from "react";
import type { Board as BoardT, Card as CardT, Column as ColumnT } from "./api";
import {
  checkSession,
  fetchBoard,
  createColumn,
  patchColumn,
  deleteColumn,
  createCard,
  patchCard,
  deleteCard,
} from "./api";
import { PassphraseGate } from "./PassphraseGate";
import { Board } from "./Board";
import { CardDetail } from "./CardDetail";

const POLL_MS = 4000;

export function GmdStudios() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [board, setBoard] = useState<BoardT | null>(null);
  const [openCard, setOpenCard] = useState<CardT | null>(null);
  const [author, setAuthor] = useState<string>(() => localStorage.getItem("gmd_author") || "");

  // Keep the open-card flag in a ref so the poll effect can read it without
  // re-subscribing every time a card opens/closes.
  const openRef = useRef(false);
  openRef.current = openCard !== null;

  const load = useCallback(async () => {
    try {
      const b = await fetchBoard();
      setBoard(b);
    } catch {
      // A 401 mid-session means the cookie lapsed — bounce back to the gate.
      setAuthed(false);
    }
  }, []);

  // Initial session check.
  useEffect(() => {
    checkSession().then(setAuthed);
  }, []);

  // First load once authed.
  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  // Poll every 4s, paused while the CardDetail panel is open.
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => {
      if (!openRef.current) load();
    }, POLL_MS);
    return () => clearInterval(t);
  }, [authed, load]);

  // Prompt once for a display name if unset.
  useEffect(() => {
    if (authed && !author) {
      const name = window.prompt("What's your name? (shown on cards you create)")?.trim();
      if (name) {
        localStorage.setItem("gmd_author", name);
        setAuthor(name);
      }
    }
  }, [authed, author]);

  // ── Optimistic mutators ──
  function patchLocalCard(id: string, patch: Partial<CardT>) {
    setBoard((b) => (b ? { ...b, cards: b.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) } : b));
  }

  const onAddCard = async (columnId: string, title: string) => {
    const card = await createCard(columnId, title, author);
    setBoard((b) => (b ? { ...b, cards: [...b.cards, card] } : b));
  };

  const onDeleteCard = async (card: CardT) => {
    setBoard((b) => (b ? { ...b, cards: b.cards.filter((c) => c.id !== card.id) } : b));
    await deleteCard(card.id).catch(() => load());
  };

  const onAddColumn = async () => {
    const title = window.prompt("New game idea (column title):")?.trim();
    if (!title) return;
    const col = await createColumn(title);
    setBoard((b) => (b ? { ...b, columns: [...b.columns, col] } : b));
  };

  const onDeleteColumn = async (column: ColumnT) => {
    if (!window.confirm(`Delete "${column.title}" and all its cards?`)) return;
    setBoard((b) =>
      b
        ? { ...b, columns: b.columns.filter((c) => c.id !== column.id), cards: b.cards.filter((c) => c.column_id !== column.id) }
        : b,
    );
    await deleteColumn(column.id).catch(() => load());
  };

  const onRenameColumn = async (column: ColumnT, title: string) => {
    setBoard((b) => (b ? { ...b, columns: b.columns.map((c) => (c.id === column.id ? { ...c, title } : c)) } : b));
    await patchColumn(column.id, { title }).catch(() => load());
  };

  const onPersistCardMove = async (cardId: string, columnId: string, position: number) => {
    patchLocalCard(cardId, { column_id: columnId, position });
    await patchCard(cardId, { column_id: columnId, position }).catch(() => load());
  };

  const onPersistColumnMove = async (columnId: string, position: number) => {
    setBoard((b) => (b ? { ...b, columns: b.columns.map((c) => (c.id === columnId ? { ...c, position } : c)) } : b));
    await patchColumn(columnId, { position }).catch(() => load());
  };

  const onToggleCardDone = async (card: CardT) => {
    const done = card.done === 1 ? 0 : 1;
    patchLocalCard(card.id, { done });
    await patchCard(card.id, { done: done === 1 }).catch(() => load());
  };

  const onCardSaved = (updated: CardT) => {
    patchLocalCard(updated.id, updated);
    setOpenCard(updated);
  };

  if (authed === null) {
    return <div className="min-h-[70vh] flex items-center justify-center text-sm text-neutral-500">Loading…</div>;
  }
  if (!authed) {
    return <PassphraseGate onUnlock={() => setAuthed(true)} />;
  }

  return (
    <main className="w-full max-w-[100rem] mx-auto px-6 md:px-8 py-10 md:py-14 flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <span className="eyebrow">✦ The war room</span>
        <h1 className="serif text-4xl font-semibold text-[var(--ink)] tracking-[-0.02em]">GMD Studios</h1>
        <p className="text-sm text-[var(--body)] max-w-xl leading-relaxed">
          Every column is a game idea. Every card is a spark. Drag to shuffle, click a card to flesh it out.
        </p>
      </header>

      {board ? (
        <Board
          board={board}
          onOpenCard={setOpenCard}
          onDeleteCard={onDeleteCard}
          onToggleCardDone={onToggleCardDone}
          onAddCard={onAddCard}
          onAddColumn={onAddColumn}
          onDeleteColumn={onDeleteColumn}
          onRenameColumn={onRenameColumn}
          onPersistCardMove={onPersistCardMove}
          onPersistColumnMove={onPersistColumnMove}
        />
      ) : (
        <div className="text-sm text-neutral-500">Loading board…</div>
      )}

      {openCard && (
        <CardDetail
          card={openCard}
          onClose={() => {
            setOpenCard(null);
            load(); // resume + refetch on close
          }}
          onSaved={onCardSaved}
        />
      )}
    </main>
  );
}

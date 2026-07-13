import { useState } from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuTrash2, LuPlus, LuGripVertical } from "react-icons/lu";
import type { Card as CardT, Column as ColumnT } from "./api";
import { Card } from "./Card";

export function Column({
  column,
  cards,
  onOpenCard,
  onDeleteCard,
  onToggleCardDone,
  onAddCard,
  onDeleteColumn,
  onRenameColumn,
}: {
  column: ColumnT;
  cards: CardT[];
  onOpenCard: (card: CardT) => void;
  onDeleteCard: (card: CardT) => void;
  onToggleCardDone: (card: CardT) => void;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteColumn: (column: ColumnT) => void;
  onRenameColumn: (column: ColumnT, title: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: "column" },
  });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function submitCard() {
    const t = draft.trim();
    if (t) onAddCard(column.id, t);
    setDraft("");
    setAdding(false);
  }

  function submitTitle() {
    const t = titleDraft.trim();
    if (t && t !== column.title) onRenameColumn(column, t);
    else setTitleDraft(column.title);
    setEditingTitle(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-3 w-72 shrink-0 rounded-2xl bg-[var(--section-alt)] border border-[var(--section-border)] p-3"
    >
      <div className="flex items-center gap-2 px-1">
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag column"
          className="text-neutral-400 dark:text-neutral-600 hover:text-[var(--accent)] cursor-grab active:cursor-grabbing touch-none transition-colors"
        >
          <LuGripVertical size={16} />
        </button>
        {editingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={submitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitTitle();
              if (e.key === "Escape") {
                setTitleDraft(column.title);
                setEditingTitle(false);
              }
            }}
            className="flex-1 bg-transparent border-b border-[var(--accent)] serif text-lg font-semibold text-[var(--ink)] outline-none"
          />
        ) : (
          <button
            onClick={() => {
              setTitleDraft(column.title);
              setEditingTitle(true);
            }}
            className="flex-1 text-left serif text-lg font-semibold text-[var(--ink)] truncate"
          >
            {column.title}
          </button>
        )}
        <span className="text-xs text-neutral-500 tabular-nums">{cards.length}</span>
        <button
          onClick={() => onDeleteColumn(column)}
          aria-label="Delete column"
          className="text-neutral-400 hover:text-[var(--accent)] transition-colors"
        >
          <LuTrash2 size={14} />
        </button>
      </div>

      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2.5 min-h-[8px]">
          {cards.map((card) => (
            <Card key={card.id} card={card} onOpen={onOpenCard} onDelete={onDeleteCard} onToggleDone={onToggleCardDone} />
          ))}
        </div>
      </SortableContext>

      {adding ? (
        <div className="flex flex-col gap-2">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitCard();
              }
              if (e.key === "Escape") {
                setDraft("");
                setAdding(false);
              }
            }}
            placeholder="Idea title…"
            rows={2}
            className="w-full resize-none rounded-lg border border-[var(--section-border)] bg-white/60 dark:bg-neutral-900/60 px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
          />
          <div className="flex items-center gap-2">
            <button onClick={submitCard} className="btn-chunky text-xs">
              Add
            </button>
            <button
              onClick={() => {
                setDraft("");
                setAdding(false);
              }}
              className="text-xs text-neutral-500 hover:text-[var(--ink)]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-1 py-1.5 text-sm text-neutral-500 hover:text-[var(--accent)] transition-colors"
        >
          <LuPlus size={15} /> Add card
        </button>
      )}
    </div>
  );
}

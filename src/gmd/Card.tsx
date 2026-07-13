import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuTrash2, LuGripVertical, LuCheck } from "react-icons/lu";
import type { Card as CardT } from "./api";
import { relativeTime } from "./api";

export function Card({
  card,
  onOpen,
  onDelete,
  onToggleDone,
}: {
  card: CardT;
  onOpen: (card: CardT) => void;
  onDelete: (card: CardT) => void;
  onToggleDone: (card: CardT) => void;
}) {
  const done = card.done === 1;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "card", columnId: card.column_id },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onOpen(card)}
      className={
        "group card card-interactive p-3.5 flex flex-col gap-2 text-left transition-colors " +
        (done
          ? "!bg-emerald-50 dark:!bg-emerald-950/40 !border-emerald-300 dark:!border-emerald-800"
          : "")
      }
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag card"
          className="mt-0.5 text-neutral-400 dark:text-neutral-600 hover:text-[var(--accent)] cursor-grab active:cursor-grabbing touch-none transition-colors"
        >
          <LuGripVertical size={15} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone(card);
          }}
          aria-label={done ? "Mark not finished" : "Mark finished"}
          aria-pressed={done}
          className={
            "mt-0.5 grid place-items-center w-[17px] h-[17px] rounded-[5px] border transition-colors shrink-0 " +
            (done
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-neutral-300 dark:border-neutral-600 text-transparent hover:border-emerald-400")
          }
        >
          <LuCheck size={12} strokeWidth={3} />
        </button>
        <span
          className={
            "serif text-base font-semibold leading-snug flex-1 " +
            (done ? "text-[var(--ink)]/70 line-through decoration-emerald-500/60" : "text-[var(--ink)]")
          }
        >
          {card.title}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card);
          }}
          aria-label="Delete card"
          className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-[var(--accent)] transition-all"
        >
          <LuTrash2 size={14} />
        </button>
      </div>
      {card.body.trim() && (
        <p className="text-xs text-[var(--body)] leading-relaxed line-clamp-2 pl-6">{card.body.trim()}</p>
      )}
      <div className="flex items-center gap-2 pl-6 text-[11px] text-neutral-500">
        {card.author && <span className="font-medium text-[var(--body)]">{card.author}</span>}
        {card.author && <span className="text-[var(--role-dot)]">·</span>}
        <span>{relativeTime(card.updated_at)}</span>
      </div>
    </div>
  );
}

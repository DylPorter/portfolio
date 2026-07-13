import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { Board as BoardT, Card as CardT, Column as ColumnT } from "./api";
import { positionBetween } from "./api";
import { Column } from "./Column";

// Sort helpers — props arrive already ordered, but we re-sort defensively.
const byPos = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

export function Board({
  board,
  onOpenCard,
  onDeleteCard,
  onToggleCardDone,
  onAddCard,
  onAddColumn,
  onDeleteColumn,
  onRenameColumn,
  onPersistCardMove,
  onPersistColumnMove,
}: {
  board: BoardT;
  onOpenCard: (card: CardT) => void;
  onDeleteCard: (card: CardT) => void;
  onToggleCardDone: (card: CardT) => void;
  onAddCard: (columnId: string, title: string) => void;
  onAddColumn: () => void;
  onDeleteColumn: (column: ColumnT) => void;
  onRenameColumn: (column: ColumnT, title: string) => void;
  onPersistCardMove: (cardId: string, columnId: string, position: number) => void;
  onPersistColumnMove: (columnId: string, position: number) => void;
}) {
  // Local mirror for smooth optimistic dragging; re-synced from props whenever
  // they change (and we're not mid-drag).
  const [columns, setColumns] = useState<ColumnT[]>(() => [...board.columns].sort(byPos));
  const [cards, setCards] = useState<CardT[]>(() => [...board.cards].sort(byPos));
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (activeId) return; // don't clobber an in-flight drag
    setColumns([...board.columns].sort(byPos));
    setCards([...board.cards].sort(byPos));
  }, [board, activeId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const cardsByColumn = useMemo(() => {
    const map = new Map<string, CardT[]>();
    for (const col of columns) map.set(col.id, []);
    for (const card of cards) {
      if (!map.has(card.column_id)) map.set(card.column_id, []);
      map.get(card.column_id)!.push(card);
    }
    return map;
  }, [columns, cards]);

  const isColumn = (id: string) => columns.some((c) => c.id === id);

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    if (activeIdStr === overIdStr) return;
    if (active.data.current?.type !== "card") return; // column reordering handled on drag end

    setCards((prev) => {
      const activeCard = prev.find((c) => c.id === activeIdStr);
      if (!activeCard) return prev;
      // Target column: dropping over a column shell, or over another card.
      const overIsColumn = isColumn(overIdStr);
      const targetColumn = overIsColumn ? overIdStr : prev.find((c) => c.id === overIdStr)?.column_id;
      if (!targetColumn) return prev;

      const next = prev.filter((c) => c.id !== activeIdStr);
      const moved = { ...activeCard, column_id: targetColumn };
      if (overIsColumn) {
        next.push(moved); // append to end of the column shell
      } else {
        const overIndex = next.findIndex((c) => c.id === overIdStr);
        next.splice(overIndex, 0, moved);
      }
      return next;
    });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    // ── Column reorder ──
    if (active.data.current?.type === "column") {
      if (activeIdStr === overIdStr) return;
      const oldIndex = columns.findIndex((c) => c.id === activeIdStr);
      const newIndex = columns.findIndex((c) => c.id === overIdStr);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(columns, oldIndex, newIndex);
      setColumns(reordered);
      const pos = neighborPosition(reordered, activeIdStr);
      onPersistColumnMove(activeIdStr, pos);
      return;
    }

    // ── Card move / reorder ──
    // Final ordering already reflected in `cards` via onDragOver; also apply a
    // within-column reorder if we dropped over a sibling card.
    setCards((prev) => {
      const activeCard = prev.find((c) => c.id === activeIdStr);
      if (!activeCard) return prev;
      let next = prev;
      if (!isColumn(overIdStr) && activeIdStr !== overIdStr) {
        const oldIndex = prev.findIndex((c) => c.id === activeIdStr);
        const newIndex = prev.findIndex((c) => c.id === overIdStr);
        if (oldIndex !== -1 && newIndex !== -1) next = arrayMove(prev, oldIndex, newIndex);
      }
      const columnCards = next.filter((c) => c.column_id === activeCard.column_id);
      const pos = neighborPosition(columnCards, activeIdStr);
      onPersistCardMove(activeIdStr, activeCard.column_id, pos);
      return next;
    });
  }

  const orderedColumns = columns;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 items-start overflow-x-auto pb-4">
        <SortableContext items={orderedColumns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
          {orderedColumns.map((col) => (
            <Column
              key={col.id}
              column={col}
              cards={cardsByColumn.get(col.id) ?? []}
              onOpenCard={onOpenCard}
              onDeleteCard={onDeleteCard}
              onToggleCardDone={onToggleCardDone}
              onAddCard={onAddCard}
              onDeleteColumn={onDeleteColumn}
              onRenameColumn={onRenameColumn}
            />
          ))}
        </SortableContext>
        <button
          onClick={onAddColumn}
          className="shrink-0 w-72 rounded-2xl border border-dashed border-[var(--section-border)] px-4 py-3 text-sm text-neutral-500 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors text-left"
        >
          + Add column
        </button>
      </div>
    </DndContext>
  );
}

// Compute a fractional position for `id` from its neighbours in an ordered list.
function neighborPosition<T extends { id: string; position: number }>(ordered: T[], id: string): number {
  const idx = ordered.findIndex((x) => x.id === id);
  if (idx === -1) return positionBetween(null, null);
  const before = idx > 0 ? ordered[idx - 1].position : null;
  const after = idx < ordered.length - 1 ? ordered[idx + 1].position : null;
  // Neighbours may still carry stale positions (they haven't been re-fetched),
  // which is fine: positionBetween only needs their relative order.
  return positionBetween(before, after);
}

// Pure, dependency-free helpers for the GMD kanban worker.
// Isolated here so the position math and the optimistic-concurrency decision
// (the only two things that can silently corrupt/lose data) are unit-testable.

export const POSITION_GAP = 1000;

/**
 * Compute a fractional position for an item being inserted relative to its
 * neighbours in an ordered list.
 *
 * - `before` is the position of the item that will sit ABOVE/LEFT of the new
 *   item (i.e. the smaller neighbour), or null if inserting at the very top.
 * - `after` is the position of the item that will sit BELOW/RIGHT of the new
 *   item (i.e. the larger neighbour), or null if inserting at the very end.
 *
 * Between two neighbours => midpoint. At the top => half the first position (or
 * firstPos - GAP if that would be non-positive). At the end => last + GAP.
 * Empty list => GAP.
 */
export function positionBetween(before: number | null, after: number | null): number {
  if (before === null && after === null) return POSITION_GAP;
  if (before === null) {
    // Inserting at the top: go below the first item.
    const first = after as number;
    const half = first / 2;
    return half > 0 ? half : first - POSITION_GAP;
  }
  if (after === null) {
    // Inserting at the end: above the last item.
    return before + POSITION_GAP;
  }
  return (before + after) / 2;
}

/** Position for a brand-new item appended to the end of a list. */
export function appendPosition(maxPosition: number | null): number {
  return maxPosition === null ? POSITION_GAP : maxPosition + POSITION_GAP;
}

/**
 * Decide the outcome of a version-checked body update.
 * `rowsAffected` is the number of rows the guarded UPDATE touched
 * (UPDATE ... WHERE id=? AND version=?). 0 => stale => 409.
 */
export function isStaleUpdate(rowsAffected: number): boolean {
  return rowsAffected === 0;
}

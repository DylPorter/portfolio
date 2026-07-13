import { describe, it, expect } from "vitest";
import { positionBetween, appendPosition, isStaleUpdate, POSITION_GAP } from "./logic";

describe("appendPosition", () => {
  it("returns the gap for an empty list", () => {
    expect(appendPosition(null)).toBe(POSITION_GAP);
  });
  it("adds the gap past the current max", () => {
    expect(appendPosition(3000)).toBe(4000);
  });
});

describe("positionBetween", () => {
  it("returns the gap for an empty list", () => {
    expect(positionBetween(null, null)).toBe(POSITION_GAP);
  });
  it("computes the midpoint between two neighbours", () => {
    expect(positionBetween(1000, 2000)).toBe(1500);
  });
  it("halves the first position when inserting at the top", () => {
    expect(positionBetween(null, 1000)).toBe(500);
  });
  it("falls back to first - gap at the top when halving would be non-positive", () => {
    // A degenerate tiny first position: half would round toward collision risk,
    // and a non-positive half must fall back to first - GAP.
    expect(positionBetween(null, -500)).toBe(-1500);
  });
  it("appends a gap past the last position when inserting at the end", () => {
    expect(positionBetween(3000, null)).toBe(4000);
  });
  it("stays strictly between neighbours after repeated subdivision", () => {
    let lo = 1000;
    const hi = 2000;
    for (let i = 0; i < 5; i++) {
      const mid = positionBetween(lo, hi);
      expect(mid).toBeGreaterThan(lo);
      expect(mid).toBeLessThan(hi);
      lo = mid;
    }
  });
});

describe("isStaleUpdate", () => {
  it("flags a 0-row update as stale (=> 409)", () => {
    expect(isStaleUpdate(0)).toBe(true);
  });
  it("treats a 1-row update as fresh", () => {
    expect(isStaleUpdate(1)).toBe(false);
  });
});

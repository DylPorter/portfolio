// Typed fetch wrappers for the GMD Studios kanban Worker API.
// All requests are same-origin and rely on the httpOnly session cookie, so we
// send `credentials: "include"` everywhere.

export interface Column {
  id: string;
  title: string;
  position: number;
  created_at: number;
}

export interface Card {
  id: string;
  column_id: string;
  title: string;
  author: string;
  body: string;
  position: number;
  version: number;
  done: number;
  created_at: number;
  updated_at: number;
}

export interface Board {
  columns: Column[];
  cards: Card[];
}

// Thrown on a 409 body-save conflict — carries the server's current card so the
// UI can offer "Load latest" without a second round-trip.
export class ConflictError extends Error {
  current: Card;
  constructor(current: Card) {
    super("conflict");
    this.name = "ConflictError";
    this.current = current;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: init?.body ? { "content-type": "application/json" } : undefined,
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function checkSession(): Promise<boolean> {
  const res = await fetch("/api/session", { credentials: "include" });
  return res.ok;
}

export async function authenticate(passphrase: string): Promise<boolean> {
  const res = await fetch("/api/auth", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ passphrase }),
  });
  return res.ok;
}

export function fetchBoard(): Promise<Board> {
  return req<Board>("/api/board");
}

export function createColumn(title: string): Promise<Column> {
  return req<Column>("/api/columns", { method: "POST", body: JSON.stringify({ title }) });
}

export function patchColumn(id: string, patch: { title?: string; position?: number }): Promise<Column> {
  return req<Column>(`/api/columns/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export function deleteColumn(id: string): Promise<{ ok: true }> {
  return req(`/api/columns/${id}`, { method: "DELETE" });
}

export function createCard(column_id: string, title: string, author: string): Promise<Card> {
  return req<Card>("/api/cards", { method: "POST", body: JSON.stringify({ column_id, title, author }) });
}

export function patchCard(
  id: string,
  patch: { column_id?: string; position?: number; title?: string; author?: string; done?: boolean },
): Promise<Card> {
  return req<Card>(`/api/cards/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function saveCardBody(id: string, body: string, version: number): Promise<Card> {
  const res = await fetch(`/api/cards/${id}/body`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ body, version }),
  });
  const data = (await res.json()) as Card;
  if (res.status === 409) throw new ConflictError(data);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return data;
}

export function deleteCard(id: string): Promise<{ ok: true }> {
  return req(`/api/cards/${id}`, { method: "DELETE" });
}

// Fractional midpoint for a client-computed drop position. Mirrors the worker's
// positionBetween so the optimistic UI matches what the server would store.
export function positionBetween(before: number | null, after: number | null): number {
  if (before === null && after === null) return 1000;
  if (before === null) {
    const first = after as number;
    const half = first / 2;
    return half > 0 ? half : first - 1000;
  }
  if (after === null) return before + 1000;
  return (before + after) / 2;
}

// Human-friendly relative timestamp ("3m ago", "2h ago", "just now").
export function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const s = Math.floor(diff / 1000);
  if (s < 45) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ms).toLocaleDateString();
}

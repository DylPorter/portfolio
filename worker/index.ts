/// <reference types="@cloudflare/workers-types" />

// GMD Studios kanban backend. Dependency-free: plain Web APIs + D1.
// Everything under /api/* is handled here; everything else falls through to the
// static SPA (env.ASSETS). See worker/README.md for deploy steps.

import { appendPosition, positionBetween, isStaleUpdate } from "./logic";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  BOARD_PASSPHRASE?: string;
  SESSION_SECRET?: string;
}

interface ColumnRow {
  id: string;
  title: string;
  position: number;
  created_at: number;
}

interface CardRow {
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

// Constant token we sign into the session cookie. Value: `${TOKEN}.${sigHex}`.
const SESSION_TOKEN = "gmd";
const COOKIE_NAME = "gmd_session";
const COOKIE_MAX_AGE = 2592000; // 30 days

const SEED_COLUMNS: Array<{ title: string; position: number }> = [
  { title: "Spin a Lapupu", position: 1000 },
  { title: "Toe Cleaning Simulator", position: 2000 },
  { title: "Jew Game", position: 3000 },
];

function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

// ── Auth: HMAC-SHA256 sign/verify a constant token ─────────────────────────
async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function makeCookieValue(env: Env): Promise<string> {
  const secret = env.SESSION_SECRET || "dev-secret";
  const sig = await hmacHex(secret, SESSION_TOKEN);
  return `${SESSION_TOKEN}.${sig}`;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

async function isAuthed(request: Request, env: Env): Promise<boolean> {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;
  const value = match.slice(COOKIE_NAME.length + 1);
  const [token, sig] = value.split(".");
  if (token !== SESSION_TOKEN || !sig) return false;
  const expected = await hmacHex(env.SESSION_SECRET || "dev-secret", SESSION_TOKEN);
  return timingSafeEqual(sig, expected);
}

// ── Seeding ─────────────────────────────────────────────────────────────────
async function ensureSeeded(env: Env): Promise<void> {
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM columns").first<{ n: number }>();
  if (row && row.n > 0) return;
  const now = Date.now();
  const stmts = SEED_COLUMNS.map((c) =>
    env.DB.prepare("INSERT INTO columns (id, title, position, created_at) VALUES (?, ?, ?, ?)").bind(
      crypto.randomUUID(),
      c.title,
      c.position,
      now,
    ),
  );
  await env.DB.batch(stmts);
}

// ── Route handlers ────────────────────────────────────────────────────────────
async function handleAuth(request: Request, env: Env): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as { passphrase?: string };
  const expected = env.BOARD_PASSPHRASE || "jaysanhater";
  if (!body.passphrase || body.passphrase !== expected) {
    return json({ error: "invalid passphrase" }, 401);
  }
  const cookieValue = await makeCookieValue(env);
  return json(
    { ok: true },
    200,
    {
      "set-cookie": `${COOKIE_NAME}=${cookieValue}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${COOKIE_MAX_AGE}`,
    },
  );
}

async function getBoard(env: Env): Promise<Response> {
  await ensureSeeded(env);
  const columns = await env.DB.prepare("SELECT * FROM columns ORDER BY position ASC").all<ColumnRow>();
  const cards = await env.DB.prepare("SELECT * FROM cards ORDER BY position ASC").all<CardRow>();
  return json({ columns: columns.results, cards: cards.results });
}

async function createColumn(request: Request, env: Env): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as { title?: string };
  const title = (body.title || "").trim();
  if (!title) return json({ error: "title required" }, 400);
  const max = await env.DB.prepare("SELECT MAX(position) AS m FROM columns").first<{ m: number | null }>();
  const position = appendPosition(max?.m ?? null);
  const id = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare("INSERT INTO columns (id, title, position, created_at) VALUES (?, ?, ?, ?)")
    .bind(id, title, position, now)
    .run();
  return json({ id, title, position, created_at: now } satisfies ColumnRow, 201);
}

async function patchColumn(request: Request, env: Env, id: string): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as { title?: string; position?: number };
  const existing = await env.DB.prepare("SELECT * FROM columns WHERE id = ?").bind(id).first<ColumnRow>();
  if (!existing) return json({ error: "not found" }, 404);
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : existing.title;
  const position = typeof body.position === "number" ? body.position : existing.position;
  await env.DB.prepare("UPDATE columns SET title = ?, position = ? WHERE id = ?")
    .bind(title, position, id)
    .run();
  return json({ ...existing, title, position });
}

async function deleteColumn(env: Env, id: string): Promise<Response> {
  // Cascade manually — ON DELETE CASCADE requires PRAGMA foreign_keys which D1
  // does not enable per-statement, so delete cards explicitly.
  await env.DB.batch([
    env.DB.prepare("DELETE FROM cards WHERE column_id = ?").bind(id),
    env.DB.prepare("DELETE FROM columns WHERE id = ?").bind(id),
  ]);
  return json({ ok: true });
}

async function createCard(request: Request, env: Env): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as {
    column_id?: string;
    title?: string;
    author?: string;
  };
  const columnId = (body.column_id || "").trim();
  const title = (body.title || "").trim();
  if (!columnId || !title) return json({ error: "column_id and title required" }, 400);
  const col = await env.DB.prepare("SELECT id FROM columns WHERE id = ?").bind(columnId).first();
  if (!col) return json({ error: "column not found" }, 404);
  const max = await env.DB.prepare("SELECT MAX(position) AS m FROM cards WHERE column_id = ?")
    .bind(columnId)
    .first<{ m: number | null }>();
  const position = appendPosition(max?.m ?? null);
  const id = crypto.randomUUID();
  const now = Date.now();
  const author = (body.author || "").trim();
  await env.DB.prepare(
    "INSERT INTO cards (id, column_id, title, author, body, position, version, created_at, updated_at) VALUES (?, ?, ?, ?, '', ?, 1, ?, ?)",
  )
    .bind(id, columnId, title, author, position, now, now)
    .run();
  const card: CardRow = {
    id,
    column_id: columnId,
    title,
    author,
    body: "",
    position,
    version: 1,
    done: 0,
    created_at: now,
    updated_at: now,
  };
  return json(card, 201);
}

async function patchCard(request: Request, env: Env, id: string): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as {
    column_id?: string;
    position?: number;
    title?: string;
    author?: string;
    done?: boolean;
  };
  const existing = await env.DB.prepare("SELECT * FROM cards WHERE id = ?").bind(id).first<CardRow>();
  if (!existing) return json({ error: "not found" }, 404);
  const columnId = typeof body.column_id === "string" && body.column_id.trim() ? body.column_id.trim() : existing.column_id;
  const position = typeof body.position === "number" ? body.position : existing.position;
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : existing.title;
  const author = typeof body.author === "string" ? body.author.trim() : existing.author;
  const done = typeof body.done === "boolean" ? (body.done ? 1 : 0) : existing.done;
  const now = Date.now();
  // No version check — moves/reorders/retitles/done-toggles are conflict-free by construction.
  await env.DB.prepare(
    "UPDATE cards SET column_id = ?, position = ?, title = ?, author = ?, done = ?, updated_at = ? WHERE id = ?",
  )
    .bind(columnId, position, title, author, done, now, id)
    .run();
  return json({ ...existing, column_id: columnId, position, title, author, done, updated_at: now });
}

async function patchCardBody(request: Request, env: Env, id: string): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as { body?: string; version?: number };
  if (typeof body.version !== "number") return json({ error: "version required" }, 400);
  const newBody = typeof body.body === "string" ? body.body : "";
  const now = Date.now();
  const result = await env.DB.prepare(
    "UPDATE cards SET body = ?, version = version + 1, updated_at = ? WHERE id = ? AND version = ?",
  )
    .bind(newBody, now, id, body.version)
    .run();
  const rowsAffected = result.meta.changes ?? 0;
  const current = await env.DB.prepare("SELECT * FROM cards WHERE id = ?").bind(id).first<CardRow>();
  if (!current) return json({ error: "not found" }, 404);
  if (isStaleUpdate(rowsAffected)) {
    // Stale write — return 409 with the current row so the client can reconcile.
    return json(current, 409);
  }
  return json(current);
}

async function deleteCard(env: Env, id: string): Promise<Response> {
  await env.DB.prepare("DELETE FROM cards WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

// Re-export pure helpers so callers importing from the worker entry get them too.
export { positionBetween, appendPosition, isStaleUpdate };

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // Public: passphrase exchange.
  if (path === "/api/auth" && method === "POST") return handleAuth(request, env);

  // Everything else requires a valid signed cookie.
  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);

  if (path === "/api/session" && method === "GET") return json({ authed: true });
  if (path === "/api/board" && method === "GET") return getBoard(env);

  if (path === "/api/columns" && method === "POST") return createColumn(request, env);
  const colMatch = path.match(/^\/api\/columns\/([^/]+)$/);
  if (colMatch) {
    const cid = decodeURIComponent(colMatch[1]);
    if (method === "PATCH") return patchColumn(request, env, cid);
    if (method === "DELETE") return deleteColumn(env, cid);
  }

  if (path === "/api/cards" && method === "POST") return createCard(request, env);
  const cardBodyMatch = path.match(/^\/api\/cards\/([^/]+)\/body$/);
  if (cardBodyMatch && method === "PATCH") {
    return patchCardBody(request, env, decodeURIComponent(cardBodyMatch[1]));
  }
  const cardMatch = path.match(/^\/api\/cards\/([^/]+)$/);
  if (cardMatch) {
    const cid = decodeURIComponent(cardMatch[1]);
    if (method === "PATCH") return patchCard(request, env, cid);
    if (method === "DELETE") return deleteCard(env, cid);
  }

  return json({ error: "not found" }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env, url);
      } catch (err) {
        return json({ error: "internal error", detail: String(err) }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

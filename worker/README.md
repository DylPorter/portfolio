# GMD Studios — kanban backend (Cloudflare Worker + D1)

Passphrase-gated brainstorm board served at `/gmd-studios`. The Worker
(`worker/index.ts`) handles everything under `/api/*`; every other path falls
through to the static SPA via the `ASSETS` binding.

- **Storage:** Cloudflare D1 (`worker/schema.sql`).
- **Auth:** single passphrase (`jaysanhater`, override via `BOARD_PASSPHRASE`),
  exchanged for an HMAC-signed httpOnly cookie (`gmd_session`).
- **Concurrency:** cards use fractional positions (single-row moves never
  collide) + a `version` column for optimistic-concurrency body edits (409 on
  stale write). The pure helpers live in `worker/logic.ts` and are unit-tested
  in `worker/logic.test.ts`.

## One-time provisioning (Dylan must run these — no cloud creds in the dev env)

```bash
# 1. Create the D1 database, then paste the returned database_id into
#    wrangler.jsonc -> d1_databases[0].database_id (replaces the PLACEHOLDER).
npx wrangler d1 create gmd-kanban

# 2. Apply the schema to the remote DB.
npm run db:remote

# 3. Set secrets (SESSION_SECRET is required for stable signed cookies;
#    BOARD_PASSPHRASE is optional — defaults to "jaysanhater").
npx wrangler secret put SESSION_SECRET
npx wrangler secret put BOARD_PASSPHRASE   # optional

# 4. Build the SPA and deploy the Worker + assets.
npm run build
npx wrangler deploy
```

## Local development

```bash
npm run db:local        # apply schema to the local D1 (creates .wrangler state)
npm run build           # produce ./dist for the ASSETS binding
npx wrangler dev        # Worker + assets at http://localhost:8787
```

For pure frontend iteration you can still use `npm run dev` (Vite), but `/api/*`
calls only resolve under `wrangler dev` (or in production).

## Tests / checks

```bash
npm test                # vitest — position math + 409 decision
npm run typecheck:worker # tsc against worker/tsconfig.json
npm run build           # tsc -b + vite build (frontend)
```

## API surface

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth` | public | `{passphrase}` → sets `gmd_session` cookie |
| GET | `/api/session` | cookie | `{authed:true}` or 401 |
| GET | `/api/board` | cookie | lazy-seeds 3 columns if empty |
| POST | `/api/columns` | cookie | `{title}` → new column at end |
| PATCH | `/api/columns/:id` | cookie | `{title?, position?}` |
| DELETE | `/api/columns/:id` | cookie | deletes column + its cards |
| POST | `/api/cards` | cookie | `{column_id, title, author}` |
| PATCH | `/api/cards/:id` | cookie | `{column_id?, position?, title?, author?}` (no version check) |
| PATCH | `/api/cards/:id/body` | cookie | `{body, version}` → 200 or 409 + current row |
| DELETE | `/api/cards/:id` | cookie | |

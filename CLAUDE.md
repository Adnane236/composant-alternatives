# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server (localhost:3000)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint (ESLint)
```

There is **no test framework** configured. Verification is done by running the app.

Deployment is automatic: pushing to `main` triggers a deploy action (Netlify via `@netlify/plugin-nextjs`, publishing `.next`). After pushing, the workflow is to SSH into the VPS and confirm with `git status` that the change landed — do **not** use a tar/unzip technique for this project.

## Stack

Next.js 14.2.5 (App Router) · React 18.3 · TypeScript (strict) · `pg` for PostgreSQL · `xlsx` for client-side spreadsheet parsing. No CSS framework — styling is a single hand-written `app/globals.css` (dark "blueprint/schematic" theme: Archivo + IBM Plex Mono, drafting grid, hairline rules, sharp corners) plus heavy inline `style={{}}` props throughout the components. There is no Tailwind here.

## Domain

A French-language industrial **after-sales dashboard** for automotive wiring harnesses (Versigent / Aptiv / JLR L550). It tracks: `Fils` (wires), `Torsades` (twisted pairs), `Splices` + `SpliceFils`, `Inventaire` (crimping dies/tools), `ProductionTracking` (order planning), `Contacts`, `Recap` (shipment records: BL/DN/Customer PO), and `RMAlternativeMateriel` (alternative materials). UI labels are English nav names mapped to French descriptions.

## Architecture

### Demo-mode fallback is core, not optional
`lib/db.ts` `getPool()` returns `null` when `DATABASE_URL` is unset; on a query error the calling function also falls back. Every data function (`getFils`, `getProductionTracking`, `searchAll`, `updateTableRow`, `insertRows`, etc.) checks for a null pool and falls back to a hardcoded `DEMO_*` array defined at the bottom of `lib/db.ts`. **The entire app runs and demos with no database.** Never assume a live DB exists; writes silently no-op (`update*` returns `false`) and `/api/upload` returns `{ demo: true }` when unconfigured.

Connection: a single cached `pg` `Pool` (stashed on `globalThis` to survive dev hot-reloads — do **not** open/close per request). Env vars (`.env.local`): `DATABASE_URL` (a Postgres URL, e.g. Neon/Supabase). TLS is verified by default; `PGSSL=disable` (no TLS, local) or `PGSSL=no-verify` (self-signed) override it.

### `lib/db.ts` is the data-layer hub
It holds **all** TypeScript row types, **all** query functions, the `DEMO_*` mock data, and two shared pieces used everywhere:
- **`TABLE_COLUMNS`** — a per-table whitelist of writable columns. This is the *authoritative* column list for the running app (see schema caveat below).
- **`updateTableRow(table, id, fields)`** and **`insertRows(table, rows)`** — generic write helpers. They interpolate the (double-quoted, PascalCase) table/column identifiers into the SQL string but are gated by `TABLE_COLUMNS` (unknown table → no-op / throw), and all values go through positional `$1` parameters. This whitelist-plus-parameters pattern is the SQL-injection defense — preserve it. `updateTableRow` maps empty string → `NULL`. `updateRMAlternative` just delegates to `updateTableRow`.

### API routes are thin wrappers (`app/api/*/route.ts`)
The standard shape: `GET` calls the matching `lib/db` getter (optionally filtered by a query param like `?famille=` or `?feuille=`); `PUT` destructures `{ id, ...fields }` and calls `updateTableRow('TableName', id, fields)`. Special routes: `/api/upload` does bulk `INSERT` with the same column whitelist; `/api/search` splits the query on `[,;\n\r]+` and merges `searchAll` results per term; `/api/stats` aggregates dashboard counts.

### Page pattern (`app/<feature>/page.tsx`)
Every feature page is a `'use client'` component that: fetches its `/api/<feature>` into local state, hardcodes a `COLUMNS: Column[]` list, filters client-side with `rowMatches` from `lib/search.ts` (matches the query against every cell value), and renders the shared **`EditableTable`**. In `EditableTable`, clicking a row expands an inline edit form; blurring a changed field calls `onChange` (optimistic local update) then `PUT`s to `apiPath`.

### Upload flow (`app/upload/page.tsx`)
Excel/CSV is parsed **in the browser** with `xlsx`. `detectHeaderRow` scores the first 5 rows against the target table's DB columns to find the real header; `autoMap` maps spreadsheet headers to DB columns, consulting an `ALIASES` table first (this handles duplicate headers — e.g. a "PE proposal" sheet with three `APN`/`code` columns that dedupe to `APN`, `APN_2`, `APN_3`). Mapped rows POST to `/api/upload`. `.pptx` is only recorded as a reference, not parsed.

### Two parallel data worlds
1. **SQL-backed wiring tables** (`lib/db.ts` + the `/fils`, `/torsades`, `/splices`, `/production`, `/inventaire`, `/recap`, `/rm-alternative-materiel`, `/upload` pages) — this is the current, active dashboard.
2. **Legacy static dataset** (`app/data/components.ts`) — a hardcoded demo list of generic "composants" used by the original `/composants`, `/composants/[id]`, `/alternatives`, `/disponibilite` pages, `SearchModal`, and the `useLanguage` i18n hook. This is the project's original "composant-alternatives" shell; treat it as legacy unless a task targets it.

### Navigation has two sources of truth
When adding or renaming a page, update **both** `NAV_LINKS` in `app/components/RootLayoutClient.tsx` (the header nav) and `NAV_CARDS` in `app/page.tsx` (the home dashboard cards). The dark theme is force-enabled via `document.documentElement.classList.add('dark-theme')` in a `RootLayoutClient` effect.

## Adding a new editable table (end-to-end checklist)
1. `lib/db.ts`: add the row `type`, a `getX()` getter, a `DEMO_X` fallback array, and a `TABLE_COLUMNS['X']` entry (generic `updateTableRow` then handles writes).
2. `app/api/x/route.ts`: `GET` → `getX()`, `PUT` → `updateTableRow('X', id, fields)`.
3. `app/x/page.tsx`: client component with a `COLUMNS` list rendering `EditableTable` against `/api/x`.
4. Register the route in `NAV_LINKS` and `NAV_CARDS` (see above).
5. If importable, add it to `TABLE_OPTIONS` and `TABLE_DB_COLUMNS` in `app/upload/page.tsx`.
6. Add the `CREATE TABLE` to `sql/schema.sql`.

## Caveats
- **Table names are PascalCase and quoted.** Postgres folds unquoted identifiers to lowercase, so every query in `lib/db.ts` double-quotes table names (`"Fils"`, `"ProductionTracking"`, …). Keep that — an unquoted `FROM Fils` resolves to `fils` and won't find the table. Columns are lowercase snake_case (no quoting needed, but the generic write helpers quote them anyway).
- **`sql/schema.sql` is the PostgreSQL schema** (with sample seed data; `sql/schema_create_only.sql` is tables-only) and is kept aligned with `TABLE_COLUMNS` in `lib/db.ts` — the authoritative column list. If you change a table's columns, update both.
- `pg` returns `NUMERIC`/`DECIMAL` columns as **strings** (e.g. `section_fil` → `"0.35"`); the UI just renders them so it's cosmetic, but don't rely on them being JS numbers. Counts in `getDashboardStats` are cast with `::int` so they come back as numbers.
- The `useLanguage` hook ships French only and throws if no `LanguageProvider` is mounted — relevant only to the legacy `app/data/components.ts` pages.

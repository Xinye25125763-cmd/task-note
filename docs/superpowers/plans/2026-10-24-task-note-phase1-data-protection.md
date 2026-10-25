# task-note Phase 1 Data Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect local and cloud task-note data during sign-in sync, saves, import, and clear operations, and define per-user access rules in a Supabase migration.

**Architecture:** Keep the app as a static HTML/CSS/JavaScript application. Centralize local/cloud writes and synchronization so all paths check Supabase's returned errors, resolve differing snapshots with an explicit user choice and a backup, and wait for pending writes before destructive navigation. Add an idempotent SQL migration for the existing one-row-per-user `public.user_data` model; do not apply it to the live Supabase project.

**Tech Stack:** Vanilla JavaScript, HTML, CSS, Supabase JavaScript v2, PostgreSQL SQL migration.

**Spec:** `/Users/Admin/Documents/Codex/2026-10-24/ni/work/task-note-phase1-design.md`

## Global Constraints

- Never compare device-local timestamps with server timestamps to choose a winning snapshot.
- Before replacing either divergent snapshot, trigger a JSON download of the other snapshot from the user's explicit choice action.
- Treat a Supabase `{ error }` response as failure even if the request promise resolves.
- Preserve a successfully saved local copy when cloud sync fails and report the two outcomes separately.
- Do not apply SQL to the remote Supabase project as part of this change.
- Accept current and known legacy import formats; reject malformed data and versions newer than `DATA_VERSION`.
- Do not add or run automated tests unless the user asks; verify JavaScript syntax and patch whitespace.

## Review Focus

- A saved but intentionally empty local snapshot must remain distinguishable from a first-time browser with no saved snapshot; keep the empty snapshot authoritative during sync.
- Supabase can resolve requests with `{ error }`; report failure and keep sync state from showing success.
- A pending debounce must not write to a newly selected account; capture the user ID and data snapshot when scheduling the write.
- An import or clear must not reload before its immediate local write completes; a cloud failure must not erase the local result.
- Old backups can omit fields added by migrations; migrate only after validating the required container shapes and reject unknown future versions.

## Files

- Modify `app.js` for persistence, sync resolution, import validation, logout, import, and clear flows.
- Modify `index.html` and `style.css` for an explicit blocking sync-conflict dialog with local/cloud summaries and choice actions.
- Create `supabase/migrations/20261024000000_user_data_rls.sql` to create the table when absent, enable RLS, and restrict authenticated users to rows whose `user_id = auth.uid()`.

## Tasks

### Task 1: Define the `user_data` RLS migration

**Files:**
- Create: `supabase/migrations/20261024000000_user_data_rls.sql`

- [x] Create `public.user_data` if absent, with `user_id uuid` as the primary key referencing `auth.users(id) ON DELETE CASCADE`, `data jsonb NOT NULL`, and `updated_at timestamptz NOT NULL DEFAULT now()`.
- [x] Enable RLS; grant the `authenticated` role the needed table operations; revoke table access from `anon`; create idempotently named select/insert/update/delete policies restricted by `auth.uid() = user_id` (`WITH CHECK` on writes).
- [x] Inspect the SQL to confirm it contains no live credentials or remote apply step and that rerunning the migration does not fail on existing policy names.

### Task 2: Make local/cloud writes awaitable and truthful

**Files:**
- Modify: `app.js` data layer, auth/logout flows, and `init()`

**Interfaces:**
- Produce `writeLocalNow(snapshot)` to synchronously persist a snapshot and timestamp, returning success/failure.
- Produce `writeCloudNow(snapshot, userId)` to await the upsert and surface both rejected requests and Supabase `{ error }` values.
- Produce `flushSave()` to cancel pending timers, persist the latest snapshot locally, await the relevant cloud write, and return local/cloud outcomes.

- [x] Replace callback-local writes with `writeLocalNow`, updating `tasknote_last_save` only after storage succeeds.
- [x] Capture `data` and the current user ID when scheduling debounced cloud saves; check `{ error }` and update the sync indicator only according to the actual result.
- [x] Add `flushSave()` and use it before sign-out; Task 4 uses it before page reload, import, and clear. Do not reload if local persistence fails.
- [x] Route existing-session initialization and auth-state sign-in through one per-user sync entry point so a callback and `init()` cannot both race to replace `data`.
- [x] Check each save/auth path and confirm cloud failure leaves local state intact and is not reported as a successful sync.

### Task 3: Resolve differing local and cloud snapshots explicitly

**Files:**
- Modify: `app.js`
- Modify: `index.html`
- Modify: `style.css`

**Interfaces:**
- Produce `reconcileCloudData(userId)` to load, migrate, compare, and resolve local/cloud snapshots.
- Produce `showSyncConflict(localSnapshot, cloudSnapshot, onChoice)` for the explicit choice UI.

- [x] Distinguish no local storage key from a saved empty snapshot; use `maybeSingle()` so no cloud row is an empty record while duplicate-row/query errors remain errors.
- [x] Migrate and validate both snapshots before comparison; use a stable serialized comparison after migration, not timestamps.
- [x] If snapshots differ, show counts for todos, OKRs, and notes and require “使用本地” or “使用云端”; do not allow background cloud saves to run while resolution is pending.
- [x] On either choice, create and trigger a complete JSON download of the other snapshot before replacing it; then save the selected data locally and, when local wins, upsert it to cloud and check the result.
- [x] If either backup creation or local persistence fails, keep the conflict unresolved and do not overwrite the other copy; if cloud save fails after local wins, keep the local copy and show a cloud-failure message.

### Task 4: Validate imports and persist before reload

**Files:**
- Modify: `app.js` import and clear handlers

- [x] Validate the imported root object, `todos`/`okrs`/`notes` arrays, optional `categories` array, optional `heatmap` object, item objects/IDs, and version before assigning `data`.
- [x] Accept the current version and known legacy versions supported by `migrateData`; reject malformed data and future versions without changing existing state.
- [x] After explicit overwrite confirmation, assign the migrated snapshot and await `flushSave()`; reload only after local persistence succeeds, and report cloud failure without discarding the local import.
- [x] For clear, await `flushSave()` for the reset snapshot before reload and report local/cloud outcomes accurately.

### Task 5: Verify the patch

**Files:**
- All files changed above

- [x] Run `node --check app.js`; expected: exit code 0 and no syntax diagnostics.
- [x] Run `git diff --check`; expected: exit code 0 and no whitespace errors.
- [x] Review the full diff against the spec and confirm the migration is not applied remotely; report these checks without claiming automated tests ran.

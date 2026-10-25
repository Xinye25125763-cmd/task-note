# TaskNote Date Picker, Reminders, and Recurrence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the todo date picker support editable times, recurring tasks, and opt-in Web Push reminders that can arrive when the TaskNote page is closed.

**Architecture:** Keep TaskNote as a static HTML/CSS/JavaScript app and preserve its existing JSON sync model. Extract pure date/reminder/recurrence logic into a testable browser-compatible module; let the existing user-data upsert trigger maintain a private reminder index; use authenticated Edge Functions, a root-scoped Service Worker, Web Push, and a one-minute Supabase Cron job for delivery.

**Tech Stack:** Browser JavaScript, HTML/CSS, Node built-in test runner, Supabase Postgres migrations, Supabase Edge Functions (Deno), `web-push@3.6.7`.

**Spec:** `docs/superpowers/specs/2026-10-25-task-date-picker-controls-design.md`

## Global Constraints

- Time is stored as 24-hour `HH:mm`; null means an all-day task.
- Reminder choices are none, due time, 5, 15, or 30 minutes before, and 1 hour before.
- Repeat choices are none, daily, weekly, or monthly; a missing monthly day clamps to the month's last day.
- Background push requires sign-in, cloud sync, HTTPS, per-device opt-in, notification permission, and browser/OS Web Push support.
- Push content is generic and must not include todo text.
- VAPID private key, service-role key, and cron secret must never enter browser code, task JSON, or Git.
- Server scheduling runs once per minute and delivery is best-effort; no exact-time or exactly-once guarantee.
- Maintain existing due-date ordering, overdue grouping, heatmap accounting, export/import, and cloud sync behavior.

## Review Focus

- Invalid date, time, reminder offset, or time-zone data must not abort saving another valid user-data snapshot.
- Completed, removed, or rescheduled tasks must not leave a stale pending push.
- Expired or rejected push subscriptions must be removed without blocking delivery to other devices.
- Daylight-saving transitions and monthly end-of-month recurrence must preserve the intended local schedule.
- Repeated scheduler calls and undo/redo of completion must not create duplicate recurrence occurrences or routine duplicate pushes.

---

### Task 1: Add tested task-date and recurrence domain helpers

**Files:**
- Create: `task-features.js`
- Create: `tests/task-features.test.cjs`
- Modify: `app.js` (data migration only)

**Interfaces:**
- `TaskFeatures.parseReminderMinutes(value)` accepts `null` or one of `0, 5, 15, 30, 60`; returns the accepted value or `null`.
- `TaskFeatures.nextOccurrence(task, now)` returns the next local `YYYY-MM-DD` occurrence and its series index, keeping the original monthly anchor day and skipping occurrences whose local dates are not after the completion date in the task time zone.
- `TaskFeatures.normalizeTodoV3(todo)` adds safe defaults for reminder and recurrence fields on older exports.

- [x] **Step 1: Write tests** for accepted/rejected reminder offsets, legacy todo normalization, daily/weekly/monthly recurrence, Jan-31 monthly clamping, leap day, and missed schedules across an IANA-zone date boundary.
- [x] **Step 2: Run tests** with the bundled Node executable and confirm each fails because the helpers do not exist.
- [x] **Step 3: Implement** the pure helper module and increment TaskNote data to version 3, preserving all v1/v2 migration behavior.
- [x] **Step 4: Run tests** with the bundled Node executable and confirm all helper tests pass.
- [x] **Step 5: Commit** as `feat: add task reminder and recurrence model`.

### Task 2: Make date, time, reminder, and repeat controls usable

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`
- Test: `tests/task-picker-markup.test.cjs`

**Interfaces:**
- The picker keeps the existing `dpSelectedDate` and `dpSelectedTime` state and adds draft state for `dpReminderMinutes` and `dpRepeatRule`.
- `dpConfirm()` commits draft settings; `dpClear()` clears date, time, reminder, and repeat together.
- `addTodo()` persists `reminderMinutes`, `reminderId`, `repeat`, `seriesId`, `seriesStartDate`, `seriesIndex`, `repeatAnchorDay`, and `timeZone` when applicable.

- [x] **Step 1: Write markup tests** asserting a real `input[type=time]`, actionable reminder/repeat controls, accessible labels, and all required reminder/repeat values.
- [x] **Step 2: Run the markup tests** and confirm they fail on the current static option rows.
- [x] **Step 3: Implement** keyboard/touch-operable controls with visible selections. Existing todos can reopen the picker to edit or clear their date, time, reminder, and recurrence. Reminder preferences can be saved locally with clear login/sync/device-permission guidance; Task 5 gates actual push enrollment on eligibility.
- [x] **Step 4: Run the markup tests**, then serve the app locally and verify date, arbitrary hour/minute, reminder, repeat, saved-task editing and clearing, cancel, narrow viewport, and keyboard interactions in a real browser.
- [x] **Step 5: Commit** as `fix: wire todo date picker controls`.

### Task 3: Generate recurring occurrences safely

**Files:**
- Modify: `app.js`
- Modify: `task-features.js`
- Create: `tests/task-recurrence.test.cjs`

**Interfaces:**
- `TaskFeatures.createNextOccurrence(source, allTodos, now, genId)` returns one child occurrence or `null` when the source is not a repeating task or the occurrence already exists.
- Each occurrence uses the same `seriesId`, a monotonically increasing `seriesIndex`, an `occurrenceKey` of `${seriesId}:${seriesIndex}`, and a new reminder schedule ID when reminders are enabled.

- [x] **Step 1: Write tests** for completion creating the next due occurrence, retaining the completed source, preservation of time/reminder/rule/time zone, monthly anchor behavior, missed-period skipping, and undo/redo without duplicates.
- [x] **Step 2: Run recurrence tests** and confirm they fail before implementation.
- [x] **Step 3: Implement** recurrence generation in the existing `toggleTodo()` flow while preserving heatmap counts and removing an uncompleted generated child when its source completion is undone.
- [x] **Step 4: Run the recurrence tests** and the full Node test suite; manually exercise completion and undo in the local browser.
- [x] **Step 5: Commit** as `feat: generate recurring todo occurrences`.

### Task 4: Add private Supabase reminder index and Web Push functions

**Files:**
- Create: `supabase/migrations/20261025000000_task_reminders.sql`
- Create: `supabase/functions/manage-push-subscription/index.ts`
- Create: `supabase/functions/send-task-reminders/index.ts`
- Create: `supabase/functions/send-task-reminders/deno.json`
- Create: `supabase/functions/manage-push-subscription/deno.json`
- Modify: `supabase/config.toml`
- Modify: `.gitignore` (exclude local function secrets)
- Create: `tests/reminder-backend-contract.test.cjs`

**Interfaces:**
- `manage-push-subscription` accepts authenticated `subscribe`, `unsubscribe`, and `public-key` actions; it verifies the bearer token and scopes subscription mutation to that user's ID.
- `send-task-reminders` accepts only a cron-secret-authenticated request and uses the server service-role key to claim due work and read subscriptions.
- `task_reminders` is rebuilt from valid, incomplete tasks by a `SECURITY DEFINER` trigger on `public.user_data`; private subscription and delivery tables deny direct `anon`/`authenticated` access.

- [x] **Step 1: Write contract tests** for safe table grants/policies, task reminder eligibility, timezone validation, reminder offsets, cron authentication, generic payloads, stale-subscription cleanup, and dedupe keys.
- [x] **Step 2: Run the contract tests** and confirm they fail because the migration/functions are absent.
- [x] **Step 3: Implement** the migration, idempotent trigger, authenticated subscription function, and scheduled sender with pinned `web-push` dependency.
- [x] **Step 4: Run contract tests** and Deno type checks when available; inspect the SQL migration for valid/invalid JSON, RLS, grants, and refresh behavior. Record that live database execution requires the user's Supabase project credentials/configuration.
- [x] **Step 5: Commit** as `feat: add scheduled web push reminders`.

### Task 5: Register subscriptions and display background notifications

**Files:**
- Create: `service-worker.js`
- Create: `push-client.js`
- Modify: `index.html`
- Modify: `app.js`
- Modify: `style.css`
- Create: `tests/service-worker-contract.test.cjs`

**Interfaces:**
- `enableBackgroundReminders()` registers `/service-worker.js`, requests notification permission from a user gesture, subscribes with the server's VAPID public key, and posts the subscription to `manage-push-subscription`.
- `disableBackgroundReminders()` removes this browser's server subscription and unsubscribes locally.
- The Service Worker handles only `push` and `notificationclick`, displays generic copy, and opens the TaskNote URL on click.

- [x] **Step 1: Write tests** for permission/support status handling, authenticated subscription API use, local unsubscribe, generic notification payload, and click navigation.
- [x] **Step 2: Run the tests** and confirm the expected functions/worker behavior are missing.
- [x] **Step 3: Implement** the opt-in status and Service Worker interactions, including clear states for signed-out, sync-off, denied, unsupported, and enabled. Remove the prior account's device subscription on sign-out and account changes.
- [x] **Step 4: Run service-worker tests**, exercise the status UI on a localhost secure context, and verify generic payload/click behavior with browser mocks. Live device enrollment and closed-page delivery depend on the production Supabase setup in Task 6.
- [x] **Step 5: Commit** as `feat: add per-device push notification controls`.

### Task 6: Document live configuration and verify the integrated change

**Files:**
- Create: `docs/task-reminders-deployment.md`
- Modify: the existing Sites source repo and published Site after source verification.

- [x] **Step 1: Write a deployment checklist** for VAPID generation, Supabase migration application, function deployment, secrets, Vault entries, one-minute Cron setup, redirect/origin verification, and per-device permission setup. Never put secret values in Git or this chat.
- [x] **Step 2: Verify the full Node test suite**, JavaScript syntax, Supabase function type checks if a Deno runtime is available, and local responsive browser interactions.
- [x] **Step 3: Review every acceptance criterion** from the design spec; distinguish locally verified behavior from live Supabase behavior that cannot be verified until the migration/functions/secrets are deployed.
- [x] **Step 4: Mirror the verified static source into the existing Sites source repository, commit and push the source changes.**
- [ ] **Step 5: Publish a public Site version only after the Supabase migration, functions, secrets, and Cron job are live and verified.**
- [x] **Step 6: Commit** the deployment guide and final integration changes as `docs: add task reminder deployment guide`.

**Deployment gate:** Latest Site source was pushed at `4e531091761757f2c443d679fad49683c186a36c`; the production Site remains at its previous saved version until Supabase migration, secrets, functions, and Cron are applied and verified. No live backend or notification-delivery claim is made.

**Final review follow-up:** Added an existing-task schedule editor and auth-event subscription cleanup after the whole-branch review found those acceptance gaps. A low-probability race where a reminder is already claimed while its task is changed remains deferred; notifications are generic and best-effort.

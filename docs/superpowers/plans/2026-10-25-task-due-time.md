# Task Due Time Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show stored due times and sort incomplete tasks by valid due date/time while preserving the existing data format and task groups.

**Architecture:** Keep the existing `date` and `time` fields. Add small validity helpers and a comparator used by `renderTodos()`, render a valid time beside the date, and keep styling changes limited to the todo metadata row. Mirror only the resulting `app.js` and `style.css` changes into the existing Site source before publishing.

**Tech Stack:** Vanilla JavaScript, CSS, Node.js VM harness, Sites source workflow.

**Spec:** `docs/superpowers/specs/2026-10-25-task-due-time-design.md`

## Global Constraints

- Do not change the persisted task shape or Supabase schema.
- For incomplete tasks: valid dates sort ascending; on the same date, valid times sort ascending and untimed tasks follow timed tasks; missing/invalid dates follow dated tasks.
- Flag priority breaks ties only after due date and time; completed tasks follow incomplete tasks and remain newest-created first.
- Preserve overdue, active, and done grouping and current filters.
- Reminder and recurrence controls remain out of scope.

## Review Focus

- Missing or malformed legacy dates must remain visible and sort after valid dates.
- Malformed times must not sort ahead of valid times or render as a misleading time.
- Same-date untimed tasks must follow all timed tasks, with flag priority applied only inside an identical due-time tie.
- Today and overdue groups must remain intact after the comparator changes.
- Narrow screens must still show date and time without forcing task text off-screen.

---

### Task 1: Due-time rendering and ordering

**Files:**
- Modify: `app.js`
- Modify: `style.css`
- Modify: `docs/superpowers/specs/2026-10-25-task-due-time-design.md`
- Create: `.superpowers/sdd/task-due-time/test-task-due-time.cjs` (ignored execution artifact)

**Interfaces:**
- Reuse task fields `date`, `time`, `flag`, `done`, and `createdAt`.
- Add `isValidTodoDate(value)` and `isValidTodoTime(value)` helpers for comparison/rendering.
- Keep `renderTodos()` as the owner of ordering and existing section grouping.

- [x] **Step 1: Write the failing source-backed VM harness**

  Extract `renderTodoItem()` and `renderTodos()` from `app.js` and evaluate them with minimal DOM/helper stubs. Assert date/time ordering, untimed placement, priority tie-breaks, missing/invalid date handling, completed-task ordering, valid time rendering, and task visibility in existing groups.

- [x] **Step 2: Run the harness and observe the expected failures**

  Run: `node .superpowers/sdd/task-due-time/test-task-due-time.cjs`
  Expected: assertions fail because current rendering omits time and sorting prioritizes flag/creation time.

- [x] **Step 3: Implement date/time validation, sorting, and rendering in `app.js`**

  Sort incomplete tasks by valid ISO date, then valid `HH:mm`; place untimed tasks after timed tasks on a shared date. Put invalid/missing dates after dated tasks. Sort by flag only after due date/time ties. Preserve completed-task created-time ordering. Render a valid stored time beside a present date. Classify invalid/missing-date tasks in the active group so they remain visible.

- [x] **Step 4: Add compact responsive metadata styling in `style.css`**

  Keep the date and time visually adjacent, use tabular numerals for time, and allow metadata to wrap or align cleanly on narrow rows.

- [x] **Step 5: Re-run the harness and static checks**

  Run: `node .superpowers/sdd/task-due-time/test-task-due-time.cjs`
  Expected: all due-date/time, tie-break, invalid-data, grouping, completion, and rendering assertions pass.

  Run: `node --check app.js && git diff --check`
  Expected: exit code 0.

- [x] **Step 6: Preview and review the result**

  Local browser review confirmed the sequence overdue → today 20:00 → tomorrow 09:00 → tomorrow all-day; toggling the overdue task placed it in the completed section at the end. At 390px, date/time stayed readable and long task text wrapped. Browser error/warning logs were empty, and all four temporary local test tasks were removed. Minor deferred: selecting a day from the calendar grid closes the picker during its rerender; reopening it allows time selection, but the extra click belongs to a separate date-picker interaction fix.

- [x] **Step 7: Sync the reviewed code into the existing Site source and publish**

  Mirrored only the due-time changes into the existing Site's `dist/app.js` and `dist/style.css`; kept Site metadata and public audience. Source-helper checks passed and packaged commit `858b3ae138d38bcc86af4dd8d767720afcdbfcf7`. Site version 4 deployed successfully at `https://task-note-public-20261025.deep-dune-0765.chatgpt.site/`; public page reload succeeded and browser error/warning logs were empty.

## Final review

- Self-review (no subagent tool): comparator, invalid legacy values, rendering escape, task groups, done ordering, data shape, and responsive row behavior were checked against the spec. No Critical or Important findings.
- Minor deferred: calendar-grid date selection closes the date picker after rerender, requiring it to be reopened before selecting a time.
- Main repository changes remain uncommitted; the Site source is committed and deployed.

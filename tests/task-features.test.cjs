const test = require('node:test');
const assert = require('node:assert/strict');

let TaskFeatures = {};
try {
  TaskFeatures = require('../task-features');
} catch (_) {
  // Keep the RED run an assertion failure while the production module is absent.
}

function feature(name) {
  assert.equal(typeof TaskFeatures[name], 'function', `TaskFeatures.${name} should exist`);
  return TaskFeatures[name];
}

test('parseReminderMinutes accepts the supported offsets only', () => {
  const parseReminderMinutes = feature('parseReminderMinutes');
  for (const offset of [0, 5, 15, 30, 60]) {
    assert.equal(parseReminderMinutes(offset), offset);
  }
  assert.equal(parseReminderMinutes(null), null);
  for (const offset of [-1, 1, 10, 45, 61, '15', undefined]) {
    assert.equal(parseReminderMinutes(offset), null);
  }
});

test('normalizeTodoV3 preserves task fields and supplies safe schedule defaults', () => {
  const normalizeTodoV3 = feature('normalizeTodoV3');
  const legacy = { id: 17, text: '旧任务', date: '2026-10-25', time: '09:00', done: false };
  const normalized = normalizeTodoV3(legacy);

  assert.deepEqual(normalized, {
    ...legacy,
    reminderMinutes: null,
    reminderId: null,
    repeat: null,
    seriesId: null,
    seriesStartDate: null,
    seriesIndex: null,
    repeatAnchorDay: null,
    timeZone: null,
    occurrenceKey: null,
    generatedFrom: null
  });
  assert.deepEqual(legacy, { id: 17, text: '旧任务', date: '2026-10-25', time: '09:00', done: false });
});

test('normalizeTodoV3 removes invalid reminder and repeat values', () => {
  const normalizeTodoV3 = feature('normalizeTodoV3');
  const normalized = normalizeTodoV3({ id: 18, text: '坏字段', reminderMinutes: 12, repeat: 'hourly' });
  assert.equal(normalized.reminderMinutes, null);
  assert.equal(normalized.repeat, null);
});

test('nextOccurrence advances daily and weekly schedules beyond the completion date', () => {
  const nextOccurrence = feature('nextOccurrence');
  const daily = nextOccurrence({
    seriesId: 'daily-series', repeat: 'daily', seriesStartDate: '2026-02-01',
    seriesIndex: 0, repeatAnchorDay: 1, timeZone: 'Asia/Shanghai'
  }, new Date('2026-02-02T03:00:00.000Z'));
  assert.deepEqual(daily, { date: '2026-02-03', seriesIndex: 2, occurrenceKey: 'daily-series:2' });

  const weekly = nextOccurrence({
    seriesId: 'weekly-series', repeat: 'weekly', seriesStartDate: '2026-02-01',
    seriesIndex: 0, repeatAnchorDay: 1, timeZone: 'Asia/Shanghai'
  }, new Date('2026-02-23T12:00:00.000Z'));
  assert.deepEqual(weekly, { date: '2026-03-01', seriesIndex: 4, occurrenceKey: 'weekly-series:4' });
});

test('nextOccurrence retains the original monthly anchor after February is clamped', () => {
  const next = feature('nextOccurrence')({
    seriesId: 'month-end', repeat: 'monthly', seriesStartDate: '2026-01-31',
    seriesIndex: 1, repeatAnchorDay: 31, timeZone: 'Asia/Shanghai'
  }, new Date('2026-03-01T00:00:00.000Z'));
  assert.deepEqual(next, { date: '2026-03-31', seriesIndex: 2, occurrenceKey: 'month-end:2' });
});

test('nextOccurrence respects leap-day clamping and the task time zone date', () => {
  const nextOccurrence = feature('nextOccurrence');
  const leapDay = nextOccurrence({
    seriesId: 'leap', repeat: 'monthly', seriesStartDate: '2024-01-31',
    seriesIndex: 1, repeatAnchorDay: 31, timeZone: 'America/New_York'
  }, new Date('2024-02-20T12:00:00.000Z'));
  assert.deepEqual(leapDay, { date: '2024-03-31', seriesIndex: 2, occurrenceKey: 'leap:2' });

  const dstBoundary = nextOccurrence({
    seriesId: 'dst', repeat: 'daily', seriesStartDate: '2026-03-01',
    seriesIndex: 6, repeatAnchorDay: 1, timeZone: 'America/New_York'
  }, new Date('2026-03-08T04:30:00.000Z'));
  assert.deepEqual(dstBoundary, { date: '2026-03-08', seriesIndex: 7, occurrenceKey: 'dst:7' });
});

test('nextOccurrence rejects invalid schedule inputs without throwing', () => {
  const nextOccurrence = feature('nextOccurrence');
  assert.equal(nextOccurrence({ repeat: 'never' }, new Date()), null);
  assert.equal(nextOccurrence({
    seriesId: 'bad-zone', repeat: 'daily', seriesStartDate: '2026-01-01',
    seriesIndex: 0, repeatAnchorDay: 1, timeZone: 'Not/A_Zone'
  }, new Date()), null);
});

test('updateTodoSchedule adds a reminder and starts a recurrence series for an existing task', () => {
  const updateTodoSchedule = feature('updateTodoSchedule');
  const original = { id: 23, date: '2026-10-25', time: null, reminderMinutes: null, repeat: null };
  const updated = updateTodoSchedule(original, {
    date: '2026-10-27', time: '14:35', reminderMinutes: 15, repeat: 'weekly', timeZone: 'Asia/Shanghai'
  }, 'series-23-new');

  assert.equal(updated.date, '2026-10-27');
  assert.equal(updated.time, '14:35');
  assert.equal(updated.reminderMinutes, 15);
  assert.equal(updated.reminderId, 'todo-23-reminder');
  assert.equal(updated.repeat, 'weekly');
  assert.equal(updated.seriesId, 'series-23-new');
  assert.equal(updated.seriesStartDate, '2026-10-27');
  assert.equal(updated.seriesIndex, 0);
  assert.equal(updated.repeatAnchorDay, 27);
  assert.equal(updated.occurrenceKey, 'series-23-new:0');
  assert.equal(updated.timeZone, 'Asia/Shanghai');
  assert.deepEqual(original, { id: 23, date: '2026-10-25', time: null, reminderMinutes: null, repeat: null });
});

test('updateTodoSchedule rebases a recurring task when its date or repeat rule changes', () => {
  const updateTodoSchedule = feature('updateTodoSchedule');
  const original = {
    id: 24, date: '2026-10-25', time: '09:00', reminderMinutes: 5, reminderId: 'todo-24-reminder',
    repeat: 'daily', seriesId: 'old-series', seriesStartDate: '2026-10-20', seriesIndex: 5,
    repeatAnchorDay: 20, occurrenceKey: 'old-series:5', timeZone: 'Asia/Shanghai'
  };
  const updated = updateTodoSchedule(original, {
    date: '2026-10-28', time: '09:00', reminderMinutes: 5, repeat: 'weekly', timeZone: 'Asia/Shanghai'
  }, 'new-series');

  assert.equal(updated.seriesId, 'new-series');
  assert.equal(updated.seriesStartDate, '2026-10-28');
  assert.equal(updated.seriesIndex, 0);
  assert.equal(updated.repeatAnchorDay, 28);
  assert.equal(updated.occurrenceKey, 'new-series:0');
  assert.equal(updated.reminderId, 'todo-24-reminder');
});

test('updateTodoSchedule preserves series identity for time-only edits and clears reminder/repeat fields', () => {
  const updateTodoSchedule = feature('updateTodoSchedule');
  const original = {
    id: 25, date: '2026-10-25', time: '09:00', reminderMinutes: 15, reminderId: 'todo-25-reminder',
    repeat: 'weekly', seriesId: 'series-25', seriesStartDate: '2026-10-04', seriesIndex: 3,
    repeatAnchorDay: 4, occurrenceKey: 'series-25:3', timeZone: 'Asia/Shanghai'
  };
  const timeEdit = updateTodoSchedule(original, {
    date: '2026-10-25', time: '10:30', reminderMinutes: 30, repeat: 'weekly', timeZone: 'Asia/Shanghai'
  }, 'unused-series');
  assert.equal(timeEdit.seriesId, 'series-25');
  assert.equal(timeEdit.seriesIndex, 3);
  assert.equal(timeEdit.reminderMinutes, 30);
  assert.equal(timeEdit.reminderId, 'todo-25-reminder');

  const cleared = updateTodoSchedule(timeEdit, {
    date: '2026-10-25', time: null, reminderMinutes: null, repeat: null, timeZone: 'Asia/Shanghai'
  }, 'unused-series');
  assert.equal(cleared.time, null);
  assert.equal(cleared.reminderMinutes, null);
  assert.equal(cleared.reminderId, null);
  assert.equal(cleared.repeat, null);
  assert.equal(cleared.seriesId, null);
  assert.equal(cleared.occurrenceKey, null);
  assert.equal(cleared.timeZone, null);
});

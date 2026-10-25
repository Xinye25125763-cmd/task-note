const test = require('node:test');
const assert = require('node:assert/strict');
const TaskFeatures = require('../task-features.js');

const now = new Date('2026-02-01T12:00:00.000Z');

function repeatingTask(overrides = {}) {
  return {
    id: 7,
    text: '交付周报',
    flag: 2,
    date: '2026-02-01',
    time: '09:45',
    reminderMinutes: 15,
    reminderId: 'todo-7-reminder',
    repeat: 'weekly',
    seriesId: 'series-7',
    seriesStartDate: '2026-02-01',
    seriesIndex: 0,
    repeatAnchorDay: 1,
    occurrenceKey: 'series-7:0',
    generatedFrom: null,
    timeZone: 'UTC',
    done: true,
    createdAt: '2026-02-01T11:00:00.000Z',
    ...overrides
  };
}

test('createNextOccurrence creates the next occurrence and preserves its schedule', () => {
  const source = repeatingTask();
  const child = TaskFeatures.createNextOccurrence(source, [source], now, () => 8);

  assert.equal(child.id, 8);
  assert.equal(child.text, source.text);
  assert.equal(child.flag, source.flag);
  assert.equal(child.date, '2026-02-08');
  assert.equal(child.time, source.time);
  assert.equal(child.reminderMinutes, source.reminderMinutes);
  assert.equal(child.reminderId, 'todo-8-reminder');
  assert.notEqual(child.reminderId, source.reminderId);
  assert.equal(child.repeat, source.repeat);
  assert.equal(child.seriesId, source.seriesId);
  assert.equal(child.seriesStartDate, source.seriesStartDate);
  assert.equal(child.seriesIndex, 1);
  assert.equal(child.repeatAnchorDay, source.repeatAnchorDay);
  assert.equal(child.occurrenceKey, 'series-7:1');
  assert.equal(child.generatedFrom, '7');
  assert.equal(child.timeZone, source.timeZone);
  assert.equal(child.done, false);
  assert.equal(child.createdAt, now.toISOString());
});

test('createNextOccurrence ignores non-repeating or incomplete sources', () => {
  assert.equal(TaskFeatures.createNextOccurrence(repeatingTask({repeat:null}), [], now, () => 8), null);
  assert.equal(TaskFeatures.createNextOccurrence(repeatingTask({done:false}), [], now, () => 8), null);
});

test('createNextOccurrence is idempotent when that series occurrence already exists', () => {
  const source = repeatingTask();
  const existing = { ...source, id: 8, date: '2026-02-08', seriesIndex: 1, occurrenceKey: 'series-7:1' };
  let generatedIds = 0;
  const child = TaskFeatures.createNextOccurrence(source, [source, existing], now, () => { generatedIds++; return 9; });

  assert.equal(child, null);
  assert.equal(generatedIds, 0);
});

test('monthly generation preserves the original day after a shorter month', () => {
  const source = repeatingTask({
    date: '2026-01-31', repeat: 'monthly', seriesStartDate: '2026-01-31',
    seriesIndex: 0, repeatAnchorDay: 31, occurrenceKey: 'series-7:0'
  });
  const child = TaskFeatures.createNextOccurrence(source, [source], new Date('2026-02-28T23:00:00.000Z'), () => 8);

  assert.equal(child.date, '2026-03-31');
  assert.equal(child.seriesIndex, 2);
  assert.equal(child.repeatAnchorDay, 31);
});

test('missed periods are skipped using the task time zone local date', () => {
  const source = repeatingTask({
    date: '2026-02-01', repeat: 'daily', seriesStartDate: '2026-02-01',
    seriesIndex: 0, occurrenceKey: 'series-7:0', timeZone: 'Pacific/Kiritimati'
  });
  const child = TaskFeatures.createNextOccurrence(source, [source], new Date('2026-02-01T12:30:00.000Z'), () => 8);

  assert.equal(child.date, '2026-02-03');
  assert.equal(child.seriesIndex, 2);
});

test('a recurring series without reminders keeps reminder IDs empty', () => {
  const source = repeatingTask({ reminderMinutes: null, reminderId: null });
  const child = TaskFeatures.createNextOccurrence(source, [source], now, () => 8);

  assert.equal(child.reminderMinutes, null);
  assert.equal(child.reminderId, null);
});

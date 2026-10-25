const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

test('date picker exposes an accessible 24-hour time input', () => {
  assert.match(html, /<input[^>]*type="time"[^>]*id="dp-time-input"[^>]*aria-label="截止时间"/);
});

test('date picker exposes all reminder offsets as a labeled select', () => {
  const start = html.indexOf('id="dp-reminder-select"');
  assert.notEqual(start, -1, 'reminder selector exists');
  const selector = html.slice(html.lastIndexOf('<select', start), html.indexOf('</select>', start) + '</select>'.length);
  assert.match(selector, /aria-label="提醒时间"/);
  for (const value of ['', '0', '5', '15', '30', '60']) assert.match(selector, new RegExp(`value="${value}"`));
  assert.match(html, /for="dp-reminder-select"[^>]*>提醒</);
});

test('date picker exposes the supported repeat rules as a labeled select', () => {
  const start = html.indexOf('id="dp-repeat-select"');
  assert.notEqual(start, -1, 'repeat selector exists');
  const selector = html.slice(html.lastIndexOf('<select', start), html.indexOf('</select>', start) + '</select>'.length);
  assert.match(selector, /aria-label="重复周期"/);
  for (const value of ['', 'daily', 'weekly', 'monthly']) assert.match(selector, new RegExp(`value="${value}"`));
  assert.match(html, /for="dp-repeat-select"[^>]*>重复</);
});

test('saved todos expose an accessible action that opens their schedule in the date picker', () => {
  assert.match(app, /class="todo-schedule-edit"[^>]*openTodoScheduleEditor\(/);
  assert.match(app, /function openTodoScheduleEditor\(/);
  assert.match(app, /TaskFeatures\.updateTodoSchedule\(todo/);
  assert.match(app, /function closeDatePicker\(/);
});

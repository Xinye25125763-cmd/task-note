const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

test('todo badge starts hidden and CSS honors the hidden state', () => {
  assert.match(html, /<span class="badge" id="todo-badge" hidden>0<\/span>/);
  assert.match(css, /\.nav-item \.badge\[hidden\]\s*\{\s*display:\s*none\s*;?\s*\}/);
});

test('todo badge hides at zero and shows the count for today’s incomplete todos', () => {
  const updateBadgeSource = app.match(/function updateBadge\(\)\s*\{[\s\S]*?\n\}/)?.[0];
  assert.ok(updateBadgeSource, 'updateBadge() exists');

  const badge = { hidden: false };
  Object.defineProperty(badge, 'textContent', {
    get() { return this.text; },
    set(value) { this.text = String(value); }
  });
  const data = { todos: [] };
  const updateBadge = vm.runInNewContext(`(${updateBadgeSource})`, {
    data,
    document: { getElementById: id => id === 'todo-badge' ? badge : null },
    today: () => '2026-10-25'
  });

  updateBadge();
  assert.equal(badge.textContent, '0');
  assert.equal(badge.hidden, true);

  data.todos = [
    { done: false, date: '2026-10-25' },
    { done: false, date: '2026-10-25' },
    { done: true, date: '2026-10-25' },
    { done: false, date: '2026-10-26' }
  ];
  updateBadge();
  assert.equal(badge.textContent, '2');
  assert.equal(badge.hidden, false);
});

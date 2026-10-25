const TaskFeatures = (() => {
  const REMINDER_MINUTES = new Set([0, 5, 15, 30, 60]);
  const REPEAT_RULES = new Set(['daily', 'weekly', 'monthly']);

  function parseReminderMinutes(value) {
    return Number.isInteger(value) && REMINDER_MINUTES.has(value) ? value : null;
  }

  function updateTodoSchedule(todo, schedule, newSeriesId) {
    if (!todo || typeof todo !== 'object' || !schedule || typeof schedule !== 'object') return null;
    if (!parseIsoDate(schedule.date)) return null;

    const time = schedule.time === null || schedule.time === '' ? null : schedule.time;
    if (time !== null && (typeof time !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))) return null;

    const date = schedule.date;
    const reminderMinutes = time ? parseReminderMinutes(schedule.reminderMinutes) : null;
    const repeat = REPEAT_RULES.has(schedule.repeat) ? schedule.repeat : null;
    const hasCurrentSeries = REPEAT_RULES.has(todo.repeat) && typeof todo.seriesId === 'string' && todo.seriesId.trim();
    const startsNewSeries = repeat && (!hasCurrentSeries || todo.repeat !== repeat || todo.date !== date);
    if (startsNewSeries && (typeof newSeriesId !== 'string' || !newSeriesId.trim())) return null;

    const timeZone = (repeat || reminderMinutes !== null)
      ? (validTimeZone(schedule.timeZone) ? schedule.timeZone : (validTimeZone(todo.timeZone) ? todo.timeZone : 'UTC'))
      : null;
    const updated = {
      ...todo,
      date,
      time,
      reminderMinutes,
      reminderId: reminderMinutes === null ? null : (typeof todo.reminderId === 'string' && todo.reminderId.trim()
        ? todo.reminderId
        : `todo-${todo.id}-reminder`),
      repeat,
      timeZone
    };

    if (!repeat) {
      Object.assign(updated, {
        seriesId: null,
        seriesStartDate: null,
        seriesIndex: null,
        repeatAnchorDay: null,
        occurrenceKey: null
      });
    } else if (startsNewSeries) {
      const day = parseIsoDate(date).day;
      Object.assign(updated, {
        seriesId: newSeriesId,
        seriesStartDate: date,
        seriesIndex: 0,
        repeatAnchorDay: day,
        occurrenceKey: `${newSeriesId}:0`
      });
    }

    return updated;
  }

  function parseIsoDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(0);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCFullYear(year, month - 1, day);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return { year, month, day };
  }

  function validTimeZone(value) {
    if (typeof value !== 'string' || !value) return false;
    try {
      new Intl.DateTimeFormat('en', { timeZone: value }).format(0);
      return true;
    } catch (_) {
      return false;
    }
  }

  function localDateAt(instant, timeZone) {
    if (!(instant instanceof Date) || !Number.isFinite(instant.getTime()) || !validTimeZone(timeZone)) return null;
    const parts = new Intl.DateTimeFormat('en', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(instant);
    const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
    return `${values.year.padStart(4, '0')}-${values.month}-${values.day}`;
  }

  function dateAtIndex(start, repeat, index, anchorDay) {
    if (repeat === 'daily' || repeat === 'weekly') {
      const parts = parseIsoDate(start);
      const date = new Date(0);
      date.setUTCHours(0, 0, 0, 0);
      const days = index * (repeat === 'weekly' ? 7 : 1);
      date.setUTCFullYear(parts.year, parts.month - 1, parts.day + days);
      return date.toISOString().slice(0, 10);
    }

    const parts = parseIsoDate(start);
    const monthIndex = parts.month - 1 + index;
    const year = parts.year + Math.floor(monthIndex / 12);
    const month = monthIndex % 12 + 1;
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const day = Math.min(anchorDay, lastDay);
    const yearText = String(year).padStart(4, '0');
    return `${yearText}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function nextOccurrence(task, now = new Date()) {
    if (!task || !REPEAT_RULES.has(task.repeat) || typeof task.seriesId !== 'string' || !task.seriesId) return null;
    const start = parseIsoDate(task.seriesStartDate || task.date);
    const currentIndex = Number.isSafeInteger(task.seriesIndex) && task.seriesIndex >= 0 ? task.seriesIndex : 0;
    const startDate = task.seriesStartDate || task.date;
    const anchorDay = Number.isInteger(task.repeatAnchorDay) && task.repeatAnchorDay >= 1 && task.repeatAnchorDay <= 31
      ? task.repeatAnchorDay
      : start?.day;
    const today = localDateAt(now, task.timeZone);
    if (!start || !anchorDay || !today) return null;

    for (let index = currentIndex + 1; index <= currentIndex + 100000; index++) {
      const date = dateAtIndex(startDate, task.repeat, index, anchorDay);
      if (date > today) {
        return { date, seriesIndex: index, occurrenceKey: `${task.seriesId}:${index}` };
      }
    }
    return null;
  }

  function createNextOccurrence(source, allTodos, now = new Date(), genId) {
    if (!source || source.done !== true || !Array.isArray(allTodos) || typeof genId !== 'function') return null;
    if (!REPEAT_RULES.has(source.repeat) || typeof source.seriesId !== 'string' || !source.seriesId) return null;

    const next = nextOccurrence(source, now);
    if (!next) return null;
    const alreadyExists = allTodos.some(todo => todo && (
      todo.occurrenceKey === next.occurrenceKey ||
      (todo.seriesId === source.seriesId && todo.seriesIndex === next.seriesIndex)
    ));
    if (alreadyExists) return null;

    const id = genId();
    const reminderMinutes = parseReminderMinutes(source.reminderMinutes);
    const timeIsValid = typeof source.time === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(source.time);
    const reminderEnabled = reminderMinutes !== null && timeIsValid;
    return {
      ...source,
      id,
      date: next.date,
      reminderMinutes: reminderEnabled ? reminderMinutes : null,
      reminderId: reminderEnabled ? `todo-${id}-reminder` : null,
      seriesIndex: next.seriesIndex,
      occurrenceKey: next.occurrenceKey,
      generatedFrom: String(source.id),
      done: false,
      createdAt: now.toISOString()
    };
  }

  function normalizeTodoV3(todo) {
    if (!todo || typeof todo !== 'object' || Array.isArray(todo)) return todo;
    const repeat = REPEAT_RULES.has(todo.repeat) ? todo.repeat : null;
    const seriesStartDate = repeat
      ? (parseIsoDate(todo.seriesStartDate) ? todo.seriesStartDate : (parseIsoDate(todo.date) ? todo.date : null))
      : null;
    const seriesId = repeat && typeof todo.seriesId === 'string' && todo.seriesId.trim() ? todo.seriesId : null;
    const seriesIndex = repeat
      ? (Number.isSafeInteger(todo.seriesIndex) && todo.seriesIndex >= 0 ? todo.seriesIndex : 0)
      : null;
    const suppliedAnchor = todo.repeatAnchorDay;
    const repeatAnchorDay = repeat
      ? (Number.isInteger(suppliedAnchor) && suppliedAnchor >= 1 && suppliedAnchor <= 31
        ? suppliedAnchor
        : (parseIsoDate(seriesStartDate)?.day ?? null))
      : null;
    const occurrenceKey = repeat && seriesId && Number.isSafeInteger(seriesIndex)
      ? `${seriesId}:${seriesIndex}`
      : null;
    const reminderMinutes = parseReminderMinutes(todo.reminderMinutes);

    return {
      ...todo,
      reminderMinutes,
      reminderId: reminderMinutes !== null && typeof todo.reminderId === 'string' && todo.reminderId.trim()
        ? todo.reminderId
        : null,
      repeat,
      seriesId,
      seriesStartDate,
      seriesIndex,
      repeatAnchorDay,
      timeZone: validTimeZone(todo.timeZone) ? todo.timeZone : null,
      occurrenceKey,
      generatedFrom: typeof todo.generatedFrom === 'string' && todo.generatedFrom ? todo.generatedFrom : null
    };
  }

  return { parseReminderMinutes, updateTodoSchedule, nextOccurrence, createNextOccurrence, normalizeTodoV3 };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = TaskFeatures;
if (typeof globalThis !== 'undefined') globalThis.TaskFeatures = TaskFeatures;

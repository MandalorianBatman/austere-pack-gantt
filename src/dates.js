// Pure date and layout helpers for the Gantt pack: no React, no DOM, so they
// run under `node --test` without a build. Dates are "YYYY-MM-DD" and are
// handled as UTC day numbers, so a time zone or a DST change never shifts a bar.

const DAY = 86_400_000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-09" -> UTC day number, or null when it is not a real calendar date. */
export function parseDay(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text ?? "").trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const ms = Date.UTC(y, mo - 1, d);
  const back = new Date(ms);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return ms / DAY;
}

const dateOf = (day) => new Date(day * DAY);

/** "Nov 9" (or "Nov" when `monthOnly`). */
export function labelDay(day, monthOnly = false) {
  const d = dateOf(day);
  return monthOnly ? MONTHS[d.getUTCMonth()] : `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

const isMonday = (day) => dateOf(day).getUTCDay() === 1;
const isFirst = (day) => dateOf(day).getUTCDate() === 1;

const MAX_TICKS = 8;

/** Axis ticks between first and last (inclusive): the finest unit that fits MAX_TICKS labels. */
export function axisTicks(first, last) {
  const days = [];
  for (let d = first; d <= last; d++) days.push(d);
  const units = [
    { keep: () => true, monthOnly: false },
    { keep: (d) => (d - first) % 2 === 0, monthOnly: false },
    { keep: isMonday, monthOnly: false },
    { keep: (d) => isMonday(d) && Math.round(d / 7) % 2 === 0, monthOnly: false },
    { keep: isFirst, monthOnly: true },
  ];
  for (const u of units) {
    const picked = days.filter(u.keep);
    if (picked.length && picked.length <= MAX_TICKS) return picked.map((day) => ({ day, label: labelDay(day, u.monthOnly) }));
  }
  // Very long ranges: month starts, thinned evenly.
  const months = days.filter(isFirst);
  const step = Math.ceil(months.length / MAX_TICKS) || 1;
  return months.filter((_, i) => i % step === 0).map((day) => ({ day, label: labelDay(day, true) }));
}

const clampPct = (n) => Math.min(100, Math.max(0, Number(n) || 0));

/**
 * Rows and axis for a list of { name, start, end, progress, owner }.
 * A task with no `end` is a milestone (one day, drawn as a diamond). A row whose
 * dates do not parse, or whose end is before its start, keeps its place with an
 * `error` and no bar, so one typo never hides the chart.
 * @returns {{ first: number, last: number, span: number, ticks: {day:number,label:string}[], rows: object[] } | null} null when no row has valid dates
 */
export function layout(tasks) {
  const rows = tasks.map((t) => {
    const start = parseDay(t.start);
    const hasEnd = String(t.end ?? "").trim() !== "";
    const end = hasEnd ? parseDay(t.end) : start;
    const row = { name: String(t.name ?? ""), owner: String(t.owner ?? ""), progress: clampPct(t.progress), milestone: !hasEnd };
    if (start === null) return { ...row, error: `start "${t.start ?? ""}" is not YYYY-MM-DD` };
    if (end === null) return { ...row, error: `end "${t.end}" is not YYYY-MM-DD` };
    if (end < start) return { ...row, error: "ends before it starts" };
    return { ...row, start, end };
  });
  const valid = rows.filter((r) => !r.error);
  if (!valid.length) return null;
  const first = Math.min(...valid.map((r) => r.start));
  const last = Math.max(...valid.map((r) => r.end));
  const span = last - first + 1;
  return {
    first,
    last,
    span,
    ticks: axisTicks(first, last),
    rows: rows.map((r) =>
      r.error ? r : { ...r, left: ((r.start - first) / span) * 100, width: ((r.end - r.start + 1) / span) * 100, startLabel: labelDay(r.start), endLabel: labelDay(r.end) },
    ),
  };
}

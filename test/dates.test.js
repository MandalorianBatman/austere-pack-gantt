import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDay, axisTicks, layout } from "../src/dates.js";

test("parseDay accepts real calendar dates only", () => {
  assert.equal(parseDay("2026-11-09") - parseDay("2026-11-02"), 7);
  assert.equal(parseDay("2026-03-01") - parseDay("2026-02-28"), 1);
  assert.equal(parseDay("2028-03-01") - parseDay("2028-02-28"), 2, "leap year");
  for (const bad of ["2026-02-30", "2026-13-01", "11/09/2026", "next tuesday", "", null, undefined]) assert.equal(parseDay(bad), null, String(bad));
});

test("a DST change does not shift a bar", () => {
  const p = layout([{ name: "a", start: "2026-03-01", end: "2026-03-31" }]);
  assert.equal(p.span, 31);
  assert.equal(p.rows[0].width, 100);
});

test("axis uses the finest unit that fits 8 labels", () => {
  const day = (s) => parseDay(s);
  assert.equal(axisTicks(day("2026-11-02"), day("2026-11-08")).length, 7, "a week: every day");
  const month = axisTicks(day("2026-11-02"), day("2026-12-14"));
  assert.ok(month.length <= 8);
  assert.ok(month.every((t) => new Date(t.day * 86_400_000).getUTCDay() === 1), "weeks start on Monday");
  const year = axisTicks(day("2026-01-01"), day("2027-06-30"));
  assert.ok(year.length > 1 && year.length <= 8);
  assert.ok(year.every((t) => /^[A-Z][a-z]{2}$/.test(t.label)), "long ranges label months");
});

test("layout positions bars on the shared axis", () => {
  const p = layout([
    { name: "first", start: "2026-11-01", end: "2026-11-10" },
    { name: "second", start: "2026-11-06", end: "2026-11-20", progress: 40 },
  ]);
  assert.equal(p.span, 20);
  assert.equal(p.rows[0].left, 0);
  assert.equal(p.rows[0].width, 50);
  assert.equal(p.rows[1].left, 25);
  assert.equal(p.rows[1].width, 75);
  assert.equal(p.rows[1].progress, 40);
});

test("no end means a milestone one day wide", () => {
  const p = layout([{ name: "a", start: "2026-11-01", end: "2026-11-10" }, { name: "ship", start: "2026-11-10" }, { name: "blank", start: "2026-11-02", end: "" }]);
  assert.equal(p.rows[1].milestone, true);
  assert.equal(p.rows[1].width, 10);
  assert.equal(p.rows[2].milestone, true);
});

test("bad rows keep their place and never hide the chart", () => {
  const p = layout([
    { name: "typo", start: "soon" },
    { name: "good", start: "2026-11-01", end: "2026-11-05" },
    { name: "backwards", start: "2026-11-05", end: "2026-11-01" },
    { name: "bad end", start: "2026-11-01", end: "later" },
  ]);
  assert.deepEqual(p.rows.map((r) => r.name), ["typo", "good", "backwards", "bad end"]);
  assert.match(p.rows[0].error, /start "soon"/);
  assert.equal(p.rows[1].error, undefined);
  assert.match(p.rows[2].error, /before/);
  assert.match(p.rows[3].error, /end "later"/);
  assert.equal(p.span, 5, "invalid rows do not stretch the axis");
});

test("layout is null when no row has valid dates; progress is clamped", () => {
  assert.equal(layout([{ name: "x", start: "?" }]), null);
  assert.equal(layout([]), null);
  const p = layout([{ name: "a", start: "2026-11-01", end: "2026-11-02", progress: 250 }, { name: "b", start: "2026-11-01", progress: -5 }]);
  assert.deepEqual([p.rows[0].progress, p.rows[1].progress], [100, 0]);
});

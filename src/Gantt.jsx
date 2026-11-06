// Two components: GanttTask is a value-only child (it renders nothing itself,
// `slots: null`); Gantt reads its tasks' props and draws the chart.
import React from "react";
import { z } from "zod";
import { austereComponent } from "austere-axi/pack";
import { layout } from "./dates.js";

const nothing = () => null;

export const GanttTask = austereComponent({
  name: "GanttTask",
  group: "Data",
  props: z.object({
    name: z.string(),
    start: z.string(),
    end: z.string().optional(),
    progress: z.number().optional(),
    owner: z.string().optional(),
  }),
  description: 'One bar in a Gantt. start and end are "YYYY-MM-DD" (end inclusive; omit or "" for a one-day milestone). progress is 0-100; owner is a short label.',
  renderer: nothing,
  slots: null,
  tagged: false,
});

function GanttView({ props }) {
  // Children arrive as parsed elements; ignore anything that is not a GanttTask.
  const tasks = (Array.isArray(props.tasks) ? props.tasks : []).filter((el) => el && el.props).map((el) => el.props);
  const plan = layout(tasks);
  const rows = plan ? plan.rows : tasks.map((t) => ({ name: String(t.name ?? ""), owner: String(t.owner ?? ""), error: "no task has valid dates" }));
  return (
    <div className="pack-gantt">
      {props.title ? <div className="pack-gantt-title">{props.title}</div> : null}
      {plan ? (
        <div className="pack-gantt-row pack-gantt-axis" aria-hidden="true">
          <span />
          <div className="pack-gantt-track">
            {plan.ticks.map((t) => (
              <span key={t.day} style={{ left: `${((t.day - plan.first + 0.5) / plan.span) * 100}%` }}>
                {t.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {rows.map((r, i) => (
        // data-austere-part makes each task its own annotation target.
        <div className="pack-gantt-row" key={i} data-austere-part={r.name}>
          <div className="pack-gantt-label">
            <span className="pack-gantt-name">{r.name}</span>
            {r.owner ? <span className="pack-gantt-owner">{r.owner}</span> : null}
          </div>
          <div className="pack-gantt-track">
            {r.error ? (
              <span className="pack-gantt-error">{r.error}</span>
            ) : (
              <div
                className={`pack-gantt-bar${r.milestone ? " is-milestone" : ""}${r.progress >= 100 ? " is-done" : ""}`}
                style={r.milestone ? { left: `${r.left + r.width / 2}%` } : { left: `${r.left}%`, width: `${r.width}%` }}
                title={`${r.name}: ${r.milestone ? r.startLabel : `${r.startLabel} to ${r.endLabel}`}${r.progress ? `, ${Math.round(r.progress)}%` : ""}`}
              >
                {r.milestone ? null : <span className="pack-gantt-fill" style={{ width: `${r.progress}%` }} />}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export const Gantt = austereComponent({
  name: "Gantt",
  group: "Data",
  props: z.object({ tasks: z.array(GanttTask.definition.ref), title: z.string().optional() }),
  description: "Gantt chart: GanttTasks as bars on a shared date axis, in the order given. Each bar is a click target.",
  renderer: GanttView,
  example: `plan = Gantt([design, build, review, launch], "Q4 rollout")
design = GanttTask("Design", "2026-11-02", "2026-11-13", 100, "Ada")
build = GanttTask("Build", "2026-11-09", "2026-12-04", 45, "Grace")
review = GanttTask("Security review", "2026-12-01", "2026-12-11", 0, "Linus")
launch = GanttTask("Launch", "2026-12-14")`,
  stress: `stressPlan = Gantt([typo, backwards, ok, longName], "<img src=x onerror=alert(1)>")
typo = GanttTask("Typo", "next tuesday")
backwards = GanttTask("Time travel", "2026-12-04", "2026-11-01")
ok = GanttTask("One day", "2026-11-03", "2026-11-03", 250)
longName = GanttTask("A task name that keeps going so it has to wrap in the label column on a phone", "2026-11-05", "2026-11-20", 10, "someone-with-a-long-handle")`,
});

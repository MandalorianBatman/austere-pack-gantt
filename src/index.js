// The pack: every component it adds, plus CSS the runtime puts on the page once.
import { Gantt, GanttTask } from "./Gantt.jsx";
import css from "./style.css";

export default { components: [Gantt, GanttTask], css };

import { CURRENT_USER } from "@/data/households";
import type { Task } from "@/data/tasks";
import { TODAY, addDays } from "@/lib/households";
import type { TasksTab } from "@/stores/households-store";

export const ANY_PRIORITY = "any";

export const TASK_GROUPS = [
  "Overdue",
  "Today",
  "This week",
  "Later",
  "No due date",
  "Done",
] as const;

export type TaskGroup = (typeof TASK_GROUPS)[number];

export function taskGroup(task: Task): TaskGroup {
  if (task.status === "done") return "Done";
  if (!task.due) return "No due date";
  if (task.due < TODAY) return "Overdue";
  if (task.due === TODAY) return "Today";
  if (task.due <= addDays(TODAY, 7)) return "This week";
  return "Later";
}

const PRIORITY_RANK = { urgent: 0, high: 1, medium: 2, low: 3 } as const;

export function filterTasks(tasks: Task[], tab: TasksTab, priority: string) {
  return tasks
    .filter((task) => tab === "all" || task.assignee === CURRENT_USER.name)
    .filter((task) => priority === ANY_PRIORITY || task.priority === priority)
    .sort((a, b) => {
      const due = (a.due ?? "9999").localeCompare(b.due ?? "9999");
      return due !== 0
        ? due
        : PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    });
}

export function groupTasks(tasks: Task[]) {
  return TASK_GROUPS.map((group) => ({
    group,
    tasks: tasks.filter((task) => taskGroup(task) === group),
  })).filter((entry) => entry.tasks.length > 0);
}

export function openCount(tasks: Task[], tab: TasksTab) {
  return filterTasks(tasks, tab, ANY_PRIORITY).filter(
    (task) => task.status === "todo",
  ).length;
}

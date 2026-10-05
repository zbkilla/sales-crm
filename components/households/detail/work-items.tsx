"use client";

import { Checkbox } from "@/components/_ui/checkbox";
import Tag from "@/components/_ui/tag";
import { PRIORITY_LABELS, PRIORITY_TONES, type Task } from "@/data/tasks";
import { TODAY, formatDate } from "@/lib/households";
import { cn } from "@/lib/utils";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
};

export function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <ul className="flex flex-col gap-2.5">
      {tasks.map((task) => {
        const overdue = task.due !== null && task.due < TODAY;
        return (
          <li key={task.id} className="flex items-start gap-2.5">
            <Checkbox
              checked={task.status === "done"}
              onCheckedChange={() => onToggle(task.id)}
              aria-label={`Complete ${task.title}`}
              className="mt-px"
            />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span>{task.title}</span>
              <span className="caption-style text-subtle flex items-center gap-2">
                <Tag tone={PRIORITY_TONES[task.priority]} size="sm">
                  {PRIORITY_LABELS[task.priority]}
                </Tag>
                <span className={cn("tabular-nums", overdue && "text-danger")}>
                  {task.due ? `Due ${formatDate(task.due)}` : "No due date"}
                </span>
                <span>· {task.assignee}</span>
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

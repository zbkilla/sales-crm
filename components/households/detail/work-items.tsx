"use client";

import { Checkbox } from "@/components/_ui/checkbox";
import Tag from "@/components/_ui/tag";
import SegmentBar from "@/components/_common/segment-bar";
import { PROJECT_TYPES, type Project } from "@/data/projects";
import { PRIORITY_LABELS, PRIORITY_TONES, type Task } from "@/data/tasks";
import { TODAY, formatDate } from "@/lib/households";
import { cn } from "@/lib/utils";

type ProjectListProps = {
  projects: Project[];
};

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ul className="divide-line-strong flex flex-col divide-y">
      {projects.map((project) => {
        const type = PROJECT_TYPES.find((item) => item.id === project.typeId);
        const milestones = type?.milestones ?? [];
        const progress = Math.round(
          ((project.milestoneIndex + project.milestoneProgress / 100) /
            Math.max(1, milestones.length)) *
            100,
        );
        const overdue = project.dueDate < TODAY;
        return (
          <li
            key={project.id}
            className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate">{project.name}</span>
                <span className="caption-style text-subtle">
                  {milestones[project.milestoneIndex]} · milestone{" "}
                  {project.milestoneIndex + 1} of {milestones.length}
                </span>
              </div>
              <span
                className={cn(
                  "caption-style shrink-0 tabular-nums",
                  overdue ? "text-danger" : "text-soft",
                )}
              >
                Due {formatDate(project.dueDate)}
              </span>
            </div>
            <div className="caption-style flex items-center gap-2">
              <SegmentBar
                percent={progress}
                segments={48}
                tone="success"
                className="h-3 flex-1 border border-white/4 px-px"
                segmentClassName="h-2"
                trackClassName="bg-white/8"
              />
              <span className="text-soft w-[4ch] text-right tabular-nums">
                {progress}%
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

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

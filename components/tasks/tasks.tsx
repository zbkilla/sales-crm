"use client";

import { useMemo, useState, type FormEvent } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { Checkbox } from "@/components/_ui/checkbox";
import CountBadge from "@/components/_ui/count-badge";
import { Input } from "@/components/_ui/input";
import { ScrollArea } from "@/components/_ui/scroll-area";
import Tag from "@/components/_ui/tag";
import FilterMenu from "@/components/_common/filter-menu";
import HouseholdMark from "@/components/_common/household-mark";
import PageHeader from "@/components/_common/page-header";
import { CURRENT_USER, profileByName } from "@/data/households";
import {
  PRIORITY_LABELS,
  PRIORITY_TONES,
  TASK_PRIORITIES,
  type Task,
} from "@/data/tasks";
import { TODAY, formatDate } from "@/lib/households";
import { ANY_PRIORITY, filterTasks, groupTasks, openCount } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { useHouseholdsStore, type TasksTab } from "@/stores/households-store";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

const PRIORITY_OPTIONS = [
  { value: ANY_PRIORITY, label: "Any" },
  ...TASK_PRIORITIES.map((priority) => ({
    value: priority,
    label: PRIORITY_LABELS[priority],
  })),
];

export default function Tasks() {
  const tasks = useHouseholdsStore((state) => state.tasks);
  const households = useHouseholdsStore((state) => state.households);
  const tab = useHouseholdsStore((state) => state.tasksTab);
  const priority = useHouseholdsStore((state) => state.tasksPriority);
  const setTab = useHouseholdsStore((state) => state.setTasksTab);
  const setPriority = useHouseholdsStore((state) => state.setTasksPriority);
  const toggleTask = useHouseholdsStore((state) => state.toggleTask);
  const addTask = useHouseholdsStore((state) => state.addTask);
  const openDetail = useHouseholdsStore((state) => state.openDetail);
  const [draft, setDraft] = useState("");

  const visible = useMemo(
    () => filterTasks(tasks, tab, priority),
    [tasks, tab, priority],
  );
  const groups = groupTasks(visible);

  function householdName(id: string | null) {
    return households.find((household) => household.id === id)?.name;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    addTask({
      id: `t-${Date.now()}`,
      title,
      householdId: null,
      assignee: CURRENT_USER.name,
      due: TODAY,
      priority: "medium",
      status: "todo",
      source: "Manual",
    });
    setDraft("");
  }

  return (
    <section id="tasks" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader
        title="Tasks"
        tabs={[
          { value: "mine", label: "My tasks", count: openCount(tasks, "mine") },
          { value: "all", label: "All tasks", count: openCount(tasks, "all") },
        ]}
        activeTab={tab}
        onTabChange={(value) => setTab(value as TasksTab)}
      />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-4">
        <FilterMenu
          label="Priority"
          value={priority}
          options={PRIORITY_OPTIONS}
          onChange={setPriority}
        />
        <form
          onSubmit={submit}
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a task due today…"
            aria-label="New task title"
            className="h-[30px] sm:w-[22em]"
          />
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={!draft.trim()}
          >
            <PlusIcon aria-hidden className="size-3" />
            Add
          </Button>
        </form>
      </div>

      <div className="border-border min-h-0 flex-1 border-t">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 p-4">
            {groups.map(({ group, tasks: groupTasksList }) => (
              <section
                key={group}
                aria-label={group}
                className="flex flex-col gap-2"
              >
                <h2
                  className={cn(
                    "eyebrow-style flex items-center gap-2 font-normal",
                    group === "Overdue" && "text-danger",
                  )}
                >
                  {group}
                  <CountBadge>{groupTasksList.length}</CountBadge>
                </h2>
                <ul className="divide-line-strong border-line-strong flex flex-col divide-y rounded-lg border">
                  {groupTasksList.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      showAssignee={tab === "all"}
                      householdName={householdName(task.householdId)}
                      onToggle={() => toggleTask(task.id)}
                      onOpenHousehold={() =>
                        task.householdId && openDetail(task.householdId)
                      }
                    />
                  ))}
                </ul>
              </section>
            ))}
            {groups.length === 0 && (
              <p className="caption-style text-muted-foreground py-12 text-center">
                No tasks match the current filters.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}

type TaskRowProps = {
  task: Task;
  showAssignee: boolean;
  householdName?: string;
  onToggle: () => void;
  onOpenHousehold: () => void;
};

function TaskRow({
  task,
  showAssignee,
  householdName,
  onToggle,
  onOpenHousehold,
}: TaskRowProps) {
  const done = task.status === "done";
  const overdue = !done && task.due !== null && task.due < TODAY;
  const assignee = profileByName(task.assignee);

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5">
      <Checkbox
        checked={done}
        onCheckedChange={onToggle}
        aria-label={`${done ? "Reopen" : "Complete"} ${task.title}`}
      />
      <span
        className={cn(
          "min-w-0 flex-1 basis-[16em]",
          done && "text-subtle line-through",
        )}
      >
        {task.title}
      </span>
      <span className="caption-style flex flex-wrap items-center gap-2">
        {householdName && (
          <Button
            variant="ghost"
            size="none"
            onClick={onOpenHousehold}
            className="text-soft gap-1.5 rounded-md px-1 py-0.5 font-normal"
          >
            <HouseholdMark
              name={householdName}
              className="size-4 rounded"
              textClassName="text-[7px] leading-none"
            />
            {householdName}
          </Button>
        )}
        <Tag tone={PRIORITY_TONES[task.priority]} size="sm">
          {PRIORITY_LABELS[task.priority]}
        </Tag>
        <Tag tone="neutral" size="sm">
          {task.source}
        </Tag>
        {showAssignee && (
          <span className="text-soft flex items-center gap-1">
            <Avatar src={assignee.avatar} alt="" className="size-4" />
            {assignee.name}
          </span>
        )}
        <span
          className={cn(
            "w-[11ch] text-right tabular-nums",
            overdue ? "text-danger" : "text-soft",
          )}
        >
          {done && task.completedAt
            ? `Done ${formatDate(task.completedAt)}`
            : task.due
              ? formatDate(task.due)
              : "No date"}
        </span>
      </span>
    </li>
  );
}

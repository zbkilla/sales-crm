"use client";

import { useMemo } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import Tag from "@/components/_ui/tag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/_ui/table";
import FilterMenu from "@/components/_common/filter-menu";
import HouseholdMark from "@/components/_common/household-mark";
import PageHeader from "@/components/_common/page-header";
import SegmentBar from "@/components/_common/segment-bar";
import { profileByName } from "@/data/households";
import { PROJECT_TYPES, type Project } from "@/data/projects";
import { TODAY, formatDate } from "@/lib/households";
import { cn } from "@/lib/utils";
import {
  useHouseholdsStore,
  type ProjectsTab,
} from "@/stores/households-store";

const ANY_TYPE = "any";

const TYPE_OPTIONS = [
  { value: ANY_TYPE, label: "All types" },
  ...PROJECT_TYPES.map((type) => ({ value: type.id, label: type.name })),
];

const COLUMNS = [
  { key: "project", label: "Project", className: "justify-start" },
  { key: "household", label: "Household", className: "justify-start" },
  { key: "milestone", label: "Current Milestone", className: "justify-start" },
  { key: "progress", label: "Progress", className: "justify-start" },
  { key: "assignee", label: "Assignee", className: "justify-start" },
  { key: "due", label: "Due", className: "justify-start" },
  { key: "action", label: "Action", className: "justify-end" },
];

const GRID_CLASS =
  "grid min-w-max grid-cols-[repeat(7,max-content)] justify-between";
const ROW_CLASS = "col-span-full grid grid-cols-subgrid";
const CELL_CLASS = "flex items-center";

function projectType(project: Project) {
  return PROJECT_TYPES.find((type) => type.id === project.typeId);
}

function overallProgress(project: Project) {
  if (project.status === "completed") return 100;
  const total = projectType(project)?.milestones.length ?? 1;
  return Math.round(
    ((project.milestoneIndex + project.milestoneProgress / 100) / total) * 100,
  );
}

export default function Projects() {
  const projects = useHouseholdsStore((state) => state.projects);
  const households = useHouseholdsStore((state) => state.households);
  const tab = useHouseholdsStore((state) => state.projectsTab);
  const typeFilter = useHouseholdsStore((state) => state.projectsType);
  const setTab = useHouseholdsStore((state) => state.setProjectsTab);
  const setTypeFilter = useHouseholdsStore((state) => state.setProjectsType);
  const advanceMilestone = useHouseholdsStore(
    (state) => state.advanceMilestone,
  );
  const openDetail = useHouseholdsStore((state) => state.openDetail);

  const visible = useMemo(
    () =>
      projects
        .filter((project) =>
          tab === "active"
            ? project.status === "in_progress"
            : project.status !== "in_progress",
        )
        .filter(
          (project) => typeFilter === ANY_TYPE || project.typeId === typeFilter,
        )
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [projects, tab, typeFilter],
  );
  const activeCount = projects.filter(
    (project) => project.status === "in_progress",
  ).length;
  const overdueCount = projects.filter(
    (project) => project.status === "in_progress" && project.dueDate < TODAY,
  ).length;

  return (
    <section id="projects" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader
        title="Projects"
        tabs={[
          { value: "active", label: "Active", count: activeCount },
          {
            value: "completed",
            label: "Completed",
            count: projects.length - activeCount,
          },
        ]}
        activeTab={tab}
        onTabChange={(value) => setTab(value as ProjectsTab)}
      />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-4">
        <FilterMenu
          label="Type"
          value={typeFilter}
          options={TYPE_OPTIONS}
          onChange={setTypeFilter}
        />
        {tab === "active" && overdueCount > 0 && (
          <span className="caption-style text-danger">
            {overdueCount} {overdueCount === 1 ? "project is" : "projects are"}{" "}
            past due
          </span>
        )}
      </div>

      <div className="border-border flex min-h-0 flex-1 flex-col border-t">
        <ScrollArea orientation="both" className="min-h-0 flex-1">
          <Table role="table" className={cn(GRID_CLASS, "w-full")}>
            <TableHeader role="rowgroup" className="contents">
              <TableRow role="row" className={ROW_CLASS}>
                {COLUMNS.map((column) => (
                  <TableHead
                    key={column.key}
                    role="columnheader"
                    className={cn(CELL_CLASS, column.className)}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody role="rowgroup" className="contents">
              {visible.map((project) => {
                const type = projectType(project);
                const milestones = type?.milestones ?? [];
                const household = households.find(
                  (item) => item.id === project.householdId,
                );
                const assignee = profileByName(project.assignee);
                const progress = overallProgress(project);
                const overdue =
                  project.status === "in_progress" && project.dueDate < TODAY;
                const lastMilestone =
                  project.milestoneIndex >= milestones.length - 1;

                return (
                  <TableRow
                    key={project.id}
                    role="row"
                    className={cn(ROW_CLASS, "hover:bg-card/60")}
                  >
                    <TableCell role="cell" className={CELL_CLASS}>
                      <span className="flex flex-col gap-1">
                        <span>{project.name}</span>
                        <span className="caption-style text-subtle">
                          {type?.name}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      {household ? (
                        <Button
                          variant="ghost"
                          size="none"
                          onClick={() => openDetail(household.id)}
                          className="text-foreground -mx-1.5 gap-2 px-1.5 py-1 font-normal"
                        >
                          <HouseholdMark name={household.name} />
                          {household.name}
                        </Button>
                      ) : (
                        <span className="text-subtle">—</span>
                      )}
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      <span className="flex flex-col gap-1">
                        <span>
                          {project.status === "completed"
                            ? "Completed"
                            : milestones[project.milestoneIndex]}
                        </span>
                        <span className="caption-style text-subtle tabular-nums">
                          Milestone{" "}
                          {Math.min(
                            project.milestoneIndex + 1,
                            milestones.length,
                          )}{" "}
                          of {milestones.length}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      <span className="caption-style flex items-center gap-2">
                        <SegmentBar
                          percent={progress}
                          segments={24}
                          tone="success"
                          className="w-[120px]"
                        />
                        <span className="w-[4ch] text-right tabular-nums">
                          {progress}%
                        </span>
                      </span>
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      <span className="flex items-center gap-1.5">
                        <Avatar src={assignee.avatar} alt="" />
                        {assignee.name}
                      </span>
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      <span className="flex items-center gap-2">
                        <span className="tabular-nums">
                          {project.status === "completed" && project.completedAt
                            ? formatDate(project.completedAt)
                            : formatDate(project.dueDate)}
                        </span>
                        {overdue && (
                          <Tag tone="red" size="sm">
                            Overdue
                          </Tag>
                        )}
                        {project.status === "completed" && (
                          <Tag tone="green" size="sm">
                            Completed
                          </Tag>
                        )}
                      </span>
                    </TableCell>
                    <TableCell
                      role="cell"
                      className={cn(CELL_CLASS, "justify-end")}
                    >
                      {project.status === "in_progress" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => advanceMilestone(project.id)}
                        >
                          {lastMilestone
                            ? "Complete project"
                            : "Complete milestone"}
                        </Button>
                      ) : (
                        <span className="text-subtle">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {visible.length === 0 && (
                <TableRow role="row" className={ROW_CLASS}>
                  <td
                    role="cell"
                    className="caption-style text-muted-foreground col-span-full flex h-[120px] items-center justify-center"
                  >
                    No projects match the current filters.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </section>
  );
}

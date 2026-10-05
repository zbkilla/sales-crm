"use client";

import { useMemo, type CSSProperties } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
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
import { FollowUpTag } from "@/components/_common/household-tags";
import PageHeader from "@/components/_common/page-header";
import SegmentBar from "@/components/_common/segment-bar";
import { RequestStatusTag, RoleTag } from "./request-tags";
import { profileByName } from "@/data/households";
import { REQUEST_CATEGORIES, requestTemplate } from "@/data/request-templates";
import { OPERATIONS_TEAM, type ServiceRequest } from "@/data/service-requests";
import { formatDate, formatMoney } from "@/lib/households";
import {
  currentStep,
  isOpen,
  requestProgress,
  slaStatus,
  turnaroundBD,
} from "@/lib/service-requests";
import { cn } from "@/lib/utils";
import {
  useHouseholdsStore,
  type RequestsTab,
} from "@/stores/households-store";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

const ANY = "any";
const ALL = "all";

const CATEGORY_OPTIONS = [
  { value: ANY, label: "All types" },
  ...REQUEST_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  })),
];

const OWNER_OPTIONS = [
  { value: ALL, label: "Everyone" },
  ...OPERATIONS_TEAM.map((name) => ({ value: name, label: name })),
];

const COLUMNS = [
  { key: "request", label: "Request", className: "justify-start" },
  { key: "household", label: "Household", className: "justify-start" },
  { key: "status", label: "Status", className: "justify-start" },
  { key: "role", label: "Role", className: "justify-start" },
  { key: "step", label: "Current Step", className: "justify-start" },
  { key: "progress", label: "Progress", className: "justify-start" },
  { key: "owner", label: "Owner", className: "justify-start" },
  { key: "due", label: "Due", className: "justify-start" },
  { key: "sla", label: "SLA Status", className: "justify-start" },
  { key: "amount", label: "Amount", className: "justify-end tabular-nums" },
];

const GRID_CLASS =
  "grid min-w-max grid-cols-[repeat(var(--table-columns),max-content)] justify-between";
const ROW_CLASS = "col-span-full grid grid-cols-subgrid";
const CELL_CLASS = "flex items-center";

function inTab(request: ServiceRequest, tab: RequestsTab) {
  if (tab === "closed") return !isOpen(request);
  if (tab === "nigo") return request.status === "NIGO / Rework";
  if (tab === "waiting") {
    return (
      request.status === "Waiting – Client" ||
      request.status === "Waiting – Custodian"
    );
  }
  return isOpen(request);
}

export default function ServiceRequests() {
  const requests = useHouseholdsStore((state) => state.serviceRequests);
  const households = useHouseholdsStore((state) => state.households);
  const tab = useHouseholdsStore((state) => state.requestsTab);
  const category = useHouseholdsStore((state) => state.requestsCategory);
  const owner = useHouseholdsStore((state) => state.requestsOwner);
  const setTab = useHouseholdsStore((state) => state.setRequestsTab);
  const setCategory = useHouseholdsStore((state) => state.setRequestsCategory);
  const setOwner = useHouseholdsStore((state) => state.setRequestsOwner);
  const openRequest = useHouseholdsStore((state) => state.openRequest);
  const openNewRequest = useHouseholdsStore((state) => state.openNewRequest);
  const requestDetailId = useHouseholdsStore((state) => state.requestDetailId);

  const visible = useMemo(
    () =>
      requests
        .filter((request) => inTab(request, tab))
        .filter(
          (request) =>
            category === ANY ||
            requestTemplate(request.templateKey)?.category === category,
        )
        .filter((request) => owner === ALL || request.owner === owner)
        .sort((a, b) =>
          tab === "closed"
            ? (b.completedOn ?? "").localeCompare(a.completedOn ?? "")
            : a.dueOn.localeCompare(b.dueOn),
        ),
    [requests, tab, category, owner],
  );

  const open = requests.filter(isOpen);
  const pastSla = open.filter((request) => slaStatus(request) === "overdue");
  const columns =
    tab === "closed"
      ? COLUMNS.filter((column) => column.key !== "sla")
      : COLUMNS;
  const nigoRate = requests.length
    ? Math.round(
        (requests.filter((request) => request.nigoHistory.length > 0).length /
          requests.length) *
          100,
      )
    : 0;
  const completed = requests.filter((request) => request.status === "Done");
  const averageTurnaround = completed.length
    ? (
        completed.reduce(
          (total, request) => total + (turnaroundBD(request) ?? 0),
          0,
        ) / completed.length
      ).toFixed(1)
    : "—";

  const stats = [
    {
      label: "Open",
      value: String(open.length),
      note: "Across all request types",
    },
    {
      label: "Past SLA",
      value: String(pastSla.length),
      note: "Open beyond business-day target",
      danger: pastSla.length > 0,
    },
    {
      label: "Waiting on client",
      value: String(
        open.filter((request) => request.status === "Waiting – Client").length,
      ),
      note: "Signatures, documents, calls",
    },
    { label: "NIGO rate", value: `${nigoRate}%`, note: "Target under 10%" },
    {
      label: "Avg turnaround",
      value: averageTurnaround === "—" ? "—" : `${averageTurnaround} BD`,
      note: "Completed requests",
    },
  ];

  function householdName(id: string) {
    return (
      households.find((household) => household.id === id)?.name ?? "Unknown"
    );
  }

  return (
    <section
      id="service-requests"
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <PageHeader
        title="Service requests"
        tabs={[
          { value: "queue", label: "Open queue", count: open.length },
          {
            value: "waiting",
            label: "Waiting on others",
            count: requests.filter((request) => inTab(request, "waiting"))
              .length,
          },
          {
            value: "nigo",
            label: "NIGO / Rework",
            count: requests.filter((request) => inTab(request, "nigo")).length,
          },
          {
            value: "closed",
            label: "Completed",
            count: requests.filter((request) => !isOpen(request)).length,
          },
        ]}
        activeTab={tab}
        onTabChange={(value) => setTab(value as RequestsTab)}
      />

      <dl className="grid shrink-0 grid-cols-2 gap-2 px-4 pt-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-line-strong flex flex-col gap-2 rounded-lg border p-3"
          >
            <dt className="caption-style text-soft">{stat.label}</dt>
            <dd className="flex flex-col gap-1">
              <span
                className={cn(
                  "text-[22px] leading-none font-semibold tabular-nums",
                  stat.danger && "text-danger",
                )}
              >
                {stat.value}
              </span>
              <span className="caption-style text-subtle">{stat.note}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <FilterMenu
            label="Type"
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={setCategory}
          />
          <FilterMenu
            label="Owner"
            value={owner}
            options={OWNER_OPTIONS}
            onChange={setOwner}
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => openNewRequest()}>
          <PlusIcon aria-hidden className="size-3" />
          New request
        </Button>
      </div>

      <div className="border-border flex min-h-0 flex-1 flex-col border-t">
        <ScrollArea orientation="both" className="min-h-0 flex-1">
          <Table
            role="table"
            className={cn(GRID_CLASS, "w-full")}
            style={{ "--table-columns": columns.length } as CSSProperties}
          >
            <TableHeader role="rowgroup" className="contents">
              <TableRow role="row" className={ROW_CLASS}>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    role="columnheader"
                    className={cn(CELL_CLASS, column.className)}
                  >
                    {column.key === "due" && tab === "closed"
                      ? "Completed"
                      : column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody role="rowgroup" className="contents">
              {visible.map((request) => {
                const template = requestTemplate(request.templateKey);
                const step = currentStep(request);
                const progress = requestProgress(request);
                const sla = slaStatus(request);
                const person = profileByName(request.owner);
                const name = householdName(request.householdId);
                return (
                  <TableRow
                    key={request.id}
                    role="row"
                    onClick={() => openRequest(request.id)}
                    data-active={requestDetailId === request.id}
                    className={cn(
                      ROW_CLASS,
                      "hover:bg-card/60 data-[active=true]:bg-card cursor-pointer",
                    )}
                  >
                    <TableCell role="cell" className={CELL_CLASS}>
                      <span className="flex max-w-[22em] flex-col gap-1">
                        <span className="flex items-center gap-2">
                          <span className="caption-style text-subtle tabular-nums">
                            SR-{request.number}
                          </span>
                          <span className="truncate">{request.title}</span>
                        </span>
                        <span className="caption-style text-subtle truncate">
                          {template?.category}
                          {request.title !== template?.name
                            ? ` · ${template?.name}`
                            : ""}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      <span className="flex items-center gap-2">
                        <HouseholdMark name={name} />
                        {name}
                      </span>
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      <RequestStatusTag status={request.status} />
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      {step && isOpen(request) ? (
                        <RoleTag role={step.step.role} />
                      ) : (
                        <span className="text-subtle">—</span>
                      )}
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      {step && isOpen(request) ? (
                        <span className="max-w-[18em] truncate">
                          {step.step.name}
                        </span>
                      ) : (
                        <span className="text-subtle">
                          {request.status === "Verification"
                            ? "Awaiting verification"
                            : "—"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      <span className="caption-style flex items-center gap-2">
                        <SegmentBar
                          percent={progress.percent}
                          segments={20}
                          tone="success"
                          className="w-[80px]"
                        />
                        <span className="text-soft w-[5ch] tabular-nums">
                          {progress.done}/{progress.total}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      <span className="flex items-center gap-1.5">
                        <Avatar src={person.avatar} alt="" />
                        {person.name}
                      </span>
                    </TableCell>
                    <TableCell role="cell" className={CELL_CLASS}>
                      {tab === "closed" && !request.completedOn ? (
                        <span className="text-subtle">—</span>
                      ) : (
                        <span className="tabular-nums">
                          {formatDate(
                            tab === "closed"
                              ? (request.completedOn as string)
                              : request.dueOn,
                          )}
                        </span>
                      )}
                    </TableCell>
                    {tab !== "closed" && (
                      <TableCell role="cell" className={CELL_CLASS}>
                        {sla ? (
                          <FollowUpTag status={sla} />
                        ) : (
                          <span className="text-subtle">—</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell
                      role="cell"
                      className={cn(CELL_CLASS, "justify-end tabular-nums")}
                    >
                      {request.amount !== null ? (
                        <span className="flex items-center gap-1">
                          <span className="text-muted-foreground">$</span>
                          {formatMoney(request.amount)}
                        </span>
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
                    No service requests match the current filters.
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

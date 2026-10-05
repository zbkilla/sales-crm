"use client";

import { useCommandState } from "cmdk";
import Avatar from "@/components/_ui/avatar";
import { CommandItem } from "@/components/_ui/command";
import HouseholdMark from "@/components/_common/household-mark";
import { FollowUpTag, SegmentTags } from "@/components/_common/household-tags";
import { advisorByName, type Household } from "@/data/households";
import {
  assetsValue,
  followUpDue,
  followUpStatus,
  formatDate,
  formatMoney,
} from "@/lib/households";
import { cn } from "@/lib/utils";
import CalendarIcon from "@/public/assets/images/_common/calendar.svg";

export const COMMAND_TABLE_GRID =
  "grid grid-cols-[minmax(0,1fr)_104px] gap-x-4 md:grid-cols-[minmax(0,1fr)_216px_148px_104px] lg:grid-cols-[minmax(0,1fr)_216px_148px_104px_96px_84px] xl:grid-cols-[minmax(0,1fr)_216px_148px_104px_96px_84px_100px_112px]";

const HEADERS = [
  { label: "Household", className: "" },
  { label: "Tier & tags", className: "hidden md:block" },
  { label: "Advisor", className: "hidden md:block" },
  { label: "AUM / Assets", className: "text-right" },
  { label: "Next follow-up", className: "hidden lg:block" },
  { label: "Status", className: "hidden lg:block" },
  { label: "Last touchpoint", className: "hidden xl:block" },
  { label: "Type", className: "hidden xl:block" },
];

export function CommandTableHeader() {
  const count = useCommandState((state) => state.filtered.count);

  if (count === 0) return null;

  return (
    <div
      aria-hidden
      className={cn(
        COMMAND_TABLE_GRID,
        "caption-style border-line-strong text-subtle h-9 items-center border-b px-4",
      )}
    >
      {HEADERS.map((header) => (
        <span key={header.label} className={cn("truncate", header.className)}>
          {header.label}
        </span>
      ))}
    </div>
  );
}

type CommandHouseholdRowProps = {
  household: Household;
  onSelect: () => void;
};

export function CommandHouseholdRow({
  household,
  onSelect,
}: CommandHouseholdRowProps) {
  const advisor = advisorByName(household.advisor);
  const due = followUpDue(household);
  const status = followUpStatus(household);
  const value = assetsValue(household);

  return (
    <CommandItem
      value={household.id}
      keywords={[
        household.name,
        household.type,
        household.advisor,
        ...household.tags,
        ...(household.tier ? [`Tier ${household.tier}`] : []),
        ...household.people.map(
          (person) => `${person.firstName} ${person.lastName}`,
        ),
      ]}
      onSelect={onSelect}
      className={cn(COMMAND_TABLE_GRID, "text-foreground h-11 gap-x-4")}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <HouseholdMark name={household.name} />
        <span className="truncate">{household.name}</span>
      </span>

      <span className="hidden min-w-0 items-center gap-[3px] overflow-hidden whitespace-nowrap md:flex">
        <SegmentTags household={household} size="sm" />
      </span>

      <span className="text-soft hidden min-w-0 items-center gap-1.5 md:flex">
        <Avatar src={advisor.avatar} alt="" />
        <span className="truncate">{advisor.name}</span>
      </span>

      <span className="flex items-center justify-end gap-1 whitespace-nowrap tabular-nums">
        {value > 0 ? (
          <>
            <span className="text-muted-foreground">$</span>
            {formatMoney(value)}
          </>
        ) : (
          <span className="text-subtle">—</span>
        )}
      </span>

      <span className="hidden items-center whitespace-nowrap tabular-nums lg:flex">
        {due ? formatDate(due) : <span className="text-subtle">—</span>}
      </span>

      <span className="hidden items-center lg:flex">
        {status ? (
          <FollowUpTag status={status} />
        ) : (
          <span className="text-subtle">—</span>
        )}
      </span>

      <span className="text-soft hidden items-center gap-1 whitespace-nowrap xl:flex">
        <CalendarIcon aria-hidden className="size-3.5 shrink-0" />
        <span className="tabular-nums">
          {formatDate(household.lastTouchpoint.date)}
        </span>
      </span>

      <span className="text-soft hidden min-w-0 items-center xl:flex">
        <span className="truncate">{household.lastTouchpoint.label}</span>
      </span>
    </CommandItem>
  );
}

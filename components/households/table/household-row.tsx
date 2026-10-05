"use client";

import type { MouseEvent } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { Checkbox } from "@/components/_ui/checkbox";
import { TableCell, TableRow } from "@/components/_ui/table";
import HouseholdMark from "@/components/_common/household-mark";
import { FollowUpTag, SegmentTags } from "@/components/_common/household-tags";
import SegmentBar from "@/components/_common/segment-bar";
import Sparkline from "@/components/_common/sparkline";
import { advisorByName, type Household } from "@/data/households";
import {
  formatDate,
  formatMoney,
  householdAum,
  leadOpportunity,
  memberCount,
  nextReviewDue,
  reviewStatus,
  weightedPipeline,
} from "@/lib/households";
import { cn } from "@/lib/utils";
import {
  TABLE_CELL_CLASS,
  TABLE_ROW_CLASS,
  columnClass,
  type TableColumnKey,
} from "./table-columns";
import CalendarIcon from "@/public/assets/images/_common/calendar.svg";
import DotsIcon from "@/public/assets/images/households/table/dots-horizontal.svg";

type HouseholdRowProps = {
  household: Household;
  selected: boolean;
  active: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onOpenAdvisor: () => void;
};

function cellClass(key: TableColumnKey) {
  return cn(TABLE_CELL_CLASS, columnClass(key));
}

function stop(event: MouseEvent) {
  event.stopPropagation();
}

function Money({ value }: { value: number }) {
  if (value <= 0) return <span className="text-subtle">—</span>;
  return (
    <span className="flex items-center gap-1">
      <span className="text-muted-foreground">$</span>
      {formatMoney(value)}
    </span>
  );
}

function AssetsCell({ household }: { household: Household }) {
  if (household.type === "Client") {
    return <Money value={householdAum(household)} />;
  }
  if (household.type === "Prospect") {
    return <Money value={leadOpportunity(household)?.value ?? 0} />;
  }
  return household.clientSince ? (
    <span className="tabular-nums">{formatDate(household.clientSince)}</span>
  ) : (
    <span className="text-subtle">—</span>
  );
}

function FollowUpCell({ household }: { household: Household }) {
  if (household.type === "Client") {
    const due = nextReviewDue(household);
    const status = reviewStatus(household);
    return (
      <span className="flex items-center gap-2">
        <span className="tabular-nums">{due ? formatDate(due) : "—"}</span>
        {status && <FollowUpTag status={status} />}
      </span>
    );
  }
  if (household.type === "Prospect") {
    const opportunity = leadOpportunity(household);
    if (!opportunity) return <span className="text-subtle">—</span>;
    return (
      <span className="flex items-center gap-2">
        <span className="w-[17ch] truncate">{opportunity.stage}</span>
        <SegmentBar percent={opportunity.probability} className="w-[60px]" />
        <span className="w-[4ch] text-right tabular-nums">
          {opportunity.probability}%
        </span>
      </span>
    );
  }
  return household.pastClientSince ? (
    <span className="tabular-nums">{formatDate(household.pastClientSince)}</span>
  ) : (
    <span className="text-subtle">—</span>
  );
}

export default function HouseholdRow({
  household,
  selected,
  active,
  onToggle,
  onOpen,
  onOpenAdvisor,
}: HouseholdRowProps) {
  const advisor = advisorByName(household.advisor);
  const members = memberCount(household);

  return (
    <TableRow
      role="row"
      onClick={onOpen}
      data-active={active || selected}
      className={cn(
        TABLE_ROW_CLASS,
        "hover:bg-card/60 data-[active=true]:border-card data-[active=true]:bg-card cursor-pointer",
      )}
    >
      <TableCell role="cell" className={cellClass("name")}>
        <span className="flex items-center gap-5">
          <Checkbox
            checked={selected}
            onCheckedChange={onToggle}
            onClick={stop}
            aria-label={`Select ${household.name}`}
          />
          <span className="flex items-center gap-2.5">
            <HouseholdMark name={household.name} />
            <span className="flex flex-col gap-1">
              <span>{household.name}</span>
              <span className="caption-style text-subtle">
                {members} {members === 1 ? "member" : "members"}
              </span>
            </span>
          </span>
        </span>
      </TableCell>
      <TableCell role="cell" className={cellClass("segment")}>
        <span className="flex items-center gap-[3px]">
          <SegmentTags
            household={household}
            withType={household.type === "Client"}
          />
        </span>
      </TableCell>
      <TableCell role="cell" className={cellClass("advisor")} onClick={stop}>
        <Button
          variant="ghost"
          size="none"
          onClick={onOpenAdvisor}
          aria-label={`Open ${advisor.name} profile`}
          className="text-foreground -mx-1.5 gap-1.5 px-1.5 py-1 font-normal"
        >
          <Avatar src={advisor.avatar} alt="" />
          {advisor.name}
        </Button>
      </TableCell>
      <TableCell role="cell" className={cellClass("assets")}>
        <AssetsCell household={household} />
      </TableCell>
      <TableCell role="cell" className={cellClass("pipeline")}>
        <Money value={weightedPipeline(household)} />
      </TableCell>
      <TableCell role="cell" className={cellClass("followUp")}>
        <FollowUpCell household={household} />
      </TableCell>
      <TableCell role="cell" className={cellClass("trend")}>
        <Sparkline values={household.touchpointTrend} />
      </TableCell>
      <TableCell role="cell" className={cellClass("lastTouchpoint")}>
        <span className="flex items-center gap-1">
          <CalendarIcon
            aria-hidden
            className="text-foreground size-3.5 shrink-0"
          />
          <span className="tabular-nums">
            {formatDate(household.lastTouchpoint.date)}
          </span>
          <span aria-hidden className="mx-[3px] h-2 w-px bg-white/15" />
          {household.lastTouchpoint.label}
        </span>
      </TableCell>
      <TableCell role="cell" className={cellClass("action")} onClick={stop}>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn("text-foreground", active && "bg-white/6")}
          aria-label={`Open ${household.name} details`}
          onClick={onOpen}
        >
          <DotsIcon aria-hidden className="size-3" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

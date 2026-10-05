"use client";

import type { DragEvent, MouseEvent } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import Tag from "@/components/_ui/tag";
import FilterMenu from "@/components/_common/filter-menu";
import HouseholdMark from "@/components/_common/household-mark";
import SegmentBar from "@/components/_common/segment-bar";
import { advisorByName, type OpportunityStage } from "@/data/households";
import { TODAY, formatDate, formatMoney } from "@/lib/households";
import { weightedValue, type PipelineCard } from "@/lib/pipeline";
import { cn } from "@/lib/utils";
import type { OpportunityOutcome } from "@/stores/households-store";

type OpportunityCardProps = {
  card: PipelineCard;
  stages: readonly { value: OpportunityStage }[];
  dragging: boolean;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onOpen: () => void;
  onMove: (stage: OpportunityStage) => void;
  onClose: (outcome: OpportunityOutcome) => void;
};

const OUTCOME_OPTIONS = [
  { value: "won", label: "Closed won" },
  { value: "lost", label: "Closed lost" },
];

function stop(event: MouseEvent) {
  event.stopPropagation();
}

export default function OpportunityCard({
  card,
  stages,
  dragging,
  onDragStart,
  onDragEnd,
  onOpen,
  onMove,
  onClose,
}: OpportunityCardProps) {
  const { household, opportunity } = card;
  const advisor = advisorByName(household.advisor);
  const overdue = opportunity.targetClose < TODAY;
  const moveOptions = [
    ...stages.map((stage) => ({ value: stage.value, label: stage.value })),
    ...OUTCOME_OPTIONS,
  ];

  function handleMove(value: string) {
    if (value === "won" || value === "lost") onClose(value);
    else onMove(value as OpportunityStage);
  }

  return (
    <li>
      <article
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        data-dragging={dragging}
        aria-label={`${opportunity.name}, ${household.name}`}
        className="bg-card ease-power3-out flex cursor-grab flex-col gap-3 rounded-lg p-3 shadow-[0px_4px_4px_0px_rgba(42,42,42,0.32),0px_0px_0px_1px_#0e0e0e,inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_0px_0px_1px_rgba(255,255,255,0.08)] transition-[background-color,opacity] duration-150 hover:bg-[#252525] active:cursor-grabbing data-[dragging=true]:opacity-40"
      >
        <div className="flex items-start justify-between gap-2">
          <Button
            variant="ghost"
            size="none"
            onClick={onOpen}
            className="text-foreground -mx-1 -my-0.5 min-w-0 shrink justify-start gap-2 rounded-md px-1 py-0.5 text-left font-normal whitespace-normal"
          >
            <HouseholdMark name={household.name} />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="truncate">{household.name}</span>
              <span className="caption-style text-subtle truncate">
                {opportunity.name}
              </span>
            </span>
          </Button>
          <span onClick={stop} className="shrink-0">
            <FilterMenu
              value={opportunity.stage}
              options={moveOptions}
              onChange={handleMove}
              align="end"
              ariaLabel={`Move ${household.name} opportunity`}
              className="h-6"
            />
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 tabular-nums">
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">$</span>
            {formatMoney(opportunity.value)}
          </span>
          <span className="caption-style text-subtle">
            ${formatMoney(weightedValue(opportunity))} weighted
          </span>
        </div>

        <div className="caption-style flex items-center gap-2">
          <SegmentBar percent={opportunity.probability} className="flex-1" />
          <span className="w-[4ch] text-right tabular-nums">
            {opportunity.probability}%
          </span>
        </div>

        <div className="caption-style flex items-center justify-between gap-2">
          <span className="text-soft flex items-center gap-1.5">
            <Avatar src={advisor.avatar} alt="" className="size-4" />
            {advisor.name}
          </span>
          <Tag tone={overdue ? "red" : "neutral"} size="sm">
            <span className={cn("tabular-nums")}>
              Close {formatDate(opportunity.targetClose)}
            </span>
          </Tag>
        </div>
      </article>
    </li>
  );
}

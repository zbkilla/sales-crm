"use client";

import type { MouseEvent } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { TableCell, TableRow } from "@/components/_ui/table";
import FilterMenu from "@/components/_common/filter-menu";
import HouseholdMark from "@/components/_common/household-mark";
import { FollowUpTag } from "@/components/_common/household-tags";
import {
  REVIEW_CADENCES,
  TIERS,
  TIER_DEFAULTS,
  advisorByName,
  type Household,
  type ReviewCadence,
  type Tier,
} from "@/data/households";
import {
  formatDate,
  formatMoney,
  householdAum,
  touchpointDays,
} from "@/lib/households";
import { reviewsDue, reviewsStatus } from "@/lib/reviews";
import { cn } from "@/lib/utils";
import {
  REVIEW_CELL_CLASS,
  REVIEW_ROW_CLASS,
  reviewColumnClass,
  type ReviewColumnKey,
} from "./review-columns";
import type { ReviewsTab } from "@/stores/households-store";
import CalendarIcon from "@/public/assets/images/_common/calendar.svg";

type ReviewRowProps = {
  household: Household;
  tab: ReviewsTab;
  active: boolean;
  onOpen: () => void;
  onOpenAdvisor: () => void;
  onTierChange: (tier: Tier) => void;
  onCadenceChange: (cadence: ReviewCadence | null) => void;
  onLog: () => void;
};

const TIER_OPTIONS = TIERS.map((tier) => ({
  value: tier,
  label: `Tier ${tier}`,
}));

const DEFAULT_CADENCE = "default";

function cellClass(key: ReviewColumnKey) {
  return cn(REVIEW_CELL_CLASS, reviewColumnClass(key));
}

function stop(event: MouseEvent) {
  event.stopPropagation();
}

export default function ReviewRow({
  household,
  tab,
  active,
  onOpen,
  onOpenAdvisor,
  onTierChange,
  onCadenceChange,
  onLog,
}: ReviewRowProps) {
  const advisor = advisorByName(household.advisor);
  const tier = household.tier ?? "C";
  const due = reviewsDue(household, tab);
  const status = reviewsStatus(household, tab);
  const head = household.people.find(
    (person) => person.role === "Head of household",
  );
  const cadenceOptions = [
    {
      value: DEFAULT_CADENCE,
      label: `${TIER_DEFAULTS[tier].reviewCadence} (tier default)`,
    },
    ...REVIEW_CADENCES.map((cadence) => ({
      value: cadence.value,
      label: cadence.value,
    })),
  ];

  return (
    <TableRow
      role="row"
      onClick={onOpen}
      data-active={active}
      className={cn(
        REVIEW_ROW_CLASS,
        "hover:bg-card/60 data-[active=true]:border-card data-[active=true]:bg-card cursor-pointer",
      )}
    >
      <TableCell role="cell" className={cellClass("client")}>
        <span className="flex items-center gap-2.5">
          <HouseholdMark name={household.name} />
          {household.name}
        </span>
      </TableCell>
      <TableCell role="cell" className={cellClass("tier")} onClick={stop}>
        <FilterMenu
          value={tier}
          options={TIER_OPTIONS}
          onChange={(value) => onTierChange(value as Tier)}
          ariaLabel={`Service tier for ${household.name}`}
        />
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
      <TableCell role="cell" className={cellClass("last")}>
        <span className="flex items-center gap-1">
          <CalendarIcon
            aria-hidden
            className="text-foreground size-3.5 shrink-0"
          />
          {tab === "upcoming" ? (
            <span className="tabular-nums">
              {household.lastReview
                ? formatDate(household.lastReview)
                : "None logged"}
            </span>
          ) : (
            <>
              <span className="tabular-nums">
                {formatDate(household.lastTouchpoint.date)}
              </span>
              <span aria-hidden className="mx-[3px] h-2 w-px bg-white/15" />
              {household.lastTouchpoint.label}
            </>
          )}
        </span>
      </TableCell>
      <TableCell role="cell" className={cellClass("due")}>
        <span className="flex items-center gap-2">
          <span className="tabular-nums">{due ? formatDate(due) : "—"}</span>
          {status && <FollowUpTag status={status} />}
        </span>
      </TableCell>
      <TableCell
        role="cell"
        className={cellClass("cadence")}
        onClick={tab === "upcoming" ? stop : undefined}
      >
        {tab === "upcoming" ? (
          <FilterMenu
            value={household.reviewCadence ?? DEFAULT_CADENCE}
            options={cadenceOptions}
            onChange={(value) =>
              onCadenceChange(
                value === DEFAULT_CADENCE ? null : (value as ReviewCadence),
              )
            }
            ariaLabel={`Review cadence for ${household.name}`}
          />
        ) : (
          <span>Every {touchpointDays(household)} days</span>
        )}
      </TableCell>
      <TableCell role="cell" className={cellClass("extra")}>
        {tab === "upcoming" ? (
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">$</span>
            {formatMoney(householdAum(household))}
          </span>
        ) : (
          <span className="text-soft">{head?.email ?? "—"}</span>
        )}
      </TableCell>
      <TableCell role="cell" className={cellClass("action")} onClick={stop}>
        <Button variant="secondary" size="sm" onClick={onLog}>
          {tab === "upcoming" ? "Log review" : "Log call"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

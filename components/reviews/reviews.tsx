"use client";

import { useMemo, type CSSProperties } from "react";
import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/_ui/table";
import FilterMenu from "@/components/_common/filter-menu";
import PageHeader from "@/components/_common/page-header";
import ReviewRow from "./review-row";
import {
  REVIEW_CELL_CLASS,
  REVIEW_GRID_CLASS,
  REVIEW_ROW_CLASS,
  reviewColumns,
} from "./review-columns";
import { ADVISORS, FOLLOW_UP_STATUSES, TIERS } from "@/data/households";
import {
  ALL_ADVISORS,
  ANY_STATUS,
  ANY_TIER,
  activeReviewsFilterCount,
  filterReviews,
  statusCounts,
} from "@/lib/reviews";
import { cn } from "@/lib/utils";
import {
  DEFAULT_REVIEWS_FILTERS,
  useHouseholdsStore,
  type ReviewsTab,
} from "@/stores/households-store";

const ADVISOR_OPTIONS = [
  { value: ALL_ADVISORS, label: "All advisors" },
  ...ADVISORS.map((advisor) => ({ value: advisor.name, label: advisor.name })),
];

const TIER_OPTIONS = [
  { value: ANY_TIER, label: "Any" },
  ...TIERS.map((tier) => ({ value: tier, label: `Tier ${tier}` })),
];

const STATUS_OPTIONS = [
  { value: ANY_STATUS, label: "Any" },
  ...FOLLOW_UP_STATUSES.map((status) => ({
    value: status.value,
    label: status.label,
  })),
];

export default function Reviews() {
  const households = useHouseholdsStore((state) => state.households);
  const tab = useHouseholdsStore((state) => state.reviewsTab);
  const filters = useHouseholdsStore((state) => state.reviewsFilters);
  const setTab = useHouseholdsStore((state) => state.setReviewsTab);
  const setFilter = useHouseholdsStore((state) => state.setReviewsFilter);
  const resetFilters = useHouseholdsStore((state) => state.resetReviewsFilters);
  const detailId = useHouseholdsStore((state) => state.detailId);
  const detailOpen = useHouseholdsStore((state) => state.detailOpen);
  const openDetail = useHouseholdsStore((state) => state.openDetail);
  const openProfile = useHouseholdsStore((state) => state.openProfile);
  const setTier = useHouseholdsStore((state) => state.setTier);
  const setReviewCadence = useHouseholdsStore(
    (state) => state.setReviewCadence,
  );
  const logReview = useHouseholdsStore((state) => state.logReview);
  const logTouchpoint = useHouseholdsStore((state) => state.logTouchpoint);

  const clients = useMemo(
    () => filterReviews(households, DEFAULT_REVIEWS_FILTERS, tab),
    [households, tab],
  );
  const visible = useMemo(
    () => filterReviews(households, filters, tab),
    [households, filters, tab],
  );
  const counts = statusCounts(visible, tab);
  const reviewCounts = statusCounts(clients, "upcoming");
  const touchpointCounts = statusCounts(
    filterReviews(households, DEFAULT_REVIEWS_FILTERS, "touchpoints"),
    "touchpoints",
  );
  const columns = reviewColumns(tab);
  const activeCount = activeReviewsFilterCount(filters);

  const summary = [
    { label: "Overdue", value: counts.overdue, className: "text-danger" },
    { label: "Due soon", value: counts["due-soon"], className: "text-warning" },
    { label: "On track", value: counts["on-track"], className: "text-success" },
  ];

  return (
    <section id="reviews" className="flex min-h-0 min-w-0 flex-1 flex-col">
      <PageHeader
        title="Reviews"
        tabs={[
          {
            value: "upcoming",
            label: "Upcoming reviews",
            count: reviewCounts.overdue + reviewCounts["due-soon"],
          },
          {
            value: "touchpoints",
            label: "Touchpoint tracking",
            count: touchpointCounts.overdue + touchpointCounts["due-soon"],
          },
        ]}
        activeTab={tab}
        onTabChange={(value) => setTab(value as ReviewsTab)}
      />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-4">
        <div className="flex min-w-0 flex-wrap gap-2">
          <FilterMenu
            label="Advisor"
            value={filters.advisor}
            options={ADVISOR_OPTIONS}
            onChange={(value) => setFilter("advisor", value)}
          />
          <FilterMenu
            label="Tier"
            value={filters.tier}
            options={TIER_OPTIONS}
            onChange={(value) => setFilter("tier", value)}
          />
          <FilterMenu
            label="Status"
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(value) => setFilter("status", value)}
          />
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          )}
        </div>
        <p className="caption-style text-subtle">
          {tab === "upcoming"
            ? "Next review = last review + cadence (client, then tier default)."
            : "Meetings, emails, calls and SMS all count as touchpoints."}
        </p>
      </div>

      <div className="border-border flex min-h-0 flex-1 flex-col border-t">
        <ScrollArea orientation="both" className="min-h-0 flex-1">
          <Table
            role="table"
            className={cn(REVIEW_GRID_CLASS, "w-full")}
            style={{ "--table-columns": columns.length } as CSSProperties}
          >
            <TableHeader role="rowgroup" className="contents">
              <TableRow role="row" className={REVIEW_ROW_CLASS}>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    role="columnheader"
                    className={cn(REVIEW_CELL_CLASS, column.className)}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody role="rowgroup" className="contents">
              {visible.map((household) => (
                <ReviewRow
                  key={household.id}
                  household={household}
                  tab={tab}
                  active={detailOpen && detailId === household.id}
                  onOpen={() => openDetail(household.id)}
                  onOpenAdvisor={() => openProfile(household.advisor)}
                  onTierChange={(tier) => setTier(household.id, tier)}
                  onCadenceChange={(cadence) =>
                    setReviewCadence(household.id, cadence)
                  }
                  onLog={() =>
                    tab === "upcoming"
                      ? logReview(household.id)
                      : logTouchpoint(household.id, "Call")
                  }
                />
              ))}
              {visible.length === 0 && (
                <TableRow role="row" className={REVIEW_ROW_CLASS}>
                  <td
                    role="cell"
                    className="caption-style text-muted-foreground col-span-full flex h-[120px] items-center justify-center"
                  >
                    No clients match the current filters.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="caption-style border-border bg-background grid shrink-0 grid-cols-2 gap-px border-b p-px sm:grid-cols-4">
          <div className="outline-border flex items-center gap-2 p-3 outline-1">
            <span className="text-foreground tabular-nums">
              {visible.length}
            </span>
            <span className="text-muted-foreground">Clients in view</span>
          </div>
          {summary.map((item) => (
            <div
              key={item.label}
              className="outline-border flex items-center gap-2 p-3 outline-1"
            >
              <span className={cn("tabular-nums", item.className)}>
                {item.value}
              </span>
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

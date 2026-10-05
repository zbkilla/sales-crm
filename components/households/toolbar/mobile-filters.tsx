"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import CountBadge from "@/components/_ui/count-badge";
import Field from "@/components/_ui/field";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/_ui/sheet";
import {
  ADVISOR_OPTIONS,
  FOLLOW_UP_OPTIONS,
  SEGMENT_OPTIONS,
  SORT_MENU_OPTIONS,
} from "./filter-options";
import { advisorByName, type SortKey } from "@/data/households";
import {
  ALL_ADVISORS,
  DEFAULT_FILTERS,
  activeFilterCount,
  filterHouseholds,
} from "@/lib/households";
import { cn } from "@/lib/utils";
import { useHouseholdsStore } from "@/stores/households-store";
import FilterIcon from "@/public/assets/images/_common/filter.svg";
import XIcon from "@/public/assets/images/households/detail/x.svg";

type MobileFiltersProps = {
  className?: string;
};

export default function MobileFilters({ className }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);
  const households = useHouseholdsStore((state) => state.households);
  const activeTab = useHouseholdsStore((state) => state.activeTab);
  const sortBy = useHouseholdsStore((state) => state.sortBy);
  const advisor = useHouseholdsStore((state) => state.advisor);
  const segment = useHouseholdsStore((state) => state.segment);
  const followUp = useHouseholdsStore((state) => state.followUp);
  const setSortBy = useHouseholdsStore((state) => state.setSortBy);
  const setAdvisor = useHouseholdsStore((state) => state.setAdvisor);
  const setSegment = useHouseholdsStore((state) => state.setSegment);
  const setFollowUp = useHouseholdsStore((state) => state.setFollowUp);
  const resetFilters = useHouseholdsStore((state) => state.resetFilters);

  const filters = { sortBy, advisor, segment, followUp };
  const activeCount = activeFilterCount(filters);
  const resultCount = useMemo(
    () =>
      filterHouseholds(
        households,
        { sortBy, advisor, segment, followUp },
        activeTab,
      ).length,
    [households, sortBy, advisor, segment, followUp, activeTab],
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={
          activeCount > 0 ? `Filters, ${activeCount} active` : "Filters"
        }
        className={cn("data-[active=true]:bg-muted", className)}
        data-active={activeCount > 0}
      >
        <FilterIcon aria-hidden className="size-3" />
        Filters
        {activeCount > 0 && <CountBadge>{activeCount}</CountBadge>}
      </Button>

      <SheetContent side="bottom">
        <SheetHeader className="px-4">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription className="sr-only">
            Sort and filter the households table
          </SheetDescription>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="-mr-1"
              aria-label="Close filters"
            >
              <XIcon aria-hidden className="text-foreground size-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <ScrollArea viewportClassName="max-h-[calc(85dvh-118px)]">
          <div className="flex flex-col gap-4 p-4">
            <Field label="Sort by" htmlFor="mobile-sort">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortKey)}
              >
                <SelectTrigger id="mobile-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_MENU_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Advisor" htmlFor="mobile-advisor">
              <Select value={advisor} onValueChange={setAdvisor}>
                <SelectTrigger id="mobile-advisor">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADVISOR_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value === ALL_ADVISORS ? (
                        option.label
                      ) : (
                        <span className="flex items-center gap-2">
                          <Avatar
                            src={advisorByName(option.value).avatar}
                            alt=""
                          />
                          {option.label}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Tier & tags" htmlFor="mobile-segment">
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger id="mobile-segment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEGMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Follow-up" htmlFor="mobile-follow-up">
              <Select value={followUp} onValueChange={setFollowUp}>
                <SelectTrigger id="mobile-follow-up">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOLLOW_UP_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </ScrollArea>

        <SheetFooter className="px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={activeCount === 0 && sortBy === DEFAULT_FILTERS.sortBy}
            className="-ml-1.5"
          >
            Reset
          </Button>
          <SheetClose asChild>
            <Button variant="primary" size="sm">
              Show {resultCount} {resultCount === 1 ? "household" : "households"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState } from "react";
import Button from "@/components/_ui/button";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/_ui/sheet";
import FilterMenu from "@/components/_common/filter-menu";
import HouseholdMark from "@/components/_common/household-mark";
import { SegmentTags } from "@/components/_common/household-tags";
import DetailSection from "./detail-section";
import HouseholdMembers from "./household-members";
import Portfolio from "./portfolio";
import Opportunities from "./opportunities";
import Engagement from "./engagement";
import MeetingCard from "./meeting-card";
import { TaskList } from "./work-items";
import RequestList from "@/components/service-requests/request-list";
import { isOpen } from "@/lib/service-requests";
import { TREND_WINDOWS, type Household } from "@/data/households";
import { useHouseholdsStore } from "@/stores/households-store";
import BuildingIcon from "@/public/assets/images/households/detail/building.svg";
import XIcon from "@/public/assets/images/households/detail/x.svg";

const WINDOW_OPTIONS = TREND_WINDOWS.map((label) => ({ value: label, label }));

const WINDOW_SCALE: Record<string, number> = {
  "Last 30 Days": 0.34,
  "Last 90 Days": 1,
  "Last 12 Months": 4,
};

function primaryAction(household: Household) {
  if (household.type === "Prospect") return "Promote to client";
  if (household.type === "Past client") return "Restore to client";
  return "Log review";
}

export default function HouseholdDetail() {
  const detailId = useHouseholdsStore((state) => state.detailId);
  const detailOpen = useHouseholdsStore((state) => state.detailOpen);
  const households = useHouseholdsStore((state) => state.households);
  const closeDetail = useHouseholdsStore((state) => state.closeDetail);
  const openProfile = useHouseholdsStore((state) => state.openProfile);
  const promoteToClient = useHouseholdsStore((state) => state.promoteToClient);
  const restoreToClient = useHouseholdsStore((state) => state.restoreToClient);
  const logReview = useHouseholdsStore((state) => state.logReview);
  const logTouchpoint = useHouseholdsStore((state) => state.logTouchpoint);
  const tasks = useHouseholdsStore((state) => state.tasks);
  const serviceRequests = useHouseholdsStore((state) => state.serviceRequests);
  const toggleTask = useHouseholdsStore((state) => state.toggleTask);
  const [trendWindow, setTrendWindow] = useState(TREND_WINDOWS[1]);

  const household = households.find((item) => item.id === detailId);
  const openTasks = tasks.filter(
    (task) => task.householdId === detailId && task.status === "todo",
  );
  const openRequests = serviceRequests.filter(
    (request) => request.householdId === detailId && isOpen(request),
  );

  function runPrimary() {
    if (!household) return;
    if (household.type === "Prospect") promoteToClient(household.id);
    else if (household.type === "Past client") restoreToClient(household.id);
    else logReview(household.id);
  }

  return (
    <Sheet
      open={detailOpen && household !== undefined}
      onOpenChange={(open) => !open && closeDetail()}
    >
      <SheetContent side="right" className="sm:w-[560px] sm:max-w-[560px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <BuildingIcon aria-hidden className="text-icon size-3.5" />
            <SheetTitle>Household Detail</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Members, portfolio, opportunities, engagement and recent meetings
          </SheetDescription>
          <div className="flex items-center gap-1">
            {household && (
              <Button
                variant="secondary"
                size="sm"
                href={`/households/${household.id}`}
                onClick={closeDetail}
              >
                Open full profile
              </Button>
            )}
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="-mr-1"
                aria-label="Close details"
              >
                <XIcon aria-hidden className="text-foreground size-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {household && (
          <ScrollArea className="min-h-0 flex-1">
            <div className="flex items-start gap-3 p-5 shadow-[inset_0_-1px_0_var(--line-strong)]">
              <HouseholdMark
                name={household.name}
                className="size-[50px] rounded-[12.5px] shadow-[0px_6.25px_6.25px_0px_rgba(15,15,15,0.24),0px_0px_0px_1.563px_#232323]"
                textClassName="h2-style"
              />
              <div className="flex min-w-0 flex-col gap-3">
                <h2 className="truncate">{household.name}</h2>
                <div className="flex flex-wrap items-center gap-[3px]">
                  <SegmentTags household={household} size="sm" limit={false} />
                </div>
              </div>
            </div>

            <DetailSection title="Household">
              <HouseholdMembers
                household={household}
                onOpenAdvisor={() => openProfile(household.advisor)}
              />
            </DetailSection>

            {household.accounts.length > 0 && (
              <DetailSection title="Portfolio">
                <Portfolio household={household} />
              </DetailSection>
            )}

            {household.type === "Prospect" && household.estAssets && (
              <DetailSection title="Estimated assets">
                <div className="flex flex-col gap-1.5">
                  <span className="block text-[28px] leading-none font-semibold">
                    {household.estAssets}
                  </span>
                  <span className="caption-style text-soft block">
                    From discovery notes and public wealth signals
                  </span>
                </div>
              </DetailSection>
            )}

            {household.opportunities.length > 0 && (
              <DetailSection title="Opportunities">
                <Opportunities household={household} />
              </DetailSection>
            )}

            {openRequests.length > 0 && (
              <DetailSection title="Service requests">
                <RequestList requests={openRequests} />
              </DetailSection>
            )}

            {openTasks.length > 0 && (
              <DetailSection title="Open tasks">
                <TaskList tasks={openTasks} onToggle={toggleTask} />
              </DetailSection>
            )}

            <DetailSection
              title="Engagement"
              className={household.meetings.length === 0 ? "shadow-none" : ""}
              action={
                <FilterMenu
                  value={trendWindow}
                  options={WINDOW_OPTIONS}
                  onChange={setTrendWindow}
                  align="end"
                />
              }
            >
              <Engagement
                household={household}
                scale={WINDOW_SCALE[trendWindow] ?? 1}
              />
            </DetailSection>

            {household.meetings.length > 0 && (
              <DetailSection
                title="Recent meetings"
                className="gap-3 shadow-none"
              >
                <div className="flex flex-col gap-2">
                  {household.meetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              </DetailSection>
            )}
          </ScrollArea>
        )}

        <SheetFooter>
          {household && household.type !== "Past client" ? (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-1.5"
              onClick={() => logTouchpoint(household.id, "Call")}
            >
              Log call
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <SheetClose asChild>
              <Button variant="subtle" size="sm">
                Close
              </Button>
            </SheetClose>
            {household && (
              <Button variant="primary" size="sm" onClick={runPrimary}>
                {primaryAction(household)}
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

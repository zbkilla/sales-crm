"use client";

import Button from "@/components/_ui/button";
import FilterMenu from "@/components/_common/filter-menu";
import MobileFilters from "./mobile-filters";
import {
  ADVISOR_OPTIONS,
  FOLLOW_UP_OPTIONS,
  SEGMENT_OPTIONS,
  SORT_MENU_OPTIONS,
} from "./filter-options";
import type { SortKey } from "@/data/households";
import { TODAY, filterHouseholds, householdsCsvRows } from "@/lib/households";
import { downloadCsv } from "@/lib/csv";
import { useHouseholdsStore } from "@/stores/households-store";
import ShareIcon from "@/public/assets/images/households/toolbar/share.svg";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

export default function HouseholdsToolbar() {
  const sortBy = useHouseholdsStore((state) => state.sortBy);
  const advisor = useHouseholdsStore((state) => state.advisor);
  const segment = useHouseholdsStore((state) => state.segment);
  const followUp = useHouseholdsStore((state) => state.followUp);
  const activeTab = useHouseholdsStore((state) => state.activeTab);
  const setSortBy = useHouseholdsStore((state) => state.setSortBy);
  const setAdvisor = useHouseholdsStore((state) => state.setAdvisor);
  const setSegment = useHouseholdsStore((state) => state.setSegment);
  const setFollowUp = useHouseholdsStore((state) => state.setFollowUp);
  const openNewHousehold = useHouseholdsStore(
    (state) => state.openNewHousehold,
  );

  function exportCsv() {
    const { households } = useHouseholdsStore.getState();
    const visible = filterHouseholds(
      households,
      { sortBy, advisor, segment, followUp },
      activeTab,
    );
    downloadCsv(
      `households-${activeTab}-${TODAY}.csv`,
      householdsCsvRows(visible),
    );
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-4">
      <MobileFilters className="sm:hidden" />

      <div className="hidden min-w-0 flex-wrap gap-2 sm:flex">
        <FilterMenu
          label="Sort by"
          value={sortBy}
          options={SORT_MENU_OPTIONS}
          onChange={(value) => setSortBy(value as SortKey)}
        />
        <FilterMenu
          label="Advisor"
          value={advisor}
          options={ADVISOR_OPTIONS}
          onChange={setAdvisor}
        />
        <FilterMenu
          label="Tier & tags"
          value={segment}
          options={SEGMENT_OPTIONS}
          onChange={setSegment}
        />
        <FilterMenu
          label="Follow-up"
          value={followUp}
          options={FOLLOW_UP_OPTIONS}
          onChange={setFollowUp}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button variant="secondary" size="sm" onClick={exportCsv}>
          <ShareIcon aria-hidden className="size-3" />
          Export
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            openNewHousehold(activeTab === "prospects" ? "Prospect" : "Client")
          }
        >
          <PlusIcon aria-hidden className="size-3" />
          New Household
        </Button>
      </div>
    </div>
  );
}

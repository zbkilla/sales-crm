"use client";

import PageHeader from "@/components/_common/page-header";
import { HOUSEHOLD_TABS, type HouseholdTab } from "@/data/households";
import { useHouseholdsStore } from "@/stores/households-store";

export default function HouseholdsHeader() {
  const activeTab = useHouseholdsStore((state) => state.activeTab);
  const setActiveTab = useHouseholdsStore((state) => state.setActiveTab);
  const households = useHouseholdsStore((state) => state.households);

  return (
    <PageHeader
      title="Households"
      tabs={HOUSEHOLD_TABS.map((tab) => ({
        value: tab.value,
        label: tab.label,
        count: households.filter((household) => household.type === tab.type)
          .length,
      }))}
      activeTab={activeTab}
      onTabChange={(value) => setActiveTab(value as HouseholdTab)}
    />
  );
}

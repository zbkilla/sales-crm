import type { HouseholdTab } from "@/data/households";

export const TABLE_COLUMN_KEYS = [
  "name",
  "segment",
  "advisor",
  "assets",
  "pipeline",
  "followUp",
  "reviewStatus",
  "trend",
  "lastTouchpoint",
  "touchpointType",
  "action",
] as const;

export type TableColumnKey = (typeof TABLE_COLUMN_KEYS)[number];

const COLUMN_CLASS: Record<TableColumnKey, string> = {
  name: "justify-start",
  segment: "justify-start",
  advisor: "justify-start",
  assets: "justify-end tabular-nums",
  pipeline: "justify-end tabular-nums",
  followUp: "justify-start",
  reviewStatus: "justify-start",
  trend: "justify-center",
  lastTouchpoint: "justify-start",
  touchpointType: "justify-start",
  action: "justify-center",
};

const COLUMN_LABELS: Record<
  HouseholdTab,
  Partial<Record<TableColumnKey, string>>
> = {
  clients: {
    name: "Household",
    segment: "Tier & Tags",
    advisor: "Advisor",
    assets: "AUM",
    pipeline: "Pipeline",
    followUp: "Next Review",
    reviewStatus: "Review Status",
    trend: "Touchpoints",
    lastTouchpoint: "Last Touchpoint",
    touchpointType: "Touchpoint Type",
    action: "Action",
  },
  prospects: {
    name: "Household",
    segment: "Tags",
    advisor: "Advisor",
    assets: "Opportunity",
    pipeline: "Weighted",
    followUp: "Stage",
    trend: "Touchpoints",
    lastTouchpoint: "Last Touchpoint",
    touchpointType: "Touchpoint Type",
    action: "Action",
  },
  past: {
    name: "Household",
    segment: "Tags",
    advisor: "Advisor",
    assets: "Client Since",
    pipeline: "Pipeline",
    followUp: "Past Client Since",
    trend: "Touchpoints",
    lastTouchpoint: "Last Touchpoint",
    touchpointType: "Touchpoint Type",
    action: "Action",
  },
};

export function columnsFor(tab: HouseholdTab) {
  return TABLE_COLUMN_KEYS.flatMap((key) => {
    const label = COLUMN_LABELS[tab][key];
    return label ? [{ key, label, className: COLUMN_CLASS[key] }] : [];
  });
}

export const TABLE_GRID_CLASS =
  "grid min-w-max grid-cols-[repeat(var(--table-columns),max-content)] justify-between";

export const TABLE_ROW_CLASS = "col-span-full grid grid-cols-subgrid";

export const TABLE_CELL_CLASS = "flex items-center";

export function columnClass(key: TableColumnKey) {
  return COLUMN_CLASS[key];
}

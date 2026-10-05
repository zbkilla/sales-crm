import type { ReviewsTab } from "@/stores/households-store";

export type ReviewColumnKey =
  | "client"
  | "tier"
  | "advisor"
  | "last"
  | "lastType"
  | "due"
  | "status"
  | "cadence"
  | "extra"
  | "action";

const COLUMN_CLASS: Record<ReviewColumnKey, string> = {
  client: "justify-start",
  tier: "justify-start",
  advisor: "justify-start",
  last: "justify-start",
  lastType: "justify-start",
  due: "justify-start",
  status: "justify-start",
  cadence: "justify-start",
  extra: "justify-end tabular-nums",
  action: "justify-end",
};

const LABELS: Record<ReviewsTab, Partial<Record<ReviewColumnKey, string>>> = {
  upcoming: {
    client: "Client",
    tier: "Tier",
    advisor: "Advisor",
    last: "Last Review",
    due: "Next Review Due",
    status: "Review Status",
    cadence: "Review Cadence",
    extra: "AUM",
    action: "Action",
  },
  touchpoints: {
    client: "Client",
    tier: "Tier",
    advisor: "Advisor",
    last: "Last Touchpoint",
    lastType: "Touchpoint Type",
    due: "Next Touchpoint Due",
    status: "Touchpoint Status",
    cadence: "Touchpoint Cadence",
    extra: "Email",
    action: "Action",
  },
};

const KEYS: ReviewColumnKey[] = [
  "client",
  "tier",
  "advisor",
  "last",
  "lastType",
  "due",
  "status",
  "cadence",
  "extra",
  "action",
];

export function reviewColumns(tab: ReviewsTab) {
  return KEYS.flatMap((key) => {
    const label = LABELS[tab][key];
    return label ? [{ key, label, className: COLUMN_CLASS[key] }] : [];
  });
}

export function reviewColumnClass(key: ReviewColumnKey) {
  return COLUMN_CLASS[key];
}

export const REVIEW_GRID_CLASS =
  "grid min-w-max grid-cols-[repeat(var(--table-columns),max-content)] justify-between";

export const REVIEW_ROW_CLASS = "col-span-full grid grid-cols-subgrid";

export const REVIEW_CELL_CLASS = "flex items-center";

import {
  ADVISORS,
  FOLLOW_UP_STATUSES,
  HOUSEHOLD_TAGS,
  SORT_OPTIONS,
  TIERS,
} from "@/data/households";
import { ALL_ADVISORS, ANY_FOLLOW_UP, ANY_SEGMENT } from "@/lib/households";

export const ADVISOR_OPTIONS = [
  { value: ALL_ADVISORS, label: "All advisors" },
  ...ADVISORS.map((advisor) => ({ value: advisor.name, label: advisor.name })),
];

export const SEGMENT_OPTIONS = [
  { value: ANY_SEGMENT, label: "Any" },
  ...TIERS.map((tier) => ({ value: `tier:${tier}`, label: `Tier ${tier}` })),
  ...HOUSEHOLD_TAGS.map((tag) => ({ value: `tag:${tag}`, label: tag })),
];

export const FOLLOW_UP_OPTIONS = [
  { value: ANY_FOLLOW_UP, label: "Any" },
  ...FOLLOW_UP_STATUSES.map((status) => ({
    value: status.value,
    label: status.label,
  })),
];

export const SORT_MENU_OPTIONS = SORT_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));

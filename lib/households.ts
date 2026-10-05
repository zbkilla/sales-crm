import {
  HOUSEHOLD_TABS,
  PROSPECT_TOUCHPOINT_DAYS,
  REVIEW_CADENCES,
  TIER_DEFAULTS,
  type FollowUpStatus,
  type Household,
  type HouseholdTab,
  type HouseholdType,
  type ReviewCadence,
  type SortKey,
} from "@/data/households";

export type HouseholdFilters = {
  sortBy: SortKey;
  advisor: string;
  segment: string;
  followUp: string;
};

export const TODAY = "2026-10-04";

export const ALL_ADVISORS = "all";
export const ANY_SEGMENT = "any";
export const ANY_FOLLOW_UP = "any";

export const DEFAULT_FILTERS: HouseholdFilters = {
  sortBy: "assets",
  advisor: ALL_ADVISORS,
  segment: ANY_SEGMENT,
  followUp: ANY_FOLLOW_UP,
};

const DAY = 24 * 60 * 60 * 1000;
const FAR_FUTURE = "9999-12-31";

export function activeFilterCount({
  advisor,
  segment,
  followUp,
}: HouseholdFilters) {
  return [
    advisor !== DEFAULT_FILTERS.advisor,
    segment !== DEFAULT_FILTERS.segment,
    followUp !== DEFAULT_FILTERS.followUp,
  ].filter(Boolean).length;
}

export function tabType(tab: HouseholdTab): HouseholdType {
  return HOUSEHOLD_TABS.find((item) => item.value === tab)?.type ?? "Client";
}

export function addMonths(iso: string, months: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number) {
  return new Date(Date.parse(iso) + days * DAY).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / DAY);
}

export function daysSince(iso: string) {
  return Math.max(0, daysBetween(iso, TODAY));
}

export function reviewCadence(household: Household): ReviewCadence {
  if (household.reviewCadence) return household.reviewCadence;
  return household.tier ? TIER_DEFAULTS[household.tier].reviewCadence : "Annual";
}

export function nextReviewDue(household: Household) {
  if (household.type !== "Client") return null;
  const months =
    REVIEW_CADENCES.find((cadence) => cadence.value === reviewCadence(household))
      ?.months ?? 12;
  const base = household.lastReview ?? household.clientSince ?? TODAY;
  return addMonths(base, months);
}

export function touchpointDays(household: Household) {
  if (household.type === "Prospect") return PROSPECT_TOUCHPOINT_DAYS;
  if (household.type !== "Client") return null;
  return household.tier ? TIER_DEFAULTS[household.tier].touchpointDays : 90;
}

export function nextTouchpointDue(household: Household) {
  const days = touchpointDays(household);
  return days === null ? null : addDays(household.lastTouchpoint.date, days);
}

function statusFor(due: string | null, soonDays: number): FollowUpStatus | null {
  if (!due) return null;
  if (due < TODAY) return "overdue";
  return daysBetween(TODAY, due) <= soonDays ? "due-soon" : "on-track";
}

export function reviewStatus(household: Household) {
  return statusFor(nextReviewDue(household), 30);
}

export function touchpointStatus(household: Household) {
  return statusFor(
    nextTouchpointDue(household),
    household.type === "Prospect" ? 5 : 14,
  );
}

export function followUpDue(household: Household) {
  if (household.type === "Client") return nextReviewDue(household);
  if (household.type === "Prospect") return nextTouchpointDue(household);
  return null;
}

export function followUpStatus(household: Household) {
  if (household.type === "Client") return reviewStatus(household);
  if (household.type === "Prospect") return touchpointStatus(household);
  return null;
}

export function householdAum(household: Household) {
  return household.accounts
    .filter((account) => account.source === "custodian")
    .reduce((sum, account) => sum + account.balance, 0);
}

export function heldAwayTotal(household: Household) {
  return household.accounts
    .filter((account) => account.source === "manual")
    .reduce((sum, account) => sum + account.balance, 0);
}

export function weightedPipeline(household: Household) {
  return household.opportunities.reduce(
    (sum, opportunity) =>
      sum + Math.round((opportunity.value * opportunity.probability) / 100),
    0,
  );
}

export function leadOpportunity(household: Household) {
  return [...household.opportunities].sort((a, b) => b.value - a.value)[0];
}

export function assetsValue(household: Household) {
  if (household.type === "Client") return householdAum(household);
  if (household.type === "Prospect") return leadOpportunity(household)?.value ?? 0;
  return 0;
}

export function headOfHousehold(household: Household) {
  return (
    household.people.find((person) => person.role === "Head of household") ??
    household.people[0]
  );
}

export function memberCount(household: Household) {
  return household.people.filter((person) => person.role !== "Deceased").length;
}

export function householdInitials(name: string) {
  const words = name.split(/\s+/).filter((word) => word && word !== "and");
  if (words.length === 0) return "?";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export function householdName(
  head: { firstName: string; lastName: string },
  partner?: { firstName: string; lastName: string },
) {
  const headName = [head.firstName, head.lastName].filter(Boolean).join(" ");
  if (!partner || !partner.firstName) return headName;
  const partnerLast = partner.lastName || head.lastName;
  if (partnerLast === head.lastName) {
    return `${head.firstName} and ${partner.firstName} ${head.lastName}`.trim();
  }
  return `${headName} and ${partner.firstName} ${partnerLast}`;
}

export function ageFrom(dateOfBirth: string) {
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = TODAY.split("-").map(Number);
  const hadBirthday =
    todayMonth > month || (todayMonth === month && todayDay >= day);
  return todayYear - year - (hadBirthday ? 0 : 1);
}

function matchesSegment(household: Household, segment: string) {
  if (segment === ANY_SEGMENT) return true;
  const [kind, value] = segment.split(":");
  if (kind === "tier") return household.tier === value;
  return household.tags.some((tag) => tag === value);
}

export function filterHouseholds(
  households: Household[],
  { sortBy, advisor, segment, followUp }: HouseholdFilters,
  tab: HouseholdTab,
): Household[] {
  const type = tabType(tab);
  const filtered = households.filter((household) => {
    if (household.type !== type) return false;
    if (advisor !== ALL_ADVISORS && household.advisor !== advisor) return false;
    if (!matchesSegment(household, segment)) return false;
    return followUp === ANY_FOLLOW_UP || followUpStatus(household) === followUp;
  });

  return filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "followUp":
        return (followUpDue(a) ?? FAR_FUTURE).localeCompare(
          followUpDue(b) ?? FAR_FUTURE,
        );
      case "pipeline":
        return weightedPipeline(b) - weightedPipeline(a);
      case "lastTouchpoint":
        return b.lastTouchpoint.date.localeCompare(a.lastTouchpoint.date);
      default:
        return assetsValue(b) - assetsValue(a);
    }
  });
}

const FOLLOW_UP_LABELS: Record<FollowUpStatus, string> = {
  overdue: "Overdue",
  "due-soon": "Due soon",
  "on-track": "On track",
};

export function followUpLabel(status: FollowUpStatus) {
  return FOLLOW_UP_LABELS[status];
}

export function householdsCsvRows(households: Household[]) {
  return [
    [
      "Household",
      "Type",
      "Tier",
      "Tags",
      "Advisor",
      "Members",
      "AUM",
      "Weighted Pipeline",
      "Next Follow-up",
      "Follow-up Status",
      "Last Touchpoint Date",
      "Last Touchpoint",
    ],
    ...households.map((household) => {
      const status = followUpStatus(household);
      return [
        household.name,
        household.type,
        household.tier ?? "",
        household.tags.join("; "),
        household.advisor,
        memberCount(household),
        householdAum(household),
        weightedPipeline(household),
        followUpDue(household) ?? "",
        status ? followUpLabel(status) : "",
        household.lastTouchpoint.date,
        household.lastTouchpoint.label,
      ];
    }),
  ];
}

export function splitTags<T extends string>(tags: T[], budget = 20) {
  let used = 0;
  const visible: T[] = [];

  for (const tag of tags) {
    if (visible.length === 2 || used + tag.length > budget) break;
    visible.push(tag);
    used += tag.length;
  }

  if (visible.length === 0 && tags.length > 0) visible.push(tags[0]);

  return { visible, hidden: tags.length - visible.length };
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const label = `${MONTH_NAMES[month - 1]} ${day}`;
  return String(year) === TODAY.slice(0, 4) ? label : `${label}, ${year}`;
}

export function formatMoney(value: number) {
  return value.toLocaleString("en-US");
}

export function formatCompactMoney(value: number) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value >= 10_000_000 ? 1 : 2)}M`;
  }
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

export function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

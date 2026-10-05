import type { FollowUpStatus, Household } from "@/data/households";
import {
  nextReviewDue,
  nextTouchpointDue,
  reviewStatus,
  touchpointStatus,
} from "@/lib/households";
import type { ReviewsFilters, ReviewsTab } from "@/stores/households-store";

export const ALL_ADVISORS = "all";
export const ANY_TIER = "any";
export const ANY_STATUS = "any";

const FAR_FUTURE = "9999-12-31";

export function reviewsStatus(household: Household, tab: ReviewsTab) {
  return tab === "upcoming"
    ? reviewStatus(household)
    : touchpointStatus(household);
}

export function reviewsDue(household: Household, tab: ReviewsTab) {
  return tab === "upcoming"
    ? nextReviewDue(household)
    : nextTouchpointDue(household);
}

export function filterReviews(
  households: Household[],
  { advisor, tier, status }: ReviewsFilters,
  tab: ReviewsTab,
) {
  return households
    .filter((household) => {
      if (household.type !== "Client") return false;
      if (advisor !== ALL_ADVISORS && household.advisor !== advisor) {
        return false;
      }
      if (tier !== ANY_TIER && household.tier !== tier) return false;
      return status === ANY_STATUS || reviewsStatus(household, tab) === status;
    })
    .sort((a, b) =>
      (reviewsDue(a, tab) ?? FAR_FUTURE).localeCompare(
        reviewsDue(b, tab) ?? FAR_FUTURE,
      ),
    );
}

export function statusCounts(households: Household[], tab: ReviewsTab) {
  const counts: Record<FollowUpStatus, number> = {
    overdue: 0,
    "due-soon": 0,
    "on-track": 0,
  };
  for (const household of households) {
    const status = reviewsStatus(household, tab);
    if (status) counts[status] += 1;
  }
  return counts;
}

export function activeReviewsFilterCount({ advisor, tier, status }: ReviewsFilters) {
  return [advisor !== ALL_ADVISORS, tier !== ANY_TIER, status !== ANY_STATUS].filter(
    Boolean,
  ).length;
}

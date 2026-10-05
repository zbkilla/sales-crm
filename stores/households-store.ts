import { create } from "zustand";
import {
  CLIENT_STAGES,
  HOUSEHOLDS,
  PROSPECT_STAGES,
  type Household,
  type HouseholdTab,
  type OpportunityStage,
  type ReviewCadence,
  type SortKey,
  type Tier,
  type Touchpoint,
} from "@/data/households";
import { NOTIFICATIONS } from "@/data/notifications";
import { DEFAULT_FILTERS, TODAY } from "@/lib/households";

export type NewHouseholdType = "Client" | "Prospect";
export type ReviewsTab = "upcoming" | "touchpoints";
export type PipelineTab = "prospect" | "client";
export type OpportunityOutcome = "won" | "lost";

export type ReviewsFilters = {
  advisor: string;
  tier: string;
  status: string;
};

export const DEFAULT_REVIEWS_FILTERS: ReviewsFilters = {
  advisor: "all",
  tier: "any",
  status: "any",
};

type HouseholdsState = {
  households: Household[];
  sortBy: SortKey;
  advisor: string;
  segment: string;
  followUp: string;
  selectedIds: string[];
  detailId: string | null;
  detailOpen: boolean;
  profileName: string | null;
  profileOpen: boolean;
  newHouseholdOpen: boolean;
  newHouseholdType: NewHouseholdType;
  sidebarOpen: boolean;
  searchOpen: boolean;
  unreadNotificationIds: string[];
  activeTab: HouseholdTab;
  setSortBy: (sortBy: SortKey) => void;
  setAdvisor: (advisor: string) => void;
  setSegment: (segment: string) => void;
  setFollowUp: (followUp: string) => void;
  resetFilters: () => void;
  toggleSelected: (id: string) => void;
  setSelected: (ids: string[]) => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  openProfile: (name: string) => void;
  closeProfile: () => void;
  openNewHousehold: (type: NewHouseholdType) => void;
  setNewHouseholdOpen: (open: boolean) => void;
  setNewHouseholdType: (type: NewHouseholdType) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setActiveTab: (tab: HouseholdTab) => void;
  addHousehold: (household: Household) => void;
  promoteToClient: (id: string) => void;
  restoreToClient: (id: string) => void;
  logReview: (id: string) => void;
  logTouchpoint: (id: string, label: Touchpoint["label"]) => void;
  setTier: (id: string, tier: Tier) => void;
  setReviewCadence: (id: string, cadence: ReviewCadence | null) => void;
  reviewsTab: ReviewsTab;
  reviewsFilters: ReviewsFilters;
  setReviewsTab: (tab: ReviewsTab) => void;
  setReviewsFilter: (key: keyof ReviewsFilters, value: string) => void;
  resetReviewsFilters: () => void;
  pipelineTab: PipelineTab;
  pipelineAdvisor: string;
  setPipelineTab: (tab: PipelineTab) => void;
  setPipelineAdvisor: (advisor: string) => void;
  moveOpportunity: (
    householdId: string,
    opportunityId: string,
    stage: OpportunityStage,
  ) => void;
  closeOpportunity: (
    householdId: string,
    opportunityId: string,
    outcome: OpportunityOutcome,
  ) => void;
};

function stageProbability(household: Household, stage: OpportunityStage) {
  const stages = household.type === "Prospect" ? PROSPECT_STAGES : CLIENT_STAGES;
  return stages.find((item) => item.value === stage)?.probability ?? 10;
}

const TAB_FOR_TYPE: Record<Household["type"], HouseholdTab> = {
  Client: "clients",
  Prospect: "prospects",
  "Past client": "past",
};

function updateHousehold(
  households: Household[],
  id: string,
  update: (household: Household) => Household,
) {
  return households.map((household) =>
    household.id === id ? update(household) : household,
  );
}

function bumpTrend(trend: number[]) {
  return [...trend.slice(0, -1), Math.min(14, trend[trend.length - 1] + 2)];
}

export const useHouseholdsStore = create<HouseholdsState>((set) => ({
  households: HOUSEHOLDS,
  ...DEFAULT_FILTERS,
  selectedIds: [],
  detailId: null,
  detailOpen: false,
  profileName: null,
  profileOpen: false,
  newHouseholdOpen: false,
  newHouseholdType: "Client",
  sidebarOpen: false,
  searchOpen: false,
  unreadNotificationIds: NOTIFICATIONS.filter((item) => item.unread).map(
    (item) => item.id,
  ),
  activeTab: "clients",
  setSortBy: (sortBy) => set({ sortBy }),
  setAdvisor: (advisor) => set({ advisor }),
  setSegment: (segment) => set({ segment }),
  setFollowUp: (followUp) => set({ followUp }),
  resetFilters: () => set({ ...DEFAULT_FILTERS }),
  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selected) => selected !== id)
        : [...state.selectedIds, id],
    })),
  setSelected: (selectedIds) => set({ selectedIds }),
  openDetail: (detailId) =>
    set({ detailId, detailOpen: true, profileOpen: false }),
  closeDetail: () => set({ detailOpen: false }),
  openProfile: (profileName) =>
    set({ profileName, profileOpen: true, detailOpen: false }),
  closeProfile: () => set({ profileOpen: false }),
  openNewHousehold: (newHouseholdType) =>
    set({ newHouseholdType, newHouseholdOpen: true }),
  setNewHouseholdOpen: (newHouseholdOpen) => set({ newHouseholdOpen }),
  setNewHouseholdType: (newHouseholdType) => set({ newHouseholdType }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  markNotificationRead: (id) =>
    set((state) => ({
      unreadNotificationIds: state.unreadNotificationIds.filter(
        (unread) => unread !== id,
      ),
    })),
  markAllNotificationsRead: () => set({ unreadNotificationIds: [] }),
  setActiveTab: (activeTab) => set({ activeTab, selectedIds: [] }),
  addHousehold: (household) =>
    set((state) => ({
      households: [household, ...state.households],
      newHouseholdOpen: false,
      activeTab: TAB_FOR_TYPE[household.type],
    })),
  promoteToClient: (id) =>
    set((state) => ({
      households: updateHousehold(state.households, id, (household) => ({
        ...household,
        type: "Client",
        tier: household.tier ?? "C",
        clientSince: TODAY,
        lastReview: null,
        opportunities: [],
        estAssets: undefined,
      })),
      activeTab: "clients",
    })),
  restoreToClient: (id) =>
    set((state) => ({
      households: updateHousehold(state.households, id, (household) => ({
        ...household,
        type: "Client",
        tier: household.tier ?? "C",
        pastClientSince: undefined,
      })),
      activeTab: "clients",
    })),
  logReview: (id) =>
    set((state) => ({
      households: updateHousehold(state.households, id, (household) => ({
        ...household,
        lastReview: TODAY,
        lastTouchpoint: { date: TODAY, label: "Client review" },
        touchpointTrend: bumpTrend(household.touchpointTrend),
        touchpointMix: {
          ...household.touchpointMix,
          meetings: household.touchpointMix.meetings + 1,
        },
      })),
    })),
  logTouchpoint: (id, label) =>
    set((state) => ({
      households: updateHousehold(state.households, id, (household) => ({
        ...household,
        lastTouchpoint: { date: TODAY, label },
        touchpointTrend: bumpTrend(household.touchpointTrend),
      })),
    })),
  setTier: (id, tier) =>
    set((state) => ({
      households: updateHousehold(state.households, id, (household) => ({
        ...household,
        tier,
      })),
    })),
  setReviewCadence: (id, cadence) =>
    set((state) => ({
      households: updateHousehold(state.households, id, (household) => ({
        ...household,
        reviewCadence: cadence ?? undefined,
      })),
    })),
  reviewsTab: "upcoming",
  reviewsFilters: DEFAULT_REVIEWS_FILTERS,
  setReviewsTab: (reviewsTab) => set({ reviewsTab }),
  setReviewsFilter: (key, value) =>
    set((state) => ({
      reviewsFilters: { ...state.reviewsFilters, [key]: value },
    })),
  resetReviewsFilters: () => set({ reviewsFilters: DEFAULT_REVIEWS_FILTERS }),
  pipelineTab: "prospect",
  pipelineAdvisor: "all",
  setPipelineTab: (pipelineTab) => set({ pipelineTab }),
  setPipelineAdvisor: (pipelineAdvisor) => set({ pipelineAdvisor }),
  moveOpportunity: (householdId, opportunityId, stage) =>
    set((state) => ({
      households: updateHousehold(state.households, householdId, (household) => ({
        ...household,
        opportunities: household.opportunities.map((opportunity) =>
          opportunity.id === opportunityId
            ? {
                ...opportunity,
                stage,
                probability: stageProbability(household, stage),
              }
            : opportunity,
        ),
      })),
    })),
  closeOpportunity: (householdId, opportunityId, outcome) =>
    set((state) => ({
      households: updateHousehold(state.households, householdId, (household) => {
        const remaining = household.opportunities.filter(
          (opportunity) => opportunity.id !== opportunityId,
        );
        if (outcome === "won" && household.type === "Prospect") {
          return {
            ...household,
            type: "Client",
            tier: household.tier ?? "C",
            clientSince: TODAY,
            lastReview: null,
            opportunities: remaining,
            estAssets: undefined,
          };
        }
        return { ...household, opportunities: remaining };
      }),
    })),
}));

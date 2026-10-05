import {
  CLIENT_STAGES,
  PROSPECT_STAGES,
  type Household,
  type Opportunity,
  type OpportunityStage,
} from "@/data/households";
import type { PipelineTab } from "@/stores/households-store";

export type PipelineCard = {
  household: Household;
  opportunity: Opportunity;
};

export const ALL_ADVISORS = "all";

export const STAGE_DOT_CLASS: Record<OpportunityStage, string> = {
  Identified: "bg-subtle",
  Connected: "bg-(--tag-blue-text)",
  "Meeting scheduled": "bg-(--tag-amber-text)",
  Qualified: "bg-(--tag-green-text)",
  "In-progress": "bg-(--tag-blue-text)",
  Reviewing: "bg-(--tag-green-text)",
};

export function pipelineStages(tab: PipelineTab) {
  return tab === "prospect" ? PROSPECT_STAGES : CLIENT_STAGES;
}

export function pipelineCards(
  households: Household[],
  tab: PipelineTab,
  advisor: string,
): PipelineCard[] {
  const type = tab === "prospect" ? "Prospect" : "Client";
  return households
    .filter(
      (household) =>
        household.type === type &&
        (advisor === ALL_ADVISORS || household.advisor === advisor),
    )
    .flatMap((household) =>
      household.opportunities.map((opportunity) => ({ household, opportunity })),
    )
    .sort((a, b) => b.opportunity.value - a.opportunity.value);
}

export function weightedValue(opportunity: Opportunity) {
  return Math.round((opportunity.value * opportunity.probability) / 100);
}

export function pipelineTotals(cards: PipelineCard[]) {
  return {
    count: cards.length,
    total: cards.reduce((sum, card) => sum + card.opportunity.value, 0),
    weighted: cards.reduce(
      (sum, card) => sum + weightedValue(card.opportunity),
      0,
    ),
  };
}

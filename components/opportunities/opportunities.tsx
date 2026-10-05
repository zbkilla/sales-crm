"use client";

import { useMemo, useState, type DragEvent } from "react";
import Button from "@/components/_ui/button";
import CountBadge from "@/components/_ui/count-badge";
import { ScrollArea } from "@/components/_ui/scroll-area";
import FilterMenu from "@/components/_common/filter-menu";
import PageHeader from "@/components/_common/page-header";
import OpportunityCard from "./opportunity-card";
import { ADVISORS, type OpportunityStage } from "@/data/households";
import { formatCompactMoney } from "@/lib/households";
import {
  ALL_ADVISORS,
  STAGE_DOT_CLASS,
  pipelineCards,
  pipelineStages,
  pipelineTotals,
  type PipelineCard,
} from "@/lib/pipeline";
import { cn } from "@/lib/utils";
import {
  useHouseholdsStore,
  type OpportunityOutcome,
  type PipelineTab,
} from "@/stores/households-store";

const ADVISOR_OPTIONS = [
  { value: ALL_ADVISORS, label: "All advisors" },
  ...ADVISORS.map((advisor) => ({ value: advisor.name, label: advisor.name })),
];

const DRAG_TYPE = "application/x-opportunity";

type DropTarget = OpportunityStage | OpportunityOutcome;

type Outcome = {
  householdId: string;
  message: string;
};

function cardKey(card: PipelineCard) {
  return `${card.household.id}:${card.opportunity.id}`;
}

export default function Opportunities() {
  const households = useHouseholdsStore((state) => state.households);
  const tab = useHouseholdsStore((state) => state.pipelineTab);
  const advisor = useHouseholdsStore((state) => state.pipelineAdvisor);
  const setTab = useHouseholdsStore((state) => state.setPipelineTab);
  const setAdvisor = useHouseholdsStore((state) => state.setPipelineAdvisor);
  const openDetail = useHouseholdsStore((state) => state.openDetail);
  const moveOpportunity = useHouseholdsStore((state) => state.moveOpportunity);
  const closeOpportunity = useHouseholdsStore(
    (state) => state.closeOpportunity,
  );
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overTarget, setOverTarget] = useState<DropTarget | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const stages = pipelineStages(tab);
  const cards = useMemo(
    () => pipelineCards(households, tab, advisor),
    [households, tab, advisor],
  );
  const totals = pipelineTotals(cards);
  const prospectCount = pipelineCards(households, "prospect", ALL_ADVISORS).length;
  const clientCount = pipelineCards(households, "client", ALL_ADVISORS).length;

  function findCard(key: string) {
    return cards.find((card) => cardKey(card) === key);
  }

  function close(card: PipelineCard, result: OpportunityOutcome) {
    const promoted = result === "won" && card.household.type === "Prospect";
    closeOpportunity(card.household.id, card.opportunity.id, result);
    setOutcome({
      householdId: card.household.id,
      message: promoted
        ? `${card.household.name} closed won and promoted to client.`
        : `${card.opportunity.name} marked closed ${result}.`,
    });
  }

  function drop(target: DropTarget, event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const key = event.dataTransfer.getData(DRAG_TYPE) || dragKey;
    setOverTarget(null);
    setDragKey(null);
    const card = key ? findCard(key) : undefined;
    if (!card) return;
    if (target === "won" || target === "lost") close(card, target);
    else if (target !== card.opportunity.stage) {
      moveOpportunity(card.household.id, card.opportunity.id, target);
    }
  }

  function dropHandlers(target: DropTarget) {
    return {
      onDragOver: (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        if (overTarget !== target) setOverTarget(target);
      },
      onDragLeave: () => setOverTarget(null),
      onDrop: (event: DragEvent<HTMLElement>) => drop(target, event),
    };
  }

  return (
    <section
      id="opportunities"
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <PageHeader
        title="Opportunities"
        tabs={[
          { value: "prospect", label: "Prospect pipeline", count: prospectCount },
          { value: "client", label: "Client growth", count: clientCount },
        ]}
        activeTab={tab}
        onTabChange={(value) => {
          setTab(value as PipelineTab);
          setOutcome(null);
        }}
      />

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterMenu
            label="Advisor"
            value={advisor}
            options={ADVISOR_OPTIONS}
            onChange={setAdvisor}
          />
          {outcome && (
            <span
              role="status"
              className="caption-style text-soft flex items-center gap-1"
            >
              {outcome.message}
              <Button
                variant="link"
                size="none"
                className="caption-style"
                onClick={() => openDetail(outcome.householdId)}
              >
                View household
              </Button>
            </span>
          )}
        </div>
        <div className="caption-style flex items-center gap-4 tabular-nums">
          <span>
            <span className="text-subtle">Total </span>
            {formatCompactMoney(totals.total)}
          </span>
          <span>
            <span className="text-subtle">Weighted </span>
            {formatCompactMoney(totals.weighted)}
          </span>
        </div>
      </div>

      <div className="border-border relative flex min-h-0 flex-1 flex-col border-t">
        <ScrollArea orientation="both" className="min-h-0 flex-1">
          <div className="flex min-h-full gap-3 p-4">
            {stages.map((stage) => {
              const stageCards = cards.filter(
                (card) => card.opportunity.stage === stage.value,
              );
              const stageTotals = pipelineTotals(stageCards);
              return (
                <section
                  key={stage.value}
                  aria-label={`${stage.value} stage`}
                  data-over={overTarget === stage.value}
                  {...dropHandlers(stage.value)}
                  className="border-line-strong data-[over=true]:border-foreground/40 flex w-[300px] shrink-0 flex-col gap-3 rounded-xl border bg-white/2 p-2 transition-colors duration-150 data-[over=true]:bg-white/5"
                >
                  <header className="flex flex-col gap-1.5 px-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className={cn(
                          "size-2 rounded-full",
                          STAGE_DOT_CLASS[stage.value],
                        )}
                      />
                      <h2 className="lead-style font-medium">{stage.value}</h2>
                      <CountBadge>{stageTotals.count}</CountBadge>
                    </div>
                    <span className="caption-style text-subtle tabular-nums">
                      {formatCompactMoney(stageTotals.total)} total ·{" "}
                      {formatCompactMoney(stageTotals.weighted)} weighted ·{" "}
                      {stage.probability}% default
                    </span>
                  </header>
                  <ul className="flex flex-col gap-2">
                    {stageCards.map((card) => (
                      <OpportunityCard
                        key={cardKey(card)}
                        card={card}
                        stages={stages}
                        dragging={dragKey === cardKey(card)}
                        onDragStart={(event) => {
                          event.dataTransfer.setData(DRAG_TYPE, cardKey(card));
                          event.dataTransfer.effectAllowed = "move";
                          setDragKey(cardKey(card));
                          setOutcome(null);
                        }}
                        onDragEnd={() => {
                          setDragKey(null);
                          setOverTarget(null);
                        }}
                        onOpen={() => openDetail(card.household.id)}
                        onMove={(target) =>
                          moveOpportunity(
                            card.household.id,
                            card.opportunity.id,
                            target,
                          )
                        }
                        onClose={(result) => close(card, result)}
                      />
                    ))}
                    {stageCards.length === 0 && (
                      <li className="caption-style text-subtle rounded-lg border border-dashed border-white/10 px-3 py-6 text-center">
                        Drop an opportunity here
                      </li>
                    )}
                  </ul>
                </section>
              );
            })}
          </div>
        </ScrollArea>

        {dragKey && (
          <div className="bg-background/90 border-border absolute inset-x-0 bottom-0 grid grid-cols-2 gap-3 border-t p-3 backdrop-blur">
            {(
              [
                { value: "won", label: "Closed won", tone: "border-success/50 text-success" },
                { value: "lost", label: "Closed lost", tone: "border-danger/50 text-danger" },
              ] as const
            ).map((zone) => (
              <div
                key={zone.value}
                data-over={overTarget === zone.value}
                {...dropHandlers(zone.value)}
                className={cn(
                  "lead-style flex h-14 items-center justify-center rounded-lg border border-dashed transition-colors duration-150 data-[over=true]:bg-white/6",
                  zone.tone,
                )}
              >
                {zone.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

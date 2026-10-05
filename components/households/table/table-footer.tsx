import type { Household, HouseholdTab } from "@/data/households";
import {
  daysBetween,
  formatCompactMoney,
  householdAum,
  reviewStatus,
  weightedPipeline,
} from "@/lib/households";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

type TableFooterProps = {
  households: Household[];
  tab: HouseholdTab;
};

function averageTenure(households: Household[]) {
  const tenures = households
    .filter((household) => household.clientSince && household.pastClientSince)
    .map(
      (household) =>
        daysBetween(household.clientSince!, household.pastClientSince!) / 365,
    );
  if (tenures.length === 0) return "—";
  const average =
    tenures.reduce((sum, years) => sum + years, 0) / tenures.length;
  return `${average.toFixed(1)} yrs`;
}

export default function TableFooter({ households, tab }: TableFooterProps) {
  const totalAum = households.reduce(
    (sum, household) => sum + householdAum(household),
    0,
  );
  const pipeline = households.reduce(
    (sum, household) => sum + weightedPipeline(household),
    0,
  );
  const overdue = households.filter(
    (household) => reviewStatus(household) === "overdue",
  ).length;
  const opportunities = households.reduce(
    (sum, household) => sum + household.opportunities.length,
    0,
  );

  const stats =
    tab === "clients"
      ? [
          { label: "Total AUM", value: formatCompactMoney(totalAum) },
          { label: "Reviews overdue", value: String(overdue) },
        ]
      : tab === "prospects"
        ? [
            { label: "Weighted pipeline", value: formatCompactMoney(pipeline) },
            { label: "Open opportunities", value: String(opportunities) },
          ]
        : [
            { label: "Average tenure", value: averageTenure(households) },
            { label: "Win-back pipeline", value: formatCompactMoney(pipeline) },
          ];

  return (
    <div className="caption-style border-border bg-background grid shrink-0 grid-cols-2 gap-px border-b p-px sm:grid-cols-4">
      <div className="outline-border flex items-center gap-2 p-3 outline-1">
        <span className="text-foreground tabular-nums">{households.length}</span>
        <span className="text-muted-foreground">Households in view</span>
      </div>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="outline-border flex items-center gap-2 p-3 outline-1"
        >
          <span className="text-foreground tabular-nums">{stat.value}</span>
          <span className="text-muted-foreground">{stat.label}</span>
        </div>
      ))}
      <div className="text-muted-foreground outline-border flex items-center gap-2 p-3 outline-1">
        <PlusIcon aria-hidden className="text-muted-foreground size-3" />
        Add Calculation
      </div>
    </div>
  );
}

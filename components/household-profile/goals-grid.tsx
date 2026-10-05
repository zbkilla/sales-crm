import Tag from "@/components/_ui/tag";
import SegmentBar from "@/components/_common/segment-bar";
import type { Goal, GoalStatus } from "@/data/financials";
import { formatDate, formatMoney } from "@/lib/households";

const STATUS_TONES: Record<GoalStatus, "green" | "amber" | "red" | "teal"> = {
  "On track": "green",
  "Needs attention": "amber",
  "At risk": "red",
  Achieved: "teal",
};

type GoalsGridProps = {
  goals: Goal[];
};

export default function GoalsGrid({ goals }: GoalsGridProps) {
  if (goals.length === 0) {
    return (
      <p className="caption-style text-subtle">
        No planning goals recorded yet.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {goals.map((goal) => (
        <li
          key={goal.id}
          className="bg-card flex flex-col gap-3 rounded-lg p-4 shadow-[0px_0px_0px_1px_#0e0e0e,inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_0px_0px_1px_rgba(255,255,255,0.08)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="caption-style text-subtle">
              {goal.category} · {goal.priority} priority
            </span>
            <Tag tone={STATUS_TONES[goal.status]} size="sm">
              {goal.status}
            </Tag>
          </div>
          <h3>{goal.name}</h3>
          <div className="caption-style flex items-center gap-2">
            <SegmentBar
              percent={Math.min(100, goal.fundedPercent)}
              segments={32}
              tone="success"
              className="flex-1"
            />
            <span className="w-[4ch] text-right tabular-nums">
              {goal.fundedPercent}%
            </span>
          </div>
          <span className="caption-style text-soft">
            {goal.targetAmount !== null
              ? `$${formatMoney(goal.targetAmount)}`
              : "No dollar target"}
            {goal.targetDate ? ` · by ${formatDate(goal.targetDate)}` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

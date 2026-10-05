import Tag from "@/components/_ui/tag";
import SegmentBar from "@/components/_common/segment-bar";
import type { Household } from "@/data/households";
import { TODAY, formatDate, formatMoney } from "@/lib/households";
import { cn } from "@/lib/utils";

type OpportunitiesProps = {
  household: Household;
};

export default function Opportunities({ household }: OpportunitiesProps) {
  return (
    <ul className="divide-line-strong flex flex-col divide-y">
      {household.opportunities.map((opportunity) => {
        const weighted = Math.round(
          (opportunity.value * opportunity.probability) / 100,
        );
        const overdue = opportunity.targetClose < TODAY;
        return (
          <li
            key={opportunity.id}
            className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="truncate">{opportunity.name}</span>
                <span className="flex">
                  <Tag tone="purple" size="sm">
                    {opportunity.stage}
                  </Tag>
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 tabular-nums">
                <span className="flex items-center gap-1">
                  <span className="text-muted-foreground">$</span>
                  {formatMoney(opportunity.value)}
                </span>
                <span className="caption-style text-subtle">
                  ${formatMoney(weighted)} weighted
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="caption-style flex items-center justify-between">
                <span>Probability</span>
                <span className="tabular-nums">{opportunity.probability}%</span>
              </div>
              <SegmentBar
                percent={opportunity.probability}
                segments={63}
                className="h-3 w-full border border-white/4 px-px"
                segmentClassName="h-2"
                trackClassName="bg-white/8"
              />
              <span
                className={cn(
                  "caption-style",
                  overdue ? "text-danger" : "text-soft",
                )}
              >
                Target close {formatDate(opportunity.targetClose)}
                {overdue && " · past due"}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

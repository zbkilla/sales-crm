import Tag from "@/components/_ui/tag";
import SegmentBar from "@/components/_common/segment-bar";
import type { Household } from "@/data/households";
import {
  formatCompactMoney,
  formatMoney,
  formatPercent,
  heldAwayTotal,
  householdAum,
} from "@/lib/households";
import { cn } from "@/lib/utils";

type PortfolioProps = {
  household: Household;
};

export default function Portfolio({ household }: PortfolioProps) {
  const aum = householdAum(household);
  const heldAway = heldAwayTotal(household);
  const custodianCount = household.accounts.filter(
    (account) => account.source === "custodian",
  ).length;
  const accounts = [...household.accounts].sort((a, b) => b.balance - a.balance);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="block text-[28px] leading-none font-semibold tabular-nums">
          ${formatMoney(aum)}
        </span>
        <span className="caption-style text-soft block">
          AUM across {custodianCount} custodian{" "}
          {custodianCount === 1 ? "account" : "accounts"}
          {heldAway > 0 && ` · ${formatCompactMoney(heldAway)} held away`}
        </span>
      </div>
      <ul className="divide-line-strong flex flex-col divide-y">
        {accounts.map((account) => {
          const share = aum > 0 ? Math.round((account.balance / aum) * 100) : 0;
          return (
            <li key={account.id} className="flex flex-col gap-2.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate">{account.name}</span>
                  <span className="caption-style text-subtle truncate">
                    {account.registration} · {account.custodian} ••••{" "}
                    {account.numberLast4}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 tabular-nums">
                  <span className="flex items-center gap-1">
                    <span className="text-muted-foreground">$</span>
                    {formatMoney(account.balance)}
                  </span>
                  <span
                    className={cn(
                      "caption-style",
                      account.ytdReturn > 0
                        ? "text-success"
                        : account.ytdReturn < 0
                          ? "text-danger"
                          : "text-subtle",
                    )}
                  >
                    {account.source === "manual" && account.ytdReturn === 0
                      ? "Cash"
                      : `${formatPercent(account.ytdReturn)} YTD`}
                  </span>
                </div>
              </div>
              {account.source === "custodian" ? (
                <div className="caption-style flex items-center gap-2">
                  <SegmentBar
                    percent={share}
                    segments={48}
                    tone="success"
                    className="h-3 flex-1 border border-white/4 px-px"
                    segmentClassName="h-2"
                    trackClassName="bg-white/8"
                  />
                  <span className="text-soft w-[4ch] text-right tabular-nums">
                    {share}%
                  </span>
                </div>
              ) : (
                <span className="flex">
                  <Tag tone="neutral" size="sm">
                    Held away · not in AUM
                  </Tag>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

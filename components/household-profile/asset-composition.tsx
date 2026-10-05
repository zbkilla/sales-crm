"use client";

import { useState } from "react";
import type { BalanceSheet } from "@/lib/balance-sheet";
import { assetComposition } from "@/lib/balance-sheet";
import { formatCompactMoney, formatMoney } from "@/lib/households";
import { cn } from "@/lib/utils";

type AssetCompositionProps = {
  sheet: BalanceSheet;
};

export default function AssetComposition({ sheet }: AssetCompositionProps) {
  const segments = assetComposition(sheet);
  const [active, setActive] = useState<string | null>(null);
  const activeSegment = segments.find((segment) => segment.key === active);

  if (segments.length === 0) {
    return (
      <p className="caption-style text-subtle">
        No assets on the balance sheet yet.
      </p>
    );
  }

  return (
    <figure className="flex flex-col gap-4">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="caption-style text-soft">
          Share of total assets by category
        </span>
        <span
          className="caption-style text-soft tabular-nums"
          aria-live="polite"
        >
          {activeSegment
            ? `${activeSegment.label}: $${formatMoney(activeSegment.value)} · ${activeSegment.percent.toFixed(1)}%`
            : `Total $${formatMoney(sheet.assets.totalAssets.totalValue)}`}
        </span>
      </figcaption>
      <div
        className="flex h-4 w-full gap-0.5"
        role="img"
        aria-label={segments
          .map((segment) => `${segment.label} ${segment.percent.toFixed(0)}%`)
          .join(", ")}
      >
        {segments.map((segment) => (
          <span
            key={segment.key}
            onMouseEnter={() => setActive(segment.key)}
            onMouseLeave={() => setActive(null)}
            style={{ width: `${segment.percent}%` }}
            className={cn(
              "h-full min-w-[3px] transition-opacity duration-150 first:rounded-l-[4px] last:rounded-r-[4px]",
              segment.color,
              active && active !== segment.key && "opacity-40",
            )}
          />
        ))}
      </div>
      <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {segments.map((segment) => (
          <li
            key={segment.key}
            onMouseEnter={() => setActive(segment.key)}
            onMouseLeave={() => setActive(null)}
            className="caption-style flex items-center gap-2"
          >
            <span
              aria-hidden
              className={cn("size-2.5 shrink-0 rounded-[3px]", segment.color)}
            />
            <span className="text-foreground min-w-0 flex-1 truncate">
              {segment.label}
            </span>
            <span className="text-soft tabular-nums">
              {formatCompactMoney(segment.value)}
            </span>
            <span className="text-subtle w-[5ch] text-right tabular-nums">
              {segment.percent.toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

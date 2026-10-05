import { ASSET_CATEGORIES, LIABILITY_CATEGORIES } from "@/data/financials";
import type {
  BalanceSheet,
  BalanceSheetEntity,
  BalanceSheetEntityValues,
} from "@/lib/balance-sheet";
import { formatDate, formatMoney, TODAY, daysBetween } from "@/lib/households";
import { cn } from "@/lib/utils";

type BalanceSheetTableProps = {
  sheet: BalanceSheet;
};

type ValueKey = keyof BalanceSheetEntityValues;

function money(value: number, negative = false) {
  if (value === 0) return "–";
  const formatted = `$${formatMoney(Math.abs(value))}`;
  return negative || value < 0 ? `(${formatted})` : formatted;
}

export default function BalanceSheetTable({ sheet }: BalanceSheetTableProps) {
  const columns: { key: ValueKey; label: string }[] = sheet.hasSpouse
    ? [
        { key: "clientValue", label: sheet.clientName },
        { key: "spouseValue", label: sheet.spouseName ?? "Spouse" },
        { key: "jointValue", label: "Joint" },
        { key: "totalValue", label: "Total" },
      ]
    : [
        { key: "clientValue", label: sheet.clientName },
        { key: "totalValue", label: "Total" },
      ];

  const assetGroups = ASSET_CATEGORIES.map((category) => ({
    ...category,
    lines: sheet.assets[category.key],
  })).filter((group) => group.lines.length > 0);

  const liabilityGroups = LIABILITY_CATEGORIES.map((category) => ({
    ...category,
    lines: sheet.liabilities[category.key],
  })).filter((group) => group.lines.length > 0);

  function subtotal(lines: BalanceSheetEntity[]): BalanceSheetEntityValues {
    return lines.reduce(
      (total, line) => ({
        clientValue: total.clientValue + line.clientValue,
        spouseValue: total.spouseValue + line.spouseValue,
        jointValue: total.jointValue + line.jointValue,
        totalValue: total.totalValue + line.totalValue,
      }),
      { clientValue: 0, spouseValue: 0, jointValue: 0, totalValue: 0 },
    );
  }

  function valueCells(
    row: BalanceSheetEntityValues,
    negative = false,
    strong = false,
  ) {
    return columns.map((column) => (
      <td
        key={column.key}
        className={cn(
          "px-3 py-2 text-right whitespace-nowrap tabular-nums",
          column.key === "totalValue" && "text-foreground",
          column.key !== "totalValue" && "text-soft",
          strong && "text-foreground font-medium",
        )}
      >
        {money(row[column.key], negative)}
      </td>
    ));
  }

  function lineRow(line: BalanceSheetEntity, negative: boolean) {
    const stale = daysBetween(line.valueAsOf, TODAY) > 365;
    return (
      <tr key={line.id} className="border-line-strong border-t">
        <th scope="row" className="py-2 pr-3 pl-6 text-left font-normal">
          <span className="flex flex-col gap-0.5">
            <span className="flex items-center gap-2">
              {line.description}
              {line.managed && (
                <span className="caption-style text-success">Managed</span>
              )}
            </span>
            <span className="caption-style text-subtle">
              {line.detail} · as of{" "}
              <span className={cn(stale && "text-warning")}>
                {formatDate(line.valueAsOf)}
              </span>
            </span>
          </span>
        </th>
        {valueCells(line, negative)}
      </tr>
    );
  }

  function groupRows(
    label: string,
    lines: BalanceSheetEntity[],
    negative: boolean,
  ) {
    return [
      <tr key={`${label}-head`} className="border-line-strong border-t">
        <th
          scope="rowgroup"
          colSpan={columns.length + 1}
          className="eyebrow-style text-soft px-3 pt-4 pb-1 text-left font-normal"
        >
          {label}
        </th>
      </tr>,
      ...lines.map((line) => lineRow(line, negative)),
      <tr key={`${label}-subtotal`} className="border-line-strong border-t">
        <th
          scope="row"
          className="text-soft py-2 pr-3 pl-6 text-left font-normal"
        >
          Total {label.toLowerCase()}
        </th>
        {valueCells(subtotal(lines), negative)}
      </tr>,
    ];
  }

  return (
    <div className="border-line-strong overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[640px] border-collapse">
        <caption className="sr-only">
          In-estate balance sheet by owner: assets, liabilities and net worth
        </caption>
        <thead>
          <tr className="caption-style text-subtle">
            <th scope="col" className="px-3 py-2.5 text-left font-normal">
              Description
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-3 py-2.5 text-right font-normal"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-line-strong border-t bg-white/2">
            <th
              scope="rowgroup"
              colSpan={columns.length + 1}
              className="px-3 py-2.5 text-left font-medium"
            >
              Assets
            </th>
          </tr>
          {assetGroups.flatMap((group) =>
            groupRows(group.label, group.lines, false),
          )}
          <tr className="border-line-strong border-t bg-white/2">
            <th scope="row" className="px-3 py-2.5 text-left font-medium">
              Total assets
            </th>
            {valueCells(sheet.assets.totalAssets, false, true)}
          </tr>

          <tr className="border-line-strong border-t bg-white/2">
            <th
              scope="rowgroup"
              colSpan={columns.length + 1}
              className="px-3 py-2.5 text-left font-medium"
            >
              Liabilities
            </th>
          </tr>
          {liabilityGroups.length > 0 ? (
            liabilityGroups.flatMap((group) =>
              groupRows(group.label, group.lines, true),
            )
          ) : (
            <tr className="border-line-strong border-t">
              <td
                colSpan={columns.length + 1}
                className="caption-style text-subtle px-6 py-3"
              >
                No liabilities on record.
              </td>
            </tr>
          )}
          <tr className="border-line-strong border-t bg-white/2">
            <th scope="row" className="px-3 py-2.5 text-left font-medium">
              Total liabilities
            </th>
            {valueCells(sheet.liabilities.totalLiabilities, true, true)}
          </tr>

          <tr className="border-foreground/30 border-t-2 bg-white/4">
            <th scope="row" className="px-3 py-3 text-left font-semibold">
              Net worth
            </th>
            {valueCells(sheet.netWorth, false, true)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

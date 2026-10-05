import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DataColumn<T> = {
  key: string;
  label: string;
  align?: "left" | "right";
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  caption: string;
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty: string;
  footer?: ReactNode;
};

export default function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  empty,
  footer,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="caption-style text-subtle">{empty}</p>;
  }

  return (
    <div className="border-line-strong overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[560px] border-collapse">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="caption-style text-subtle">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "px-3 py-2.5 font-normal whitespace-nowrap",
                  column.align === "right" ? "text-right" : "text-left",
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-line-strong border-t">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-3 py-2.5 align-top",
                    column.align === "right" && "text-right tabular-nums",
                  )}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>
  );
}

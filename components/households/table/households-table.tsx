"use client";

import { useMemo, type CSSProperties } from "react";
import { Checkbox } from "@/components/_ui/checkbox";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/_ui/table";
import HouseholdRow from "./household-row";
import TableFooter from "./table-footer";
import {
  TABLE_CELL_CLASS,
  TABLE_GRID_CLASS,
  TABLE_ROW_CLASS,
  columnsFor,
} from "./table-columns";
import { filterHouseholds } from "@/lib/households";
import { cn } from "@/lib/utils";
import { useHouseholdsStore } from "@/stores/households-store";

export default function HouseholdsTable() {
  const households = useHouseholdsStore((state) => state.households);
  const activeTab = useHouseholdsStore((state) => state.activeTab);
  const sortBy = useHouseholdsStore((state) => state.sortBy);
  const advisor = useHouseholdsStore((state) => state.advisor);
  const segment = useHouseholdsStore((state) => state.segment);
  const followUp = useHouseholdsStore((state) => state.followUp);
  const selectedIds = useHouseholdsStore((state) => state.selectedIds);
  const detailId = useHouseholdsStore((state) => state.detailId);
  const detailOpen = useHouseholdsStore((state) => state.detailOpen);
  const toggleSelected = useHouseholdsStore((state) => state.toggleSelected);
  const setSelected = useHouseholdsStore((state) => state.setSelected);
  const openDetail = useHouseholdsStore((state) => state.openDetail);
  const openProfile = useHouseholdsStore((state) => state.openProfile);

  const visible = useMemo(
    () =>
      filterHouseholds(
        households,
        { sortBy, advisor, segment, followUp },
        activeTab,
      ),
    [households, sortBy, advisor, segment, followUp, activeTab],
  );
  const columns = columnsFor(activeTab);

  const selectedVisible = visible.filter((household) =>
    selectedIds.includes(household.id),
  );
  const allSelected =
    visible.length > 0 && selectedVisible.length === visible.length;
  const someSelected = selectedVisible.length > 0 && !allSelected;

  function toggleAll() {
    setSelected(allSelected ? [] : visible.map((household) => household.id));
  }

  return (
    <div className="border-border flex min-h-0 flex-1 flex-col border-t">
      <ScrollArea orientation="both" className="min-h-0 flex-1">
        <Table
          role="table"
          className={cn(TABLE_GRID_CLASS, "w-full")}
          style={{ "--table-columns": columns.length } as CSSProperties}
        >
          <TableHeader role="rowgroup" className="contents">
            <TableRow role="row" className={TABLE_ROW_CLASS}>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  role="columnheader"
                  className={cn(TABLE_CELL_CLASS, column.className)}
                >
                  {column.key === "name" ? (
                    <span className="flex items-center gap-5">
                      <Checkbox
                        checked={
                          allSelected
                            ? true
                            : someSelected
                              ? "indeterminate"
                              : false
                        }
                        onCheckedChange={toggleAll}
                        aria-label="Select all households"
                      />
                      {column.label}
                    </span>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody role="rowgroup" className="contents">
            {visible.map((household) => (
              <HouseholdRow
                key={household.id}
                household={household}
                columns={columns.map((column) => column.key)}
                selected={selectedIds.includes(household.id)}
                active={detailOpen && detailId === household.id}
                onToggle={() => toggleSelected(household.id)}
                onOpen={() => openDetail(household.id)}
                onOpenAdvisor={() => openProfile(household.advisor)}
              />
            ))}
            {visible.length === 0 && (
              <TableRow role="row" className={TABLE_ROW_CLASS}>
                <td
                  role="cell"
                  className="caption-style text-muted-foreground col-span-full flex h-[120px] items-center justify-center"
                >
                  No households match the current filters.
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <TableFooter households={visible} tab={activeTab} />
    </div>
  );
}

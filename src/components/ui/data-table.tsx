"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconSelector,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  /** Cell renderer. Return a string/number for the default typography. */
  cell: (row: T) => React.ReactNode;
  /** Enables sorting on the column and supplies the comparable value. */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  width?: string;
  /** Hidden below `lg` — use for secondary columns so mobile stays readable. */
  secondary?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: React.ReactNode;
  pageSize?: number;
  className?: string;
  /** Renders a checkbox column and lifts the selected keys. */
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  caption?: string;
  dense?: boolean;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  empty,
  pageSize = 12,
  className,
  selectable,
  selected = [],
  onSelectedChange,
  caption,
  dense,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(
    null,
  );
  const [page, setPage] = React.useState(1);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((item) => item.key === sort.key);
    if (!column?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const left = column.sortValue!(a);
      const right = column.sortValue!(b);
      const result =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));
      return sort.dir === "asc" ? result : -result;
    });
  }, [rows, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  React.useEffect(() => {
    setPage(1);
  }, [rows.length]);

  const allVisibleSelected =
    visible.length > 0 && visible.every((row) => selected.includes(rowKey(row)));

  const toggleAll = () => {
    if (!onSelectedChange) return;
    const visibleKeys = visible.map(rowKey);
    onSelectedChange(
      allVisibleSelected
        ? selected.filter((key) => !visibleKeys.includes(key))
        : Array.from(new Set([...selected, ...visibleKeys])),
    );
  };

  if (rows.length === 0) {
    return (
      <>{empty ?? <EmptyState title="Nothing to show" description="No rows match the current filters." />}</>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-surface", className)}>
      <div className="nx-scrollbar overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-border bg-surface-2/60">
              {selectable ? (
                <th scope="col" className="w-10 px-3 py-2.5">
                  <input
                    type="checkbox"
                    aria-label="Select all rows on this page"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    className="size-4 cursor-pointer rounded-sm border border-border-strong bg-surface-2 accent-[rgb(var(--nx-accent))]"
                  />
                </th>
              ) : null}
              {columns.map((column) => {
                const sortable = Boolean(column.sortValue);
                const active = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    className={cn(
                      "px-3 py-2.5 text-2xs font-semibold uppercase tracking-wide text-fg-subtle",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                      !column.align && "text-left",
                      column.secondary && "hidden lg:table-cell",
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSort(
                            active && sort?.dir === "asc"
                              ? { key: column.key, dir: "desc" }
                              : { key: column.key, dir: "asc" },
                          )
                        }
                        className={cn(
                          "inline-flex items-center gap-1 transition-colors hover:text-fg",
                          active && "text-fg",
                          column.align === "right" && "flex-row-reverse",
                        )}
                      >
                        {column.header}
                        {active ? (
                          sort?.dir === "asc" ? (
                            <IconSortAscending className="size-3.5" />
                          ) : (
                            <IconSortDescending className="size-3.5" />
                          )
                        ) : (
                          <IconSelector className="size-3.5 opacity-50" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((row) => {
              const key = rowKey(row);
              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-surface-2",
                    selected.includes(key) && "bg-accent/[0.06]",
                  )}
                >
                  {selectable ? (
                    <td className="px-3 py-2.5" onClick={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label="Select row"
                        checked={selected.includes(key)}
                        onChange={() =>
                          onSelectedChange?.(
                            selected.includes(key)
                              ? selected.filter((item) => item !== key)
                              : [...selected, key],
                          )
                        }
                        className="size-4 cursor-pointer rounded-sm border border-border-strong bg-surface-2 accent-[rgb(var(--nx-accent))]"
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-3 align-middle text-fg-muted",
                        dense ? "py-2" : "py-3",
                        column.align === "right" && "text-right",
                        column.align === "center" && "text-center",
                        column.secondary && "hidden lg:table-cell",
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
          <p className="text-xs text-fg-subtle nx-tnum">
            {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <IconChevronLeft />
            </Button>
            <span className="px-2 text-xs text-fg-muted nx-tnum">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              <IconChevronRight />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

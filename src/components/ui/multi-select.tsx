"use client";

import { IconCheck, IconChevronDown, IconSearch, IconX } from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export interface Option {
  value: string;
  label: string;
  description?: string;
  group?: string;
}

export interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  id?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  /** Caps how many chips render before collapsing into "+N more". */
  maxVisibleChips?: number;
  /** Shown when nothing is selected and selection means "everything". */
  allLabel?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search",
  emptyLabel = "No matches",
  id,
  invalid,
  disabled,
  className,
  maxVisibleChips = 4,
  allLabel,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) ||
        option.description?.toLowerCase().includes(needle),
    );
  }, [options, query]);

  const grouped = React.useMemo(() => {
    const groups = new Map<string, Option[]>();
    for (const option of filtered) {
      const key = option.group ?? "";
      const list = groups.get(key) ?? [];
      list.push(option);
      groups.set(key, list);
    }
    return [...groups.entries()];
  }, [filtered]);

  const toggle = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    );
  };

  const selectedOptions = value
    .map((item) => options.find((option) => option.value === item))
    .filter(Boolean) as Option[];

  const visibleChips = selectedOptions.slice(0, maxVisibleChips);
  const overflow = selectedOptions.length - visibleChips.length;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        // Same reasoning as DatePicker: this is a combobox that owns a
        // listbox popup, which is the role that supports aria-invalid.
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex min-h-10 w-full items-center justify-between gap-2 rounded border bg-surface-2 px-2.5 py-1.5 text-left text-sm transition-colors",
          invalid ? "border-danger" : "border-border",
          disabled ? "cursor-not-allowed opacity-50" : "hover:border-border-strong",
        )}
      >
        <span className="flex min-w-0 flex-wrap items-center gap-1">
          {selectedOptions.length === 0 ? (
            <span className="px-0.5 text-fg-subtle">
              {allLabel ?? placeholder}
            </span>
          ) : (
            <>
              {visibleChips.map((option) => (
                <Badge key={option.value} tone="neutral" size="sm">
                  {option.label}
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label={`Remove ${option.label}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggle(option.value);
                    }}
                    className="-mr-1 cursor-pointer rounded-full p-0.5 hover:text-fg"
                  >
                    <IconX className="size-3" />
                  </span>
                </Badge>
              ))}
              {overflow > 0 ? (
                <Badge tone="outline" size="sm">
                  +{overflow} more
                </Badge>
              ) : null}
            </>
          )}
        </span>
        <IconChevronDown className="size-4 shrink-0 text-fg-subtle" />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-40 mt-2 rounded-lg border border-border bg-surface-2 shadow-lg animate-scale-in">
          <div className="border-b border-border p-2">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-full rounded border border-border bg-surface pl-8 pr-2 text-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable
            className="nx-scrollbar max-h-64 overflow-y-auto p-1"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-fg-subtle">
                {emptyLabel}
              </li>
            ) : (
              grouped.map(([group, groupOptions]) => (
                <li key={group || "default"}>
                  {group ? (
                    <p className="px-2.5 pb-1 pt-2.5 text-2xs font-semibold uppercase tracking-wide text-fg-subtle">
                      {group}
                    </p>
                  ) : null}
                  <ul>
                    {groupOptions.map((option) => {
                      const checked = value.includes(option.value);
                      return (
                        <li key={option.value}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={checked}
                            onClick={() => toggle(option.value)}
                            className={cn(
                              "flex w-full items-start gap-2.5 rounded px-2.5 py-2 text-left transition-colors hover:bg-surface-3",
                              checked && "bg-accent/[0.08]",
                            )}
                          >
                            <span
                              className={cn(
                                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                                checked
                                  ? "border-accent bg-accent text-accent-fg"
                                  : "border-border-strong",
                              )}
                            >
                              {checked ? <IconCheck className="size-3" /> : null}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm text-fg">{option.label}</span>
                              {option.description ? (
                                <span className="mt-0.5 block text-xs text-fg-subtle">
                                  {option.description}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))
            )}
          </ul>

          <div className="flex items-center justify-between gap-2 border-t border-border px-2.5 py-2">
            <span className="text-2xs text-fg-subtle nx-tnum">
              {value.length} selected
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-2xs font-medium text-fg-muted hover:text-fg"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => onChange(filtered.map((option) => option.value))}
                className="text-2xs font-medium text-accent hover:underline"
              >
                Select all shown
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

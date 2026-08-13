"use client";

import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isValid,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface DatePickerProps {
  /** ISO date string (yyyy-MM-dd) or empty. */
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Adds a time field and emits a full ISO datetime instead. */
  withTime?: boolean;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = "Select a date",
  invalid,
  disabled,
  id,
  className,
  withTime,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selected = React.useMemo(() => {
    if (!value) return null;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }, [value]);

  const [cursor, setCursor] = React.useState(() => selected ?? new Date(2026, 7, 1));

  React.useEffect(() => {
    if (selected) setCursor(selected);
  }, [selected]);

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

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const minDate = min ? parseISO(min) : null;
  const maxDate = max ? parseISO(max) : null;

  const timeValue = withTime && value.includes("T") ? value.slice(11, 16) : "09:00";

  const commit = (date: Date, time = timeValue) => {
    const datePart = format(date, "yyyy-MM-dd");
    onChange(withTime ? `${datePart}T${time}` : datePart);
    if (!withTime) setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded border bg-surface-2 px-3 text-left text-sm transition-colors",
          invalid ? "border-danger" : "border-border",
          disabled ? "cursor-not-allowed opacity-50" : "hover:border-border-strong",
          selected ? "text-fg" : "text-fg-subtle",
        )}
      >
        <span className="truncate">
          {selected
            ? format(selected, withTime ? "d MMM yyyy, HH:mm" : "d MMM yyyy")
            : placeholder}
        </span>
        <IconCalendar className="size-4 shrink-0 text-fg-subtle" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Choose a date"
          className="absolute left-0 z-40 mt-2 w-[19rem] rounded-lg border border-border bg-surface-2 p-3 shadow-lg animate-scale-in"
        >
          <div className="mb-2 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Previous month"
              onClick={() => setCursor(subMonths(cursor, 1))}
            >
              <IconChevronLeft />
            </Button>
            <p className="text-sm font-semibold text-fg">
              {format(cursor, "MMMM yyyy")}
            </p>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Next month"
              onClick={() => setCursor(addMonths(cursor, 1))}
            >
              <IconChevronRight />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-1 text-center text-2xs font-medium uppercase text-fg-subtle"
              >
                {day}
              </div>
            ))}
            {days.map((day) => {
              const outside = !isSameMonth(day, cursor);
              const isSelected = selected ? isSameDay(day, selected) : false;
              const outOfRange =
                (minDate && day < minDate) || (maxDate && day > maxDate);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={Boolean(outOfRange)}
                  onClick={() => commit(day)}
                  aria-pressed={isSelected}
                  className={cn(
                    "h-8 rounded text-xs transition-colors nx-tnum",
                    isSelected
                      ? "bg-accent font-semibold text-accent-fg"
                      : outside
                        ? "text-fg-subtle/50 hover:bg-surface-3"
                        : "text-fg hover:bg-surface-3",
                    outOfRange && "cursor-not-allowed opacity-30 hover:bg-transparent",
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {withTime ? (
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <label
                htmlFor={`${id ?? "date"}-time`}
                className="text-xs font-medium text-fg-muted"
              >
                Time
              </label>
              <input
                id={`${id ?? "date"}-time`}
                type="time"
                value={timeValue}
                onChange={(event) =>
                  commit(selected ?? cursor, event.target.value)
                }
                className="h-8 flex-1 rounded border border-border bg-surface px-2 text-sm text-fg"
              />
              <Button size="sm" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

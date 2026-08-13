"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/40 text-center",
        compact ? "px-5 py-8" : "px-6 py-14",
        className,
      )}
    >
      {icon ? (
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-surface-3 text-fg-subtle [&_svg]:size-5">
          {icon}
        </span>
      ) : null}
      <p className="font-display text-base font-semibold text-fg">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-fg-muted">
          {description}
        </p>
      ) : null}
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {action ? (
            <Button variant="primary" href={action.href} onClick={action.onClick}>
              {action.label}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button
              variant="ghost"
              href={secondaryAction.href}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Skeletons -------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("nx-skeleton rounded", className)} />;
}

export function VideoCardSkeleton({ wide = true }: { wide?: boolean }) {
  return (
    <div className="space-y-2.5">
      <Skeleton className={cn("w-full rounded-lg", wide ? "aspect-video" : "aspect-[2/3]")} />
      <Skeleton className="h-4 w-[85%]" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function RailSkeleton({
  count = 6,
  wide = true,
}: {
  count?: number;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        wide
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6"
          : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8",
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <VideoCardSkeleton key={index} wide={wide} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-4 py-3.5">
          {Array.from({ length: cols }, (_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn("h-4", colIndex === 0 ? "flex-[2]" : "flex-1")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

"use client";

import * as React from "react";
import { cn, clamp } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  tone?: "accent" | "success" | "warning" | "danger" | "info";
  size?: "xs" | "sm" | "md";
  label?: React.ReactNode;
  valueLabel?: React.ReactNode;
  /** Diagonal stripes for indeterminate/processing work. */
  striped?: boolean;
}

const TONES = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

const HEIGHTS = { xs: "h-1", sm: "h-1.5", md: "h-2.5" };

export function ProgressBar({
  value,
  max = 100,
  className,
  tone = "accent",
  size = "md",
  label,
  valueLabel,
  striped,
}: ProgressBarProps) {
  const percent = clamp((value / (max || 1)) * 100, 0, 100);
  return (
    <div className={cn("w-full", className)}>
      {(label || valueLabel) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
          <span className="font-medium text-fg">{label}</span>
          <span className="text-fg-subtle nx-tnum">{valueLabel}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={typeof label === "string" ? label : "Progress"}
        className={cn(
          "w-full overflow-hidden rounded-full bg-surface-3",
          HEIGHTS[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300 ease-out",
            TONES[tone],
            striped &&
              "bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.18)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.18)_75%,transparent_75%,transparent)]",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/** Compact radial used in stat tiles and completion-rate cells. */
export function RadialProgress({
  value,
  size = 44,
  strokeWidth = 4,
  tone = "accent",
  children,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: keyof typeof TONES;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamp(value, 0, 100) / 100);
  const strokeColor = {
    accent: "rgb(var(--nx-accent))",
    success: "rgb(var(--nx-success))",
    warning: "rgb(var(--nx-warning))",
    danger: "rgb(var(--nx-danger))",
    info: "rgb(var(--nx-info))",
  }[tone];

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="rgb(var(--nx-surface-3))"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-2xs font-semibold nx-tnum">{children}</span>
    </span>
  );
}

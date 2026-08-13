"use client";

import { IconCheck } from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
}

export interface StepperProps {
  steps: Step[];
  current: number;
  onStepClick?: (index: number) => void;
  /** Steps past this index are not reachable yet. */
  furthestReached?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Stepper({
  steps,
  current,
  onStepClick,
  furthestReached,
  orientation = "horizontal",
  className,
}: StepperProps) {
  const maxReachable = furthestReached ?? current;

  if (orientation === "vertical") {
    return (
      <ol className={cn("space-y-1", className)}>
        {steps.map((step, index) => {
          const state =
            index < current ? "done" : index === current ? "current" : "upcoming";
          const reachable = index <= maxReachable;
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!reachable || !onStepClick}
                onClick={() => onStepClick?.(index)}
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 rounded px-2.5 py-2 text-left transition-colors",
                  reachable && onStepClick && "hover:bg-surface-2",
                  !reachable && "cursor-not-allowed opacity-50",
                  state === "current" && "bg-surface-2",
                )}
              >
                <Marker index={index} state={state} />
                <span className="min-w-0 pt-0.5">
                  <span
                    className={cn(
                      "block text-sm font-medium",
                      state === "upcoming" ? "text-fg-subtle" : "text-fg",
                    )}
                  >
                    {step.title}
                    {step.optional ? (
                      <span className="ml-1.5 text-2xs font-normal text-fg-subtle">
                        Optional
                      </span>
                    ) : null}
                  </span>
                  {step.description ? (
                    <span className="mt-0.5 block text-xs leading-snug text-fg-subtle">
                      {step.description}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol
      className={cn(
        "nx-rail auto-cols-fr items-start gap-0",
        className,
      )}
    >
      {steps.map((step, index) => {
        const state =
          index < current ? "done" : index === current ? "current" : "upcoming";
        const reachable = index <= maxReachable;
        return (
          <li key={step.id} className="relative flex min-w-[7.5rem] flex-col">
            {index > 0 ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[calc(-50%+1rem)] right-[calc(50%+1rem)] top-3.5 h-px",
                  index <= current ? "bg-accent" : "bg-border",
                )}
              />
            ) : null}
            <button
              type="button"
              disabled={!reachable || !onStepClick}
              onClick={() => onStepClick?.(index)}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "flex flex-col items-center gap-2 px-2 text-center",
                !reachable && "cursor-not-allowed opacity-50",
              )}
            >
              <Marker index={index} state={state} />
              <span
                className={cn(
                  "text-xs font-medium leading-tight",
                  state === "upcoming" ? "text-fg-subtle" : "text-fg",
                )}
              >
                {step.title}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function Marker({
  index,
  state,
}: {
  index: number;
  state: "done" | "current" | "upcoming";
}) {
  return (
    <span
      className={cn(
        "relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
        state === "done" && "border-accent bg-accent text-accent-fg",
        state === "current" &&
          "border-accent bg-bg text-accent ring-4 ring-accent/15",
        state === "upcoming" && "border-border bg-surface-2 text-fg-subtle",
      )}
    >
      {state === "done" ? <IconCheck className="size-3.5" /> : index + 1}
    </span>
  );
}

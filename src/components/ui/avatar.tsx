"use client";

import { IconCircleCheckFilled } from "@tabler/icons-react";
import * as React from "react";
import { cn, initials } from "@/lib/utils";

const SIZES = {
  xs: "size-6 text-2xs",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
  "2xl": "size-28 text-3xl",
} as const;

export interface AvatarProps {
  name: string;
  gradient?: [string, string];
  size?: keyof typeof SIZES;
  verified?: boolean;
  square?: boolean;
  className?: string;
}

/**
 * No remote avatar images exist in this build, so identity is carried by a
 * deterministic gradient + initials. Same input always renders the same chip.
 */
export function Avatar({
  name,
  gradient = ["#33373F", "#0D0E11"],
  size = "md",
  verified,
  square,
  className,
}: AvatarProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center font-semibold text-white/95 ring-1 ring-inset ring-white/10",
          SIZES[size],
          square ? "rounded" : "rounded-full",
        )}
        style={{
          backgroundImage: `linear-gradient(140deg, ${gradient[0]}, ${gradient[1]})`,
        }}
      >
        {initials(name)}
      </span>
      <span className="sr-only">{name}</span>
      {verified ? (
        <IconCircleCheckFilled
          aria-label="Verified"
          className={cn(
            "absolute -bottom-0.5 -right-0.5 text-info drop-shadow",
            size === "xs" || size === "sm" ? "size-3" : "size-4",
          )}
        />
      ) : null}
    </span>
  );
}

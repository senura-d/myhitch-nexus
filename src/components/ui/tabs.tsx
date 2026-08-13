"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  count?: number;
  icon?: React.ReactNode;
}

/** Controlled tab bar for in-page switching. */
export function Tabs({
  items,
  value,
  onChange,
  className,
  variant = "underline",
}: {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: "underline" | "pill";
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "nx-rail items-center gap-1",
        variant === "underline" && "border-b border-border",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors [&_svg]:size-4",
              variant === "underline"
                ? cn(
                    "px-3 pb-2.5 pt-2",
                    active
                      ? "text-fg after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-accent"
                      : "text-fg-muted hover:text-fg",
                  )
                : cn(
                    "h-8 rounded-full px-3.5",
                    active
                      ? "bg-accent text-accent-fg"
                      : "bg-surface-2 text-fg-muted hover:bg-surface-3 hover:text-fg",
                  ),
            )}
          >
            {item.icon}
            {item.label}
            {item.count != null ? (
              <span
                className={cn(
                  "rounded-full px-1.5 text-2xs nx-tnum",
                  active && variant === "pill"
                    ? "bg-accent-fg/15 text-accent-fg"
                    : "bg-surface-3 text-fg-subtle",
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/** Route-driven variant used for the studio/admin/account section navs. */
export function NavTabs({
  items,
  className,
}: {
  items: Array<{ href: string; label: React.ReactNode; icon?: React.ReactNode; count?: number }>;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div className={cn("nx-rail items-center gap-1 border-b border-border", className)}>
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex items-center gap-2 whitespace-nowrap px-3 pb-2.5 pt-2 text-sm font-medium transition-colors [&_svg]:size-4",
              active
                ? "text-fg after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-accent"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {item.icon}
            {item.label}
            {item.count != null && item.count > 0 ? (
              <span className="rounded-full bg-accent px-1.5 text-2xs font-semibold text-accent-fg nx-tnum">
                {item.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

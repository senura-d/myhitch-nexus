import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { NexusMark } from "./logo";

/**
 * Shared layout for whole-page states — offline, crashed, not found.
 *
 * These are the screens people see on their worst day with the product, so
 * they get the same care as the rest: an explanation of what happened, what
 * we already tried, and a way forward that is not just "reload".
 */
export function StatusScreen({
  icon,
  title,
  description,
  detail,
  actions,
  tone = "neutral",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  /** Technical detail — collapsed by default, never shouted at the viewer. */
  detail?: string;
  actions?: React.ReactNode;
  tone?: "neutral" | "danger" | "warning";
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="flex h-header shrink-0 items-center px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="MYHitch Nexus Home">
          <NexusMark className="h-10 w-auto" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-lg text-center">
          <span
            className={cn(
              "inline-flex size-14 items-center justify-center rounded-full [&_svg]:size-7",
              tone === "danger"
                ? "bg-danger/15 text-danger"
                : tone === "warning"
                  ? "bg-warning/15 text-warning"
                  : "bg-accent-soft text-accent",
            )}
          >
            {icon}
          </span>

          <h1 className="mt-5 font-display text-2xl font-semibold text-fg sm:text-3xl">
            {title}
          </h1>

          <div className="mt-2.5 text-sm leading-relaxed text-fg-muted">
            {description}
          </div>

          {actions ? (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {actions}
            </div>
          ) : null}

          {children}

          {detail ? (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-xs text-fg-subtle transition-colors hover:text-fg-muted">
                Technical detail
              </summary>
              <pre className="nx-scrollbar mt-2 max-h-40 overflow-auto rounded border border-border bg-surface-2 p-3 text-left font-mono text-2xs leading-relaxed text-fg-muted">
                {detail}
              </pre>
            </details>
          ) : null}
        </div>
      </main>
    </div>
  );
}

/** Quick links shown under the error/offline states. */
export function StatusLinks({
  links,
}: {
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <nav aria-label="Suggested pages" className="mt-8 border-t border-border pt-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
        Try one of these
      </p>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-accent transition-colors hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

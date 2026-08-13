import { cn } from "@/lib/utils";

/**
 * The Nexus mark: a play triangle formed from three connected nodes — the
 * "centralised ecosystem" idea, drawn rather than written.
 */
export function NexusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="MYHitch Nexus"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="nx-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--nx-accent))" />
          <stop offset="100%" stopColor="rgb(var(--nx-accent-press))" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#nx-mark)" />
      <path
        d="M11.5 9.2 22.4 16 11.5 22.8z"
        fill="rgb(var(--nx-accent-fg))"
        opacity="0.92"
      />
      <g fill="none" stroke="rgb(var(--nx-accent-fg))" strokeWidth="1.1" opacity="0.55">
        <circle cx="11.5" cy="9.2" r="2.3" fill="rgb(var(--nx-accent))" />
        <circle cx="11.5" cy="22.8" r="2.3" fill="rgb(var(--nx-accent))" />
        <circle cx="22.4" cy="16" r="2.3" fill="rgb(var(--nx-accent))" />
      </g>
    </svg>
  );
}

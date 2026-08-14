import { cn } from "@/lib/utils";
import { NexusMark } from "./logo";

/**
 * The loading mark: the brand logo centred in a spinning ring, over an
 * indeterminate sweep bar.
 *
 * Pure CSS so it works before hydration — the boot splash renders in the
 * server HTML and animates while the bundle is still downloading.
 */
export function NexusLoader({
  size = "md",
  label = "Loading",
  showBar = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
  showBar?: boolean;
  className?: string;
}) {
  const dimension = { sm: 40, md: 64, lg: 88 }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center gap-4", className)}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: dimension, height: dimension }}
      >
        {/* Sweeping ring */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-accent/15 border-t-accent motion-safe:animate-ring-spin"
        />

        <NexusMark
          className={cn(
            size === "sm" && "h-5",
            size === "md" && "h-8",
            size === "lg" && "h-11",
            "w-auto drop-shadow-[0_0_20px_rgba(56,189,248,0.25)]",
          )}
        />
      </div>

      {showBar ? (
        <span
          aria-hidden
          className="relative block h-0.5 w-28 overflow-hidden rounded-full bg-surface-3"
        >
          <span className="absolute inset-y-0 left-0 w-full rounded-full bg-accent motion-safe:animate-bar-sweep" />
        </span>
      ) : null}

      <span className="sr-only">{label}</span>
    </div>
  );
}

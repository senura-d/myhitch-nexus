import { cn } from "@/lib/utils";
import { NexusMark } from "./logo";

/**
 * The loading mark: the brand logo breathing gently, over an indeterminate
 * sweep bar. No ring or spinner — just the mark, on the page's own light
 * background.
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
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center gap-4", className)}
    >
      <NexusMark
        className={cn(
          size === "sm" && "h-5",
          size === "md" && "h-8",
          size === "lg" && "h-11",
          "w-auto motion-safe:animate-node-pulse",
        )}
      />

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

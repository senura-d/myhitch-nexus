import { cn } from "@/lib/utils";
import { NexusMark } from "./logo";

/**
 * The loading mark: the three nodes from the Nexus logo lighting in sequence
 * around the play triangle, over an indeterminate sweep bar.
 *
 * Pure CSS so it works before hydration — the boot splash renders in the
 * server HTML and animates while the bundle is still downloading.
 */
export function NexusLoader({
  size = "md",
  label = "Loading",
  showBar = true,
  showLogo = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
  showBar?: boolean;
  showLogo?: boolean;
  className?: string;
}) {
  const dimension = { sm: 40, md: 64, lg: 88 }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center gap-4", className)}
    >
      {showLogo ? (
        <NexusMark
          className={cn(
            size === "sm" && "h-7",
            size === "md" && "h-10",
            size === "lg" && "h-14",
            "w-auto drop-shadow-[0_0_20px_rgba(56,189,248,0.25)]",
          )}
        />
      ) : null}
      <div className="relative" style={{ width: dimension, height: dimension }}>
        {/* Sweeping ring */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-accent/15 border-t-accent motion-safe:animate-ring-spin"
        />

        <svg
          viewBox="0 0 32 32"
          aria-hidden
          className="absolute inset-0 size-full p-[18%]"
        >
          <path
            d="M11.5 9.2 22.4 16 11.5 22.8z"
            fill="rgb(var(--nx-accent))"
            opacity="0.28"
          />
          {[
            { cx: 11.5, cy: 9.2, delay: "0ms" },
            { cx: 22.4, cy: 16, delay: "180ms" },
            { cx: 11.5, cy: 22.8, delay: "360ms" },
          ].map((node) => (
            <circle
              key={`${node.cx}-${node.cy}`}
              cx={node.cx}
              cy={node.cy}
              r="2.6"
              fill="rgb(var(--nx-accent))"
              className="origin-center motion-safe:animate-node-pulse"
              style={{
                animationDelay: node.delay,
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            />
          ))}
        </svg>
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

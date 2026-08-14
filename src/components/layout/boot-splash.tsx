"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { NexusLoader } from "./nexus-loader";

/**
 * First-load splash.
 *
 * Rendered in the server HTML so it is painted before the JS bundle arrives,
 * then faded out once React has mounted. It stays for a short floor
 * (MIN_VISIBLE_MS) so a fast load reads as a deliberate reveal rather than a
 * flicker, and is skipped entirely for viewers who prefer reduced motion.
 */
const MIN_VISIBLE_MS = 900;
const FADE_MS = 420;

export function BootSplash() {
  const [state, setState] = React.useState<"visible" | "fading" | "gone">(
    "visible",
  );

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 0 : MIN_VISIBLE_MS;

    const fadeTimer = window.setTimeout(() => setState("fading"), hold);
    const doneTimer = window.setTimeout(
      () => setState("gone"),
      hold + (reduced ? 0 : FADE_MS),
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  // Once gone it leaves the tree entirely — no stray overlay intercepting
  // clicks, no element for screen readers to wander into.
  if (state === "gone") return null;

  return (
    <div
      aria-hidden={state === "fading"}
      className={cn(
        "fixed inset-0 z-[80] flex flex-col items-center justify-center gap-8 bg-bg transition-opacity duration-[420ms] ease-out",
        state === "fading" && "pointer-events-none opacity-0",
      )}
    >
      {/* Faint radial wash so the mark sits in a pool of light rather than
          floating on flat black. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60rem 40rem at 50% 45%, rgb(var(--nx-accent) / 0.10), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        <NexusLoader size="lg" label="Loading MYHitch Nexus" />

        <div className="text-center">
          <p className="mt-1 text-xs text-fg-subtle">
            Preparing your catalogue…
          </p>
        </div>
      </div>
    </div>
  );
}

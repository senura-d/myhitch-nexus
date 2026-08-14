import { NexusLoader } from "@/components/layout/nexus-loader";

/**
 * Route-level loading UI, shown while a segment's code or data is in flight.
 * Same mark as the boot splash so navigation feels continuous with startup.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6">
      <NexusLoader size="md" showLogo label="Loading page" />
      <p className="text-sm text-fg-subtle">Loading…</p>
    </div>
  );
}

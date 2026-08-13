"use client";

import { IconBookmark } from "@tabler/icons-react";
import { EmptyState, RailSkeleton } from "@/components/ui/empty-state";
import { VideoGrid } from "@/components/video/rail";
import { useToggleWatchlist, useWatchlist } from "@/lib/mock-api/hooks";

export default function WatchlistPage() {
  const { data: watchlist = [], isLoading } = useWatchlist();
  const toggleWatchlist = useToggleWatchlist();

  if (isLoading) return <RailSkeleton count={8} />;

  if (watchlist.length === 0) {
    return (
      <EmptyState
        icon={<IconBookmark />}
        title="Your watchlist is empty"
        description="Save films, courses and live events to come back to them later. The bookmark icon appears on every card."
        action={{ label: "Browse the catalogue", href: "/explore" }}
        secondaryAction={{ label: "See what is live", href: "/live" }}
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-fg-muted nx-tnum">
        {watchlist.length} saved {watchlist.length === 1 ? "title" : "titles"}
      </p>
      <VideoGrid
        videos={watchlist}
        watchlist={watchlist.map((item) => item.id)}
        onToggleWatchlist={(id) => toggleWatchlist.mutate(id)}
      />
    </div>
  );
}

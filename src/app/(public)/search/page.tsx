"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BrowseView } from "@/components/discovery/browse-view";
import { RailSkeleton } from "@/components/ui/empty-state";

function SearchResults() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";

  return (
    <BrowseView
      title={query ? `Results for “${query}”` : "Search"}
      description="Search across titles, synopses, creators, businesses, cast and credits. Narrow with the filters on the left."
      initialQuery={query}
      showQueryField
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <RailSkeleton count={8} />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}

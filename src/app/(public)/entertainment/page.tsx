"use client";

import { BrowseView } from "@/components/discovery/browse-view";

export default function EntertainmentPage() {
  return (
    <BrowseView
      title="Entertainment"
      description="Series, seasons, music sessions and recorded performance."
      lockedContentTypes={["entertainment"]}
    />
  );
}

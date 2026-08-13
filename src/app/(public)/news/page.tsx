"use client";

import { BrowseView } from "@/components/discovery/browse-view";

export default function NewsPage() {
  return (
    <BrowseView
      title="News & documentary"
      description="Daily bulletins and long-form investigative journalism from verified newsrooms, with full transcripts and source material where publishers provide them."
      lockedContentTypes={["news", "documentary"]}
    />
  );
}

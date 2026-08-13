"use client";

import { BrowseView } from "@/components/discovery/browse-view";

export default function FilmsPage() {
  return (
    <BrowseView
      title="Films & cinema"
      description="Features, shorts and restorations from independent studios and distributors. Rent, buy, or watch what is included with Premium."
      lockedContentTypes={["film"]}
      layout="poster"
    />
  );
}

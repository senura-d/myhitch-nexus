"use client";

import { BrowseView } from "@/components/discovery/browse-view";

export default function CommercialPage() {
  return (
    <BrowseView
      title="Commercial & advertising"
      description="Brand films, launch content, product explainers and corporate media published directly by the businesses that made them. Sponsored content is labelled."
      lockedContentTypes={["commercial"]}
    />
  );
}

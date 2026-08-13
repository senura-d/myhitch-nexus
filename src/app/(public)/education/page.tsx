"use client";

import { BrowseView } from "@/components/discovery/browse-view";

export default function EducationPage() {
  return (
    <BrowseView
      title="Education"
      description="Accredited courses, open lectures, research seminars and workplace training from verified education providers."
      lockedContentTypes={["education"]}
    />
  );
}

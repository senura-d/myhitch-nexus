"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { BrowseView } from "@/components/discovery/browse-view";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CONTENT_TYPE_LABELS } from "@/lib/mock-api/data/categories";
import { useCategory } from "@/lib/mock-api/hooks";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const { data: category, isLoading } = useCategory(slug);

  if (isLoading) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="nx-skeleton h-9 w-64 rounded" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Category not found"
          description={`No category matches “${slug}”. It may have been renamed or removed from platform settings.`}
          action={{ label: "Browse all categories", href: "/explore" }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" href="/explore">
          <IconArrowLeft />
          All categories
        </Button>
      </div>
      <BrowseView
        title={category.name}
        description={`${category.description} · ${CONTENT_TYPE_LABELS[category.contentType]}`}
        lockedCategoryId={category.id}
        layout={category.contentType === "film" ? "poster" : "wide"}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BrowseView } from "@/components/discovery/browse-view";
import { CONTENT_TYPE_LABELS, categories } from "@/lib/mock-api/data/categories";
import { compactNumber } from "@/lib/utils";

const CHART_TOKENS = [
  "rgb(var(--nx-chart-1))",
  "rgb(var(--nx-chart-2))",
  "rgb(var(--nx-chart-3))",
  "rgb(var(--nx-chart-4))",
  "rgb(var(--nx-chart-5))",
  "rgb(var(--nx-chart-6))",
];

export default function ExplorePage() {
  return (
    <div>
      <section className="border-b border-border px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
          Browse every category
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-muted">
          Commercial, film, entertainment, education, news, live, tourism,
          government, non-profit and creator content — the full catalogue in one
          place.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card
                interactive
                className="group relative h-full min-h-[8.5rem] overflow-hidden p-4"
                style={{
                  borderLeftColor: CHART_TOKENS[category.accentToken - 1],
                  borderLeftWidth: 3,
                }}
              >
                {category.imageUrl ? (
                  <>
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover opacity-20 transition-all duration-300 group-hover:scale-105 group-hover:opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/90 to-surface-1/60" />
                  </>
                ) : null}
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-fg transition-colors group-hover:text-accent">
                    {category.name}
                  </p>
                  <p className="mt-1 nx-clamp-2 text-xs leading-relaxed text-fg-muted">
                    {category.description}
                  </p>
                  <p className="mt-2.5 text-2xs uppercase tracking-wide text-fg-subtle">
                    {CONTENT_TYPE_LABELS[category.contentType]} ·{" "}
                    <span className="nx-tnum">{compactNumber(category.videoCount)}</span>{" "}
                    titles
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <BrowseView
        title="Everything on Nexus"
        description="Filter the whole catalogue by type, category, access model, language, age rating and release year."
      />
    </div>
  );
}

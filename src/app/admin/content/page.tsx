"use client";

import { IconExternalLink, IconVideo } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";
import { PageBody, PageHeader } from "@/components/layout/workspace-shell";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { TableSkeleton } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/field";
import { CONTENT_TYPE_LABELS } from "@/lib/mock-api/data/categories";
import { channelById } from "@/lib/mock-api/data/channels";
import { useSearchVideos } from "@/lib/mock-api/hooks";
import type { ContentType, Video } from "@/lib/mock-api/types";
import { compactNumber, formatDate } from "@/lib/utils";

export default function AdminContentPage() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("");

  const { data, isLoading } = useSearchVideos({
    query: query || undefined,
    contentTypes: type ? [type as ContentType] : undefined,
    pageSize: 200,
  });

  const videos = data?.items ?? [];

  const columns: Array<Column<Video>> = [
    {
      key: "title",
      header: "Title",
      sortValue: (row) => row.title,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-9 w-16 shrink-0 rounded"
            style={{
              backgroundImage: `linear-gradient(140deg, ${row.posterGradient[0]}, ${row.posterGradient[1]})`,
            }}
          />
          <span className="min-w-0">
            <Link
              href={`/video/${row.id}`}
              className="block truncate font-medium text-fg transition-colors hover:text-accent"
            >
              {row.title}
            </Link>
            <span className="block truncate text-2xs text-fg-subtle">
              {channelById(row.channelId)?.name}
            </span>
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      secondary: true,
      sortValue: (row) => row.contentType,
      cell: (row) => (
        <Badge tone="outline" size="sm">
          {CONTENT_TYPE_LABELS[row.contentType]}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (row) => row.status,
      cell: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: "rating",
      header: "Rating",
      secondary: true,
      sortValue: (row) => row.rights.ageRating,
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          <Badge tone="neutral" size="sm">
            {row.rights.ageRating}
          </Badge>
          {row.rights.contentLabels.map((label) => (
            <Badge key={label} tone="warning" size="sm">
              {label.replace(/-/g, " ")}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "territories",
      header: "Territories",
      secondary: true,
      cell: (row) =>
        row.rights.permittedCountries.length ? (
          <span className="text-xs">
            {row.rights.permittedCountries.length} allowed
          </span>
        ) : row.rights.blockedCountries.length ? (
          <span className="text-xs text-warning">
            {row.rights.blockedCountries.length} blocked
          </span>
        ) : (
          <span className="text-xs text-fg-subtle">Worldwide</span>
        ),
    },
    {
      key: "published",
      header: "Published",
      secondary: true,
      sortValue: (row) => row.publishedAt ?? "",
      cell: (row) => (
        <span className="nx-tnum">
          {row.publishedAt ? formatDate(row.publishedAt) : "—"}
        </span>
      ),
    },
    {
      key: "views",
      header: "Views",
      align: "right",
      sortValue: (row) => row.views,
      cell: (row) => <span className="nx-tnum text-fg">{compactNumber(row.views)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) => (
        <Button variant="ghost" size="xs" href={`/video/${row.id}`}>
          <IconExternalLink />
        </Button>
      ),
    },
  ];

  const restricted = videos.filter((v) => v.status === "restricted").length;
  const sponsored = videos.filter((v) => v.pricing.sponsored).length;

  return (
    <>
      <PageHeader
        title="Content"
        description="Every published and restricted title across the platform, with its rights and classification."
      />

      <PageBody className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat label="Titles" value={String(videos.length)} icon={<IconVideo />} />
          <Stat label="Restricted" value={String(restricted)} invertDelta />
          <Stat label="Sponsored" value={String(sponsored)} />
          <Stat
            label="Age 18"
            value={String(videos.filter((v) => v.rights.ageRating === "18").length)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, channels, tags"
            className="max-w-sm"
            sizeVariant="sm"
          />
          <Select
            value={type}
            onChange={(event) => setType(event.target.value)}
            sizeVariant="sm"
            className="w-52"
            aria-label="Filter by content type"
          >
            <option value="">All content types</option>
            {(Object.keys(CONTENT_TYPE_LABELS) as ContentType[]).map((item) => (
              <option key={item} value={item}>
                {CONTENT_TYPE_LABELS[item]}
              </option>
            ))}
          </Select>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} cols={6} />
        ) : (
          <DataTable
            columns={columns}
            rows={videos}
            rowKey={(row) => row.id}
            pageSize={15}
            caption="Platform content"
          />
        )}
      </PageBody>
    </>
  );
}

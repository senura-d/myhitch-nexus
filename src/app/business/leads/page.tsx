"use client";

import { IconDownload, IconMail, IconUserSearch } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";
import { PageBody, PageHeader } from "@/components/layout/workspace-shell";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, Stat } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { videoById } from "@/lib/mock-api/data/videos";
import { useLeads, useUpdateLeadStatus } from "@/lib/mock-api/hooks";
import type { Lead } from "@/lib/mock-api/types";
import { relativeTime } from "@/lib/utils";

const CHANNEL_ID = "ch_helio";

const STATUS_TONE: Record<Lead["status"], "accent" | "info" | "published" | "archived"> = {
  new: "accent",
  contacted: "info",
  qualified: "published",
  closed: "archived",
};

export default function LeadsPage() {
  const { data: leads = [] } = useLeads(CHANNEL_ID);
  const updateStatus = useUpdateLeadStatus(CHANNEL_ID);
  const { toast } = useToast();

  const [tab, setTab] = React.useState("all");
  const [detail, setDetail] = React.useState<Lead | null>(null);

  const filtered = tab === "all" ? leads : leads.filter((lead) => lead.status === tab);

  const counts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  return (
    <>
      <PageHeader
        title="Leads"
        description="Enquiries captured from your videos and channel page."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast({
                title: "Export queued",
                description: "Mock CSV export — no CRM is connected.",
                tone: "info",
              })
            }
          >
            <IconDownload />
            Export
          </Button>
        }
      />

      <PageBody className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat label="New" value={String(counts.new)} />
          <Stat label="Contacted" value={String(counts.contacted)} />
          <Stat label="Qualified" value={String(counts.qualified)} />
          <Stat label="Closed" value={String(counts.closed)} />
        </div>

        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: "all", label: "All", count: leads.length },
            { value: "new", label: "New", count: counts.new },
            { value: "contacted", label: "Contacted", count: counts.contacted },
            { value: "qualified", label: "Qualified", count: counts.qualified },
            { value: "closed", label: "Closed", count: counts.closed },
          ]}
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<IconUserSearch />}
            title="No leads in this view"
            description="Enquiries submitted from your videos land here."
          />
        ) : (
          <ul className="space-y-3">
            {filtered.map((lead) => {
              const video = videoById(lead.sourceVideoId);
              return (
                <li key={lead.id}>
                  <Card className="p-4">
                    <div className="flex flex-wrap items-start gap-4">
                      <Avatar name={lead.name} size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-fg">{lead.name}</p>
                          <Badge tone={STATUS_TONE[lead.status]} size="sm">
                            {lead.status}
                          </Badge>
                          <span className="text-xs text-fg-subtle">
                            {relativeTime(lead.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-fg-muted">
                          {lead.company} · {lead.email}
                        </p>
                        <p className="mt-2 nx-clamp-2 text-sm leading-relaxed text-fg-muted">
                          {lead.message}
                        </p>
                        {video ? (
                          <Link
                            href={`/video/${video.id}`}
                            className="mt-2 inline-block text-2xs text-fg-subtle transition-colors hover:text-accent"
                          >
                            from “{video.title}”
                          </Link>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Select
                          value={lead.status}
                          onChange={(event) =>
                            updateStatus.mutate({
                              id: lead.id,
                              status: event.target.value as Lead["status"],
                            })
                          }
                          sizeVariant="sm"
                          className="w-32"
                          aria-label={`Status for ${lead.name}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="closed">Closed</option>
                        </Select>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setDetail(lead)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </PageBody>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.name}
        description={detail ? `${detail.company} · ${detail.email}` : undefined}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDetail(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                toast({
                  title: "Reply drafted",
                  description: "No email is sent — delivery is out of scope.",
                  tone: "info",
                });
                setDetail(null);
              }}
            >
              <IconMail />
              Reply
            </Button>
          </>
        }
      >
        {detail ? (
          <div className="space-y-3">
            <Badge tone={STATUS_TONE[detail.status]} size="sm">
              {detail.status}
            </Badge>
            <p className="whitespace-pre-line text-sm leading-relaxed text-fg-muted">
              {detail.message}
            </p>
            <p className="text-xs text-fg-subtle nx-tnum">
              Received {relativeTime(detail.createdAt)}
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

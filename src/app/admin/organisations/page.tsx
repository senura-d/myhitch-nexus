"use client";

import {
  IconBuildingCommunity,
  IconCheck,
  IconFileDescription,
  IconX,
} from "@tabler/icons-react";
import * as React from "react";
import { PageBody, PageHeader } from "@/components/layout/workspace-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, Stat } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { CHANNEL_KIND_LABELS } from "@/lib/mock-api/data/channels";
import {
  useOrganisations,
  useUpdateOrganisationStatus,
} from "@/lib/mock-api/hooks";
import type { Organisation } from "@/lib/mock-api/types";
import { cn, formatDate, relativeTime } from "@/lib/utils";

const STATUS_TONE = {
  verified: "published",
  pending: "pending",
  rejected: "rejected",
  unverified: "draft",
} as const;

export default function AdminOrganisationsPage() {
  const { data: organisations = [] } = useOrganisations();
  const updateStatus = useUpdateOrganisationStatus();
  const { toast } = useToast();

  const [tab, setTab] = React.useState("all");
  const [selected, setSelected] = React.useState<Organisation | null>(null);
  const [decision, setDecision] = React.useState<"verified" | "rejected">("verified");
  const [reason, setReason] = React.useState("");

  const filtered =
    tab === "all"
      ? organisations
      : organisations.filter((org) => org.verificationStatus === tab);

  const counts = {
    pending: organisations.filter((o) => o.verificationStatus === "pending").length,
    verified: organisations.filter((o) => o.verificationStatus === "verified").length,
    rejected: organisations.filter((o) => o.verificationStatus === "rejected").length,
  };

  return (
    <>
      <PageHeader
        title="Organisations"
        description="Verification applications from businesses, studios, education providers, government bodies and charities."
      />

      <PageBody className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat
            label="Awaiting review"
            value={String(counts.pending)}
            icon={<IconBuildingCommunity />}
          />
          <Stat label="Verified" value={String(counts.verified)} />
          <Stat label="Rejected" value={String(counts.rejected)} />
        </div>

        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: "all", label: "All", count: organisations.length },
            { value: "pending", label: "Pending", count: counts.pending },
            { value: "verified", label: "Verified", count: counts.verified },
            { value: "rejected", label: "Rejected", count: counts.rejected },
          ]}
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<IconBuildingCommunity />}
            title="Nothing here"
            description="No organisations match this filter."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((org) => (
              <Card key={org.id}>
                <CardHeader
                  title={
                    <span className="flex flex-wrap items-center gap-2">
                      {org.name}
                      <Badge tone={STATUS_TONE[org.verificationStatus]} size="sm">
                        {org.verificationStatus}
                      </Badge>
                      <Badge tone="outline" size="sm">
                        {CHANNEL_KIND_LABELS[org.kind]}
                      </Badge>
                    </span>
                  }
                  description={`${org.registrationNumber} · ${org.country} · submitted ${relativeTime(org.submittedAt)}`}
                  action={
                    org.verificationStatus === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelected(org);
                            setDecision("rejected");
                            setReason("");
                          }}
                        >
                          <IconX />
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelected(org);
                            setDecision("verified");
                            setReason("");
                          }}
                        >
                          <IconCheck />
                          Verify
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelected(org);
                          setDecision(
                            org.verificationStatus === "verified" ? "rejected" : "verified",
                          );
                          setReason("");
                        }}
                      >
                        Change decision
                      </Button>
                    )
                  }
                />
                <CardBody className="grid gap-5 lg:grid-cols-2">
                  {/* Representative + documents */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                        Authorised representative
                      </p>
                      <p className="mt-1 text-sm text-fg">{org.representative}</p>
                      <p className="text-xs text-fg-muted">{org.representativeEmail}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                        Documents
                      </p>
                      <ul className="mt-2 space-y-2">
                        {org.documents.map((doc) => (
                          <li
                            key={doc.id}
                            className="flex items-center gap-2.5 rounded border border-border bg-surface-2 p-2.5"
                          >
                            <IconFileDescription className="size-4 shrink-0 text-fg-subtle" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm text-fg">
                                {doc.name}
                              </span>
                              <span className="block text-2xs text-fg-subtle">
                                {doc.type} · uploaded {formatDate(doc.uploadedAt)}
                              </span>
                            </span>
                            <Badge
                              tone={
                                doc.status === "verified"
                                  ? "published"
                                  : doc.status === "rejected"
                                    ? "rejected"
                                    : "pending"
                              }
                              size="sm"
                            >
                              {doc.status}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Verification timeline */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                      Verification history
                    </p>
                    <ol className="mt-3 space-y-0">
                      {org.timeline.map((step, index) => (
                        <li key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
                          {index < org.timeline.length - 1 ? (
                            <span
                              aria-hidden
                              className="absolute left-[7px] top-4 h-full w-px bg-border"
                            />
                          ) : null}
                          <span
                            className={cn(
                              "relative z-10 mt-1 size-3.5 shrink-0 rounded-full border-2",
                              step.state === "done"
                                ? "border-success bg-success"
                                : step.state === "failed"
                                  ? "border-danger bg-danger"
                                  : step.state === "current"
                                    ? "border-accent bg-bg"
                                    : "border-border bg-surface-2",
                            )}
                          />
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block text-sm",
                                step.state === "pending" ? "text-fg-subtle" : "text-fg",
                              )}
                            >
                              {step.label}
                            </span>
                            <span className="block text-2xs text-fg-subtle nx-tnum">
                              {step.at ? `${formatDate(step.at)} · ` : ""}
                              {step.actor}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </PageBody>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={`${decision === "verified" ? "Verify" : "Reject"} ${selected?.name ?? ""}`}
        description={
          decision === "verified"
            ? "The organisation gets a verified badge and can publish and monetise."
            : "The organisation is told why, and can resubmit with corrected documents."
        }
        tone={decision === "rejected" ? "danger" : "default"}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button
              variant={decision === "verified" ? "primary" : "danger"}
              disabled={reason.trim().length < 8}
              loading={updateStatus.isPending}
              onClick={async () => {
                if (!selected) return;
                await updateStatus.mutateAsync({
                  orgId: selected.id,
                  status: decision,
                  reason: reason.trim(),
                });
                toast({
                  title:
                    decision === "verified"
                      ? "Organisation verified"
                      : "Verification rejected",
                  description: "Recorded in the audit log.",
                  tone: decision === "verified" ? "success" : "warning",
                });
                setSelected(null);
              }}
            >
              {decision === "verified" ? "Verify" : "Reject"}
            </Button>
          </>
        }
      >
        <Field
          label="Reason"
          htmlFor="org-reason"
          required
          hint="Required for both decisions. Written to the audit log."
        >
          <Textarea
            id="org-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder={
              decision === "verified"
                ? "Registration confirmed against the public register."
                : "Proof of address is illegible — please resubmit."
            }
          />
        </Field>
      </Modal>
    </>
  );
}

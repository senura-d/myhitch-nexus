"use client";

import {
  IconAlertTriangle,
  IconGavel,
  IconMessagePlus,
  IconScale,
  IconShieldLock,
  IconWallet,
} from "@tabler/icons-react";
import * as React from "react";
import { PageBody, PageHeader } from "@/components/layout/workspace-shell";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, Stat } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Select, Textarea } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useAddCaseNote, useCases } from "@/lib/mock-api/hooks";
import type { AdminCase } from "@/lib/mock-api/types";
import { cn, formatDateTime, relativeTime } from "@/lib/utils";

const DOMAIN_META: Record<
  AdminCase["domain"],
  { label: string; icon: React.ReactNode; tone: "danger" | "warning" | "info" | "accent" }
> = {
  legal: { label: "Legal", icon: <IconScale />, tone: "info" },
  safety: { label: "Trust & safety", icon: <IconShieldLock />, tone: "danger" },
  payment: { label: "Payment", icon: <IconWallet />, tone: "warning" },
  copyright: { label: "Copyright", icon: <IconGavel />, tone: "accent" },
};

const STATUS_TONE = {
  open: "pending",
  investigating: "info",
  escalated: "warning",
  resolved: "published",
} as const;

export default function AdminCasesPage() {
  const { data: cases = [] } = useCases();
  const addNote = useAddCaseNote();
  const { toast } = useToast();

  const [tab, setTab] = React.useState("open");
  const [noteFor, setNoteFor] = React.useState<AdminCase | null>(null);
  const [noteBody, setNoteBody] = React.useState("");
  const [noteKind, setNoteKind] = React.useState<"note" | "escalation" | "resolution">(
    "note",
  );

  const open = cases.filter((item) => item.status !== "resolved");
  const resolved = cases.filter((item) => item.status === "resolved");
  const shown = tab === "open" ? open : tab === "resolved" ? resolved : cases;

  const urgent = cases.filter(
    (item) => item.priority === "urgent" && item.status !== "resolved",
  );

  return (
    <>
      <PageHeader
        title="Case management"
        description="Legal, safety, payment and copyright matters that need a documented decision trail."
      />

      <PageBody className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Open cases" value={String(open.length)} icon={<IconGavel />} />
          <Stat
            label="Urgent"
            value={String(urgent.length)}
            icon={<IconAlertTriangle />}
            invertDelta
          />
          <Stat
            label="Escalated"
            value={String(cases.filter((c) => c.status === "escalated").length)}
          />
          <Stat label="Resolved" value={String(resolved.length)} />
        </div>

        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: "open", label: "Open", count: open.length },
            { value: "resolved", label: "Resolved", count: resolved.length },
            { value: "all", label: "All", count: cases.length },
          ]}
        />

        {shown.length === 0 ? (
          <EmptyState
            icon={<IconGavel />}
            title="No cases"
            description="Escalations from the review queue and finance appear here."
          />
        ) : (
          <div className="space-y-4">
            {shown.map((item) => {
              const meta = DOMAIN_META[item.domain];
              return (
                <Card key={item.id}>
                  <CardHeader
                    title={
                      <span className="flex flex-wrap items-center gap-2">
                        <code className="font-mono text-xs text-accent">
                          {item.reference}
                        </code>
                        {item.subject}
                      </span>
                    }
                    description={
                      <>
                        {item.owner} · opened {relativeTime(item.openedAt)} · related{" "}
                        <span className="font-mono">{item.relatedId}</span>
                      </>
                    }
                    action={
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={meta.tone} size="sm">
                          {meta.icon}
                          {meta.label}
                        </Badge>
                        <Badge tone={STATUS_TONE[item.status]} size="sm">
                          {item.status}
                        </Badge>
                        <Badge
                          tone={
                            item.priority === "urgent"
                              ? "danger"
                              : item.priority === "high"
                                ? "warning"
                                : "neutral"
                          }
                          size="sm"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    }
                  />
                  <CardBody className="space-y-4">
                    <ol className="space-y-0">
                      {item.notes.map((note, index) => (
                        <li key={note.id} className="relative flex gap-3 pb-4 last:pb-0">
                          {index < item.notes.length - 1 ? (
                            <span
                              aria-hidden
                              className="absolute left-[15px] top-9 h-[calc(100%-2rem)] w-px bg-border"
                            />
                          ) : null}
                          <Avatar name={note.author} size="sm" className="relative z-10" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-fg">
                                {note.author}
                              </span>
                              <Badge
                                tone={
                                  note.kind === "escalation"
                                    ? "warning"
                                    : note.kind === "resolution"
                                      ? "published"
                                      : "outline"
                                }
                                size="sm"
                              >
                                {note.kind}
                              </Badge>
                              <span
                                className="text-2xs text-fg-subtle nx-tnum"
                                title={formatDateTime(note.createdAt)}
                              >
                                {relativeTime(note.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                              {note.body}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    {item.status !== "resolved" ? (
                      <div className="border-t border-border pt-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setNoteFor(item);
                            setNoteBody("");
                            setNoteKind("note");
                          }}
                        >
                          <IconMessagePlus />
                          Add note or escalate
                        </Button>
                      </div>
                    ) : null}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </PageBody>

      <Modal
        open={Boolean(noteFor)}
        onClose={() => setNoteFor(null)}
        title={`Add to ${noteFor?.reference ?? "case"}`}
        description={noteFor?.subject}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNoteFor(null)}>
              Cancel
            </Button>
            <Button
              variant={noteKind === "escalation" ? "danger" : "primary"}
              disabled={noteBody.trim().length < 8}
              loading={addNote.isPending}
              onClick={async () => {
                if (!noteFor) return;
                await addNote.mutateAsync({
                  caseId: noteFor.id,
                  body: noteBody.trim(),
                  kind: noteKind,
                });
                toast({
                  title:
                    noteKind === "escalation"
                      ? "Case escalated"
                      : noteKind === "resolution"
                        ? "Case resolved"
                        : "Note added",
                  description: "Recorded in the audit log.",
                  tone: noteKind === "escalation" ? "warning" : "success",
                });
                setNoteFor(null);
              }}
            >
              {noteKind === "escalation"
                ? "Escalate"
                : noteKind === "resolution"
                  ? "Resolve case"
                  : "Add note"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Entry type" htmlFor="note-kind">
            <Select
              id="note-kind"
              value={noteKind}
              onChange={(event) =>
                setNoteKind(event.target.value as typeof noteKind)
              }
            >
              <option value="note">Note — record progress</option>
              <option value="escalation">Escalation — raise to a senior owner</option>
              <option value="resolution">Resolution — close the case</option>
            </Select>
          </Field>

          <Field
            label="Details"
            htmlFor="note-body"
            required
            hint="Written to the case timeline and the platform audit log."
          >
            <Textarea
              id="note-body"
              value={noteBody}
              onChange={(event) => setNoteBody(event.target.value)}
              rows={4}
              placeholder={
                noteKind === "escalation"
                  ? "Escalating to external counsel for a fair-dealing opinion."
                  : noteKind === "resolution"
                    ? "Claimant withdrew the claim. Content restored."
                    : "Counter-notice received from the publisher."
              }
            />
          </Field>

          {noteKind === "resolution" ? (
            <p
              className={cn(
                "flex items-start gap-2 rounded border p-3 text-xs leading-relaxed",
                "border-success/30 bg-success/10 text-fg-muted",
              )}
            >
              <IconGavel className="mt-0.5 size-4 shrink-0 text-success" />
              Resolving closes the case. It stays readable in the archive and the
              audit log entry is permanent.
            </p>
          ) : null}
        </div>
      </Modal>
    </>
  );
}

"use client";

import { IconCheck, IconExternalLink } from "@tabler/icons-react";
import * as React from "react";
import { PageBody, PageHeader } from "@/components/layout/workspace-shell";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Switch, Textarea } from "@/components/ui/field";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/components/ui/toast";
import { Poster } from "@/components/video/poster";
import { CHANNEL_KIND_LABELS } from "@/lib/mock-api/data/channels";
import { useChannel, useCurrentUser } from "@/lib/mock-api/hooks";
import { compactNumber, formatDate } from "@/lib/utils";

const LANGUAGES = [
  "English", "Welsh", "German", "French", "Spanish", "Portuguese", "Polish", "Urdu", "Sinhala", "Tamil",
].map((value) => ({ value, label: value }));

export default function ChannelSettingsPage() {
  const { data: user } = useCurrentUser();
  const channelId = user?.channelId ?? "ch_mara";
  const { data: channel } = useChannel(channelId);
  const { toast } = useToast();

  const [name, setName] = React.useState("");
  const [handle, setHandle] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [about, setAbout] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [languages, setLanguages] = React.useState<string[]>([]);
  const [country, setCountry] = React.useState("GB");

  const [membershipsEnabled, setMembershipsEnabled] = React.useState(true);
  const [adsEnabled, setAdsEnabled] = React.useState(true);
  const [commentsEnabled, setCommentsEnabled] = React.useState(true);
  const [autoApprove, setAutoApprove] = React.useState(false);

  React.useEffect(() => {
    if (!channel) return;
    setName(channel.name);
    setHandle(channel.handle);
    setTagline(channel.tagline);
    setAbout(channel.about);
    setContactEmail(channel.contactEmail);
    setLanguages(channel.languages);
    setCountry(channel.country);
  }, [channel]);

  if (!channel) return null;

  return (
    <>
      <PageHeader
        title="Channel settings"
        description="Branding, contact details and channel-level policies."
        actions={
          <Button variant="secondary" href={`/channel/${channel.id}`}>
            <IconExternalLink />
            View public page
          </Button>
        }
      />

      <PageBody className="space-y-6">
        {/* Branding */}
        <Card>
          <CardHeader
            title="Branding"
            description="Banner and avatar are generated from your channel identity in this build — image upload is out of scope."
          />
          <CardBody className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-border">
              <Poster
                gradient={channel.bannerGradient}
                seed={`${channel.id}-banner`}
                ratio="banner"
              />
              <div className="flex flex-wrap items-center gap-4 bg-surface-2 p-4">
                <Avatar
                  name={channel.name}
                  gradient={channel.avatarGradient}
                  size="xl"
                  square
                  verified={channel.verified}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-fg">{channel.name}</p>
                  <p className="text-xs text-fg-muted nx-tnum">
                    @{channel.handle} · {compactNumber(channel.followers)} followers
                  </p>
                </div>
                <Badge tone="accent" size="sm">
                  {CHANNEL_KIND_LABELS[channel.kind]}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Channel name" htmlFor="ch-name">
                <Input
                  id="ch-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
              <Field label="Handle" htmlFor="ch-handle">
                <Input
                  id="ch-handle"
                  value={handle}
                  onChange={(event) => setHandle(event.target.value)}
                  leading={<span className="text-sm">@</span>}
                />
              </Field>
            </div>

            <Field label="Tagline" htmlFor="ch-tagline" aside={`${tagline.length}/80`}>
              <Input
                id="ch-tagline"
                value={tagline}
                maxLength={80}
                onChange={(event) => setTagline(event.target.value)}
              />
            </Field>

            <Field label="About" htmlFor="ch-about" aside={`${about.length}/1000`}>
              <Textarea
                id="ch-about"
                value={about}
                maxLength={1000}
                rows={5}
                onChange={(event) => setAbout(event.target.value)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact email" htmlFor="ch-email">
                <Input
                  id="ch-email"
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                />
              </Field>
              <Field label="Country" htmlFor="ch-country">
                <Select
                  id="ch-country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                >
                  {["GB", "IE", "DE", "FR", "PT", "US", "LK", "AU"].map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Languages">
              <MultiSelect
                options={LANGUAGES}
                value={languages}
                onChange={setLanguages}
                placeholder="Select languages"
              />
            </Field>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="ghost">Reset</Button>
              <Button
                variant="primary"
                onClick={() => toast({ title: "Channel settings saved" })}
              >
                Save changes
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Verification */}
        <Card>
          <CardHeader
            title="Verification"
            description="Verified channels get a badge and access to advanced monetisation."
          />
          <CardBody>
            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border p-4">
              <span
                className={
                  channel.verificationStatus === "verified"
                    ? "flex size-10 items-center justify-center rounded-full bg-success/15 text-success"
                    : "flex size-10 items-center justify-center rounded-full bg-warning/15 text-warning"
                }
              >
                <IconCheck className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">
                  {channel.verificationStatus === "verified"
                    ? "This channel is verified"
                    : channel.verificationStatus === "pending"
                      ? "Verification in progress"
                      : "Not verified"}
                </p>
                <p className="mt-0.5 text-xs text-fg-muted">
                  On Nexus since {formatDate(channel.joinedAt, "long")}
                </p>
              </div>
              <Badge
                tone={
                  channel.verificationStatus === "verified"
                    ? "published"
                    : channel.verificationStatus === "pending"
                      ? "pending"
                      : "draft"
                }
              >
                {channel.verificationStatus}
              </Badge>
            </div>
          </CardBody>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader
            title="Channel policies"
            description="Defaults applied to new uploads. Individual videos can override them."
          />
          <CardBody className="space-y-4">
            <Switch
              checked={adsEnabled}
              onCheckedChange={setAdsEnabled}
              label="Allow advertising on my content"
              description="Enables pre-roll, mid-roll and overlay placements and the associated revenue share."
            />
            <Switch
              checked={membershipsEnabled}
              onCheckedChange={setMembershipsEnabled}
              label="Offer channel memberships"
              description="Lets viewers subscribe monthly for members-only content."
            />
            <Switch
              checked={commentsEnabled}
              onCheckedChange={setCommentsEnabled}
              label="Allow comments"
              description="Turning this off hides existing comments and disables new ones."
            />
            <Switch
              checked={autoApprove}
              onCheckedChange={setAutoApprove}
              label="Auto-approve comments from members"
              description="Skips the held queue for your paying members."
            />
          </CardBody>
        </Card>
      </PageBody>
    </>
  );
}

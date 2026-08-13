"use client";

import { IconHistory, IconTrash } from "@tabler/icons-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState, RailSkeleton } from "@/components/ui/empty-state";
import { Switch } from "@/components/ui/field";
import { ProgressBar } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { VideoCard } from "@/components/video/video-card";
import {
  useContinueWatching,
  useCurrentUser,
  useUpdateUser,
} from "@/lib/mock-api/hooks";
import { formatDuration, relativeTime } from "@/lib/utils";

export default function HistoryPage() {
  const { data: history = [], isLoading } = useContinueWatching();
  const { data: user } = useCurrentUser();
  const updateUser = useUpdateUser();
  const { toast } = useToast();

  const inProgress = history.filter((entry) => !entry.progress.completed);
  const completed = history.filter((entry) => entry.progress.completed);

  if (isLoading) return <RailSkeleton count={8} />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="History settings"
          description="Watch history drives Continue watching and personalised rails."
        />
        <CardBody className="space-y-4">
          <Switch
            checked={user?.privacy.watchHistoryVisible ?? false}
            onCheckedChange={(value) =>
              updateUser.mutate({
                privacy: { ...user!.privacy, watchHistoryVisible: value },
              })
            }
            label="Make watch history visible on my public profile"
            description="Off by default. Nobody can see what you watch."
          />
          <Switch
            checked={user?.privacy.personalisedRecommendations ?? false}
            onCheckedChange={(value) =>
              updateUser.mutate({
                privacy: { ...user!.privacy, personalisedRecommendations: value },
              })
            }
            label="Use history for recommendations"
            description="Turning this off replaces personalised rails with editorial ones."
          />
          <div className="flex justify-end border-t border-border pt-4">
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                toast({
                  title: "History cleared",
                  description: "Mock action — the fixture data reseeds on reload.",
                  tone: "warning",
                })
              }
            >
              <IconTrash />
              Clear all watch history
            </Button>
          </div>
        </CardBody>
      </Card>

      {history.length === 0 ? (
        <EmptyState
          icon={<IconHistory />}
          title="Nothing watched yet"
          description="Titles you start appear here so you can pick them up on any device."
          action={{ label: "Find something to watch", href: "/explore" }}
        />
      ) : (
        <>
          {inProgress.length > 0 ? (
            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-fg">
                Continue watching
              </h2>
              <ul className="space-y-3">
                {inProgress.map((entry) => {
                  const percent =
                    (entry.progress.positionSeconds / entry.progress.durationSeconds) * 100;
                  return (
                    <li key={entry.video.id}>
                      <Card className="p-3">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="w-full sm:w-64">
                            <VideoCard
                              video={entry.video}
                              layout="wide"
                              minimal
                              progress={percent}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-fg">
                              {entry.video.title}
                            </p>
                            <p className="mt-1 text-xs text-fg-muted nx-tnum">
                              {formatDuration(entry.progress.positionSeconds)} of{" "}
                              {formatDuration(entry.progress.durationSeconds)} ·
                              last watched {relativeTime(entry.progress.updatedAt)}
                            </p>
                            <ProgressBar
                              value={percent}
                              size="sm"
                              className="mt-2 max-w-sm"
                            />
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            href={`/video/${entry.video.id}`}
                          >
                            Resume
                          </Button>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {completed.length > 0 ? (
            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-fg">
                Finished
              </h2>
              <ul className="space-y-3">
                {completed.map((entry) => (
                  <li key={entry.video.id}>
                    <Card className="flex flex-wrap items-center gap-4 p-3">
                      <div className="w-full sm:w-48">
                        <VideoCard video={entry.video} layout="wide" minimal />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-fg">
                          {entry.video.title}
                        </p>
                        <p className="mt-1 text-xs text-fg-muted">
                          Watched {relativeTime(entry.progress.updatedAt)}
                        </p>
                      </div>
                      <Badge tone="published" size="sm">
                        Completed
                      </Badge>
                      <Button variant="ghost" size="sm" href={`/video/${entry.video.id}`}>
                        Watch again
                      </Button>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

"use client";

import { IconPlugConnectedX, IconRefresh, IconWifi, IconWifiOff } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NexusLoader } from "./nexus-loader";
import { StatusScreen } from "./status-screen";

/**
 * Connection handling.
 *
 * Two distinct states, because they deserve different weight:
 *
 *  - **Dropped** — the browser reports offline. The app is unusable, so it is
 *    replaced by a full-screen state rather than letting people click into
 *    surfaces that cannot load.
 *  - **Restored** — a transient banner confirming we are back, so the change
 *    is acknowledged instead of silently happening.
 *
 * Reconnecting refetches every query rather than reloading the page, which
 * keeps whatever the viewer had in flight.
 */
export function NetworkStatus({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [online, setOnline] = React.useState(true);
  const [restored, setRestored] = React.useState(false);
  const [retrying, setRetrying] = React.useState(false);
  const wasOffline = React.useRef(false);

  React.useEffect(() => {
    // Read the real value only after mount: the server render has no
    // navigator, and assuming "offline" would flash the error screen.
    setOnline(navigator.onLine);

    const handleOnline = () => {
      setOnline(true);
      if (wasOffline.current) {
        setRestored(true);
        window.setTimeout(() => setRestored(false), 4_000);
        void queryClient.refetchQueries();
      }
      wasOffline.current = false;
    };

    const handleOffline = () => {
      wasOffline.current = true;
      setOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queryClient]);

  const retry = async () => {
    setRetrying(true);
    if (navigator.onLine) {
      setOnline(true);
      await queryClient.refetchQueries();
    }
    window.setTimeout(() => setRetrying(false), 700);
  };

  if (!online) {
    return (
      <StatusScreen
        tone="warning"
        icon={<IconWifiOff />}
        title="You are offline"
        description={
          <>
            Your device has lost its connection, so Nexus cannot load new
            pages. Anything already open stays on screen — this will clear
            itself the moment you are back.
          </>
        }
        actions={
          <>
            <Button variant="primary" onClick={retry} loading={retrying}>
              <IconRefresh />
              Try again
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Reload the page
            </Button>
          </>
        }
      >
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-border pt-6">
          <NexusLoader size="sm" showBar={false} label="Waiting for a connection" />
          <p className="text-xs text-fg-subtle">
            Watching for the connection to come back…
          </p>
        </div>
      </StatusScreen>
    );
  }

  return (
    <>
      {children}

      {/* Reconnected confirmation */}
      <div
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-0 top-3 z-[70] flex justify-center px-3 transition-all duration-300",
          restored
            ? "translate-y-0 opacity-100"
            : "-translate-y-3 opacity-0",
        )}
      >
        {restored ? (
          <span className="flex items-center gap-2 rounded-full border border-success/30 bg-success/15 px-3.5 py-1.5 text-xs font-medium text-success shadow-md backdrop-blur-sm">
            <IconWifi className="size-3.5" />
            Back online — content refreshed
          </span>
        ) : null}
      </div>
    </>
  );
}

/**
 * Inline variant for a single failed panel, where replacing the whole page
 * would be disproportionate.
 */
export function ConnectionError({
  onRetry,
  className,
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-danger/40 bg-danger/[0.04] px-6 py-10 text-center",
        className,
      )}
    >
      <span className="inline-flex size-11 items-center justify-center rounded-full bg-danger/15 text-danger">
        <IconPlugConnectedX className="size-5" />
      </span>
      <p className="mt-3 font-display text-base font-semibold text-fg">
        Could not load this section
      </p>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-fg-muted">
        The request did not come back. The rest of the page is unaffected.
      </p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          <IconRefresh />
          Retry
        </Button>
      ) : null}
    </div>
  );
}

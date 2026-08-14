"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useCurrentUser } from "@/lib/mock-api/hooks";

/**
 * Wraps protected workspace sections (Studio, Admin, Business).
 * If the user is not logged in, redirects to the login page immediately.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  React.useEffect(() => {
    if (!isLoading && user === null) {
      router.replace("/auth/login");
    }
  }, [isLoading, user, router]);

  // While we're checking auth, or if user is null (redirect pending), show nothing.
  if (isLoading || user === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="nx-skeleton h-8 w-40 rounded" />
      </div>
    );
  }

  return <>{children}</>;
}

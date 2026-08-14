import { cn } from "@/lib/utils";

export function NexusMark({ className }: { className?: string }) {
  return (
    <>
      <img
        src="/images/brand/logo.png"
        alt="MYHitch Nexus Logo"
        className={cn("shrink-0 object-contain dark:hidden", className)}
      />
      <img
        src="/images/brand/logo-dark.png"
        alt="MYHitch Nexus Logo"
        className={cn("hidden shrink-0 object-contain dark:block", className)}
      />
    </>
  );
}

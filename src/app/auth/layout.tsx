import Link from "next/link";
import { NexusMark } from "@/components/layout/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,34rem)]">
      {/* Editorial panel — desktop only. Keeps the form column uncluttered. */}
      <aside className="relative hidden overflow-hidden lg:block">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(150deg, #16326B 0%, #0B1220 48%, #124C6B 100%)",
          }}
        />
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full opacity-[0.13]"
        >
          <g fill="none" stroke="white" strokeWidth="0.4">
            {Array.from({ length: 14 }, (_, index) => (
              <circle key={index} cx="30" cy="55" r={6 + index * 6} />
            ))}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link href="/" className="flex items-center gap-2.5">
            <NexusMark className="size-8" />
            <span className="font-display text-lg font-semibold tracking-tight text-white">
              MYHitch <span className="text-accent">Nexus</span>
            </span>
          </Link>

          <div className="max-w-md">
            <h2 className="font-display text-3xl font-semibold leading-tight text-white">
              One account. Every kind of video.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Watch films and live events, publish as a creator, run a business
              channel, buy advertising, or manage an organisation — all from the
              same identity, with the permissions that fit your role.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/70">
              {[
                "Publish to a global catalogue with rights and territory controls",
                "Monetise with advertising, rentals, purchases and memberships",
                "Stream live with ticketing, chat moderation and replays",
                "Measure it all with retention, revenue and audience analytics",
              ].map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/45">
            Front-end prototype. All data is mocked in the browser — no accounts
            are created and no verification services are contacted.
          </p>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col bg-bg">
        <header className="flex h-header shrink-0 items-center px-5 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <NexusMark className="size-7" />
            <span className="font-display text-base font-semibold text-fg">
              MYHitch <span className="text-accent">Nexus</span>
            </span>
          </Link>
        </header>
        <main id="main" className="flex flex-1 items-start justify-center px-5 py-8 sm:py-12">
          <div className="w-full max-w-lg">{children}</div>
        </main>
      </div>
    </div>
  );
}

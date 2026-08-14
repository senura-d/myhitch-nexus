import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,34rem)]">
      {/* Editorial panel — desktop only. Keeps the form column uncluttered. */}
      <aside className="relative hidden overflow-hidden lg:block">
        {/* Backdrop photograph */}
        <Image
          src="/images/brand/auth-backdrop.png"
          alt=""
          aria-hidden
          fill
          priority
          className="object-cover object-center"
          sizes="50vw"
        />
        {/* Dark scrim so text stays legible over the image */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.70) 100%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-end p-10">
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
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col bg-bg">
        <main id="main" className="flex flex-1 items-start justify-center px-5 py-8 sm:py-12">
          <div className="w-full max-w-lg">{children}</div>
        </main>
      </div>
    </div>
  );
}

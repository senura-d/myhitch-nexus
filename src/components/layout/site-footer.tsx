import Link from "next/link";
import { NexusMark } from "./logo";

const COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "Films & cinema", href: "/films" },
      { label: "Commercial", href: "/commercial" },
      { label: "Live events", href: "/live" },
      { label: "Education", href: "/education" },
      { label: "News & documentary", href: "/news" },
      { label: "Entertainment", href: "/entertainment" },
      { label: "All categories", href: "/explore" },
    ],
  },
  {
    title: "Publish",
    links: [
      { label: "Creator Studio", href: "/studio/dashboard" },
      { label: "Upload a video", href: "/studio/upload" },
      { label: "Go live", href: "/studio/live" },
      { label: "Playlists & series", href: "/studio/playlists" },
      { label: "Analytics", href: "/studio/analytics" },
      { label: "Revenue & payouts", href: "/studio/revenue" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Business Studio", href: "/business/channel" },
      { label: "Advertise", href: "/business/campaigns" },
      { label: "Create a campaign", href: "/business/campaigns/new" },
      { label: "Product links", href: "/business/product-links" },
      { label: "Leads", href: "/business/leads" },
      { label: "Billing", href: "/business/billing" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Profile", href: "/account/profile" },
      { label: "Watchlist", href: "/account/watchlist" },
      { label: "Purchases", href: "/account/purchases" },
      { label: "Rentals", href: "/account/rentals" },
      { label: "Subscriptions", href: "/account/subscriptions" },
      { label: "Settings", href: "/account/settings" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface/50">
      <div className="mx-auto max-w-[110rem] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <NexusMark className="size-7" />
              <span className="font-display text-base font-semibold tracking-tight text-fg">
                MYHitch <span className="text-accent">Nexus</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">
              Commercial video, film, education, live, news and creator content in
              one ecosystem — with publishing, discovery, monetisation and commerce
              built in.
            </p>
            <p className="mt-4 rounded border border-border bg-surface-2 px-3 py-2 text-xs leading-relaxed text-fg-subtle">
              <strong className="text-fg-muted">Front-end prototype.</strong> All
              data is mocked in the browser. No payment, streaming, DRM or
              ad-delivery services are contacted.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                {column.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MYHitch Nexus. Prototype build.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/admin" className="transition-colors hover:text-fg">
              Admin console
            </Link>
            <Link href="/auth/register" className="transition-colors hover:text-fg">
              Create an account
            </Link>
            <span>Terms</span>
            <span>Privacy</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

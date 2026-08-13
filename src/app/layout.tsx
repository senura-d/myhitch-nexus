import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

// Font stacks live in tokens.css and resolve locally — see the typography note
// there for why this build deliberately avoids next/font/google.

export const metadata: Metadata = {
  title: {
    default: "MYHitch Nexus",
    template: "%s · MYHitch Nexus",
  },
  description:
    "One platform for commercial video, films, education, live streams, corporate media, documentaries, news and creator content — with publishing, discovery, monetisation and commerce built in.",
};

export const viewport: Viewport = {
  themeColor: "#0A0B0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-fg"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

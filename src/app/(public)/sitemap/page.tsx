import type { Metadata } from "next";
import { SitemapClient } from "./sitemap-client";

export const metadata: Metadata = {
  title: "Sitemap · MYHitch Nexus",
  description:
    "Complete directory of all pages, categories, channels, and portals available across the MYHitch Nexus video platform.",
};

export default function SitemapPage() {
  return <SitemapClient />;
}

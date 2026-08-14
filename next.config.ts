import type { NextConfig } from "next";

/**
 * The site is published to GitHub Pages under a repository subpath, so the
 * build needs a basePath there and none locally.
 *
 * This is resolved in one place and exported, because three things must agree
 * on it: the build, the static server used for previews and tests
 * (scripts/serve-static.mjs), and Playwright's baseURL. When they disagree the
 * export silently requests assets from the wrong prefix.
 *
 * NOTE: Run `node scripts/generate-assets.mjs` once after cloning to generate
 * all SVG assets (avatars, banners, live-event posters, category cards) that
 * the mock-API data layer references under public/images/.
 */
export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_ACTIONS === "true" ? "/myhitch-nexus" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  reactStrictMode: true,
  // UI-only build: every image is either a local SVG/poster or a generated
  // data-URI gradient from lib/mock-api. No remote image hosts are configured
  // on purpose — see §12 "explicitly out of scope".
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
};

export default nextConfig;

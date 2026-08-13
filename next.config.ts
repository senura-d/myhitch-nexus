import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions ? "/myhitch-nexus" : process.env.NEXT_PUBLIC_BASE_PATH || "",
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

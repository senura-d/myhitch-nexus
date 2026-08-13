import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // UI-only build: every image is either a local SVG/poster or a generated
  // data-URI gradient from lib/mock-api. No remote image hosts are configured
  // on purpose — see §12 "explicitly out of scope".
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;

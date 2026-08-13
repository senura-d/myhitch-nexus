import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);

/**
 * Must match `basePath` in next.config.ts — in CI the export is built for a
 * repository subpath, so the tests have to drive it from that prefix too.
 * Getting this wrong makes every asset 404 and every navigation hang.
 */
const BASE_PATH = (
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_ACTIONS === "true" ? "/myhitch-nexus" : "")
).replace(/\/$/, "");

const BASE_URL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}${BASE_PATH}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // The export is served by a single-process static server (scripts/
  // serve-static.mjs). Several headless browsers pulling chunks at once
  // saturate it and produce spurious navigation timeouts, so the suite runs
  // serially — it completes in ~2 minutes either way.
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // The mock store lives in browser memory, so every test starts from the
    // same seeded fixtures as long as it begins with its own page load.
    testIdAttribute: "data-testid",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  // Tests run against the static export — the same artifact GitHub Pages
  // serves — so there is no compile-on-demand cost and no dev-only behaviour.
  // Run `npm run build` first (npm run test:e2e does this for you).
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `node scripts/serve-static.mjs --port ${PORT}`,
        // Probe the base path, not the origin: under a subpath the root is a
        // 404 and Playwright would give up before the server was ever asked
        // for a real page.
        url: `${BASE_URL}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});

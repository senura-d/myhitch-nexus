import { type Page } from "@playwright/test";

/**
 * Next's dev indicator can sit over bottom-anchored controls.
 */
export async function dismissDevOverlay(page: Page) {
  await page
    .addStyleTag({ content: "nextjs-portal{display:none!important}" })
    .catch(() => {});
}

/**
 * Signs in as the seeded demo viewer. The login form ships with valid
 * defaults (see src/app/auth/login/page.tsx), so submitting it as-is is
 * enough — most of the app now redirects guests to /auth/login (Studio,
 * Admin, Business, Account and individual video pages), so tests that touch
 * those areas need a real session first.
 */
export async function login(page: Page) {
  await page.goto("/auth/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((url) => !url.pathname.includes("/auth/login"));
}

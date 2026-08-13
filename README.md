# MYHitch Nexus — front-end prototype

A UI-only build of **MYHitch Nexus**: a centralised video and digital media
platform bringing commercial video, films, education, live streams, corporate
media, documentaries, news and creator content into one ecosystem, with
publishing, discovery, monetisation and cross-platform commerce.

**There is no back end.** Every screen works end to end in the browser against
an in-memory mock API. Nothing persists, nothing is transcoded, and no external
service is contacted.

- **Live demo:** https://senura-d.github.io/myhitch-nexus/
- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · React Query ·
  React Hook Form + Zod · Recharts · Tabler icons · Playwright

---

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static export to `out/` |
| `npm run serve:static` | Serve `out/` on :3100 (what Pages serves) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:e2e` | Build, then run the Playwright suite |
| `npm run test:e2e:only` | Run Playwright against an existing `out/` |

---

## How it is put together

```
src/
  app/                     routes (App Router)
    (public)/              viewer-facing site + account area
    auth/                  login, role-based onboarding, OTP verification
    studio/                Creator Studio
    business/              Business Studio + advertising
    admin/                 Admin console
    tokens.css             the design system's single source of truth
  components/
    ui/                    Button, Input, Modal, DataTable, Stepper, Toast…
    layout/                site header/footer, workspace shell
    video/                 poster art, video cards, rails
    player/                custom player shell + playback engine
    discovery/             shared browse/filter surface
    charts/                shared Recharts theming
  lib/
    mock-api/
      types.ts             the domain model
      data/                seed fixtures (~40 videos, 10 channels, …)
      store.ts             mutable in-memory store + audit recorder
      index.ts             typed async functions — the API contract
      hooks.ts             React Query bindings
```

### The mock API is the contract

Components never import fixtures directly. They call React Query hooks, which
call typed async functions in `lib/mock-api/index.ts`:

```ts
getFeaturedContent()
searchVideos(filters)
getVideo(id)
getChannel(id)
createUploadSession(fileName, sizeBytes)
getEntitlement(userId, videoId)
createCampaign(payload)
getCreatorAnalytics(channelId, range)
actionModerationItem(itemId, action, reason)
```

Going live means replacing those bodies with `fetch()` calls. The signatures and
return types are designed to be the real ones.

Writes land in a mutable store, so journeys join up across screens within a
session: publishing a sponsored video puts it in the admin review queue;
approving it there flips the video to Published and appends to the audit log.
A page reload reseeds from the fixtures.

### Design system

`src/app/tokens.css` holds every colour, radius, shadow and font stack as CSS
custom properties, surfaced to Tailwind as semantic names (`bg-surface-2`,
`text-fg-muted`, `border-border-strong`). Consequences worth knowing:

- **Dark-first.** Viewing surfaces are the heart of the product, so dark is the
  default. Light is opt-in for dashboards, and the player/video/live surfaces
  stay dark in both via `[data-surface="cinema"]`.
- **One accent.** Azure blue owns primary actions only. Status colours are
  always tinted pills, never solid fills, so they cannot be mistaken for a CTA.
  Broadcast red is reserved exclusively for live.
- **No web fonts.** Font stacks resolve locally. `next/font/google` needs to
  reach Google at build time, which makes builds fail-slow behind a firewall.

### Determinism

Mock data must render identically on server and client, so nothing calls
`Math.random()` or `Date.now()` at render time. Analytics series come from a
seeded PRNG keyed by channel and range, and all fixture dates are relative to a
fixed "today" (`NOW` in `lib/mock-api/data/videos.ts`).

---

## What is deliberately faked

Per the brief, these are demonstrated as UI states and nothing more:

| Area | What actually happens |
| --- | --- |
| Uploads | Chunked progress is simulated, including a failure at chunk 17 so the resumable/retry state is real. The file never leaves the page. |
| Playback | A custom shell around `<video>`. With no media file present it falls back to a rAF-driven timeline, so scrubbing, speed and the preview limit all behave. |
| DRM / watermarking | A visible overlay demonstrating the concept. No DRM. |
| Payments | Mock checkout. No gateway, no card capture anywhere. |
| Live streaming | Stream keys and ingest URLs are illustrative. No RTMP/WebRTC. |
| Advertising | No ad server, targeting or measurement. Reach estimates are computed locally. |
| Identity & OTP | The code is always `000000`. No email or SMS is sent. |
| Moderation | Human review queue only. No classification models. |

---

## Tests

`e2e/journey.spec.ts` covers the acceptance journey end to end — discovery,
paywall and geo-restriction, rating and commenting, the six-step upload wizard,
the campaign builder feeding the admin queue, moderation writing to the audit
log, plus heading structure and horizontal-overflow checks. It runs on desktop
and mobile viewports against the static export.

```bash
npm run test:e2e
```

Tests run serially: the export is served by a single-process static server, and
several headless browsers at once saturate it.

---

## Deployment

Pushes to `main` run typecheck, lint, the static export and the Playwright suite
before publishing `out/` to GitHub Pages
(`.github/workflows/deploy.yml`). `basePath` is set automatically when building
in Actions so asset paths resolve under the repository subpath.

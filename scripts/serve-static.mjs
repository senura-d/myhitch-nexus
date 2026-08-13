#!/usr/bin/env node
/**
 * Minimal static file server for the `out/` export.
 *
 * Exists so the Playwright suite (and anyone eyeballing the build) can run
 * against exactly the artifact GitHub Pages serves, rather than the dev
 * server. Deliberately dependency-free — this is a test/preview harness, not
 * production infrastructure.
 *
 *   node scripts/serve-static.mjs [--port 3100] [--dir out]
 */

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const args = process.argv.slice(2);
const readFlag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const PORT = Number(process.env.PORT ?? readFlag("port", "3100"));
const ROOT = resolve(process.cwd(), readFlag("dir", "out"));

/**
 * Must match `basePath` in next.config.ts. On GitHub Pages the site lives
 * under a repository subpath, so the export's HTML asks for
 * /<repo>/_next/... — serving it from the root would 404 every asset and the
 * page would never finish loading.
 */
const BASE_PATH = (
  process.env.NEXT_PUBLIC_BASE_PATH ??
  readFlag("base-path", process.env.GITHUB_ACTIONS === "true" ? "/myhitch-nexus" : "")
).replace(/\/$/, "");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".vtt": "text/vtt",
  ".map": "application/json; charset=utf-8",
};

if (!existsSync(ROOT)) {
  console.error(
    `[serve-static] "${ROOT}" does not exist. Run \`npm run build\` first.`,
  );
  process.exit(1);
}

/** Resolve a URL path to a file inside ROOT, or null if it escapes / is missing. */
function resolveFile(urlPath) {
  let decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);

  // Strip the deployment prefix so `out/` can stay mounted at its own root.
  if (BASE_PATH && decoded.startsWith(BASE_PATH)) {
    decoded = decoded.slice(BASE_PATH.length) || "/";
  }

  const safe = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const target = join(ROOT, safe);

  // Path traversal guard.
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null;

  const candidates = [];
  if (extname(target)) {
    candidates.push(target);
  } else {
    // `trailingSlash: true` exports every route as <route>/index.html.
    candidates.push(join(target, "index.html"), `${target}.html`);
  }

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Pipe a file, tolerating the client hanging up mid-transfer. */
function send(response, file, status, type) {
  response.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": file.includes(`${sep}_next${sep}static${sep}`)
      ? "public, max-age=31536000, immutable"
      : "no-cache",
  });

  const stream = createReadStream(file);
  // A test navigating away aborts in-flight requests. Without these handlers
  // the resulting ECONNRESET/EPIPE becomes an unhandled error and takes the
  // whole server down, which then looks like every later test "hanging".
  stream.on("error", () => response.destroy());
  response.on("close", () => stream.destroy());
  stream.pipe(response);
}

const server = createServer((request, response) => {
  response.on("error", () => response.destroy());

  const file = resolveFile(request.url ?? "/");

  if (!file) {
    const notFound = join(ROOT, "404.html");
    if (existsSync(notFound)) {
      send(response, notFound, 404, MIME[".html"]);
      return;
    }
    response.writeHead(404, { "Content-Type": MIME[".txt"] });
    response.end("Not found");
    return;
  }

  send(
    response,
    file,
    200,
    MIME[extname(file).toLowerCase()] ?? "application/octet-stream",
  );
});

server.on("clientError", (_error, socket) => {
  if (socket.writable) socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

// Keep sockets alive long enough for a parallel Playwright run.
server.keepAliveTimeout = 30_000;
server.headersTimeout = 35_000;

// Failing to bind is fatal — staying alive here would make Playwright wait on
// a server that will never answer. Only per-connection faults are survivable.
server.on("error", (error) => {
  console.error(`[serve-static] ${error.message}`);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("[serve-static] recovered:", error.message);
});

server.listen(PORT, () => {
  console.log(
    `[serve-static] serving ${ROOT} on http://localhost:${PORT}${BASE_PATH || "/"}`,
  );
});

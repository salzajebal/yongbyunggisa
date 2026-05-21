import path from "node:path";
import fs from "node:fs/promises";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { createProxyMiddleware } from "http-proxy-middleware";
import router from "./routes";
import shareRouter from "./routes/share";
import { logger } from "./lib/logger";
import { injectOG, getMetaValues } from "./lib/og";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());

const isDev = process.env.NODE_ENV !== "production";
const VITE_URL = "http://localhost:23849";
const PUBLIC_DIR = path.resolve(
  process.cwd(),
  "artifacts/naver-news/dist/public",
);

function isReservedApiPath(p: string): boolean {
  return p === "/api" || p.startsWith("/api/") || p === "/share" || p.startsWith("/share/");
}

// Body parsers are only needed for our JSON API. Don't parse bodies for
// the SPA proxy/static handler (would break websocket upgrades & file streams).
app.use((req, res, next) => {
  if (!isReservedApiPath(req.path)) return next();
  express.json()(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ extended: true })(req, res, next);
  });
});

app.use("/api", router);
app.use(shareRouter);

async function sendIndexHtml(req: Request, res: Response, next: NextFunction) {
  try {
    const meta = await getMetaValues();
    let html: string;
    if (isDev) {
      const r = await fetch(`${VITE_URL}/`);
      html = await r.text();
    } else {
      html = await fs.readFile(path.join(PUBLIC_DIR, "index.html"), "utf-8");
    }
    const out = injectOG(html, req, meta);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Tell crawlers the resource is dynamic and must always be revalidated.
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    // Last-Modified lets crawlers (incl. Naver Band) detect updates via standard
    // HTTP semantics. We always reply 200 (never 304) so freshly-cached crawlers
    // still get the new content.
    res.setHeader("Last-Modified", meta.updatedAt.toUTCString());
    res.setHeader("ETag", `W/"meta-${meta.updatedAt.getTime()}"`);
    res.setHeader("Vary", "User-Agent");
    res.send(out);
  } catch (err) {
    next(err);
  }
}

if (isDev) {
  // Intercept root + index.html to inject dynamic OG tags
  app.get(["/", "/index.html"], sendIndexHtml);

  // Proxy everything else (Vite HMR, assets, /src/...) to the Vite dev server
  const viteProxy = createProxyMiddleware({
    target: VITE_URL,
    changeOrigin: true,
    ws: true,
    logger: undefined,
  });
  app.use((req, res, next) => {
    if (isReservedApiPath(req.path)) return next();
    return viteProxy(req, res, next);
  });
} else {
  // Production: serve built static files; index.html always goes through OG injection
  app.get(["/", "/index.html"], sendIndexHtml);
  app.use(express.static(PUBLIC_DIR, { index: false }));
  // SPA fallback for client-side routes
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    if (isReservedApiPath(req.path)) return next();
    sendIndexHtml(req, res, next);
  });
}

export default app;

import { Router, type IRouter } from "express";
import { getMetaValues } from "../lib/og";

const router: IRouter = Router();

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

router.get("/share", async (req, res) => {
  try {
    const meta = await getMetaValues();

    const title = meta.title;
    const description = meta.description;
    const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "";
    const origin = `${proto}://${host}`;
    const articleUrl = `${origin}/`;
    const shareUrl = `${origin}/share`;

    // og:image must be absolute https URL (required by Naver Band & strict crawlers).
    let absoluteImage = meta.image;
    if (absoluteImage && !/^https?:\/\//i.test(absoluteImage)) {
      absoluteImage = absoluteImage.startsWith("//")
        ? `https:${absoluteImage}`
        : absoluteImage.startsWith("/")
          ? `${origin}${absoluteImage}`
          : `${origin}/${absoluteImage}`;
    }
    const image = absoluteImage
      ? `${absoluteImage}${absoluteImage.includes("?") ? "&" : "?"}v=${meta.updatedAt.getTime()}`
      : "";

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)} : 네이버 뉴스</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:site_name" content="네이버 뉴스" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ""}
<meta property="og:url" content="${escapeHtml(shareUrl)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ""}
<link rel="canonical" href="${escapeHtml(articleUrl)}" />
<meta http-equiv="refresh" content="0; url=${escapeHtml(articleUrl)}" />
<script>window.location.replace(${JSON.stringify(articleUrl)});</script>
</head>
<body style="font-family:sans-serif;text-align:center;padding:40px;color:#333">
<p>기사 페이지로 이동 중입니다...</p>
<p><a href="${escapeHtml(articleUrl)}">자동으로 이동하지 않으면 여기를 클릭하세요</a></p>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Last-Modified", meta.updatedAt.toUTCString());
    res.setHeader("ETag", `W/"meta-${meta.updatedAt.getTime()}"`);
    res.setHeader("Vary", "User-Agent");
    res.send(html);
  } catch (err) {
    req.log.error({ err }, "Failed to render share page");
    res.status(500).send("Failed to render share page");
  }
});

export default router;

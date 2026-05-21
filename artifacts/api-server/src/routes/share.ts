import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { articleTable } from "@workspace/db/schema";

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
    const rows = await db.select().from(articleTable).limit(1);
    const article = rows[0];

    const title = article?.metaTitle?.trim() || article?.title || "네이버 뉴스";
    const description =
      article?.metaDescription?.trim() ||
      "네이버 뉴스에서 더 많은 기사를 확인하세요.";
    const image =
      article?.metaImage?.trim() ||
      article?.imageUrl ||
      "";

    const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "";
    const articleUrl = `${proto}://${host}/`;
    const shareUrl = `${proto}://${host}/share`;

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
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.send(html);
  } catch (err) {
    req.log.error({ err }, "Failed to render share page");
    res.status(500).send("Failed to render share page");
  }
});

export default router;

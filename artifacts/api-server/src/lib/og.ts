import type { Request } from "express";
import { db } from "@workspace/db";
import { articleTable } from "@workspace/db/schema";

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function getMetaValues() {
  const rows = await db.select().from(articleTable).limit(1);
  const a = rows[0];
  return {
    title: a?.metaTitle?.trim() || a?.title || "네이버 뉴스",
    description:
      a?.metaDescription?.trim() ||
      "네이버 뉴스에서 더 많은 기사를 확인하세요.",
    image: a?.metaImage?.trim() || a?.imageUrl || "",
  };
}

export async function injectOG(html: string, req: Request): Promise<string> {
  const m = await getMetaValues();
  const proto =
    (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const url = `${proto}://${host}/`;

  const tags = [
    `<title>${escapeAttr(m.title)} : 네이버 뉴스</title>`,
    `<meta name="description" content="${escapeAttr(m.description)}" />`,
    `<meta property="og:site_name" content="네이버 뉴스" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escapeAttr(m.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(m.description)}" />`,
    m.image
      ? `<meta property="og:image" content="${escapeAttr(m.image)}" />`
      : "",
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(m.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(m.description)}" />`,
    m.image
      ? `<meta name="twitter:image" content="${escapeAttr(m.image)}" />`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  const stripped = html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(
      /<meta\s+(?:property|name)=["'](?:og:[^"']+|twitter:[^"']+|description)["'][^>]*\/?>\s*/gi,
      "",
    );

  return stripped.replace(/<\/head>/i, `    ${tags}\n  </head>`);
}

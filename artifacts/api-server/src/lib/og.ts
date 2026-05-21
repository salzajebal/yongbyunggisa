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

function withCacheBuster(url: string, version: string | number): string {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(String(version))}`;
}

function toAbsoluteUrl(url: string, origin: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${origin}${url}`;
  return `${origin}/${url}`;
}

export type MetaValues = {
  title: string;
  description: string;
  image: string;
  updatedAt: Date;
};

export async function getMetaValues(): Promise<MetaValues> {
  const rows = await db.select().from(articleTable).limit(1);
  const a = rows[0];
  return {
    title: a?.metaTitle?.trim() || a?.title || "네이버 뉴스",
    description:
      a?.metaDescription?.trim() ||
      "네이버 뉴스에서 더 많은 기사를 확인하세요.",
    image: a?.metaImage?.trim() || a?.imageUrl || "",
    updatedAt: a?.updatedAt ? new Date(a.updatedAt) : new Date(0),
  };
}

export function injectOG(html: string, req: Request, m: MetaValues): string {
  const proto =
    (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const origin = `${proto}://${host}`;
  const url = `${origin}/`;
  // Crawlers (especially Naver Band) REQUIRE absolute https URLs for og:image.
  // Also append cache-buster so they treat it as a fresh image on meta updates.
  const absoluteImage = m.image ? toAbsoluteUrl(m.image, origin) : "";
  const versionedImage = absoluteImage
    ? withCacheBuster(absoluteImage, m.updatedAt.getTime())
    : "";

  const tags = [
    `<title>${escapeAttr(m.title)} : 네이버 뉴스</title>`,
    `<meta name="description" content="${escapeAttr(m.description)}" />`,
    `<meta property="og:site_name" content="네이버 뉴스" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escapeAttr(m.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(m.description)}" />`,
    versionedImage
      ? `<meta property="og:image" content="${escapeAttr(versionedImage)}" />`
      : "",
    versionedImage
      ? `<meta property="og:image:secure_url" content="${escapeAttr(versionedImage)}" />`
      : "",
    versionedImage ? `<meta property="og:image:width" content="1200" />` : "",
    versionedImage ? `<meta property="og:image:height" content="630" />` : "",
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    `<meta property="og:updated_time" content="${m.updatedAt.toISOString()}" />`,
    `<meta property="article:modified_time" content="${m.updatedAt.toISOString()}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(m.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(m.description)}" />`,
    versionedImage
      ? `<meta name="twitter:image" content="${escapeAttr(versionedImage)}" />`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  const stripped = html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(
      /<meta\s+(?:property|name)=["'](?:og:[^"']+|twitter:[^"']+|description|article:[^"']+)["'][^>]*\/?>\s*/gi,
      "",
    );

  return stripped.replace(/<\/head>/i, `    ${tags}\n  </head>`);
}

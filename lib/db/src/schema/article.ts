import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const articleTable = pgTable("article", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull().default("[]"),
  imageUrl: text("image_url").notNull().default(""),
  imageLink: text("image_link").default(""),
  imageCaption: text("image_caption").default(""),
  metaImage: text("meta_image").default(""),
  viewCount: integer("view_count").notNull().default(0),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const updateArticleSchema = z.object({
  title: z.string().optional(),
  body: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  imageLink: z.string().optional(),
  imageCaption: z.string().optional(),
  metaImage: z.string().optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Article = typeof articleTable.$inferSelect;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;

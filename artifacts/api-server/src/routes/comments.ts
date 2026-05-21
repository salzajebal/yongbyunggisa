import { Router } from "express";
import { db } from "@workspace/db";
import { commentsTable, insertCommentSchema } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "naver2026";

function requireAdmin(req: any, res: any, next: any) {
  const auth = req.headers["x-admin-password"];
  if (auth !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.get("/comments", async (req, res) => {
  try {
    const comments = await db
      .select()
      .from(commentsTable)
      .orderBy(desc(commentsTable.createdAt));
    res.json(comments);
  } catch (err) {
    req.log.error({ err }, "Failed to get comments");
    res.status(500).json({ error: "Failed to get comments" });
  }
});

router.post("/comments", requireAdmin, async (req, res) => {
  try {
    const parsed = insertCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data", issues: parsed.error.issues });
      return;
    }
    const [comment] = await db
      .insert(commentsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(comment);
  } catch (err) {
    req.log.error({ err }, "Failed to create comment");
    res.status(500).json({ error: "Failed to create comment" });
  }
});

router.patch("/comments/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const body = (req.body ?? {}) as { username?: string; content?: string; likes?: number; dislikes?: number; createdAt?: string };
    const updates: Record<string, unknown> = {};
    if (typeof body.username === "string") updates.username = body.username;
    if (typeof body.content === "string") updates.content = body.content;
    if (typeof body.likes === "number") updates.likes = body.likes;
    if (typeof body.dislikes === "number") updates.dislikes = body.dislikes;
    if (typeof body.createdAt === "string") {
      const d = new Date(body.createdAt);
      if (isNaN(d.getTime())) { res.status(400).json({ error: "Invalid createdAt" }); return; }
      updates.createdAt = d;
    }
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }
    const [updated] = await db
      .update(commentsTable)
      .set(updates)
      .where(eq(commentsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update comment");
    res.status(500).json({ error: "Failed to update comment" });
  }
});

router.delete("/comments/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(commentsTable).where(eq(commentsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete comment");
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;

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

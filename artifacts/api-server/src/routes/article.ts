import { Router } from "express";
import { db } from "@workspace/db";
import { articleTable, updateArticleSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

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

const DEFAULT_BODY = JSON.stringify([
  "삼성전자 노사가 총파업을 하루 앞두고 진행한 막판 협상에서 끝내 합의에 이르지 못했다. 삼성전자는 \"노조의 과도한 요구를 수용할 경우 회사 경영의 기본 원칙이 흔들릴 수 있다\"며 강경한 입장을 내놨다.",
  "삼성전자는 20일 입장문에서 \"사후 조정 종료를 매우 안타깝게 생각한다\"며 \"최악의 상황을 막기 위해 마지막 순간까지 대화를 이어가겠다\"고 밝혔다.",
  "이어 \"어떠한 경우에도 파업은 없어야 한다\"며 \"막판까지 합의가 이뤄지지 못한 것은 노동조합 요구를 그대로 수용할 경우 회사 경영의 기본 원칙이 흔들릴 수 있다는 판단 때문\"이라고 설명했다.",
  "특히 삼성전자는 노조 측 성과급 요구와 관련해 \"회사가 성과급 규모와 내용 대부분을 수용했음에도 노조는 적자 사업부에도 사회적으로 용납되기 어려운 수준의 보상을 요구하고 있다\"고 주장했다.",
  "삼성전자 관계자는 \"막판까지 가장 큰 쟁점은 적자 사업부 배분과 성과급 지급 규모였다\"며 \"회사는 흑자 전환 시 지급하거나 적자 사업부의 경우 연봉 상한 50% 수준에서 지급해야 한다는 입장을 유지해왔다\"고 말했다.",
  "이어 \"사업부·부문별 비율이 회사 요구대로 반영되더라도 전체 재원이 영업이익의 10% 이상으로 커질 경우 일부 사업부에서는 수억원대 성과급이 지급될 수밖에 없다\"며 \"이는 '성과 있는 곳에 보상이 있다'는 성과주의 원칙과 배치된다는 판단\"이라고 설명했다.",
  "삼성전자는 \"'성과 있는 곳에 보상이 있다'는 회사 경영 원칙을 포기할 경우 삼성전자뿐 아니라 다른 기업과 산업 전반에도 악영향을 줄 수 있다고 판단했다\"고 강조했다.",
  "다만 회사 측은 추가 협상 가능성은 열어뒀다. 삼성전자는 \"추가 조정이나 노조와의 직접 대화를 통해 마지막까지 문제 해결 노력을 이어갈 것\"이라며 \"그동안 노력해 준 정부에도 감사드리며 지속적인 관심을 부탁한다\"고 밝혔다.",
]);

async function getOrCreateArticle() {
  const rows = await db.select().from(articleTable).limit(1);
  if (rows.length > 0) return rows[0];

  const [created] = await db
    .insert(articleTable)
    .values({
      title: '삼전 "적자 사업부 수억 성과급 수용 못해"…노조 "내일 총파업"',
      body: DEFAULT_BODY,
      imageUrl:
        "https://imgnews.pstatic.net/image/025/2026/05/20/0003524574_001_20260520164015416.jpg?type=w860",
      imageLink: "",
      imageCaption:
        "삼성그룹 초기업노동조합 삼성전자지부 최승호 위원장(왼쪽)과 삼성전자 사측 대표교섭위원인 여명구 DS(디바이스솔루션·반도체 사업 담당) 피플팀장이 20일 정부세종청사 중앙노동위원회에서 총파업 예고 시점을 하루 앞두고 열린 3차 사후조정 회의에 각각 들어가고 있는 모습. 연합뉴스",
      metaImage:
        "https://imgnews.pstatic.net/image/025/2026/05/20/0003524574_001_20260520164015416.jpg?type=w860",
      viewCount: 0,
    })
    .returning();
  return created;
}

router.get("/article", async (req, res) => {
  try {
    const article = await getOrCreateArticle();
    await db
      .update(articleTable)
      .set({ viewCount: article.viewCount + 1 })
      .where(eq(articleTable.id, article.id));

    const parsed = {
      ...article,
      body: JSON.parse(article.body) as string[],
      viewCount: article.viewCount + 1,
    };
    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Failed to get article");
    res.status(500).json({ error: "Failed to get article" });
  }
});

router.put("/article", requireAdmin, async (req, res) => {
  try {
    const parsed = updateArticleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data", issues: parsed.error.issues });
      return;
    }

    const article = await getOrCreateArticle();
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (parsed.data.title !== undefined) updates.title = parsed.data.title;
    if (parsed.data.imageUrl !== undefined) updates.imageUrl = parsed.data.imageUrl;
    if (parsed.data.imageLink !== undefined) updates.imageLink = parsed.data.imageLink;
    if (parsed.data.imageCaption !== undefined) updates.imageCaption = parsed.data.imageCaption;
    if (parsed.data.metaImage !== undefined) updates.metaImage = parsed.data.metaImage;
    if (parsed.data.body !== undefined) updates.body = JSON.stringify(parsed.data.body);

    const [updated] = await db
      .update(articleTable)
      .set(updates)
      .where(eq(articleTable.id, article.id))
      .returning();

    res.json({ ...updated, body: JSON.parse(updated.body) });
  } catch (err) {
    req.log.error({ err }, "Failed to update article");
    res.status(500).json({ error: "Failed to update article" });
  }
});

router.post("/article/reset-views", requireAdmin, async (req, res) => {
  try {
    const article = await getOrCreateArticle();
    await db
      .update(articleTable)
      .set({ viewCount: 0 })
      .where(eq(articleTable.id, article.id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to reset views");
    res.status(500).json({ error: "Failed to reset views" });
  }
});

router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password?: string };
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: "Wrong password" });
  }
});

export default router;

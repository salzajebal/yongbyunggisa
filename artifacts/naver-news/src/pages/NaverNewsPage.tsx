import { useState, useEffect } from "react";

const JOONGANG_LOGO =
  "https://mimgnews.pstatic.net/image/upload/office_logo/025/2025/03/07/logo_025_100_20250307145712.png";

const navTabs = [
  { label: "주요뉴스", href: "https://news.naver.com/" },
  { label: "프리미엄", href: "https://news.naver.com/premium/" },
  { label: "이슈", href: "https://news.naver.com/" },
  { label: "클립", href: "https://news.naver.com/now/" },
  { label: "지면", href: "https://news.naver.com/paper/" },
  { label: "정치", href: "https://news.naver.com/section/100" },
  { label: "경제", href: "https://news.naver.com/section/101" },
  { label: "사회", href: "https://news.naver.com/section/102" },
  { label: "생활", href: "https://news.naver.com/section/103" },
  { label: "세계", href: "https://news.naver.com/section/104" },
  { label: "IT", href: "https://news.naver.com/section/105" },
  { label: "사/칼럼", href: "https://news.naver.com/opinion/" },
  { label: "신문보기", href: "https://news.naver.com/paper/" },
  { label: "랭킹", href: "https://news.naver.com/ranking/" },
  { label: "MY", href: "https://news.naver.com/" },
];

const rankingNews = [
  { rank: 1, img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524642.jpg?type=nf284_284", title: "눈 마주치면 무려 치고, 5년간 보복...", badge: null, href: "https://n.news.naver.com/article/025/0003524642" },
  { rank: 2, img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524640.jpg?type=nf284_284", title: "하정우 35 박민식 20 한동훈 31...단일...", badge: null, href: "https://n.news.naver.com/article/025/0003524640" },
  { rank: 3, img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524600.jpg?type=nf284_284", title: "'탱크 텀블러' 든 전두환...'스벅 돈 탈내...", badge: null, href: "https://n.news.naver.com/article/025/0003524600" },
  { rank: 4, img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524574.jpg?type=nf284_284", title: "삼전 특별성과급 전액 자사주로 준다...", badge: "1:34", href: "https://n.news.naver.com/article/025/0003524574" },
  { rank: 5, img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524560.jpg?type=nf284_284", title: '"커피는 스벅"…尹탄핵 반대 배우 최준...', badge: null, href: "https://n.news.naver.com/article/025/0003524560" },
  { rank: 6, img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524530.jpg?type=nf284_284", title: '"임신 몰랐다"더 나니...\'모텔 출산 후...', badge: null, href: "https://n.news.naver.com/article/025/0003524530" },
];

const otherSources = [
  { name: "노컷뉴스", color: "#e81111", href: "https://media.naver.com/press/079" },
  { name: "SBS", color: "#1a6de8", href: "https://media.naver.com/press/055" },
  { name: "파이낸셜뉴스", color: "#e8a011", href: "https://media.naver.com/press/014" },
  { name: "아시아경제", color: "#e87211", href: "https://media.naver.com/press/277" },
  { name: "비즈워치", color: "#1176e8", href: "https://media.naver.com/press/648" },
  { name: "중앙일보", color: "#e81111", href: "https://media.naver.com/press/025" },
  { name: "이데일리", color: "#e87211", href: "https://media.naver.com/press/018" },
  { name: "YTN", color: "#e81111", href: "https://media.naver.com/press/052" },
];

const relatedArticles = [
  { title: "한동훈, 일진과 맞짱…'금목걸이 장발' 서울대 뒤집다", href: "https://www.joongang.co.kr/article/25429794" },
  { title: "27만원→101만원 됐다…삼전 제친 '新황제주' 정체", href: "https://www.joongang.co.kr/article/25429795" },
  { title: "내신 9등급도 의사 된다? 대치맘이 유학 보낸 곳", href: "https://www.joongang.co.kr/article/25429798" },
  { title: "50대 남녀 '기내 성관계'…아이가 보고 한 일 깜짝", href: "https://www.joongang.co.kr/article/25428229" },
  { title: '"입주민끼리 결혼" 그 강남 아파트 발칵…이번엔 뭔일', href: "https://www.joongang.co.kr/article/25429235" },
];

const issues = [
  { tag: "3대 특검", title: "김건희 \"쥴리 의혹 충격에 6년째 정신병…'쥴' 자도 사용한 적 없다\"", img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/20/3524624.jpg?type=nfs284_284", href: "https://media.naver.com/issue/025/1721" },
  { tag: "6·3 지방선거", title: '"우상호 돼야 기업유치" "지역 일꾼은 김진태"…강원민심 팽팽', img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/20/3524491.jpg?type=nfs284_284", href: "https://media.naver.com/issue/025/2671" },
  { tag: "美·이란 전쟁", title: "美, 이란 공습 재개 보류 속 금융망·선박 대규모 제재", img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/20/3524479.jpg?type=nfs284_284", href: "https://media.naver.com/issue/025/2674" },
  { tag: "쿠팡 개인정보 유출", title: "법원, 쿠팡 김범석 동일인 지정 제동…공정위 결정 효력 정지", img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/15/3523617.jpg?type=nfs284_284", href: "https://media.naver.com/issue/025/2176" },
  { tag: "트럼프발 관세전쟁", title: "美항소법원, '10% 글로벌 관세' 무효 판결 효력 '일시 정지'", img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/13/3522855.jpg?type=nfs284_284", href: "https://media.naver.com/issue/025/1182" },
];

const reactionDefs = [
  { label: "쏠쏠정보", count: 135 },
  { label: "흥미진진", count: 3 },
  { label: "공감백배", count: 491 },
  { label: "분석탁월", count: 2 },
  { label: "후속강추", count: 25 },
];

const COMMENTS_PER_PAGE = 5;

const commentDemographics = {
  gender: { male: 81, female: 19 },
  age: [
    { label: "10대", pct: 0 }, { label: "20대", pct: 1 }, { label: "30대", pct: 7 },
    { label: "40대", pct: 23 }, { label: "50대", pct: 36 }, { label: "60대", pct: 27 }, { label: "70대↑", pct: 6 },
  ],
};

interface Article {
  title: string;
  body: string[];
  imageUrl: string;
  imageLink: string;
  imageCaption: string;
  metaImage: string;
  viewCount: number;
}

interface Comment {
  id: number;
  username: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function NaverNewsPage() {
  const [activeReaction, setActiveReaction] = useState<number | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);

  useEffect(() => {
    async function load() {
      try {
        const [artRes, comRes] = await Promise.all([
          fetch("/api/article"),
          fetch("/api/comments"),
        ]);
        if (artRes.ok) {
          const art = await artRes.json() as Article;
          setArticle(art);
          // Update meta tags dynamically
          if (art.metaImage) {
            let ogImg = document.querySelector('meta[property="og:image"]');
            if (!ogImg) {
              ogImg = document.createElement("meta");
              ogImg.setAttribute("property", "og:image");
              document.head.appendChild(ogImg);
            }
            ogImg.setAttribute("content", art.metaImage);
          }
        }
        if (comRes.ok) setComments(await comRes.json() as Comment[]);
      } catch (_) {
        // fallback - keep loading state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const title = article?.title ?? '삼전 "적자 사업부 수억 성과급 수용 못해"…노조 "내일 총파업"';
  const body = article?.body ?? [];
  const imageUrl = article?.imageUrl ?? "https://imgnews.pstatic.net/image/025/2026/05/20/0003524574_001_20260520164015416.jpg?type=w860";
  const imageLink = article?.imageLink ?? "";
  const imageCaption = article?.imageCaption ?? "삼성그룹 초기업노동조합 삼성전자지부 최승호 위원장(왼쪽)과 삼성전자 사측 대표교섭위원인 여명구 DS(디바이스솔루션·반도체 사업 담당) 피플팀장이 20일 정부세종청사 중앙노동위원회에서 총파업 예고 시점을 하루 앞두고 열린 3차 사후조정 회의에 각각 들어가고 있는 모습. 연합뉴스";
  const viewCount = article?.viewCount ?? 0;

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #e5e5e5", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", maxWidth: 1200, margin: "0 auto" }}>
          <a href="https://news.naver.com/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 24, height: 24, backgroundColor: "#03c75a", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 15, fontFamily: "Arial, sans-serif" }}>N</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>뉴스</span>
          </a>
          <a href="https://media.naver.com/press/025" target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", textDecoration: "none" }}>중앙일보</a>
          <a href="https://media.naver.com/press/025" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#1a1a1a", border: "1px solid #ccc", borderRadius: 3, padding: "4px 10px", backgroundColor: "#fff", textDecoration: "none" }}>
            +구독
          </a>
        </div>
        <nav style={{ borderTop: "1px solid #e5e5e5" }}>
          <div style={{ display: "flex", justifyContent: "center", overflowX: "auto", whiteSpace: "nowrap", padding: "0 20px" }}>
            {navTabs.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", padding: "10px 14px", fontSize: 14, color: label === "경제" ? "#1a1a1a" : "#595959", fontWeight: label === "경제" ? 700 : 400, borderBottom: label === "경제" ? "2px solid #1a1a1a" : "2px solid transparent", textDecoration: "none", flexShrink: 0 }}>
                {label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", gap: 30, alignItems: "flex-start" }}>
        {/* Main article */}
        <main style={{ flex: "1 1 0", minWidth: 0, paddingTop: 20 }}>
          {loading ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#9ca3af", fontSize: 15 }}>불러오는 중...</div>
          ) : (
            <>
              {/* Source + PICK */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={JOONGANG_LOGO} alt="중앙일보" style={{ height: 20, objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <span style={{ fontSize: 14, color: "#1a1a1a", fontWeight: 600 }}>중앙일보</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", backgroundColor: "#1a1a1a", padding: "2px 6px", borderRadius: 2, fontStyle: "italic" }}>PiCK</span>
                  <span style={{ color: "#999", fontSize: 14 }}>ⓘ</span>
                </div>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, marginBottom: 14, letterSpacing: -0.5 }}>
                {title}
              </h1>

              {/* Meta */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#595959" }}><em>입력</em> 2026.05.20. 오전 11:52</span>
                <span style={{ color: "#ccc" }}>·</span>
                <span style={{ fontSize: 13, color: "#595959" }}><em>수정</em> 2026.05.20. 오후 4:40</span>
                <a href="https://www.joongang.co.kr/article/25429880" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#1a1a1a", border: "1px solid #ccc", borderRadius: 2, padding: "1px 6px", marginLeft: 4 }}>기사원문</a>
              </div>

              {/* Reactions + actions row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 4, border: "1px solid #e5e5e5", borderRadius: 20, padding: "4px 12px", background: "#fff", cursor: "pointer", fontSize: 13, color: "#1a1a1a" }}>
                  <span>😊</span><span style={{ fontWeight: 600 }}>656</span>
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#595959" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#595959", display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: 12 }}>가</span><span style={{ fontSize: 10 }}>▼</span>
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#595959" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#595959" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                  </button>
                </div>
                {/* View count */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 13, color: "#595959", display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    {viewCount.toLocaleString("ko-KR")}
                  </span>
                  <a href="#comments" style={{ fontSize: 13, color: "#595959", display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    {comments.length > 0 ? comments.length.toLocaleString("ko-KR") : "1,494"}
                  </a>
                </div>
              </div>

              {/* Article image */}
              <div style={{ marginBottom: 20 }}>
                {imageLink ? (
                  <a href={imageLink} target="_blank" rel="noopener noreferrer">
                    <img src={imageUrl} alt="기사 이미지" style={{ width: "100%", display: "block", borderRadius: 2, cursor: "pointer" }} onError={(e) => { e.currentTarget.style.backgroundColor = "#f0f0f0"; e.currentTarget.style.height = "400px"; }} />
                  </a>
                ) : (
                  <img src={imageUrl} alt="기사 이미지" style={{ width: "100%", display: "block", borderRadius: 2 }} onError={(e) => { e.currentTarget.style.backgroundColor = "#f0f0f0"; e.currentTarget.style.height = "400px"; }} />
                )}
                {imageCaption && (
                  <p style={{ fontSize: 12, color: "#595959", marginTop: 8, lineHeight: 1.5 }}>{imageCaption}</p>
                )}
              </div>

              {/* Body */}
              <div style={{ fontSize: 17, lineHeight: 1.8, color: "#1a1a1a", marginBottom: 30 }}>
                {body.map((para, i) => (
                  <p key={i} style={{ marginBottom: 20 }}>{para}</p>
                ))}
              </div>

              {/* Copyright */}
              <div style={{ fontSize: 13, color: "#595959", marginBottom: 24, borderTop: "1px solid #e5e5e5", paddingTop: 16 }}>
                Copyright ⓒ 중앙일보. All rights reserved. 무단 전재 및 재배포 금지.
              </div>

              {/* Section tag */}
              <div style={{ fontSize: 13, color: "#595959", marginBottom: 30 }}>
                이 기사는 언론사에서 <strong>경제</strong> 섹션으로 분류했습니다.
              </div>

              {/* Publisher block */}
              <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, padding: 20, marginBottom: 30, display: "flex", alignItems: "center", gap: 16 }}>
                <img src={JOONGANG_LOGO} alt="중앙일보" style={{ height: 28, objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>중앙일보 구독하고</div>
                  <div style={{ fontSize: 13, color: "#595959" }}>메인에서 바로 만나보세요!</div>
                </div>
                <a href="https://media.naver.com/press/025" target="_blank" rel="noopener noreferrer" style={{ border: "1px solid #1a1a1a", borderRadius: 3, padding: "6px 16px", background: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", color: "#1a1a1a" }}>구독</a>
                <a href="https://media.naver.com/press/025" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#595959" }}>언론사홈</a>
              </div>

              {/* Related articles */}
              <div style={{ marginBottom: 30 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>중앙일보 주요뉴스</div>
                {relatedArticles.map((item, i) => (
                  <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 0", borderBottom: "1px solid #f0f0f0", color: "#1a1a1a", fontSize: 14, lineHeight: 1.5, textDecoration: "none" }}>
                    <span style={{ color: "#999", minWidth: 16 }}>·</span><span style={{ flex: 1 }}>{item.title}</span>
                  </a>
                ))}
              </div>

              {/* Issues */}
              <div style={{ marginBottom: 30 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>중앙일보 언론사가 직접 선정한 이슈</div>
                {issues.map((issue, i) => (
                  <a key={i} href={issue.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderBottom: "1px solid #f0f0f0", color: "#1a1a1a", textDecoration: "none" }}>
                    <img src={issue.img} alt={issue.title} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 2, flexShrink: 0 }} onError={(e) => { e.currentTarget.style.backgroundColor = "#f0f0f0"; }} />
                    <div>
                      <div style={{ fontSize: 12, color: "#595959", marginBottom: 4 }}>이슈 <strong style={{ color: "#1a1a1a" }}>{issue.tag}</strong></div>
                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{issue.title}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Reactions */}
              <div style={{ marginBottom: 30 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>이 기사를 추천합니다</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {reactionDefs.map((r, i) => (
                    <button key={i} onClick={() => setActiveReaction(activeReaction === i ? null : i)}
                      style={{ display: "flex", alignItems: "center", gap: 6, border: activeReaction === i ? "1px solid #1a1a1a" : "1px solid #e5e5e5", borderRadius: 20, padding: "6px 14px", background: activeReaction === i ? "#f5f5f5" : "#fff", cursor: "pointer", fontSize: 13 }}>
                      <span>{r.label}</span><span style={{ fontWeight: 600, color: "#595959" }}>{r.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div id="comments" style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>댓글</span>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{comments.length > 0 ? comments.length.toLocaleString("ko-KR") : "1,494"}</span>
                </div>

                {/* Comment stats */}
                <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>댓글 상세 현황</div>
                  <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
                    <div><div style={{ fontSize: 12, color: "#595959" }}>현재 댓글</div><div style={{ fontSize: 16, fontWeight: 700 }}>{comments.length > 0 ? comments.length : 1339}</div></div>
                    <div><div style={{ fontSize: 12, color: "#595959" }}>작성자 삭제</div><div style={{ fontSize: 16, fontWeight: 700 }}>155</div></div>
                    <div><div style={{ fontSize: 12, color: "#595959" }}>규정 미준수</div><div style={{ fontSize: 16, fontWeight: 700 }}>0</div></div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", borderRadius: 3, overflow: "hidden", height: 20, marginBottom: 6 }}>
                      <div style={{ width: `${commentDemographics.gender.male}%`, backgroundColor: "#4a90d9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{commentDemographics.gender.male}%</span>
                      </div>
                      <div style={{ width: `${commentDemographics.gender.female}%`, backgroundColor: "#e87db0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{commentDemographics.gender.female}%</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#595959" }}><span>남자</span><span>여자</span></div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                    {commentDemographics.age.map((a, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 10, color: "#595959" }}>{a.pct}%</span>
                        <div style={{ width: "100%", height: Math.max(a.pct * 2.5, 3), backgroundColor: a.label === "50대" ? "#e87211" : "#c5d8f0", borderRadius: 2 }} />
                        <span style={{ fontSize: 10, color: "#595959", whiteSpace: "nowrap" }}>{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comment input */}
                <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, padding: 14, marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>댓글 입력</div>
                  <div style={{ backgroundColor: "#f9f9f9", border: "1px solid #e5e5e5", borderRadius: 3, padding: 12, fontSize: 13, color: "#999", marginBottom: 10, minHeight: 80 }}>
                    댓글을 작성하려면 로그인 해주세요
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#999" }}>현재 입력한 글자수 <strong>0</strong>/전체 입력 가능한 글자수 300</span>
                    <button style={{ backgroundColor: "#1a1a1a", color: "#fff", border: "none", borderRadius: 3, padding: "6px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>등록</button>
                  </div>
                </div>

                {/* Sort */}
                <div style={{ display: "flex", gap: 14, marginBottom: 20, borderBottom: "1px solid #e5e5e5", paddingBottom: 12 }}>
                  {["순공감순", "최신순", "과거순"].map((opt, i) => (
                    <button key={opt} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: i === 0 ? "#1a1a1a" : "#999", fontWeight: i === 0 ? 700 : 400, padding: 0 }}>{opt}</button>
                  ))}
                </div>

                {/* Comments list */}
                {comments.length > 0 ? (
                  comments.slice(0, visibleCount).map((c) => (
                    <div key={c.id} style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#999" }}>👤</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{c.username}</div>
                          <div style={{ fontSize: 12, color: "#999" }}>{timeAgo(c.createdAt)}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10, paddingLeft: 40 }}>{c.content}</p>
                      <div style={{ display: "flex", gap: 12, paddingLeft: 40 }}>
                        <button style={{ background: "none", border: "1px solid #e5e5e5", borderRadius: 3, padding: "3px 10px", fontSize: 12, cursor: "pointer", color: "#595959" }}>👍 {c.likes}</button>
                        <button style={{ background: "none", border: "1px solid #e5e5e5", borderRadius: 3, padding: "3px 10px", fontSize: 12, cursor: "pointer", color: "#595959" }}>👎 {c.dislikes}</button>
                        <button style={{ background: "none", border: "none", fontSize: 12, cursor: "pointer", color: "#999" }}>답글 쓰기</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "30px 0", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                    아직 등록된 댓글이 없습니다.
                  </div>
                )}

                {comments.length > visibleCount && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + COMMENTS_PER_PAGE)}
                    style={{ width: "100%", padding: "12px 0", border: "1px solid #e5e5e5", borderRadius: 4, background: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600, marginTop: 10 }}
                  >
                    댓글 더보기 ({comments.length - visibleCount}개 남음)
                  </button>
                )}
                {comments.length > 0 && comments.length <= visibleCount && (
                  <div style={{ textAlign: "center", padding: "16px 0", fontSize: 13, color: "#9ca3af" }}>
                    모든 댓글을 불러왔습니다.
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* Sidebar */}
        <aside style={{ width: 300, flexShrink: 0, paddingTop: 20, position: "sticky", top: 90, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div><span style={{ fontWeight: 700, fontSize: 14 }}>중앙일보</span><span style={{ fontSize: 14, marginLeft: 4 }}>많이 본 뉴스</span></div>
              <span style={{ fontSize: 11, color: "#999" }}>오전 10시~11시까지 집계된 결과입니다.</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {rankingNews.map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", position: "relative", borderBottom: i < 4 ? "1px solid #e5e5e5" : "none", borderRight: i % 2 === 0 ? "1px solid #e5e5e5" : "none" }}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} onError={(e) => { e.currentTarget.style.backgroundColor = "#f0f0f0"; (e.currentTarget as HTMLImageElement).style.height = "142px"; }} />
                  <div style={{ position: "absolute", top: 6, left: 6, backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", fontWeight: 900, fontSize: 15, width: 24, height: 24, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.rank}</div>
                  {item.badge && <div style={{ position: "absolute", bottom: 32, right: 6, backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, padding: "2px 5px", borderRadius: 2 }}>{item.badge}</div>}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.75))", padding: "20px 8px 8px" }}>
                    <p style={{ fontSize: 12, color: "#fff", lineHeight: 1.4, margin: 0 }}>{item.title}</p>
                  </div>
                </a>
              ))}
            </div>
            <a href="https://news.naver.com/ranking/" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "10px", fontSize: 13, color: "#595959", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa", textDecoration: "none" }}>랭킹 뉴스 더보기</a>
          </div>

          <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, marginBottom: 16, padding: 14, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 40, height: 40, flexShrink: 0, backgroundColor: "#e8f4ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
            <div><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>네이버 AI 뉴스 알고리즘</div><div style={{ fontSize: 12, color: "#595959" }}>뉴스 추천 알고리즘이 궁금하다면?</div></div>
          </div>

          <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5e5e5" }}><span style={{ fontWeight: 700, fontSize: 14 }}>다른 언론사 보기</span></div>
            <div style={{ padding: "8px 14px" }}>
              {otherSources.map((src, i) => (
                <a key={i} href={src.href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < otherSources.length - 1 ? "1px solid #f5f5f5" : "none", textDecoration: "none", color: "#1a1a1a" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: src.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13 }}>{src.name}</span>
                </a>
              ))}
              <a href="https://news.naver.com/subscribe" target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: 13, color: "#595959", marginTop: 8, textAlign: "center", textDecoration: "none" }}>구독 설정 &gt;</a>
            </div>
          </div>
        </aside>
      </div>

      <footer style={{ backgroundColor: "#f9f9f9", borderTop: "1px solid #e5e5e5", marginTop: 40, padding: "30px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", fontSize: 12, color: "#999", textAlign: "center", lineHeight: 2 }}>
          <div style={{ marginBottom: 10 }}>
            {[
              { label: "회사소개", href: "https://www.navercorp.com/" },
              { label: "인재채용", href: "https://recruit.navercorp.com/" },
              { label: "투자정보", href: "https://www.navercorp.com/ir/irCalendar/upcomingEvent" },
              { label: "광고", href: "https://naver.com/" },
              { label: "제휴", href: "https://naver.com/" },
              { label: "이용약관", href: "https://www.naver.com/rules/service.html" },
              { label: "개인정보처리방침", href: "https://www.naver.com/rules/privacy.html" },
              { label: "청소년보호정책", href: "https://www.naver.com/rules/youth.html" },
              { label: "고객센터", href: "https://help.naver.com/" },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ margin: "0 10px", color: "#595959", textDecoration: "none" }}>{label}</a>
            ))}
          </div>
          <div>Copyright © NAVER Corp. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}

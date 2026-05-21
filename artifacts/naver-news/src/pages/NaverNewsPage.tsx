import { useState } from "react";

const ARTICLE_IMAGE = "https://imgnews.pstatic.net/image/025/2026/05/20/0003524574_001_20260520164015416.jpg?type=w860";
const JOONGANG_LOGO = "https://mimgnews.pstatic.net/image/upload/office_logo/025/2025/03/07/logo_025_100_20250307145712.png";

const rankingNews = [
  {
    rank: 1,
    img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524642.jpg?type=nf284_284",
    title: "눈 마주치면 무려 치고, 5년간 보복...",
    badge: null,
  },
  {
    rank: 2,
    img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524640.jpg?type=nf284_284",
    title: "하정우 35 박민식 20 한동훈 31...단일...",
    badge: null,
  },
  {
    rank: 3,
    img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524600.jpg?type=nf284_284",
    title: "'탱크 텀블러' 든 전두환...'스벅 돈 탈내...",
    badge: null,
  },
  {
    rank: 4,
    img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524574.jpg?type=nf284_284",
    title: "삼전 특별성과급 전액 자사주로 준다...",
    badge: "1:34",
  },
  {
    rank: 5,
    img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524560.jpg?type=nf284_284",
    title: '"커피는 스벅"…尹탄핵 반대 배우 최준...',
    badge: null,
  },
  {
    rank: 6,
    img: "https://imgnews.pstatic.net/image/origin/025/2026/05/20/3524530.jpg?type=nf284_284",
    title: '"임신 몰랐다"더 나니...\'모텔 출산 후...',
    badge: null,
  },
];

const otherSources = [
  { name: "노컷뉴스", logo: "https://mimgnews.pstatic.net/image/upload/office_logo/079/2020/03/25/logo_079_100_20200325101843.png", color: "#e81111" },
  { name: "SBS", logo: "https://mimgnews.pstatic.net/image/upload/office_logo/055/2020/03/25/logo_055_100_20200325100020.png", color: "#1a6de8" },
  { name: "파이낸셜뉴스", logo: "https://mimgnews.pstatic.net/image/upload/office_logo/014/2020/03/25/logo_014_100_20200325100043.png", color: "#e8a011" },
  { name: "아시아경제", logo: "https://mimgnews.pstatic.net/image/upload/office_logo/277/2020/03/25/logo_277_100_20200325100343.png", color: "#e87211" },
  { name: "비즈워치", logo: "https://mimgnews.pstatic.net/image/upload/office_logo/648/2021/03/09/logo_648_100_20210309145702.png", color: "#1176e8" },
  { name: "중앙일보", logo: JOONGANG_LOGO, color: "#e81111" },
  { name: "이데일리", logo: "https://mimgnews.pstatic.net/image/upload/office_logo/018/2020/03/25/logo_018_100_20200325100113.png", color: "#e87211" },
  { name: "YTN", logo: "https://mimgnews.pstatic.net/image/upload/office_logo/052/2020/03/25/logo_052_100_20200325100054.png", color: "#e81111" },
];

const relatedArticles = [
  "한동훈, 일진과 맞짱…'금목걸이 장발' 서울대 뒤집다",
  "27만원→101만원 됐다…삼전 제친 '新황제주' 정체",
  "내신 9등급도 의사 된다? 대치맘이 유학 보낸 곳",
  "50대 남녀 '기내 성관계'…아이가 보고 한 일 깜짝",
  '"입주민끼리 결혼" 그 강남 아파트 발칵…이번엔 뭔일',
];

const issues = [
  {
    tag: "3대 특검",
    title: "김건희 \"쥴리 의혹 충격에 6년째 정신병…'쥴' 자도 사용한 적 없다\"",
    img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/20/3524624.jpg?type=nfs284_284",
  },
  {
    tag: "6·3 지방선거",
    title: '"우상호 돼야 기업유치" "지역 일꾼은 김진태"…강원민심 팽팽',
    img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/20/3524491.jpg?type=nfs284_284",
  },
  {
    tag: "美·이란 전쟁",
    title: "美, 이란 공습 재개 보류 속 금융망·선박 대규모 제재",
    img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/20/3524479.jpg?type=nfs284_284",
  },
  {
    tag: "쿠팡 개인정보 유출",
    title: "법원, 쿠팡 김범석 동일인 지정 제동…공정위 결정 효력 정지",
    img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/15/3523617.jpg?type=nfs284_284",
  },
  {
    tag: "트럼프발 관세전쟁",
    title: "美항소법원, '10% 글로벌 관세' 무효 판결 효력 '일시 정지'",
    img: "https://mimgnews.pstatic.net/image/origin/025/2026/05/13/3522855.jpg?type=nfs284_284",
  },
];

const reactions = [
  { label: "쏠쏠정보", count: 135 },
  { label: "흥미진진", count: 3 },
  { label: "공감백배", count: 491 },
  { label: "분석탁월", count: 2 },
  { label: "후속강추", count: 25 },
];

const navTabs = [
  "주요뉴스", "프리미엄", "이슈", "클립", "지면",
  "정치", "경제", "사회", "생활", "세계", "IT",
  "사/칼럼", "신문보기", "랭킹", "MY"
];

const commentDemographics = {
  gender: { male: 81, female: 19 },
  age: [
    { label: "10대", pct: 0 },
    { label: "20대", pct: 1 },
    { label: "30대", pct: 7 },
    { label: "40대", pct: 23 },
    { label: "50대", pct: 36 },
    { label: "60대", pct: 27 },
    { label: "70대↑", pct: 6 },
  ],
};

export default function NaverNewsPage() {
  const [activeReaction, setActiveReaction] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #e5e5e5", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 100 }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Naver N logo */}
            <div style={{ width: 24, height: 24, backgroundColor: "#03c75a", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 15, fontFamily: "Arial, sans-serif" }}>N</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>뉴스</span>
          </div>
          {/* Headline source */}
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>중앙일보</span>
          <button style={{ fontSize: 13, color: "#1a1a1a", border: "1px solid #ccc", borderRadius: 3, padding: "4px 10px", backgroundColor: "#fff", cursor: "pointer" }}>
            +구독
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ overflowX: "auto", whiteSpace: "nowrap", borderTop: "1px solid #e5e5e5" }}>
          <div style={{ display: "inline-flex", padding: "0 20px", maxWidth: 1200 }}>
            {navTabs.map((tab, i) => (
              <a
                key={tab}
                href="#"
                style={{
                  display: "inline-block",
                  padding: "10px 14px",
                  fontSize: 14,
                  color: tab === "경제" ? "#1a1a1a" : "#595959",
                  fontWeight: tab === "경제" ? 700 : 400,
                  borderBottom: tab === "경제" ? "2px solid #1a1a1a" : "2px solid transparent",
                  textDecoration: "none",
                  lineHeight: 1,
                }}
                onClick={(e) => e.preventDefault()}
              >
                {tab}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", gap: 30, alignItems: "flex-start" }}>
        {/* Article area */}
        <main style={{ flex: "1 1 0", minWidth: 0, paddingTop: 20 }}>
          {/* Source + PICK */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src={JOONGANG_LOGO}
                alt="중앙일보"
                style={{ height: 20, objectFit: "contain" }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <span style={{ fontSize: 14, color: "#1a1a1a", fontWeight: 600 }}>중앙일보</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                backgroundColor: "#1a1a1a",
                padding: "2px 6px",
                borderRadius: 2,
                fontStyle: "italic",
                letterSpacing: 0.5,
              }}>
                PiCK
              </span>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 14 }}>ⓘ</button>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.4,
            marginBottom: 14,
            letterSpacing: -0.5,
          }}>
            삼전 "적자 사업부 수억 성과급 수용 못해"…노조 "내일 총파업"
          </h1>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#595959" }}>
              <span style={{ fontStyle: "italic" }}>입력</span> 2026.05.20. 오전 11:52
            </span>
            <span style={{ color: "#ccc" }}>·</span>
            <span style={{ fontSize: 13, color: "#595959" }}>
              <span style={{ fontStyle: "italic" }}>수정</span> 2026.05.20. 오후 4:40
            </span>
            <a href="#" style={{ fontSize: 12, color: "#1a1a1a", border: "1px solid #ccc", borderRadius: 2, padding: "1px 6px", marginLeft: 4 }}
              onClick={(e) => e.preventDefault()}>
              기사원문
            </a>
          </div>

          {/* Reactions + Comments row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 4, border: "1px solid #e5e5e5",
                borderRadius: 20, padding: "4px 12px", background: "#fff", cursor: "pointer", fontSize: 13, color: "#1a1a1a"
              }}>
                <span>😊</span>
                <span style={{ fontWeight: 600 }}>656</span>
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Audio */}
              <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#595959" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </button>
              {/* Font size */}
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#595959", display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 12 }}>가</span>
                <span style={{ fontSize: 10 }}>▼</span>
              </button>
              {/* Share */}
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#595959" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
              {/* Print */}
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#595959" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </button>
            </div>
            <a href="#comments" style={{ fontSize: 13, color: "#595959", display: "flex", alignItems: "center", gap: 4 }}
              onClick={(e) => e.preventDefault()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              1,494
            </a>
          </div>

          {/* Article image */}
          <div style={{ marginBottom: 20 }}>
            <img
              src={ARTICLE_IMAGE}
              alt="삼성전자 노사 협상"
              style={{ width: "100%", display: "block", borderRadius: 2 }}
              onError={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
                e.currentTarget.style.height = "400px";
              }}
            />
            <p style={{ fontSize: 12, color: "#595959", marginTop: 8, lineHeight: 1.5 }}>
              삼성그룹 초기업노동조합 삼성전자지부 최승호 위원장(왼쪽)과 삼성전자 사측 대표교섭위원인 여명구 DS(디바이스솔루션·반도체 사업 담당) 피플팀장이 20일 정부세종청사 중앙노동위원회에서 총파업 예고 시점을 하루 앞두고 열린 3차 사후조정 회의에 각각 들어가고 있는 모습. 연합뉴스
            </p>
          </div>

          {/* Article body */}
          <div style={{ fontSize: 17, lineHeight: 1.8, color: "#1a1a1a", marginBottom: 30 }}>
            <p style={{ marginBottom: 20 }}>
              삼성전자 노사가 총파업을 하루 앞두고 진행한 막판 협상에서 끝내 합의에 이르지 못했다. 삼성전자는 "노조의 과도한 요구를 수용할 경우 회사 경영의 기본 원칙이 흔들릴 수 있다"며 강경한 입장을 내놨다.
            </p>
            <p style={{ marginBottom: 20 }}>
              삼성전자는 20일 입장문에서 "사후 조정 종료를 매우 안타깝게 생각한다"며 "최악의 상황을 막기 위해 마지막 순간까지 대화를 이어가겠다"고 밝혔다.
            </p>
            <p style={{ marginBottom: 20 }}>
              이어 "어떠한 경우에도 파업은 없어야 한다"며 "막판까지 합의가 이뤄지지 못한 것은 노동조합 요구를 그대로 수용할 경우 회사 경영의 기본 원칙이 흔들릴 수 있다는 판단 때문"이라고 설명했다.
            </p>
            <p style={{ marginBottom: 20 }}>
              특히 삼성전자는 노조 측 성과급 요구와 관련해 "회사가 성과급 규모와 내용 대부분을 수용했음에도 노조는 적자 사업부에도 사회적으로 용납되기 어려운 수준의 보상을 요구하고 있다"고 주장했다.
            </p>
            <p style={{ marginBottom: 20 }}>
              삼성전자 관계자는 "막판까지 가장 큰 쟁점은 적자 사업부 배분과 성과급 지급 규모였다"며 "회사는 흑자 전환 시 지급하거나 적자 사업부의 경우 연봉 상한 50% 수준에서 지급해야 한다는 입장을 유지해왔다"고 말했다.
            </p>
            <p style={{ marginBottom: 20 }}>
              이어 "사업부·부문별 비율이 회사 요구대로 반영되더라도 전체 재원이 영업이익의 10% 이상으로 커질 경우 일부 사업부에서는 수억원대 성과급이 지급될 수밖에 없다"며 "이는 '성과 있는 곳에 보상이 있다'는 성과주의 원칙과 배치된다는 판단"이라고 설명했다.
            </p>
            <p style={{ marginBottom: 20 }}>
              삼성전자는 "'성과 있는 곳에 보상이 있다'는 회사 경영 원칙을 포기할 경우 삼성전자뿐 아니라 다른 기업과 산업 전반에도 악영향을 줄 수 있다고 판단했다"고 강조했다.
            </p>
            <p style={{ marginBottom: 20 }}>
              다만 회사 측은 추가 협상 가능성은 열어뒀다. 삼성전자는 "추가 조정이나 노조와의 직접 대화를 통해 마지막까지 문제 해결 노력을 이어갈 것"이라며 "그동안 노력해 준 정부에도 감사드리며 지속적인 관심을 부탁한다"고 밝혔다.
            </p>
          </div>

          {/* Copyright */}
          <div style={{ fontSize: 13, color: "#595959", marginBottom: 24, borderTop: "1px solid #e5e5e5", paddingTop: 16 }}>
            Copyright ⓒ 중앙일보. All rights reserved. 무단 전재 및 재배포 금지.
          </div>

          {/* Section tag */}
          <div style={{ fontSize: 13, color: "#595959", marginBottom: 30 }}>
            <span>이 기사는 언론사에서 </span>
            <span style={{ fontWeight: 700, color: "#1a1a1a" }}>경제</span>
            <span> 섹션으로 분류했습니다.</span>
          </div>

          {/* Publisher subscribe block */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, padding: 20, marginBottom: 30, display: "flex", alignItems: "center", gap: 16 }}>
            <img src={JOONGANG_LOGO} alt="중앙일보" style={{ height: 28, objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>중앙일보 구독하고</div>
              <div style={{ fontSize: 13, color: "#595959" }}>메인에서 바로 만나보세요!</div>
            </div>
            <button style={{ border: "1px solid #1a1a1a", borderRadius: 3, padding: "6px 16px", background: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              구독
            </button>
            <a href="#" style={{ fontSize: 13, color: "#595959" }} onClick={(e) => e.preventDefault()}>언론사홈</a>
          </div>

          {/* Related articles */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: "#1a1a1a" }}>
              <span style={{ color: "#1a1a1a" }}>중앙일보</span> 주요뉴스
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {relatedArticles.map((title, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "10px 0",
                    borderBottom: "1px solid #f0f0f0",
                    color: "#1a1a1a",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span style={{ color: "#999", minWidth: 16 }}>·</span>
                  <span style={{ flex: 1 }}>{title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Issues section */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: "#595959" }}>
              <span style={{ fontStyle: "italic" }}>중앙일보</span>
              <span style={{ color: "#1a1a1a" }}> 언론사가 직접 선정한 이슈</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {issues.map((issue, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "12px 0",
                    borderBottom: "1px solid #f0f0f0",
                    color: "#1a1a1a",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    src={issue.img}
                    alt={issue.title}
                    style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
                    onError={(e) => { e.currentTarget.style.backgroundColor = "#f0f0f0"; }}
                  />
                  <div>
                    <div style={{ fontSize: 12, color: "#595959", marginBottom: 4 }}>
                      이슈 <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{issue.tag}</span>
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>{issue.title}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Reaction buttons */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: "#1a1a1a" }}>이 기사를 추천합니다</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {reactions.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReaction(activeReaction === i ? null : i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    border: activeReaction === i ? "1px solid #1a1a1a" : "1px solid #e5e5e5",
                    borderRadius: 20,
                    padding: "6px 14px",
                    background: activeReaction === i ? "#f5f5f5" : "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#1a1a1a",
                    transition: "all 0.1s",
                  }}
                >
                  <span>{r.label}</span>
                  <span style={{ fontWeight: 600, color: "#595959" }}>{r.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments section */}
          <div id="comments" style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>댓글</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>1,494</span>
              <button style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 13, cursor: "pointer", color: "#595959" }}>새로고침</button>
            </div>

            {/* Comment stats */}
            <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>댓글 상세 현황</div>
              <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#595959" }}>현재 댓글</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>1,339</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#595959" }}>작성자 삭제</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>155</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#595959" }}>규정 미준수</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>0</div>
                </div>
              </div>

              {/* Gender bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", borderRadius: 3, overflow: "hidden", height: 20, marginBottom: 6 }}>
                  <div style={{ width: `${commentDemographics.gender.male}%`, backgroundColor: "#4a90d9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{commentDemographics.gender.male}%</span>
                  </div>
                  <div style={{ width: `${commentDemographics.gender.female}%`, backgroundColor: "#e87db0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{commentDemographics.gender.female}%</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#595959" }}>
                  <span>남자</span>
                  <span>여자</span>
                </div>
              </div>

              {/* Age bars */}
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                {commentDemographics.age.map((a, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, color: "#595959" }}>{a.pct}%</span>
                    <div style={{
                      width: "100%",
                      height: Math.max(a.pct * 2.5, 3),
                      backgroundColor: a.label === "50대" ? "#e87211" : "#c5d8f0",
                      borderRadius: 2,
                    }} />
                    <span style={{ fontSize: 10, color: "#595959", whiteSpace: "nowrap" }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment input */}
            <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, padding: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>댓글 입력</div>
              <div style={{
                backgroundColor: "#f9f9f9",
                border: "1px solid #e5e5e5",
                borderRadius: 3,
                padding: 12,
                fontSize: 13,
                color: "#999",
                marginBottom: 10,
                minHeight: 80,
              }}>
                댓글을 작성하려면 로그인 해주세요
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#999" }}>현재 입력한 글자수 <strong>0</strong>/전체 입력 가능한 글자수 300</span>
                <button style={{
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 3,
                  padding: "6px 18px",
                  fontSize: 13,
                  cursor: "pointer",
                  fontWeight: 600,
                }}>
                  등록
                </button>
              </div>
            </div>

            {/* Notice */}
            <div style={{ backgroundColor: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 4, padding: 12, marginBottom: 20, fontSize: 13, color: "#595959" }}>
              <strong>공지사항</strong> 제9회 지방선거 관련 댓글 작성 시 유의해주세요.
              <br />
              후보자 등 관련 허위사실공표‧비방 및 딥페이크 게시물 링크 공유 등의 행위는 공직선거법 위반으로 삭제 또는 고발될 수 있습니다.
            </div>

            {/* Sort options */}
            <div style={{ display: "flex", gap: 14, marginBottom: 20, borderBottom: "1px solid #e5e5e5", paddingBottom: 12 }}>
              {["순공감순", "최신순", "과거순"].map((opt, i) => (
                <button
                  key={opt}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    color: i === 0 ? "#1a1a1a" : "#999",
                    fontWeight: i === 0 ? 700 : 400,
                    padding: 0,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Sample comments */}
            {[
              { user: "soo***", time: "5시간 전", content: "파업해도 됩니다. 적자인 사업부에 수억원 성과급은 말이 안 되죠.", likes: 1247, dislikes: 45 },
              { user: "kim***", time: "4시간 전", content: "회사 입장도 이해가 되네요. 적자 사업부에 수억 성과급은 과한 요구 같습니다.", likes: 892, dislikes: 123 },
              { user: "lee***", time: "3시간 전", content: "노사가 합의점을 찾길 바랍니다. 파업은 모두에게 좋지 않습니다.", likes: 634, dislikes: 28 },
              { user: "park***", time: "2시간 전", content: "성과 없이 보상을 요구하는 건 무리한 요구 아닌가요?", likes: 521, dislikes: 67 },
              { user: "choi***", time: "1시간 전", content: "삼성 화이팅! 이 상황에서 무너지면 안 됩니다.", likes: 398, dislikes: 42 },
            ].map((c, i) => (
              <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#999" }}>
                    👤
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{c.user}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>{c.time}</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#1a1a1a", marginBottom: 10, paddingLeft: 40 }}>{c.content}</p>
                <div style={{ display: "flex", gap: 12, paddingLeft: 40 }}>
                  <button style={{ background: "none", border: "1px solid #e5e5e5", borderRadius: 3, padding: "3px 10px", fontSize: 12, cursor: "pointer", color: "#595959" }}>
                    👍 {c.likes}
                  </button>
                  <button style={{ background: "none", border: "1px solid #e5e5e5", borderRadius: 3, padding: "3px 10px", fontSize: 12, cursor: "pointer", color: "#595959" }}>
                    👎 {c.dislikes}
                  </button>
                  <button style={{ background: "none", border: "none", fontSize: 12, cursor: "pointer", color: "#999" }}>
                    답글 쓰기
                  </button>
                </div>
              </div>
            ))}

            <button style={{
              width: "100%",
              padding: "12px 0",
              border: "1px solid #e5e5e5",
              borderRadius: 4,
              background: "#fff",
              fontSize: 14,
              cursor: "pointer",
              color: "#1a1a1a",
              marginTop: 10,
              fontWeight: 600,
            }}>
              댓글 더보기
            </button>
          </div>
        </main>

        {/* Right sidebar */}
        <aside style={{ width: 300, flexShrink: 0, paddingTop: 20, position: "sticky", top: 90, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          {/* Ranking news box */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>중앙일보</span>
                <span style={{ fontSize: 14, color: "#1a1a1a", marginLeft: 4 }}>많이 본 뉴스</span>
              </div>
              <span style={{ fontSize: 11, color: "#999" }}>오전 10시~11시까지 집계된 결과입니다.</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {rankingNews.map((item, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: "block",
                    padding: 0,
                    position: "relative",
                    borderBottom: i < 4 ? "1px solid #e5e5e5" : "none",
                    borderRight: i % 2 === 0 ? "1px solid #e5e5e5" : "none",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
                    onError={(e) => { e.currentTarget.style.backgroundColor = "#f0f0f0"; e.currentTarget.style.height = "142px"; }}
                  />
                  <div style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 15,
                    width: 24,
                    height: 24,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {item.rank}
                  </div>
                  {item.badge && (
                    <div style={{
                      position: "absolute",
                      bottom: 32,
                      right: 6,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      fontSize: 11,
                      padding: "2px 5px",
                      borderRadius: 2,
                    }}>
                      {item.badge}
                    </div>
                  )}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
                    padding: "20px 8px 8px",
                  }}>
                    <p style={{ fontSize: 12, color: "#fff", lineHeight: 1.4, margin: 0 }}>{item.title}</p>
                  </div>
                </a>
              ))}
            </div>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "block",
                textAlign: "center",
                padding: "10px",
                fontSize: 13,
                color: "#595959",
                borderTop: "1px solid #e5e5e5",
                backgroundColor: "#fafafa",
              }}
            >
              랭킹 뉴스 더보기
            </a>
          </div>

          {/* AI news */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, marginBottom: 16, padding: 14, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 40, height: 40, flexShrink: 0, backgroundColor: "#e8f4ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              🤖
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>네이버 AI 뉴스 알고리즘</div>
              <div style={{ fontSize: 12, color: "#595959" }}>뉴스 추천 알고리즘이 궁금하다면?</div>
            </div>
          </div>

          {/* Other sources */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5e5e5" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>다른 언론사 보기</span>
            </div>
            <div style={{ padding: "8px 14px" }}>
              {otherSources.map((src, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 0",
                    borderBottom: i < otherSources.length - 1 ? "1px solid #f5f5f5" : "none",
                  }}
                >
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: src.color,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, color: "#1a1a1a" }}>{src.name}</span>
                </a>
              ))}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ display: "block", fontSize: 13, color: "#595959", marginTop: 8, textAlign: "center" }}
              >
                구독 설정 &gt;
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#f9f9f9", borderTop: "1px solid #e5e5e5", marginTop: 40, padding: "30px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", fontSize: 12, color: "#999", textAlign: "center", lineHeight: 2 }}>
          <div style={{ marginBottom: 10 }}>
            <a href="#" style={{ margin: "0 10px", color: "#595959" }} onClick={(e) => e.preventDefault()}>회사소개</a>
            <a href="#" style={{ margin: "0 10px", color: "#595959" }} onClick={(e) => e.preventDefault()}>인재채용</a>
            <a href="#" style={{ margin: "0 10px", color: "#595959" }} onClick={(e) => e.preventDefault()}>투자정보</a>
            <a href="#" style={{ margin: "0 10px", color: "#595959" }} onClick={(e) => e.preventDefault()}>광고</a>
            <a href="#" style={{ margin: "0 10px", color: "#595959" }} onClick={(e) => e.preventDefault()}>제휴</a>
            <a href="#" style={{ margin: "0 10px", color: "#595959" }} onClick={(e) => e.preventDefault()}>이용약관</a>
            <strong><a href="#" style={{ margin: "0 10px", color: "#595959" }} onClick={(e) => e.preventDefault()}>개인정보처리방침</a></strong>
            <a href="#" style={{ margin: "0 10px", color: "#595959" }} onClick={(e) => e.preventDefault()}>청소년보호정책</a>
            <a href="#" style={{ margin: "0 10px", color: "#595959" }} onClick={(e) => e.preventDefault()}>고객센터</a>
          </div>
          <div>Copyright © NAVER Corp. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from "react";

interface Article {
  id: number;
  title: string;
  body: string[];
  imageUrl: string;
  imageLink: string;
  imageCaption: string;
  metaImage: string;
  viewCount: number;
  publishedAt?: string;
  updatedAt?: string;
}

function toLocalDT(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function fromLocalDT(s: string): string | null {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

interface Comment {
  id: number;
  username: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
}

const API = "";

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"article" | "comments" | "views">("article");

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState<string[]>([]);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageLink, setEditImageLink] = useState("");
  const [editImageCaption, setEditImageCaption] = useState("");
  const [editMetaImage, setEditMetaImage] = useState("");
  const [editPublishedAt, setEditPublishedAt] = useState("");
  const [editUpdatedAt, setEditUpdatedAt] = useState("");
  const [origPublishedAt, setOrigPublishedAt] = useState("");
  const [origUpdatedAt, setOrigUpdatedAt] = useState("");
  const [commentDateEdits, setCommentDateEdits] = useState<Record<number, string>>({});

  const [newCommentUser, setNewCommentUser] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [newCommentLikes, setNewCommentLikes] = useState(0);
  const [newCommentDislikes, setNewCommentDislikes] = useState(0);
  const [commentMsg, setCommentMsg] = useState("");

  const headers = { "Content-Type": "application/json", "x-admin-password": token };

  const [uploading, setUploading] = useState<string>("");

  async function uploadFile(file: File, slot: string): Promise<string | null> {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return null;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert("20MB 이하 파일만 업로드할 수 있습니다.");
      return null;
    }
    setUploading(slot);
    try {
      const reqRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": token },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!reqRes.ok) {
        const errJson = await reqRes.json().catch(() => ({ error: `업로드 URL 요청 실패 (${reqRes.status})` }));
        throw new Error(errJson.error || `업로드 URL 요청 실패 (${reqRes.status})`);
      }
      const { uploadURL, objectPath } = await reqRes.json();
      const putRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error(`업로드 실패 (${putRes.status})`);
      return `/api/storage${objectPath}`;
    } catch (err) {
      console.error(err);
      alert(`이미지 업로드 중 오류가 발생했습니다: ${err instanceof Error ? err.message : "알 수 없는 오류"}`);
      return null;
    } finally {
      setUploading("");
    }
  }

  async function login() {
    const res = await fetch(`${API}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: loginPw }),
    });
    if (res.ok) {
      const data = await res.json() as { token: string };
      setToken(data.token);
      localStorage.setItem("admin_token", data.token);
      setLoginError("");
    } else {
      setLoginError("비밀번호가 틀렸습니다.");
    }
  }

  async function loadArticle() {
    const res = await fetch(`${API}/api/article`);
    if (res.ok) {
      const data = await res.json() as Article;
      setArticle(data);
      setEditTitle(data.title);
      setEditBody(data.body);
      setEditImageUrl(data.imageUrl);
      setEditImageLink(data.imageLink || "");
      setEditImageCaption(data.imageCaption || "");
      setEditMetaImage(data.metaImage || "");
      const pub = toLocalDT(data.publishedAt);
      const upd = toLocalDT(data.updatedAt);
      setEditPublishedAt(pub);
      setEditUpdatedAt(upd);
      setOrigPublishedAt(pub);
      setOrigUpdatedAt(upd);
    }
  }

  async function loadComments() {
    const res = await fetch(`${API}/api/comments`);
    if (res.ok) {
      setComments(await res.json() as Comment[]);
      setCommentDateEdits({});
    }
  }

  useEffect(() => {
    if (token) {
      loadArticle();
      loadComments();
    }
  }, [token]);

  async function saveArticle() {
    setSaving(true);
    setSaveMsg("");
    const res = await fetch(`${API}/api/article`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        title: editTitle,
        body: editBody,
        imageUrl: editImageUrl,
        imageLink: editImageLink,
        imageCaption: editImageCaption,
        metaImage: editMetaImage,
        ...(editPublishedAt && editPublishedAt !== origPublishedAt
          ? { publishedAt: fromLocalDT(editPublishedAt) ?? undefined }
          : {}),
        ...(editUpdatedAt !== origUpdatedAt
          ? { updatedAt: fromLocalDT(editUpdatedAt) ?? undefined }
          : {}),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaveMsg("✅ 저장되었습니다.");
      await loadArticle();
    } else {
      setSaveMsg("❌ 저장 실패.");
    }
    setTimeout(() => setSaveMsg(""), 3000);
  }

  async function addComment() {
    if (!newCommentUser.trim() || !newCommentContent.trim()) {
      setCommentMsg("닉네임과 내용을 입력하세요.");
      return;
    }
    const res = await fetch(`${API}/api/comments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        username: newCommentUser,
        content: newCommentContent,
        likes: newCommentLikes,
        dislikes: newCommentDislikes,
      }),
    });
    if (res.ok) {
      setNewCommentUser("");
      setNewCommentContent("");
      setNewCommentLikes(0);
      setNewCommentDislikes(0);
      setCommentMsg("✅ 댓글이 등록되었습니다.");
      await loadComments();
    } else {
      setCommentMsg("❌ 등록 실패.");
    }
    setTimeout(() => setCommentMsg(""), 3000);
  }

  async function deleteComment(id: number) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    await fetch(`${API}/api/comments/${id}`, { method: "DELETE", headers });
    await loadComments();
  }

  async function updateCommentDate(id: number, localDT: string) {
    const iso = fromLocalDT(localDT);
    if (!iso) {
      alert("올바른 날짜/시간을 입력하세요.");
      setCommentDateEdits((prev) => { const n = { ...prev }; delete n[id]; return n; });
      return;
    }
    const res = await fetch(`${API}/api/comments/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ createdAt: iso }),
    });
    if (res.ok) {
      await loadComments();
    } else {
      alert("댓글 시간 변경 실패");
      setCommentDateEdits((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
  }

  async function resetViews() {
    if (!confirm("조회수를 0으로 초기화하시겠습니까?")) return;
    await fetch(`${API}/api/article/reset-views`, { method: "POST", headers });
    await loadArticle();
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setToken("");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 12px",
    fontSize: 14, outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" };
  const sectionStyle: React.CSSProperties = { backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, marginBottom: 20 };
  const btnStyle: React.CSSProperties = {
    backgroundColor: "#1a1a1a", color: "#fff", border: "none", borderRadius: 6,
    padding: "9px 20px", fontSize: 14, cursor: "pointer", fontWeight: 600,
  };
  const dangerBtn: React.CSSProperties = { ...btnStyle, backgroundColor: "#ef4444" };

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 40, width: 360 }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ width: 40, height: 40, backgroundColor: "#1a1a1a", borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <span style={{ color: "#fff", fontSize: 20 }}>🔐</span>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>관리자 로그인</h1>
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>뉴스 페이지 관리자 패널</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>비밀번호</label>
            <input
              type="password"
              placeholder="관리자 비밀번호 입력"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              style={inputStyle}
            />
            {loginError && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>{loginError}</p>}
          </div>
          <button onClick={login} style={{ ...btnStyle, width: "100%" }}>로그인</button>
          <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 16 }}>
            기본 비밀번호: <code>naver2026</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1a1a1a", color: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>📰</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>뉴스 관리자 패널</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/" target="_blank" style={{ color: "#d1d5db", fontSize: 13, textDecoration: "none" }}>← 뉴스 페이지 보기</a>
          <button onClick={logout} style={{ background: "none", border: "1px solid #4b5563", borderRadius: 5, color: "#d1d5db", padding: "5px 12px", fontSize: 13, cursor: "pointer" }}>
            로그아웃
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0 }}>
          {([
            { key: "article", label: "📝 기사 편집" },
            { key: "comments", label: "💬 댓글 관리" },
            { key: "views", label: "👁 조회수" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "14px 20px", fontSize: 14, fontWeight: 600,
                color: tab === key ? "#1a1a1a" : "#6b7280",
                borderBottom: tab === key ? "2px solid #1a1a1a" : "2px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px" }}>

        {/* ARTICLE TAB */}
        {tab === "article" && (
          <div>
            <div style={sectionStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>기사 제목</h2>
              <label style={labelStyle}>제목</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={inputStyle} />
            </div>

            <div style={sectionStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: "#1a1a1a" }}>기사 날짜/시간</h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>기사 상단에 노출되는 입력/수정 시각입니다. 초 단위까지 변경 가능합니다.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>입력 (게시) 일시</label>
                  <input type="datetime-local" step={1} value={editPublishedAt} onChange={(e) => setEditPublishedAt(e.target.value)} style={inputStyle} />
                  <button onClick={() => setEditPublishedAt(toLocalDT(new Date()))} style={{ marginTop: 6, background: "none", border: "1px solid #d1d5db", borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: "#374151" }}>지금으로 설정</button>
                </div>
                <div>
                  <label style={labelStyle}>수정 일시</label>
                  <input type="datetime-local" step={1} value={editUpdatedAt} onChange={(e) => setEditUpdatedAt(e.target.value)} style={inputStyle} />
                  <button onClick={() => setEditUpdatedAt(toLocalDT(new Date()))} style={{ marginTop: 6, background: "none", border: "1px solid #d1d5db", borderRadius: 5, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: "#374151" }}>지금으로 설정</button>
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>대표 이미지</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>이미지 URL</label>
                  <input value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} style={inputStyle} placeholder="https://... 또는 파일 업로드" />
                  <label style={{ display: "inline-block", marginTop: 6, padding: "6px 12px", backgroundColor: uploading === "hero" ? "#9ca3af" : "#10b981", color: "white", borderRadius: 6, cursor: uploading === "hero" ? "wait" : "pointer", fontSize: 12, fontWeight: 600 }}>
                    {uploading === "hero" ? "업로드 중..." : "📁 파일 업로드"}
                    <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading === "hero"} onChange={async (e) => {
                      const f = e.target.files?.[0]; e.target.value = "";
                      if (!f) return;
                      const url = await uploadFile(f, "hero");
                      if (url) setEditImageUrl(url);
                    }} />
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>이미지 클릭 시 이동할 URL (링크)</label>
                  <input value={editImageLink} onChange={(e) => setEditImageLink(e.target.value)} style={inputStyle} placeholder="https://..." />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>이미지 캡션</label>
                <input value={editImageCaption} onChange={(e) => setEditImageCaption(e.target.value)} style={inputStyle} placeholder="이미지 설명 텍스트" />
              </div>
              {editImageUrl && (
                <div>
                  <label style={labelStyle}>미리보기</label>
                  <img src={editImageUrl} alt="preview" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 6, border: "1px solid #e5e7eb" }} />
                </div>
              )}
            </div>

            <div style={sectionStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: "#1a1a1a" }}>메타 이미지 (OG Image)</h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>카카오톡, 문자 등 링크 공유 시 나타나는 이미지입니다.</p>
              <label style={labelStyle}>메타 이미지 URL</label>
              <input value={editMetaImage} onChange={(e) => setEditMetaImage(e.target.value)} style={inputStyle} placeholder="https://... 또는 파일 업로드" />
              <label style={{ display: "inline-block", marginTop: 6, padding: "6px 12px", backgroundColor: uploading === "meta" ? "#9ca3af" : "#10b981", color: "white", borderRadius: 6, cursor: uploading === "meta" ? "wait" : "pointer", fontSize: 12, fontWeight: 600 }}>
                {uploading === "meta" ? "업로드 중..." : "📁 파일 업로드"}
                <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading === "meta"} onChange={async (e) => {
                  const f = e.target.files?.[0]; e.target.value = "";
                  if (!f) return;
                  const url = await uploadFile(f, "meta");
                  if (url) setEditMetaImage(url);
                }} />
              </label>
              {editMetaImage && (
                <div style={{ marginTop: 12 }}>
                  <img src={editMetaImage} alt="meta preview" style={{ maxWidth: 300, maxHeight: 160, objectFit: "cover", borderRadius: 6, border: "1px solid #e5e7eb" }} />
                </div>
              )}
            </div>

            <div style={sectionStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>본문 문단</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setEditBody([...editBody, ""])}
                    style={{ ...btnStyle, backgroundColor: "#3b82f6", padding: "7px 14px", fontSize: 13 }}
                  >
                    + 문단 추가
                  </button>
                  <button
                    onClick={() => {
                      const url = window.prompt("삽입할 이미지 URL을 입력하세요 (https://...)");
                      if (!url) return;
                      const caption = window.prompt("이미지 캡션 (선택, 비워두면 캡션 없음)", "") || "";
                      const link = window.prompt("이미지 클릭 시 이동할 URL (선택, 비워두면 링크 없음)", "") || "";
                      const md = link.trim()
                        ? `[![${caption}](${url.trim()})](${link.trim()})`
                        : `![${caption}](${url.trim()})`;
                      setEditBody([...editBody, md]);
                    }}
                    style={{ ...btnStyle, backgroundColor: "#6366f1", padding: "7px 14px", fontSize: 13 }}
                  >
                    + URL로 이미지
                  </button>
                  <label style={{ ...btnStyle, backgroundColor: uploading === "body" ? "#9ca3af" : "#10b981", padding: "7px 14px", fontSize: 13, cursor: uploading === "body" ? "wait" : "pointer", display: "inline-flex", alignItems: "center", margin: 0 }}>
                    {uploading === "body" ? "업로드 중..." : "📁 파일로 이미지"}
                    <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploading === "body"} onChange={async (e) => {
                      const f = e.target.files?.[0]; e.target.value = "";
                      if (!f) return;
                      const url = await uploadFile(f, "body");
                      if (!url) return;
                      const caption = window.prompt("이미지 캡션 (선택, 비워두면 캡션 없음)", "") || "";
                      const link = window.prompt("이미지 클릭 시 이동할 URL (선택, 비워두면 링크 없음)", "") || "";
                      const md = link.trim()
                        ? `[![${caption}](${url})](${link.trim()})`
                        : `![${caption}](${url})`;
                      setEditBody([...editBody, md]);
                    }} />
                  </label>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, lineHeight: 1.6, padding: "8px 12px", backgroundColor: "#f9fafb", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                💡 본문 중간에 이미지를 넣으려면 <strong>+ 파일로 이미지</strong>(직접 업로드) 또는 <strong>+ URL로 이미지</strong> 버튼을 누르세요. 직접 입력하려면{" "}
                <code style={{ backgroundColor: "#fff", padding: "1px 5px", borderRadius: 3, border: "1px solid #e5e7eb" }}>![캡션](이미지URL)</code>{" "}
                형식, 클릭 시 이동할 링크를 넣으려면{" "}
                <code style={{ backgroundColor: "#fff", padding: "1px 5px", borderRadius: 3, border: "1px solid #e5e7eb" }}>[![캡션](이미지URL)](링크URL)</code>{" "}
                형식으로 입력하세요. 한 문단 전체가 이 형식일 때 이미지로 렌더링됩니다.
              </p>
              {editBody.map((para, i) => {
                const trimmed = para.trim();
                const linkedImg = trimmed.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/);
                const plainImg = !linkedImg ? trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/) : null;
                const imgMatch = linkedImg ?? plainImg;
                const isImage = !!imgMatch;
                const imgCap = imgMatch ? imgMatch[1] : "";
                const imgUrl = imgMatch ? imgMatch[2] : "";
                const imgLink = linkedImg ? linkedImg[3] : "";
                const buildImgMd = (cap: string, url: string, link: string) =>
                  link.trim()
                    ? `[![${cap}](${url})](${link.trim()})`
                    : `![${cap}](${url})`;
                const updateImgField = (cap: string, url: string, link: string) => {
                  const next = [...editBody];
                  next[i] = buildImgMd(cap, url, link);
                  setEditBody(next);
                };
                return (
                  <div key={i} style={{ marginBottom: 12, padding: isImage ? 10 : 0, backgroundColor: isImage ? "#ecfdf5" : "transparent", borderRadius: isImage ? 6 : 0, border: isImage ? "1px solid #a7f3d0" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <label style={{ ...labelStyle, marginBottom: 0, flex: 1 }}>
                        {isImage ? `🖼️ 이미지 ${i + 1}` : `문단 ${i + 1}`}
                      </label>
                      <button
                        onClick={() => {
                          if (i === 0) return;
                          const next = [...editBody];
                          [next[i - 1], next[i]] = [next[i], next[i - 1]];
                          setEditBody(next);
                        }}
                        disabled={i === 0}
                        style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 4, padding: "2px 8px", cursor: i === 0 ? "not-allowed" : "pointer", color: i === 0 ? "#d1d5db" : "#374151", fontSize: 12 }}
                      >↑</button>
                      <button
                        onClick={() => {
                          if (i === editBody.length - 1) return;
                          const next = [...editBody];
                          [next[i + 1], next[i]] = [next[i], next[i + 1]];
                          setEditBody(next);
                        }}
                        disabled={i === editBody.length - 1}
                        style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 4, padding: "2px 8px", cursor: i === editBody.length - 1 ? "not-allowed" : "pointer", color: i === editBody.length - 1 ? "#d1d5db" : "#374151", fontSize: 12 }}
                      >↓</button>
                      <button
                        onClick={() => setEditBody(editBody.filter((_, j) => j !== i))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 18, lineHeight: 1 }}
                      >
                        ✕
                      </button>
                    </div>
                    {isImage ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div>
                          <label style={{ fontSize: 11, color: "#065f46", fontWeight: 600 }}>캡션</label>
                          <input
                            value={imgCap}
                            onChange={(e) => updateImgField(e.target.value, imgUrl, imgLink)}
                            placeholder="이미지 설명 (선택)"
                            style={{ ...inputStyle, fontSize: 13 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: "#065f46", fontWeight: 600 }}>이미지 URL</label>
                          <input
                            value={imgUrl}
                            onChange={(e) => updateImgField(imgCap, e.target.value, imgLink)}
                            placeholder="https://..."
                            style={{ ...inputStyle, fontSize: 12, fontFamily: "monospace" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: "#065f46", fontWeight: 600 }}>🔗 클릭 시 이동할 URL (선택)</label>
                          <input
                            value={imgLink}
                            onChange={(e) => updateImgField(imgCap, imgUrl, e.target.value)}
                            placeholder="비워두면 링크 없는 일반 이미지"
                            style={{ ...inputStyle, fontSize: 12, fontFamily: "monospace" }}
                          />
                        </div>
                        {imgUrl && (
                          <img src={imgUrl} alt={imgCap} style={{ marginTop: 4, maxWidth: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 4, border: "1px solid #d1fae5" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={para}
                        onChange={(e) => {
                          const next = [...editBody];
                          next[i] = e.target.value;
                          setEditBody(next);
                        }}
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={saveArticle} disabled={saving} style={{ ...btnStyle, opacity: saving ? 0.6 : 1 }}>
                {saving ? "저장 중..." : "💾 저장하기"}
              </button>
              {saveMsg && <span style={{ fontSize: 14, fontWeight: 600, color: saveMsg.startsWith("✅") ? "#16a34a" : "#ef4444" }}>{saveMsg}</span>}
            </div>
          </div>
        )}

        {/* COMMENTS TAB */}
        {tab === "comments" && (
          <div>
            <div style={sectionStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>새 댓글 등록</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 100px", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>닉네임</label>
                  <input value={newCommentUser} onChange={(e) => setNewCommentUser(e.target.value)} style={inputStyle} placeholder="예: kim***" />
                </div>
                <div>
                  <label style={labelStyle}>내용</label>
                  <input value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} style={inputStyle} placeholder="댓글 내용" />
                </div>
                <div>
                  <label style={labelStyle}>👍 좋아요</label>
                  <input type="number" value={newCommentLikes} onChange={(e) => setNewCommentLikes(Number(e.target.value))} style={inputStyle} min={0} />
                </div>
                <div>
                  <label style={labelStyle}>👎 싫어요</label>
                  <input type="number" value={newCommentDislikes} onChange={(e) => setNewCommentDislikes(Number(e.target.value))} style={inputStyle} min={0} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={addComment} style={btnStyle}>댓글 등록</button>
                {commentMsg && <span style={{ fontSize: 14, fontWeight: 600, color: commentMsg.startsWith("✅") ? "#16a34a" : "#ef4444" }}>{commentMsg}</span>}
              </div>
            </div>

            <div style={sectionStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>등록된 댓글 ({comments.length}개)</h2>
                <button onClick={loadComments} style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 5, padding: "5px 12px", fontSize: 13, cursor: "pointer", color: "#374151" }}>
                  🔄 새로고침
                </button>
              </div>
              {comments.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "20px 0" }}>등록된 댓글이 없습니다.</p>
              ) : (
                <div>
                  {comments.map((c) => (
                    <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{c.username}</span>
                          <span style={{ fontSize: 12, color: "#6b7280" }}>👍 {c.likes} · 👎 {c.dislikes}</span>
                        </div>
                        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.5, marginBottom: 8 }}>{c.content}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <label style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>작성 시각:</label>
                          <input
                            type="datetime-local"
                            step={1}
                            value={commentDateEdits[c.id] ?? toLocalDT(c.createdAt)}
                            onChange={(e) => setCommentDateEdits((prev) => ({ ...prev, [c.id]: e.target.value }))}
                            style={{ border: "1px solid #d1d5db", borderRadius: 5, padding: "3px 8px", fontSize: 12, fontFamily: "inherit" }}
                          />
                          {commentDateEdits[c.id] !== undefined && commentDateEdits[c.id] !== toLocalDT(c.createdAt) && (
                            <>
                              <button
                                onClick={() => updateCommentDate(c.id, commentDateEdits[c.id])}
                                style={{ background: "#03c75a", color: "#fff", border: "none", borderRadius: 5, padding: "3px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                              >저장</button>
                              <button
                                onClick={() => setCommentDateEdits((prev) => { const n = { ...prev }; delete n[c.id]; return n; })}
                                style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 5, padding: "3px 10px", fontSize: 12, cursor: "pointer", color: "#374151" }}
                              >취소</button>
                            </>
                          )}
                        </div>
                      </div>
                      <button onClick={() => deleteComment(c.id)} style={{ ...dangerBtn, padding: "5px 12px", fontSize: 12, flexShrink: 0 }}>
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEWS TAB */}
        {tab === "views" && (
          <div>
            <div style={sectionStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "#1a1a1a" }}>조회수 현황</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: "#1a1a1a", lineHeight: 1 }}>
                    {(article?.viewCount ?? 0).toLocaleString("ko-KR")}
                  </div>
                  <div style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>총 조회수</div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
                    뉴스 페이지에 방문할 때마다 조회수가 1씩 증가합니다.<br />
                    어드민 패널에서 기사를 불러올 때도 카운트됩니다.
                  </p>
                  <div style={{ marginTop: 16 }}>
                    <button onClick={resetViews} style={dangerBtn}>
                      🔄 조회수 초기화 (0으로 리셋)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: "#1a1a1a" }}>기사 정보</h2>
              <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                {[
                  ["제목", article?.title ?? "-"],
                  ["마지막 수정", article?.updatedAt ? new Date(article.updatedAt).toLocaleString("ko-KR") : "-"],
                  ["본문 문단 수", String(article?.body?.length ?? 0) + "개"],
                  ["대표 이미지 링크", article?.imageLink || "(없음)"],
                  ["메타 이미지", article?.metaImage || "(없음)"],
                ].map(([key, val]) => (
                  <tr key={key} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "10px 0", color: "#6b7280", fontWeight: 600, width: 160 }}>{key}</td>
                    <td style={{ padding: "10px 0", color: "#1a1a1a", wordBreak: "break-all" }}>{val}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

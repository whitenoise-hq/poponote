import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Grid, CalendarDays, Plus } from "lucide-react";

const PHOTOS = [
  "https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1530700131180-d43d9b8cc41f?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1526660690293-bcd32dc3b123?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1615789591457-74a63395c990?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1561438774-1790fe271b8f?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1637424864367-7ab8752c19c6?w=400&h=400&fit=crop&auto=format",
];

const diaryEntries = [
  {
    id: 1, day: 15, photo: PHOTOS[0],
    title: "산책 중에 발견한 민들레 🌼",
    text: "오늘 한강 산책 중에 포포가 민들레를 발견하고 한참 킁킁거렸어요. 바람이 살살 불고 너무 좋은 하루였다 🐾",
    likes: 12, comments: 3,
    care: [{ type: "meal", note: "사료 80g", time: "08:12", who: "엄마" }, { type: "walk", note: "한강공원 40분", time: "10:30", who: "아빠" }],
    userComments: [{ id: 1, name: "엄마", text: "포포 너무 귀엽다 💕", time: "10분 전" }, { id: 2, name: "유진", text: "민들레랑 찍은 사진 어딨어?", time: "5분 전" }],
  },
  {
    id: 2, day: 13, photo: PHOTOS[1],
    title: "첫 수영 도전! 🏊",
    text: "오늘 포포랑 첫 수영장 방문! 처음엔 무서워했는데 나중엔 신나서 첨벙첨벙 🌊",
    likes: 24, comments: 7,
    care: [{ type: "meal", note: "사료 80g + 습식", time: "08:00", who: "아빠" }, { type: "snack", note: "오리 간식", time: "16:00", who: "유진" }],
    userComments: [{ id: 1, name: "아빠", text: "수영 천재 포포!", time: "2일 전" }],
  },
  {
    id: 3, day: 10, photo: PHOTOS[2],
    title: "오늘은 집순이 모드 🛋️",
    text: "비오는 날에는 포포도 집순이. 소파에서 하루종일 쿨쿨 자다가 간식 먹으러 일어남 ㅋㅋ",
    likes: 8, comments: 2,
    care: [{ type: "snack", note: "치킨 트릿", time: "15:00", who: "엄마" }],
    userComments: [],
  },
];

const daysWithEntries = new Set(diaryEntries.map((e) => e.day));

const WEEKS = [
  [null, null, null, null, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, null],
];

const careEmoji: Record<string, string> = { meal: "🍚", snack: "🦴", walk: "🐾" };
const careColor: Record<string, string> = { meal: "#f4846a", snack: "#a8c8a0", walk: "#7eb8e8" };
const careBg: Record<string, string> = { meal: "#fff0ec", snack: "#edf7ec", walk: "#eaf4fd" };

export function DiaryScreen() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [likedEntries, setLikedEntries] = useState<Set<number>>(new Set());
  const [newComment, setNewComment] = useState("");

  const selectedEntry = diaryEntries.find((e) => e.day === selectedDay);

  function toggleLike(id: number) {
    setLikedEntries((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (selectedEntry) {
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 pt-14 pb-3" style={{ background: "var(--background)" }}>
          <button onClick={() => setSelectedDay(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--secondary)" }}>
            <ChevronLeft size={18} style={{ color: "var(--primary)" }} />
          </button>
          <span className="text-sm" style={{ color: "var(--foreground)" }}>2026.06.{String(selectedEntry.day).padStart(2, "0")}</span>
        </div>

        <img src={selectedEntry.photo} alt={selectedEntry.title} className="w-full object-cover" style={{ height: 280 }} />

        <div className="px-4 py-4 flex flex-col gap-4">
          <div>
            <h2 style={{ color: "var(--foreground)" }}>{selectedEntry.title}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{selectedEntry.text}</p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => toggleLike(selectedEntry.id)} className="flex items-center gap-1.5">
              <Heart size={18} fill={likedEntries.has(selectedEntry.id) ? "#f4846a" : "none"} style={{ color: "#f4846a" }} />
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {selectedEntry.likes + (likedEntries.has(selectedEntry.id) ? 1 : 0)}
              </span>
            </button>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={18} style={{ color: "var(--muted-foreground)" }} />
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{selectedEntry.userComments.length}</span>
            </div>
          </div>

          {/* Care records */}
          {selectedEntry.care.length > 0 && (
            <div>
              <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>케어 기록</p>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.care.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: careBg[c.type], color: careColor[c.type], border: `1px solid ${careColor[c.type]}33` }}>
                    <span>{careEmoji[c.type]}</span>
                    <span style={{ fontWeight: 600 }}>{c.who}</span>
                    <span>{c.note}</span>
                    <span style={{ opacity: 0.7 }}>{c.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>댓글 {selectedEntry.userComments.length}개</p>
            <div className="flex flex-col gap-3">
              {selectedEntry.userComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0" style={{ background: "var(--accent)", color: "var(--primary)", fontWeight: 700 }}>
                    {c.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: "var(--foreground)", fontWeight: 600 }}>{c.name}</span>
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{c.time}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--foreground)" }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 text-xs px-4 py-2.5 rounded-full outline-none"
                style={{ background: "var(--muted)", color: "var(--foreground)", border: "1.5px solid var(--border)" }}
              />
              <button
                onClick={() => setNewComment("")}
                className="px-4 py-2.5 rounded-full text-xs"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      <div className="px-4 pt-14 pb-4 sticky top-0 z-10" style={{ background: "var(--background)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 style={{ color: "var(--foreground)" }}>포포의 다이어리</h1>
          <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Plus size={16} color="#fff" />
          </button>
        </div>

        {/* Toggle */}
        <div className="flex rounded-2xl p-1 gap-1" style={{ background: "var(--secondary)" }}>
          {(["calendar", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs transition-all"
              style={view === v ? { background: "#fff", color: "var(--primary)", fontWeight: 700, boxShadow: "0 2px 8px rgba(244,132,106,0.18)" } : { color: "var(--muted-foreground)" }}
            >
              {v === "calendar" ? <CalendarDays size={14} /> : <Grid size={14} />}
              {v === "calendar" ? "캘린더" : "피드"}
            </button>
          ))}
        </div>
      </div>

      {view === "calendar" ? (
        <div className="px-4 pb-6">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--secondary)" }}>
              <ChevronLeft size={16} style={{ color: "var(--primary)" }} />
            </button>
            <span className="text-sm" style={{ color: "var(--foreground)", fontWeight: 700 }}>2026년 6월</span>
            <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--secondary)" }}>
              <ChevronRight size={16} style={{ color: "var(--primary)" }} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="text-center text-xs py-1" style={{ color: "var(--muted-foreground)" }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex flex-col gap-1">
            {WEEKS.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((day, di) => (
                  <div key={di} className="flex flex-col items-center">
                    {day ? (
                      <button
                        onClick={() => daysWithEntries.has(day) && setSelectedDay(day)}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs transition-all relative"
                        style={
                          day === 15
                            ? { background: "var(--primary)", color: "#fff", fontWeight: 700 }
                            : daysWithEntries.has(day)
                            ? { background: "var(--secondary)", color: "var(--foreground)", fontWeight: 600 }
                            : { color: "var(--muted-foreground)" }
                        }
                      >
                        {day}
                        {daysWithEntries.has(day) && day !== 15 && (
                          <span
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                            style={{ background: "var(--primary)" }}
                          />
                        )}
                      </button>
                    ) : (
                      <div className="w-9 h-9" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4 pb-6 flex flex-col gap-4">
          {diaryEntries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setSelectedDay(entry.day)}
              className="w-full rounded-2xl overflow-hidden text-left"
              style={{ background: "#fff", border: "1.5px solid var(--border)", boxShadow: "0 2px 12px rgba(244,132,106,0.07)" }}
            >
              <div className="relative">
                <img src={entry.photo} alt={entry.title} className="w-full object-cover" style={{ height: 200 }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(61,47,42,0.6) 0%, transparent 55%)" }} />
                <div className="absolute top-3 left-3">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.88)", color: "var(--foreground)", fontWeight: 600 }}>
                    6월 {entry.day}일
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-sm text-white" style={{ fontWeight: 700 }}>{entry.title}</p>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted-foreground)" }}>{entry.text}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Heart size={14} style={{ color: "#f4846a" }} />
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{entry.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{entry.comments}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

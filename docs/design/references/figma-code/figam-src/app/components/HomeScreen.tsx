import { useState } from "react";
import { Plus, Heart, ChevronRight } from "lucide-react";

const DOG_PHOTO = "https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=120&h=120&fit=crop&auto=format";
const DIARY_PHOTO = "https://images.unsplash.com/photo-1530700131180-d43d9b8cc41f?w=400&h=240&fit=crop&auto=format";

const today = new Date();
const dateStr = today.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

type CareEntry = { id: number; nickname: string; time: string; note?: string };

const initialCare: Record<string, CareEntry[]> = {
  meal: [
    { id: 1, nickname: "엄마", time: "08:12", note: "사료 80g" },
    { id: 2, nickname: "아빠", time: "18:30", note: "사료 80g" },
  ],
  snack: [
    { id: 1, nickname: "유진", time: "14:20", note: "닭가슴살 트릿" },
  ],
  walk: [],
};

const careLabels: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  meal: { label: "밥", emoji: "🍚", color: "#f4846a", bg: "#fff0ec" },
  snack: { label: "간식", emoji: "🦴", color: "#a8c8a0", bg: "#edf7ec" },
  walk: { label: "산책", emoji: "🐾", color: "#7eb8e8", bg: "#eaf4fd" },
};

interface Props {
  onGoToDiary: () => void;
}

export function HomeScreen({ onGoToDiary }: Props) {
  const [care, setCare] = useState(initialCare);
  const [adding, setAdding] = useState<string | null>(null);
  const [inputNote, setInputNote] = useState("");

  function addEntry(type: string) {
    const now = new Date();
    const time = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
    setCare((prev) => ({
      ...prev,
      [type]: [...prev[type], { id: Date.now(), nickname: "나", time, note: inputNote || undefined }],
    }));
    setAdding(null);
    setInputNote("");
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      {/* Header */}
      <div
        className="px-5 pt-14 pb-5"
        style={{ background: "linear-gradient(160deg, #fff0ec 0%, #fdf8f5 100%)" }}
      >
        <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>{dateStr}</p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={DOG_PHOTO}
              alt="포포"
              className="w-16 h-16 rounded-full object-cover border-4"
              style={{ borderColor: "#fff", boxShadow: "0 4px 16px rgba(244,132,106,0.22)" }}
            />
            <span className="absolute -bottom-1 -right-1 text-base">🐶</span>
          </div>
          <div>
            <h1 className="text-xl" style={{ color: "var(--foreground)", letterSpacing: "-0.3px" }}>
              포포 <span className="text-base" style={{ color: "var(--muted-foreground)", fontWeight: 400 }}>의 하루</span>
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fde8e0", color: "#f4846a" }}>
                골든 리트리버 · 3살
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#fde8e0" }}>
              <Heart size={18} style={{ color: "#f4846a" }} fill="#f4846a" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 flex flex-col gap-4">
        {/* Today's Care */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm" style={{ color: "var(--foreground)" }}>오늘의 케어</h2>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              총 {Object.values(care).flat().length}번
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {Object.entries(careLabels).map(([type, meta]) => (
              <div
                key={type}
                className="rounded-2xl p-4"
                style={{ background: meta.bg, border: `1.5px solid ${meta.color}22` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{meta.emoji}</span>
                    <span className="text-sm" style={{ color: meta.color, fontWeight: 700 }}>{meta.label}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: meta.color + "22", color: meta.color }}
                    >
                      {care[type].length}회
                    </span>
                  </div>
                  <button
                    onClick={() => setAdding(adding === type ? null : type)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{ background: meta.color, color: "#fff" }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {care[type].length > 0 && (
                  <div className="flex flex-col gap-1.5 mb-2">
                    {care[type].map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                            style={{ background: meta.color + "33", color: meta.color, fontWeight: 700 }}
                          >
                            {entry.nickname[0]}
                          </div>
                          <span className="text-xs" style={{ color: "var(--foreground)" }}>
                            {entry.nickname}
                            {entry.note && <span style={{ color: "var(--muted-foreground)" }}> · {entry.note}</span>}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{entry.time}</span>
                      </div>
                    ))}
                  </div>
                )}

                {adding === type && (
                  <div className="flex gap-2 mt-2">
                    <input
                      value={inputNote}
                      onChange={(e) => setInputNote(e.target.value)}
                      placeholder="메모 (선택)"
                      className="flex-1 text-xs px-3 py-2 rounded-xl outline-none"
                      style={{ background: "#fff", border: `1.5px solid ${meta.color}44`, color: "var(--foreground)" }}
                      onKeyDown={(e) => e.key === "Enter" && addEntry(type)}
                    />
                    <button
                      onClick={() => addEntry(type)}
                      className="text-xs px-3 py-2 rounded-xl"
                      style={{ background: meta.color, color: "#fff" }}
                    >
                      추가
                    </button>
                  </div>
                )}

                {care[type].length === 0 && adding !== type && (
                  <p className="text-xs" style={{ color: meta.color + "99" }}>아직 기록이 없어요</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Diary Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm" style={{ color: "var(--foreground)" }}>오늘의 일기</h2>
            <button onClick={onGoToDiary} className="flex items-center gap-0.5 text-xs" style={{ color: "var(--primary)" }}>
              더보기 <ChevronRight size={13} />
            </button>
          </div>

          <button
            onClick={onGoToDiary}
            className="w-full rounded-2xl overflow-hidden text-left"
            style={{ background: "#fff", border: "1.5px solid var(--border)", boxShadow: "0 2px 12px rgba(244,132,106,0.08)" }}
          >
            <div className="relative">
              <img
                src={DIARY_PHOTO}
                alt="오늘 일기"
                className="w-full h-36 object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(61,47,42,0.55) 0%, transparent 50%)" }} />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-xs text-white" style={{ fontWeight: 700 }}>산책 중에 발견한 민들레 🌼</p>
              </div>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                오늘 한강 산책 중에 포포가 민들레를 발견하고 한참 킁킁거렸어요. 바람이 살살 불고 너무 좋은 하루였다 🐾
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Copy, Check, ChevronRight, UserPlus, Dog, User, LogOut, Bell, Shield, HelpCircle } from "lucide-react";

const DOG_PHOTO = "https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=120&h=120&fit=crop&auto=format";

const members = [
  { id: 1, name: "엄마", role: "보호자", avatar: "👩", color: "#fde8e0" },
  { id: 2, name: "아빠", role: "보호자", avatar: "👨", color: "#edf7ec" },
  { id: 3, name: "유진", role: "가족", avatar: "👧", color: "#eaf4fd" },
];

const INVITE_CODE = "POPO-7K2X";

export function SettingsScreen() {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(INVITE_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      <div className="px-4 pt-14 pb-2">
        <h1 style={{ color: "var(--foreground)" }}>설정</h1>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-5">
        {/* Pet Profile */}
        <section>
          <p className="text-xs mb-3 px-1" style={{ color: "var(--muted-foreground)" }}>반려동물 프로필</p>
          <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1.5px solid var(--border)" }}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={DOG_PHOTO} alt="포포" className="w-14 h-14 rounded-full object-cover border-2" style={{ borderColor: "var(--primary)" }} />
                <span className="absolute -bottom-0.5 -right-0.5 text-base">🐶</span>
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: "var(--foreground)", fontWeight: 700 }}>포포</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>골든 리트리버 · 2023.03.14 생</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--primary)" }}>수컷</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#edf7ec", color: "#6ab87a" }}>중성화 완료</span>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: "var(--muted-foreground)" }} />
            </div>

            <div className="mt-3 pt-3 flex gap-4" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="text-center flex-1">
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>나이</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--foreground)", fontWeight: 700 }}>3살</p>
              </div>
              <div className="text-center flex-1" style={{ borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>체중</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--foreground)", fontWeight: 700 }}>28.5kg</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>기록</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--foreground)", fontWeight: 700 }}>156일</p>
              </div>
            </div>
          </div>
        </section>

        {/* Invite Code */}
        <section>
          <p className="text-xs mb-3 px-1" style={{ color: "var(--muted-foreground)" }}>가족 초대</p>
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "#fff", border: "1.5px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--foreground)", fontWeight: 700 }}>초대 코드</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>가족에게 코드를 공유하세요</p>
              </div>
              <UserPlus size={18} style={{ color: "var(--primary)" }} />
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center"
                style={{ background: "var(--secondary)", border: "1.5px dashed var(--primary)" }}
              >
                <span style={{ color: "var(--primary)", fontWeight: 800, letterSpacing: "0.15em", fontSize: "1.1rem", fontFamily: "monospace" }}>
                  {INVITE_CODE}
                </span>
              </div>
              <button
                onClick={copyCode}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                style={{ background: copied ? "#a8d8b9" : "var(--primary)", color: "#fff" }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            {copied && (
              <p className="text-xs text-center" style={{ color: "#6ab87a" }}>코드가 복사되었어요! 🎉</p>
            )}
          </div>
        </section>

        {/* Members */}
        <section>
          <p className="text-xs mb-3 px-1" style={{ color: "var(--muted-foreground)" }}>가족 멤버</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1.5px solid var(--border)" }}>
            {members.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < members.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: m.color }}
                >
                  {m.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "var(--foreground)", fontWeight: 600 }}>{m.name}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{m.role}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                  {m.id === 1 ? "나" : "멤버"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Account & More */}
        <section>
          <p className="text-xs mb-3 px-1" style={{ color: "var(--muted-foreground)" }}>계정 & 기타</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1.5px solid var(--border)" }}>
            {[
              { icon: User, label: "내 계정", sub: "mom@example.com" },
              { icon: Bell, label: "알림 설정", sub: "케어 알림 켜짐" },
              { icon: Dog, label: "반려동물 추가", sub: "최대 3마리" },
              { icon: Shield, label: "개인정보 처리방침", sub: null },
              { icon: HelpCircle, label: "도움말 & 피드백", sub: null },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--muted)" }}>
                  <item.icon size={16} style={{ color: "var(--primary)" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "var(--foreground)" }}>{item.label}</p>
                  {item.sub && <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.sub}</p>}
                </div>
                <ChevronRight size={16} style={{ color: "var(--muted-foreground)" }} />
              </button>
            ))}
          </div>
        </section>

        <button
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl"
          style={{ background: "#fff5f5", color: "#d4183d", border: "1.5px solid #f5c2c7" }}
        >
          <LogOut size={16} />
          <span className="text-sm" style={{ fontWeight: 600 }}>로그아웃</span>
        </button>

        <p className="text-center text-xs" style={{ color: "var(--muted-foreground)" }}>포포노트 v1.0.0 🐾</p>
      </div>
    </div>
  );
}

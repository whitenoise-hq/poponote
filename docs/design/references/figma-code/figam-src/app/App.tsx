import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { DiaryScreen } from "./components/DiaryScreen";
import { AlbumScreen } from "./components/AlbumScreen";
import { SettingsScreen } from "./components/SettingsScreen";

type Tab = "home" | "diary" | "album" | "settings";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "home", label: "홈", emoji: "🏠" },
  { id: "diary", label: "다이어리", emoji: "📖" },
  { id: "album", label: "앨범", emoji: "🖼️" },
  { id: "settings", label: "설정", emoji: "⚙️" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{ background: "#e8ddd6", fontFamily: "'Nunito', sans-serif" }}
    >
      {/* iPhone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 393,
          height: 852,
          background: "var(--background)",
          borderRadius: 48,
          boxShadow: "0 32px 80px rgba(61,47,42,0.35), 0 0 0 10px #1a1a1a, 0 0 0 12px #3a3a3a",
        }}
      >
        {/* Status bar notch */}
        <div
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
          style={{ height: 50, background: "transparent" }}
        >
          <span className="text-xs" style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 13 }}>
            9:41
          </span>
          <div
            className="absolute left-1/2 -translate-x-1/2 top-2"
            style={{ width: 120, height: 34, background: "#1a1a1a", borderRadius: 20 }}
          />
          <div className="flex items-center gap-1.5">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="var(--foreground)">
              <rect x="0" y="3" width="3" height="9" rx="1" opacity="0.3" />
              <rect x="4.5" y="2" width="3" height="10" rx="1" opacity="0.5" />
              <rect x="9" y="0" width="3" height="12" rx="1" opacity="0.7" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 3C10.4 3 12.5 4 14 5.8L15.5 4.2C13.5 2.2 10.9 1 8 1C5.1 1 2.5 2.2 0.5 4.2L2 5.8C3.5 4 5.6 3 8 3Z" fill="var(--foreground)" opacity="0.5" />
              <path d="M8 6C9.7 6 11.2 6.8 12.2 8L13.7 6.4C12.3 5 10.2 4 8 4C5.8 4 3.7 5 2.3 6.4L3.8 8C4.8 6.8 6.3 6 8 6Z" fill="var(--foreground)" opacity="0.75" />
              <circle cx="8" cy="11" r="1.5" fill="var(--foreground)" />
            </svg>
            <div className="flex items-center gap-0.5">
              <div style={{ width: 22, height: 11, border: "1.5px solid var(--foreground)", borderRadius: 3, padding: "1.5px", display: "flex", alignItems: "center" }}>
                <div style={{ width: "70%", height: "100%", background: "var(--foreground)", borderRadius: 1.5 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-hidden" style={{ paddingBottom: 80 }}>
          {activeTab === "home" && <HomeScreen onGoToDiary={() => setActiveTab("diary")} />}
          {activeTab === "diary" && <DiaryScreen />}
          {activeTab === "album" && <AlbumScreen />}
          {activeTab === "settings" && <SettingsScreen />}
        </div>

        {/* Bottom tab bar */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-end pb-6 pt-2 px-2"
          style={{
            background: "rgba(253,248,245,0.95)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid var(--border)",
            height: 88,
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 transition-all"
                style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all text-lg"
                  style={isActive ? { background: "var(--secondary)", transform: "scale(1.05)" } : {}}
                >
                  {tab.emoji}
                </div>
                <span
                  className="text-xs"
                  style={{ fontWeight: isActive ? 700 : 500, fontSize: 10 }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

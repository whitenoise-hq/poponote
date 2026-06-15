import { useState } from "react";
import { ChevronLeft, Image } from "lucide-react";

const ALL_PHOTOS = [
  { id: 1, url: "https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=300&h=300&fit=crop&auto=format", month: "2026.06" },
  { id: 2, url: "https://images.unsplash.com/photo-1530700131180-d43d9b8cc41f?w=300&h=300&fit=crop&auto=format", month: "2026.06" },
  { id: 3, url: "https://images.unsplash.com/photo-1526660690293-bcd32dc3b123?w=300&h=300&fit=crop&auto=format", month: "2026.06" },
  { id: 4, url: "https://images.unsplash.com/photo-1615789591457-74a63395c990?w=300&h=300&fit=crop&auto=format", month: "2026.06" },
  { id: 5, url: "https://images.unsplash.com/photo-1561438774-1790fe271b8f?w=300&h=300&fit=crop&auto=format", month: "2026.06" },
  { id: 6, url: "https://images.unsplash.com/photo-1637424864367-7ab8752c19c6?w=300&h=300&fit=crop&auto=format", month: "2026.06" },
  { id: 7, url: "https://images.unsplash.com/photo-1602684379319-1de467ca74e5?w=300&h=300&fit=crop&auto=format", month: "2026.06" },
  { id: 8, url: "https://images.unsplash.com/photo-1695023264743-7f1448deb7f2?w=300&h=300&fit=crop&auto=format", month: "2026.06" },
  { id: 9, url: "https://images.unsplash.com/photo-1614035030394-b6e5b01e0737?w=300&h=300&fit=crop&auto=format", month: "2026.06" },
  { id: 10, url: "https://images.unsplash.com/photo-1610112645245-36020fc0e128?w=300&h=300&fit=crop&auto=format", month: "2026.05" },
  { id: 11, url: "https://images.unsplash.com/photo-1606391276068-d82696ac76bc?w=300&h=300&fit=crop&auto=format", month: "2026.05" },
  { id: 12, url: "https://images.unsplash.com/photo-1445499348736-29b6cdfc03b9?w=300&h=300&fit=crop&auto=format", month: "2026.05" },
  { id: 13, url: "https://images.unsplash.com/photo-1780246330770-b9ee80b790ca?w=300&h=300&fit=crop&auto=format", month: "2026.04" },
  { id: 14, url: "https://images.unsplash.com/photo-1615789591457-74a63395c990?w=300&h=300&fit=crop&auto=format", month: "2026.04" },
  { id: 15, url: "https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=300&h=300&fit=crop&auto=format", month: "2026.03" },
];

const MONTH_LABELS: Record<string, string> = {
  "2026.06": "2026년 6월",
  "2026.05": "2026년 5월",
  "2026.04": "2026년 4월",
  "2026.03": "2026년 3월",
};

const monthGroups = ALL_PHOTOS.reduce<Record<string, typeof ALL_PHOTOS>>((acc, p) => {
  if (!acc[p.month]) acc[p.month] = [];
  acc[p.month].push(p);
  return acc;
}, {});

const monthKeys = Object.keys(monthGroups).sort((a, b) => b.localeCompare(a));

export function AlbumScreen() {
  const [openMonth, setOpenMonth] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (selectedPhoto) {
    return (
      <div className="flex flex-col h-full" style={{ background: "#000" }}>
        <button
          onClick={() => setSelectedPhoto(null)}
          className="absolute top-14 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <ChevronLeft size={20} color="#fff" />
        </button>
        <div className="flex items-center justify-center h-full">
          <img src={selectedPhoto} alt="사진" className="w-full object-contain" style={{ maxHeight: "80vh" }} />
        </div>
      </div>
    );
  }

  if (openMonth) {
    const photos = monthGroups[openMonth];
    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
        <div className="px-4 pt-14 pb-4 sticky top-0 z-10 flex items-center gap-3" style={{ background: "var(--background)" }}>
          <button onClick={() => setOpenMonth(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--secondary)" }}>
            <ChevronLeft size={18} style={{ color: "var(--primary)" }} />
          </button>
          <h1 style={{ color: "var(--foreground)" }}>{MONTH_LABELS[openMonth]}</h1>
          <span className="text-xs ml-auto" style={{ color: "var(--muted-foreground)" }}>{photos.length}장</span>
        </div>

        <div className="px-1 pb-6">
          <div className="grid grid-cols-3 gap-0.5">
            {photos.map((p) => (
              <button key={p.id} onClick={() => setSelectedPhoto(p.url)} className="aspect-square overflow-hidden">
                <img src={p.url} alt="앨범 사진" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ fontFamily: "'Nunito', sans-serif", background: "var(--background)" }}>
      <div className="px-4 pt-14 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Image size={18} style={{ color: "var(--primary)" }} />
          <h1 style={{ color: "var(--foreground)" }}>일러스트 앨범</h1>
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>포포의 추억을 모아봐요 🐾</p>
      </div>

      <div className="px-4 pb-6 flex flex-col gap-4">
        {monthKeys.map((month) => {
          const photos = monthGroups[month];
          const thumbs = photos.slice(0, 4);
          return (
            <button
              key={month}
              onClick={() => setOpenMonth(month)}
              className="w-full rounded-3xl overflow-hidden text-left transition-all"
              style={{ background: "#fff", border: "1.5px solid var(--border)", boxShadow: "0 2px 16px rgba(244,132,106,0.08)" }}
            >
              {/* Mosaic thumbnail */}
              <div className="relative" style={{ height: 160 }}>
                {thumbs.length >= 4 ? (
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5">
                    {thumbs.map((p) => (
                      <img key={p.id} src={p.url} alt="" className="w-full h-full object-cover" />
                    ))}
                  </div>
                ) : thumbs.length >= 1 ? (
                  <img src={thumbs[0].url} alt="" className="w-full h-full object-cover" />
                ) : null}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(61,47,42,0.5) 0%, transparent 60%)" }} />

                {/* Photo count badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.9)", color: "var(--foreground)", fontWeight: 700 }}>
                    {photos.length}장
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "var(--foreground)", fontWeight: 700 }}>{MONTH_LABELS[month]}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{month}</p>
                </div>
                <div className="flex -space-x-1">
                  {thumbs.slice(0, 3).map((p) => (
                    <img key={p.id} src={p.url} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-white" />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

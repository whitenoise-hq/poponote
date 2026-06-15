# Figma Make 컬러 토큰 (원본 참고)

Figma Make(Pet Diary Mobile App)에서 생성된 색상 변수 원본과, 우리 Tailwind 토큰과의 매핑.
실제 적용은 `tailwind.config.js`에서 하며, 이 파일은 출처·대조용 스펙이다.

## 원본 `:root`

```css
:root {
  --background: #fdf8f5;
  --foreground: #3d2f2a;
  --card: #ffffff;
  --primary: #f4846a;
  --primary-foreground: #ffffff;
  --secondary: #fde8e0;
  --muted: #f5ede8;
  --muted-foreground: #9e7e76;
  --accent: #ffd6cc;
  --destructive: #d4183d;
  --border: rgba(244, 132, 106, 0.18);
  --input-background: #fdf0eb;
  --ring: #f4846a;
  --chart-1: #f4846a; /* 코랄 */
  --chart-2: #a8d8b9; /* 초록 */
  --chart-3: #b8d4f5; /* 블루 */
  --chart-4: #f5d08a; /* 옐로 */
  --chart-5: #d4b8f5; /* 퍼플 */
  --radius: 1rem; /* 16px */
}
```

> `--sidebar-*`, `--font-*`, `--switch-background` 등 웹 전용/미사용 변수는 모바일에 불필요하여 제외.

## 우리 Tailwind 토큰 매핑

| 역할 | Figma 변수 | Figma 값 | 우리 토큰 | 현재 우리 값 |
|------|-----------|---------|-----------|-----------|
| 포인트(코랄) | `--primary` / `--ring` | `#f4846a` | `primary.DEFAULT` | `#F2724A` |
| 배경(크림) | `--background` | `#fdf8f5` | `cream.DEFAULT` | `#FBF7F1` |
| 표면(카드) | `--card` | `#ffffff` | (Card `bg-white`) | `#ffffff` |
| 연한 면/배지 | `--secondary` | `#fde8e0` | `cream-100` | `#F6EFE4` |
| 옅은 표면 | `--muted` | `#f5ede8` | `cream-100`~`200` | — |
| 텍스트(본문) | `--foreground` | `#3d2f2a` | `ink.DEFAULT` | `#2B2520` |
| 텍스트(보조) | `--muted-foreground` | `#9e7e76` | `ink-500` | `#7A6F64` |
| 보더 | `--border` | `rgba(244,132,106,.18)` | `cream-200` | `#ECE1D1` |
| 위험/삭제 | `--destructive` | `#d4183d` | `danger` | `#D45D5D` |
| 라운드 | `--radius` | `16px` | `borderRadius.xl` | `16px` |

### 케어 색 (화면 코드 실제 값 — chart 변수와 다름)

`:root`에 `--chart-*`가 있지만, 실제 화면(`HomeScreen`/`DiaryScreen`)은 컴포넌트 안에
**아래 인라인 값**을 쓴다. 이 값이 진짜 디자인이다. 각 종류는 `color`(아이콘/텍스트) + `bg`(연한 면) 쌍.

| 케어 | 이모지 | color | bg | 우리 토큰 | 현재 우리 값 |
|------|-------|-------|-----|-----------|-----------|
| 밥(meal) | 🍚 | `#f4846a` | `#fff0ec` | `meal` | `#F2A65A` |
| 간식(snack) | 🦴 | `#a8c8a0` | `#edf7ec` | `treat` | `#E0709A` (핑크, 불일치) |
| 산책(walk) | 🐾 | `#7eb8e8` | `#eaf4fd` | `walk` | `#6FA98C` (초록, 불일치) |

> 참고본은 밥=코랄 / 간식=세이지그린 / 산책=소프트블루. 현재 우리 토큰은 간식=핑크, 산책=초록이라
> 계열이 다름. 맞출지 여부는 `tailwind.config.js` 조정 시 결정.
> (필드명도 참고본은 `snack`, 우리 데이터 모델/토큰은 `treat` — 화면 구현 시 매핑 주의.)

### 자주 쓰이는 시맨틱 (화면 전반)

| 용도 | Figma | 비고 |
|------|-------|------|
| 배지·토글·태그·뒤로가기 버튼 배경 | `--secondary` `#fde8e0` | 가장 많이 등장 |
| 댓글 아바타 배경 | `--accent` `#ffd6cc` | |
| 아이콘 칩·입력창 배경 | `--muted` `#f5ede8` | |
| 성공(복사됨/중성화) | `#6ab87a` / `#a8d8b9` | |
| 로그아웃 버튼 | bg `#fff5f5` · 글자 `#d4183d` · 보더 `#f5c2c7` | |
| 본문 폰트(웹) | `Nunito` | 우리는 Gothic A1 / 제목 Jua로 대체 |

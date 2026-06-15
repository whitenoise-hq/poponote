# Figma Make 원본 코드 (웹 React · 참고 전용)

Figma Make가 생성한 화면 컴포넌트 원본. **실행용이 아니라 레이아웃 설계도 참고용.**
웹 React(react-dom)라 그대로는 못 쓴다. 구조·간격·수치·로직만 읽고,
화면은 React Native(Expo) + NativeWind + `components/ui`로 다시 작성한다.

> 색상은 `../figma-tokens.md`에 정리 완료. shadcn `ui/`·`styles/`·이미지 헬퍼 등
> 참고 가치 없는 보일러플레이트는 삭제했다.

## 남은 파일 (figam-src/app)

- `App.tsx` — 탭 셸 구조(하단 4탭, 활성 탭 배경 = secondary, 이모지 아이콘)
- `components/HomeScreen.tsx` — 홈(펫 헤더 + 오늘의 케어 + 일기 미리보기)
- `components/DiaryScreen.tsx` — 다이어리(캘린더/피드 토글 + 날짜 상세)
- `components/AlbumScreen.tsx` — 앨범(월 폴더 → 3열 그리드 → 사진 상세)
- `components/SettingsScreen.tsx` — 설정(프로필/초대코드/멤버/계정)

## 변환 규칙 (웹 → RN)

- `div`/`section` → `View`, `p`/`span`/`h1` → `Text`, `button` → `Pressable`, `img` → `Image`
- `onClick` → `onPress`, hover/CSS 일부는 RN 미지원
- className은 NativeWind 지원 범위로 재작성, 색은 우리 토큰으로 매핑
- 케어 필드명: 참고본 `snack` ↔ 우리 `treat` 매핑 주의
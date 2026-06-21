# CLAUDE.md

> Claude Code 작업 지침서 · 포포노트 (PopoNote)
> 가족이 함께 쓰는 반려동물 다이어리

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 따르는 기준이다.

**모든 작업 시작 전 이 파일을 가장 먼저 읽는다.** 그 다음 아래 참고 문서를 필요에 맞게 참조한다.

## 참고 문서 (Source of Truth)

- **기획**: `docs/planning.md` — 제품 정의, 핵심 규칙, 기능 명세, MVP 범위, 데이터 구조 초안.
- **기술 스택**: `docs/tech-stack.md` — 아키텍처, Supabase 구조, AI 일기 생성, 이미지 최적화 정책.
- **화면 구현**: `docs/screens.md` — 화면별 구성·동작·이동, 와이어프레임, 데이터↔화면 매핑.
- **개발 순서**: `docs/flow.md` — 단계별(P0~P11) 개발 진행 순서, 산출물·완료 기준, Supabase 셋업 절차.

세 문서와 충돌하는 코드를 작성하지 않는다. 문서를 벗어나는 결정이 필요하면 먼저 확인을 구한다.

## 제품 한 줄 요약

가족이 초대 코드로 함께 들어와, 하루 한 장씩 반려동물의 사진·일기를 쌓고 밥·간식·산책을 같이 챙기는 다이어리 앱.

## 기술 스택

- **프론트엔드**: React Native + Expo, TypeScript
- **라우팅**: Expo Router (파일 기반), 하단 4탭(홈/다이어리/앨범/설정)
- **스타일**: React Native `style` prop + `StyleSheet.create`. 색상 토큰은 `theme/colors.js` 단일 출처.
- **서버 상태**: TanStack Query (React Query). 데이터 신선도는 3중 — ① mutation 시 `invalidateQueries`, ② **Supabase Realtime**(`useRealtimeSync`, 가족 단일 채널)로 다른 구성원 변경 실시간 반영, ③ 화면 포커스/앱 복귀 시 refetch(`useRefetchOnFocus` + `focusManager`). Realtime 수신엔 `supabase.realtime.setAuth(token)`(use-auth)와 `supabase_realtime` publication 등록이 필요.
- **백엔드**: Supabase (Auth / Postgres / Storage / Edge Functions)
- **인증**: 카카오 OAuth (Supabase Auth). 구글은 MVP 범위 밖.
- **AI 일기 생성**: OpenAI GPT-4.1 Mini (비전+텍스트)를 Edge Function 경유 호출. 사진 분석 → 제목+내용 자동 생성.

## 핵심 규칙 (반드시 준수)

- **하루 메인 기록 1개**: 하루에 메인 기록(사진+글)은 1개. 이미 있으면 댓글·반응만. 작성 본인만 삭제, 삭제 시 재작성 가능.
- **본인 것만 수정·삭제**: 메인 기록·케어 기록·댓글 모두. Supabase **RLS로 강제**한다.
- **케어 순차 누적**: 밥·간식·산책은 시간대 고정 없이 누를 때마다 누적. 각 줄에 닉네임+시간. 0시 기준 일일 리셋.
- **반려동물 1마리 기준 UI(MVP)**: 화면은 대표 Pet 1마리 기준. 단 모든 기록은 `pet_id`(FK) 보유 → 여러 마리는 2차 확장. 한 기록 = 한 마리.
- **이미지 정책**: 업로드 시 클라이언트 압축(JPEG 80%, ~1440px + 썸네일 300px). 이미지는 Storage에 저장하고 DB에는 URL만.
- **AI 일기 작성**: 사진 업로드 후 AI(GPT-4.1 Mini)가 사진을 분석해 제목+내용을 자동 생성. 사용자가 수정 후 저장.

## 보안 (반드시 준수)

- **API 키를 클라이언트(RN)에 두지 않는다.** OpenAI API 키 등 민감 정보는 **Edge Function 환경변수(secrets)**에만 보관.
- 클라이언트에는 Supabase URL과 anon key만 둔다.
- 모든 테이블에 **RLS 정책**을 적용한다. 사용자는 자신이 속한 가족 그룹의 데이터만 접근 가능. 본인 작성 레코드만 수정·삭제 가능.

## 코딩 컨벤션

- **언어**: TypeScript. `any` 지양, 타입 명시.
- **컴포넌트**: 함수형 컴포넌트 + Hooks.
- **네이밍**: 컴포넌트 PascalCase, 변수·함수 camelCase, 상수 UPPER_SNAKE_CASE, 파일은 컴포넌트=PascalCase / 그 외=kebab-case 또는 camelCase로 일관 유지.
- **스타일**: `style` prop + `StyleSheet.create` 사용. `className`은 사용하지 않는다(NativeWind 제거됨).
- **디자인 토큰 — 색상**: 색상은 `theme/colors.js`가 **단일 출처**. `import {colors} from '@/theme/colors'`로 참조한다. 컴포넌트에 hex를 직접 박지 않는다(`#...` 금지).
- **UI 컴포넌트**: `components/ui/`의 Text·Card·Button·Screen은 `style` prop으로 오버라이드. Text는 `variant` prop으로 타이포 토큰 적용.
- **폰트**: Pretendard(Regular/Medium/SemiBold/Bold, .otf) + Jua(디스플레이/펫 이름). `assets/fonts/`에 저장.
- **아이콘**: Ionicons(`@expo/vector-icons`) 사용. 이모지 사용 금지(기기별 렌더링 불일치).
- **폴더 구조**:
  ```
  app/            # Expo Router 화면 (파일 기반 라우팅, (tabs) 그룹 포함)
  components/     # 재사용 UI 컴포넌트
  lib/            # supabase 클라이언트, 유틸
  hooks/          # 커스텀 훅 (React Query 등)
  theme/          # 디자인 토큰 단일 출처 (colors.js — 모든 style에서 import)
  types/          # 공용 타입
  supabase/       # 마이그레이션, Edge Functions
  docs/           # 기획/스택/화면 문서 (planning.md, tech-stack.md, screens.md)
  ```
- **데이터 접근**: 컴포넌트에서 Supabase 직접 호출보다, hooks(React Query)로 감싸 재사용.

## 커밋 규칙

- Conventional Commits 사용: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`.
- 메시지는 간결한 한글 또는 영어로 일관되게. 한 커밋 = 한 논리적 변경.

## 권장 개발 순서

1. Expo + TypeScript 초기 세팅, Expo Router로 4탭 골격.
2. Supabase 연동(`@supabase/supabase-js`), `.env` 구성.
3. DB 스키마 + RLS 정책 작성 (planning.md 데이터 구조 기준). → 마이그레이션.
4. 카카오 OAuth 로그인 + 온보딩(그룹 생성 / 코드 참여 + 닉네임).
5. Storage 버킷 + 접근 정책.
6. 핵심 기능: 가족 그룹/초대 코드 → 홈(케어) → 메인 기록 → 다이어리(캘린더/리스트/상세) → 댓글·반응.
7. AI 일기 생성 Edge Function (OpenAI GPT-4.1 Mini, 사진→텍스트).
8. 앨범(연·월 폴더 → 3열 그리드 → 상세).
9. 설정 탭.

## 하지 말 것

- 세 참고 문서의 결정사항을 임의로 변경.
- 클라이언트에 비밀 키 노출.
- RLS 없이 테이블 생성.
- OpenAI API 키를 클라이언트에 노출.
- MVP 범위 밖 기능을 먼저 구현(2차 기능은 planning.md 5.2 참고).

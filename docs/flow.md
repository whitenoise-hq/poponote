# 포포노트 (PopoNote) — 개발 진행 순서 (flow.md)

> Claude Code 개발 진행용 문서
> v1.1 · 2026-06-15 (UI-first 전략으로 재정렬)

이 문서는 포포노트를 **어떤 순서로, 무엇을 산출물로** 개발할지 단계별로 정의한다.
기획은 `planning.md`, 기술 스택은 `tech-stack.md`, 화면은 `screens.md` 참고.
세 문서의 결정사항과 충돌하지 않는다. 벗어나는 결정이 필요하면 먼저 확인을 구한다.

## 읽는 법

- 각 Phase는 **목표 / 선행조건 / 작업 / 산출물 / 완료 기준(DoD)** 으로 구성한다.
- `[MVP]`는 1차 출시 필수, `[2차]`는 범위 밖(planning.md 5.2). 2차는 자리만 고려하고 구현하지 않는다.
- **P 번호는 작업 단위 ID**일 뿐, 실행 순서는 아래 "개발 전략"의 트랙(A→B→C→D→E)을 따른다.

## 개발 전략 (2026-06-15 결정 · UI-first)

**화면(UI)을 mock 데이터로 먼저 다 만들고, 그 뒤에 Supabase를 연결한다.**
데이터 접근은 CLAUDE.md 규칙대로 항상 `hooks/`(React Query)를 거치므로, 처음엔 hook이
mock을 반환하게 하고 나중에 **hook 내부만 Supabase로 교체**한다(화면 컴포넌트는 거의 불변).

```
[A] UI 구현 (mock, hooks 경유)         ← 지금부터
      공용 타입(types/) → mock hooks → 홈/다이어리/앨범/설정 + 작성·댓글 UI
          │
          ▼
[B] 백엔드 기반   = P1 Supabase ─ P2 DB·RLS ─ P3 인증·온보딩 ─ P4 Storage·압축
          │
          ▼
[C] 연결   hooks 내부 mock → Supabase 교체, 인증 라우팅 가드, 서버 제약(하루 1개 등) 연결
          │
          ▼
[D] P8 AI 일기 생성(Edge Function)  ─  [E] P11 출시 준비
```

- 기존 **P5~P10의 화면 작업은 [A]에서 UI(mock), [C]에서 실데이터**로 2-pass 진행.
- **앨범 사진**은 P8 이후 실데이터로 완성(그 전엔 더미 이미지로 레이아웃만).
- **스키마는 UI에서 확정된다**: [A]를 진행하며 화면에 필요한 컬럼이 드러나면 `types/`에 먼저
  반영하고, [B]의 P2 마이그레이션은 그 결과를 토대로 작성한다. 즉 **P2 테이블 정의는 초안**이며,
  발견되는 컬럼(예: 펫 체중·성별·중성화, 멤버 역할, 일기 제목 등)을 모아 확정한다. → 아래 "스키마 변경 메모" 참고.

---

## P0 — 프로젝트 기반 세팅 `[MVP]` ✅ 완료

**목표**: Expo + TS + NativeWind + Expo Router 4탭 골격 + 디자인 시스템.

**작업**
- ✅ Expo + TypeScript 프로젝트, Expo Router 세팅. (NativeWind은 Phase A 중 제거, inline style로 전환)
- ✅ 하단 4탭(홈/다이어리/앨범/설정) — `app/(tabs)/_layout.tsx`.
- ✅ 디자인 토큰: 색상(primary/cream/ink/케어)·폰트·라운드·그림자를 `tailwind.config.js`에 정의.
- ✅ 공통 UI 컴포넌트: `components/ui/`에 Screen·Text·Button·Card + 배럴.
- ✅ 폰트 로드(Pretendard·Jua) + 스플래시 제어, 디자인 참고본 정리(`docs/design/references/`).

**산출물**: `app/_layout.tsx`, `app/(tabs)/*`, `tailwind.config.js`, `components/ui/*`, `lib/cn.ts`

**DoD**: ✅ 4탭 전환 동작, 토큰 기반 스타일 렌더.

---

## A — UI 구현 (mock 데이터) `[MVP]` ✅ 완료

**목표**: 모든 화면을 mock 데이터로 구현해 디자인·UX를 확정한다. 백엔드 없이 동작.

**선행조건**: P0. 참고: `docs/design/references/`(캡처·화면 코드·`figma-tokens.md`).

**작업**
- ✅ **공용 타입**(`types/index.ts`): Family, Member, Pet, DiaryEntry, CareLog, Comment, Reaction.
  Pet에 `weight`/`sex`/`neutered`, DiaryEntry에 `title` 포함.
- ✅ **mock 데이터 + mock hooks**(`hooks/`): React Query(`@tanstack/react-query`) 형태로 8개 hook 구현.
  `lib/mock-data.ts`에 mock 데이터 중앙화, mutation 지원(케어 추가·댓글·반응 토글·기록 작성).
- ✅ **디자인 토큰 정렬**: 케어 색상 Figma 기준(meal=코랄, treat=세이지그린, walk=소프트블루),
  시맨틱 토큰(secondary/muted/accent) 추가.
- ✅ **폰트 교체**: Gothic A1 → Pretendard(.otf). 이모지 전부 Ionicons로 교체.
- ✅ **화면 구현**:
  - ✅ 홈: 펫 헤더 + 그라데이션 배경 + 케어(밥/간식/산책, 메모 입력) + 일기 미리보기/빈 상태.
  - ✅ 다이어리: [캘린더|피드] 토글(Animated 슬라이딩, Figma 기준), 캘린더(선택 날짜 코랄 원형 배경,
    하단 DayPreview), 피드 카드(사진+제목+날짜+EntryStatsBar), 날짜 상세(기록+좋아요+케어 아코디언+댓글).
  - ✅ 앨범: 월 폴더 → 3열 그리드 → 사진 상세(더미 이미지).
  - ✅ 설정: 펫 프로필(통계·태그) + 초대 코드(복사) + 가족 멤버 + 계정/기타 + 로그아웃.
  - ✅ 작성 UI: 사진 플레이스홀더 + 제목/본문 입력 + 저장.
  - ✅ 댓글: 목록 + 하단 고정 입력바(disabled 처리) + 삭제.
- ✅ **디자인 토큰 단일화**: 색상 단일 출처 `theme/colors.js` 도입 → 컴포넌트 hex 하드코딩 전부 토큰으로 교체.
- ✅ **NativeWind 제거 → inline style 전환**: NativeWind/tailwind-merge/clsx 의존성 제거. 31개 파일의 `className`을 `style` prop으로 전환. UI 컴포넌트(Text/Card/Button/Screen) 인터페이스 `className` → `style`로 변경. `lib/cn.ts`, `global.css` 삭제, `babel.config.js`·`metro.config.js` 정리.
- ✅ **디자인 다듬기**:
  - 앨범: 월별 카드 간격 축소, 상세 버튼 pill 리디자인(공유 제거), 그리드 style 전환, 월 헤더 `YYYY년 MM월` + 장수 오른쪽 정렬.
  - 설정: 섹션별 제목(반려동물 프로필/가족 초대/가족 멤버/계정&기타), 섹션 border, 초대코드 복사 아이콘화, 멤버 구분선, 행 높이 통일, 로그아웃 pill, 하단 버전 표시.
  - 반려동물 프로필 수정 페이지(`app/settings/edit-pet.tsx`) 신규 — 이름/종류/생일/체중/성별(아이콘+색상)/중성화.
  - 다이어리 상세 헤더 날짜 가운데 정렬.
  - 홈·캘린더 일기 빈 상태 dashed 코랄 디자인, 케어만 있는 날 좋아요/댓글 숨김.
  - Card 그림자 제거, cream border 통일.
- ✅ **공통 모달**: `Modal`(자유 콘텐츠), `AlertModal`(확인/취소) — 전체 `Alert.alert` 교체.
- ✅ **로그인·온보딩**: 카카오 로그인, 온보딩 분기(새로 시작/코드 참여), 반려동물 등록, 초대코드 결과, 코드 입력, 닉네임/관계 설정. mock 인증 상태 + 라우팅 가드.
- ✅ **설정 서브 화면**: 내 계정(회원탈퇴), 개인정보처리방침, 도움말&피드백(FAQ 아코디언). 알림설정·반려동물추가 2차로 주석 처리.
- ✅ **캘린더 오늘 기본 선택**, 다이어리 빈 상태에서 작성 화면 이동, edit-pet input 높이 고정 + 빈값 저장 비활성화.

**산출물**: `app/(tabs)/*`, `app/diary/*`·`app/album/*`·`app/entry/*`·`app/photo-detail/*`, `components/*`, `hooks/*`(mock), `types/*`

**DoD**: ✅ 모든 탭·주요 sub-screen이 mock으로 동작(탐색·토글·추가가 화면상 반영), 디자인 확정. 로그인·온보딩 플로우 포함.

---

## P1 — Supabase 연동 기반 `[MVP]` ✅ 완료

**목표**: 앱에서 Supabase에 접근할 수 있는 클라이언트와 서버 상태 레이어 구성.

**선행조건**: Supabase 프로젝트 생성(클라우드).

**작업**

*(1) 웹에서 한 번만 (손으로)*
- supabase.com 로그인 → **New Project** 생성(리전: 서울 권장, DB 비밀번호 설정).
- 발급된 `Project URL` + `anon key` 확보(anon key는 클라이언트 공개 가능 범위).

*(2) 로컬 CLI 연결*
```bash
brew install supabase/tap/supabase   # CLI 설치
supabase login                       # 브라우저 토큰으로 인증 (사용자가 직접 실행)
supabase init                        # supabase/ 폴더 초기화
supabase link --project-ref <ref>    # 원격 프로젝트와 연결
```
> `supabase login`은 브라우저 토큰이 필요해 **사용자가 터미널에서 직접** 실행한다(`! supabase login`).

*(3) 앱 연동*
- `@supabase/supabase-js` 설치, 클라이언트 생성 → `lib/supabase.ts`.
- 환경변수: 클라이언트엔 **URL + anon key만**. `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` (`.env`, `app.json`/`expo-constants`). `.env`는 커밋 금지(이미 gitignore).
- TanStack Query 설치 + `QueryClientProvider`를 `app/_layout.tsx`에 래핑 → `lib/query-client.ts`.
- 데이터 접근은 컴포넌트 직접 호출 금지, **`hooks/`(React Query)로 감싼다**(CLAUDE.md 규칙).

**산출물**: `lib/supabase.ts`, `lib/query-client.ts`, `.env.example`, `supabase/`(init 결과), `app/_layout.tsx`(Provider 추가)

**DoD**: 앱에서 Supabase에 ping(간단 select) 성공, React Query devtools/캐시 동작.

---

## P2 — 데이터 모델 & RLS (마이그레이션) `[MVP]` ✅ 완료

**목표**: planning.md 7번 데이터 구조를 실제 테이블·정책으로 구현. **RLS 없는 테이블은 만들지 않는다.**

**선행조건**: P1, **A(UI)** — 아래 테이블은 **초안**이며, UI에서 확정된 컬럼("스키마 변경 메모")을 반영해 마무리한다.

**테이블** (planning.md 7 기준 초안, 모든 기록은 `pet_id` FK 보유)
- `families` (id, invite_code unique, owner_id, created_at)
- `members` (id, family_id, user_id, nickname, joined_at)
- `pets` (id, family_id, name, species, birthday, adopted_at, profile_url)
- `diary_entries` (id, family_id, pet_id, date, author_id, title, body, photo_url, illustration_url(deprecated), created_at, updated_at)
  - **하루 1개 제약**: `UNIQUE(family_id, pet_id, date)`.
- `care_logs` (id, family_id, pet_id, date, kind[meal/treat/walk], author_id, logged_at, memo)
- `comments` (id, entry_id, author_id, body, created_at)
- `reactions` (id, entry_id, author_id, kind) — `UNIQUE(entry_id, author_id, kind)`.

**RLS 정책** (tech-stack.md 3.2)
- SELECT: 요청자가 **그 행의 family에 속한 멤버**일 때만. → helper `is_family_member(family_id)` 작성.
- INSERT: 본인(`author_id = auth.uid()` 매핑) + 소속 family 한정.
- UPDATE/DELETE: **본인 작성 레코드만** (메인 기록·케어·댓글·반응 공통).
- comments/reactions는 `entry_id` → diary_entries → family 경유로 멤버십 확인.

**적용 흐름 (CLI)**
```bash
supabase migration new init_schema   # supabase/migrations/xxxx_init_schema.sql 생성
#   → 테이블 + 인덱스 + RLS + helper 함수 SQL 작성
supabase db push                      # 원격 DB에 마이그레이션 적용
supabase gen types typescript --linked > types/database.ts   # TS 타입 생성
```
> 테이블 설계는 **대시보드 클릭이 아니라 마이그레이션 SQL**로 한다(git 관리·재현·RLS 리뷰 목적).

**산출물**: `supabase/migrations/*.sql` (테이블 + 인덱스 + RLS + helper 함수), `types/database.ts`(supabase gen types).

**DoD**: ✅ 마이그레이션 적용 성공(`supabase db push`), `types/database.ts` 생성 완료. RLS 테스트는 P3 인증 연동 후 실데이터로 검증 예정.

---

## P3 — 인증 & 온보딩 `[MVP]` ✅ 완료

**목표**: 카카오 로그인 → 그룹 소속 여부에 따른 분기 → 온보딩 완료까지(screens.md 2).

**선행조건**: P2(members/families/pets 테이블).

**작업**
- ✅ 카카오 OAuth (Supabase Auth provider + Expo WebBrowser + deep link redirect).
- ✅ 세션 관리 hook: `hooks/use-auth.ts` (세션, 로그인/로그아웃).
- ✅ **라우팅 가드** (`app/_layout.tsx` AuthGate):
  - 미인증 → 로그인 화면.
  - 인증 + 그룹 없음 → 온보딩 분기.
  - 인증 + 그룹 있음 → `(tabs)` 홈.
  - 스플래시 유지: 라우팅 결정까지 네이티브 스플래시 표시, 홈 깜빡임 방지(`app/index.tsx`).
- ✅ 온보딩 화면(Supabase 실연동):
  - 분기: [새로 시작] / [코드로 참여].
  - 최초 사용자: 펫 등록 → 닉네임 설정(관계 default 보호자) → family+pet+member 생성 → 초대코드 공유 → 홈.
  - 초대받은 사용자: 코드 검증(DB) → 닉네임+관계 설정 → 멤버 등록 → 홈.
  - 닉네임/관계 특수문자 차단(한글/영어/숫자만), 생일 DatePickerModal, 프로필 사진 ImagePicker.
- ✅ **회원 탈퇴**: `delete_account()` RPC — owner family cascade 삭제 + 멤버 탈퇴 + signOut.
- ✅ **DB 수정**: grant_permissions(테이블 접근 권한), fix_families_rls(owner SELECT 허용).

**산출물**: `app/(auth)/login.tsx`, `app/(onboarding)/*`, `hooks/use-auth.ts`, `lib/onboarding.ts`, `lib/invite-code.ts`, `components/ui/DatePickerModal.tsx`, `supabase/migrations/*`

**DoD**: ✅ 두 경로(생성/참여) 모두 홈 진입, 닉네임 저장, 잘못된 코드 처리, 회원 탈퇴 동작 확인.

---

## P4 — Storage & 이미지 압축 파이프라인 `[MVP]` ✅ 완료

**목표**: 이미지 저장 버킷·정책과 **업로드 전 클라이언트 압축** 유틸 (tech-stack.md 3.3).

**선행조건**: P2.

**작업**
- 버킷 분리: `photos`(압축본) / `profiles`(프로필). (`illustrations` 버킷은 deprecated)
- 접근 정책: 해당 family 멤버만 read/write.
- 클라이언트 압축 유틸 (`expo-image-manipulator`):
  - 가로 1080~1440px 리사이즈, **WebP**, 수백 KB 목표.
  - **썸네일(300px)** 별도 생성(목록/앨범용).
- 업로드 유틸: `lib/storage.ts` (압축 → 업로드 → URL 반환).

**산출물**: `supabase/`(버킷 정책 SQL/설정), `lib/image.ts`(압축), `lib/storage.ts`(업로드)

**DoD**: ✅ 버킷 생성·RLS 적용, 압축·썸네일·프로필 유틸 구현, 온보딩 프로필 업로드 연결.

---

## P5~P7 + C — hooks Supabase 교체 + mock 제거 `[MVP]` ✅ 완료

**목표**: 전체 hooks를 mock → Supabase로 교체하고, 컴포넌트의 mock-data 직접 참조를 제거.

**완료 작업**
- ✅ 전체 hooks(8개) mock → Supabase 쿼리/뮤테이션 교체:
  use-current-user, use-pet, use-family, use-care-logs, use-diary, use-comments, use-reactions, use-album.
- ✅ use-diary: 사진 업로드 연동(uploadDiaryPhoto).
- ✅ 컴포넌트 mock-data 참조 전부 제거 (getMemberNickname → useMemberMap, CURRENT_USER_ID → useAuth, getReactions/getComments → hooks, TODAY → 로컬 함수).
- ✅ mock-data.ts, auth-store.ts 삭제. mock import 0개.
- ✅ 미사용 파일 정리 (tailwind.config.js, figma-code 등).

**추후 보완 필요 (TODO)**
- ✅ 다이어리 캘린더: 전체 날짜의 케어/기록 유무 점 표시 — useAllCareLogs hook 추가, 전체 월 데이터로 점 표시.
- ✅ 리스트뷰 좋아요/댓글 카운트 — DiaryListCard에서 useReactions/useComments hook 직접 호출.
- ✅ 케어 기록 본인 줄 길게눌러 삭제 UI — 홈 CareCard에서 구현 완료 (다이어리 상세에서는 미적용, 홈에서만 삭제).
- ✅ 일기 수정 화면 (app/entry/[id]/edit.tsx) — 작성자만 수정 가능, 수정 완료 모달.
- ✅ 낙관적 업데이트(optimistic update) — 케어 추가, 댓글 추가/삭제, 반응 토글에 적용.
- 🔲 로딩/에러/빈 상태 처리 점검 — 실데이터 환경에서 각 화면 검증. 전체 연동 후 마지막에 진행.

---

## P8 이전 남은 TODO (위 P5~P7+C에서 미완)

---

## P8 — AI 일기 생성 Edge Function `[MVP]` ✅ 완료

**목표**: 사진 업로드 → AI가 일기 제목+내용 자동 생성 (tech-stack.md 4). **API 키는 Edge Function secrets에만.**

> **변경 이력**: 기존 일러스트 변환(Stability AI SD3)은 품질 문제(동물 변경)로 제거. AI 일기 작성 기능으로 대체.

**완료 작업**
- ✅ Edge Function `generate-diary`: OpenAI GPT-4.1 Mini (비전+텍스트). 사진 분석 → 제목+내용 JSON 반환.
- ✅ `lib/generate-diary.ts`: 클라이언트 래퍼, title + body 반환.
- ✅ 일기 등록 플로우 변경: 사진 선택 → 업로드 → AI 생성 → 제목/내용 자동 채움 → 사용자 수정 → 저장.
- ✅ 로딩 오버레이: "사진 업로드 중..." → "AI가 일기 작성 중..." + 스피너.
- ✅ 제목/내용 비활성화: 사진 선택 전에는 비활성화, AI 완료 후 편집 가능.
- ✅ 기존 일러스트 관련 코드 전면 정리 (FlipImage, illustration_url, transform-image, lib/transform.ts 삭제).
- ✅ illustration_url 컬럼 삭제 마이그레이션, illustrations 버킷·정책 제거.
- ✅ 일기 삭제 시 Storage 사진 함께 삭제.
- ✅ 앨범 탭: photo_url 기반으로 전환.

**산출물**: `supabase/functions/generate-diary/index.ts`, `lib/generate-diary.ts`, `app/entry/new.tsx`(리워크), `hooks/use-diary.ts`(useGenerateDiaryText 추가), `supabase/migrations/20260618000000_remove_illustration.sql`

**DoD**: ✅ 사진 업로드 → AI 제목/내용 생성 → 사용자 수정 → 저장 동작 확인.

---

## P9 — 앨범 탭 `[MVP]` ✅ 완료

**목표**: 일기 사진을 연·월 폴더로 모아보기 (screens.md 6).

**선행조건**: P8.

**완료 작업**
- ✅ 폴더 목록(6.2): 연·월 폴더 최신순, 표지=그 달 첫 장+"YYYY.MM"+총 장수, 기록 있는 달만.
- ✅ 월 그리드(6.3): 가로 3열, 최신순. date 타입 범위 쿼리로 수정.
- ✅ 사진 상세(6.4): 크게 보기, 저장(갤러리/expo-media-library)·공유(expo-sharing), 다이어리로 이동.
- ✅ `hooks/use-album.ts`: `photo_url` 기반 쿼리 전환 완료.
- ✅ `app.json` + `Info.plist`: 사진 갤러리 권한 설정.

**산출물**: `app/(tabs)/album.tsx`, `app/album/[month].tsx`, `app/photo-detail/[id].tsx`, `hooks/use-album.ts`, `components/album/PhotoDetail.tsx`

**DoD**: ✅ 폴더→그리드→상세 이동, 저장/공유, 날짜 상세로 점프 동작 확인.

---

## P10 — 설정 탭 `[MVP]` ✅ 완료

**목표**: screens.md 7.1.

**선행조건**: P3.

**완료 작업**
- ✅ 가족 그룹: 초대 코드 보기·복사, 멤버 목록, 닉네임 변경(모달).
- ✅ 반려동물 프로필: 이름·종·생일·체중·성별·중성화·사진 수정 (useUpdatePet + Storage 업로드).
- ✅ 내 계정: 카카오 프로필 사진·이름·이메일·로그인 방식 표시. 회원 탈퇴(delete_account RPC).
- ✅ 로그아웃: 확인 모달.
- ✅ 이용약관: 11개 조항 (terms.tsx 신규).
- ✅ 개인정보처리방침: 9개 조항 보강 (제3자 제공·처리 위탁·안전성 확보·책임자 추가).
- ✅ 도움말 & 피드백: FAQ 8개 + 앱 내 문의 메일 전송 (Resend API, send-inquiry Edge Function).
- ✅ 버전 표시.

**산출물**: `app/(tabs)/settings.tsx`, `app/settings/*`, `hooks/use-pet.ts`(useUpdatePet), `hooks/use-current-user.ts`(useUpdateNickname), `supabase/functions/send-inquiry/`, `lib/constants.ts`

**DoD**: ✅ 코드 복사, 닉네임 변경, 프로필 수정, 로그아웃·탈퇴, 이용약관, 개인정보처리방침, 문의하기 동작 확인.

---

## P11 — 출시 준비 `[MVP]`

**목표**: 스토어 제출 가능 상태.

**작업**
- 약관/개인정보처리방침 링크, 회원 탈퇴 흐름 최종 점검.
- 앱 아이콘·스플래시(`assets/`) 포포노트 자체 에셋으로 교체(현재 Expo 템플릿 잔여물 정리).
- `pnpm typecheck`·lint 통과, 빈 상태/에러/로딩 처리 점검.
- Expo 빌드 → App Store / Google Play 제출. Edge Functions는 Supabase CLI 배포.

**DoD**: 타입·lint 클린, 핵심 플로우 E2E 통과, 빌드 산출.

---

## 스키마 변경 메모 (UI에서 발견되는 컬럼)

UI-first 진행 중 화면에 필요해 드러난 컬럼을 여기 모은다. P2 마이그레이션 작성 시 반영해 확정한다.
(`P2 초안`에 없던 것 위주. 출처: `docs/design/references/` 화면 코드)

| 테이블 | 컬럼 | 비고 | 상태 |
|--------|------|------|------|
| `pets` | `weight` | 체중(예: 28.5kg). 설정에서 추가 등록·편집. 단위·이력 보관 여부 결정 필요 | 확정 |
| `pets` | `sex` | 성별(수컷/암컷). 설정에서 추가 등록·편집 | 확정 |
| `pets` | `neutered` | 중성화 여부(boolean). 설정에서 추가 등록·편집 | 확정 |
| `members` | `role` | 역할(보호자/가족 등). 권한과 연결할지 결정 | 검토 |
| `diary_entries` | `title` | 일기 제목(예: "산책 중에 발견한 민들레"). P2 초안은 `body`만. UI에서 사용 중 | 확정 |

> "기록 156일", "총 N번" 등은 컬럼이 아니라 **집계(파생)** 값 — 쿼리/뷰로 처리.
> 새 항목이 생기면 이 표에 추가하고, P2에서 일괄 확정한다.

---

## 범위 밖 (`[2차]`, planning.md 5.2 — 지금 구현하지 않음)

- 푸시 알림(일기 없을 때/새 댓글), 기념일 등록·알림
- 월별 사진 콜라주/회고, 통계
- 반려동물 여러 마리 전환 UI (데이터는 `pet_id`로 이미 대비)
- 케어 항목 확장(물·약), 산책 시간·거리

---

## 미확정 (개발 중 결정 — 결정 전 임의 확정 금지)

- 사진 보관 용량 한도.
- 사진 교체 허용 여부(수정 시 AI 재생성) — 구현 시 결정.
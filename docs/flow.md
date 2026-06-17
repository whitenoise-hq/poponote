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
[D] P8 이미지 변환(Edge Function)  ─  [E] P11 출시 준비
```

- 기존 **P5~P10의 화면 작업은 [A]에서 UI(mock), [C]에서 실데이터**로 2-pass 진행.
- **앨범 일러스트**는 변환(P8/[D]) 이후 진짜 데이터로 완성(그 전엔 더미 이미지로 레이아웃만).
- **스키마는 UI에서 확정된다**: [A]를 진행하며 화면에 필요한 컬럼이 드러나면 `types/`에 먼저
  반영하고, [B]의 P2 마이그레이션은 그 결과를 토대로 작성한다. 즉 **P2 테이블 정의는 초안**이며,
  발견되는 컬럼(예: 펫 체중·성별·중성화, 멤버 역할, 일기 제목 등)을 모아 확정한다. → 아래 "스키마 변경 메모" 참고.

---

## P0 — 프로젝트 기반 세팅 `[MVP]` ✅ 완료

**목표**: Expo + TS + NativeWind + Expo Router 4탭 골격 + 디자인 시스템.

**작업**
- ✅ Expo + TypeScript 프로젝트, Expo Router 세팅. (NativeWind은 Phase A 중 제거, inline style로 전환)
- ✅ 하단 4탭(홈/다이어리/일러스트 앨범/설정) — `app/(tabs)/_layout.tsx`.
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

## P1 — Supabase 연동 기반 `[MVP]` ← 다음 단계

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

## P2 — 데이터 모델 & RLS (마이그레이션) `[MVP]`

**목표**: planning.md 7번 데이터 구조를 실제 테이블·정책으로 구현. **RLS 없는 테이블은 만들지 않는다.**

**선행조건**: P1, **A(UI)** — 아래 테이블은 **초안**이며, UI에서 확정된 컬럼("스키마 변경 메모")을 반영해 마무리한다.

**테이블** (planning.md 7 기준 초안, 모든 기록은 `pet_id` FK 보유)
- `families` (id, invite_code unique, owner_id, created_at)
- `members` (id, family_id, user_id, nickname, joined_at)
- `pets` (id, family_id, name, species, birthday, adopted_at, profile_url)
- `diary_entries` (id, family_id, pet_id, date, author_id, body, photo_url, illustration_url, created_at, updated_at)
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

**DoD**: 마이그레이션 적용 성공, 다른 가족 데이터 접근 차단 확인(RLS 테스트), 타입 생성.

---

## P3 — 인증 & 온보딩 `[MVP]`

**목표**: 카카오/구글 로그인 → 그룹 소속 여부에 따른 분기 → 온보딩 완료까지(screens.md 2).

**선행조건**: P2(members/families/pets 테이블).

**작업**
- 카카오/구글 OAuth (Supabase Auth provider + Expo deep link redirect).
- 세션 관리 hook: `hooks/use-auth.ts` (세션, 로그인/로그아웃).
- **라우팅 가드** (`app/_layout.tsx` 또는 그룹 레이아웃):
  - 미인증 → 로그인 화면.
  - 인증 + 그룹 없음 → 온보딩 분기.
  - 인증 + 그룹 있음 → `(tabs)` 홈.
- 온보딩 화면(탭 바깥, 풀스크린):
  - 분기: [새로 시작] / [코드로 참여] (screens.md 2.2).
  - 최초 사용자: 반려동물 등록 → family 생성(작성자=방장) + pet 생성 + 초대코드 발급 + 본인 멤버 등록 (2.3).
  - 초대받은 사용자: 코드 검증 → 닉네임(목록 선택 + 직접 입력) → 멤버 등록 (2.4).

**산출물**: `app/(auth)/login.tsx`, `app/(onboarding)/*`, `hooks/use-auth.ts`, `hooks/use-family.ts`, `lib/invite-code.ts`

**DoD**: 두 경로(생성/참여) 모두 홈 진입, 닉네임 저장, 잘못된 코드 처리.

---

## P4 — Storage & 이미지 압축 파이프라인 `[MVP]`

**목표**: 이미지 저장 버킷·정책과 **업로드 전 클라이언트 압축** 유틸 (tech-stack.md 3.3). *변환(일러스트화)은 P8.*

**선행조건**: P2.

**작업**
- 버킷 분리: `photos`(압축본) / `illustrations`(변환본) / `profiles`(프로필).
- 접근 정책: 해당 family 멤버만 read/write.
- 클라이언트 압축 유틸 (`expo-image-manipulator`):
  - 가로 1080~1440px 리사이즈, **WebP**, 수백 KB 목표.
  - **썸네일(300px)** 별도 생성(목록/앨범용).
- 업로드 유틸: `lib/storage.ts` (압축 → 업로드 → URL 반환).

**산출물**: `supabase/`(버킷 정책 SQL/설정), `lib/image.ts`(압축), `lib/storage.ts`(업로드)

**DoD**: 사진 선택 → 압축본+썸네일 업로드 → URL 획득, 비멤버 접근 차단.

---

## P5 — 홈 탭: 케어 기록 `[MVP]`

**목표**: screens.md 3 — 오늘 케어 보기·입력 + 오늘 일기 미리보기.

**선행조건**: P3, P4.

**작업**
- 홈 레이아웃: ① 반려동물 정보(대표 Pet) ② 오늘 케어 ③ 오늘 일기 미리보기.
- 케어 hooks: `hooks/use-care-logs.ts` (오늘 날짜 필터 = 0시 리셋, 종류별 그룹).
  - 밥: [+추가] 즉시 기록(메모 없음).
  - 간식·산책: [+추가] → 메모 입력 시트(선택) → 저장.
  - 각 줄: 닉네임 + 시간, **본인 줄만** 길게눌러 수정/삭제(RLS로도 강제).
- 오늘 일기 미리보기 분기: 있으면 썸네일+글 → 상세로, 없으면 "오늘 일기를 남겨주세요" → 작성으로(P6 연결).

**산출물**: `app/(tabs)/index.tsx`, `components/care/*`, `hooks/use-care-logs.ts`, 케어 추가 시트

**DoD**: 케어 추가/수정/삭제 동작, 0시 기준 오늘 분만 표시, 본인 권한 검증.

---

## P6 — 메인 기록 & 다이어리 `[MVP]`

**목표**: 메인 기록 작성/수정 + 다이어리 탭(캘린더/리스트/날짜 상세). screens.md 4·5.

**선행조건**: P4(이미지 업로드), P5(홈 미리보기 연결). *일러스트 변환은 P8에서 연결 — 그 전엔 압축본/썸네일로 표시.*

**작업**
- 메인 기록 작성(5.1): 사진 선택→압축→업로드, 글 입력, 저장.
  - **하루 1개 가드**: 저장 시점 중복이면(동시성) 안내 후 댓글·반응 유도. DB `UNIQUE` + 앱 가드 이중.
- 메인 기록 수정(5.2): 본인만, 글 수정 중심(사진 교체 시 재변환은 P8 정책 따름).
- 다이어리 탭(4):
  - [캘린더 | 리스트] 토글, **마지막 선택 보기 사용자별 저장**.
  - 캘린더: 날짜별 기록·케어 유무 점 표시 → 날짜 상세.
  - 리스트: 최신순 카드(날짜+썸네일+글 일부) → 날짜 상세.
  - 날짜 상세(4.5/4.6): 메인 기록 + 그날 케어 전체 + (댓글·반응은 P7).

**산출물**: `app/entry/new.tsx`, `app/entry/[id]/edit.tsx`, `app/(tabs)/diary.tsx`, `app/diary/[date].tsx`, `hooks/use-diary.ts`, `components/diary/*`

**DoD**: 작성→상세 확인, 하루 1개 강제, 캘린더/리스트 전환·보기 저장, 본인 수정/삭제·재작성.

---

## P7 — 댓글 / 반응 `[MVP]`

**목표**: 날짜 상세 내 댓글·반응 (screens.md 4.5 ③④).

**선행조건**: P6(날짜 상세).

**작업**
- 댓글: 목록 + 입력창 + 전송, **본인 댓글만** 수정·삭제.
- 반응: 좋아요/이모지 토글, 카운트.
- hooks: `hooks/use-comments.ts`, `hooks/use-reactions.ts`(낙관적 업데이트 권장).

**산출물**: `components/diary/comments.tsx`, `components/diary/reactions.tsx`, 위 hooks

**DoD**: 댓글 CRUD(본인 한정), 반응 토글·집계, RLS 검증.

---

## C — 연결 (mock → Supabase) `[MVP]`

**목표**: [A]에서 만든 화면을 실데이터로 전환. **hook 내부만 교체**, 화면 컴포넌트는 유지.

**선행조건**: A(UI), P1~P4(백엔드 기반).

**작업**
- `hooks/*`의 mock 반환을 Supabase 쿼리/뮤테이션으로 교체(React Query 키·캐시 유지).
- 인증 라우팅 가드 적용(미인증→로그인, 그룹 없음→온보딩) — P3 연동.
- 서버 제약 연결: 하루 1개(UNIQUE), 본인만 수정·삭제(RLS), 0시 케어 리셋 등.
- 이미지: 작성 시 압축·업로드(P4), 표시용 URL 사용. *일러스트 변환 연결은 [D].*
- mock 데이터·임시 코드 제거, 로딩/빈 상태/에러 처리 점검.

**산출물**: `hooks/*`(Supabase 구현), `app/_layout.tsx`(가드), mock 제거 diff

**DoD**: 화면이 실제 DB 데이터로 동작, 권한·제약 강제 확인, mock 잔존 없음.

---

## P8 — 이미지 변환 Edge Function `[MVP]`

**목표**: 사진 → 일러스트 자동 변환 (tech-stack.md 4). **API 키는 Edge Function secrets에만.**

**선행조건**: P4(Storage), P6(작성 플로우).

**작업**
- Edge Function(`supabase/functions/transform-image/`): 입력 이미지 → 외부 생성 API 호출 → 일러스트 저장.
- **변환 로직 모듈 추상화**: 모델/제공사 교체 시 한 곳만 수정(tech-stack.md 4.2). 모델은 추후 결정(4.3) — 인터페이스 먼저.
- 처리 흐름(4.2): 압축본 업로드 → 변환 입력 임시 보관 → Edge Function 변환 → 일러스트 저장 → **변환 완료 즉시 원본/임시 입력 삭제**(압축본+일러스트만 잔존).
- 비용 제어: 그룹/사용자당 변환 횟수 제한(4.4).
- 작성 플로우 연결: 변환 진행 중 로딩/플레이스홀더, **실패 시 재시도**.

**산출물**: `supabase/functions/transform-image/index.ts`, `lib/transform.ts`(클라이언트 트리거), 작성 화면 로딩/재시도 UI

**DoD**: 작성 시 일러스트 생성·앨범 노출, 원본 삭제 확인, 키 비노출, 실패 재시도, 횟수 제한 동작.

---

## P9 — 일러스트 앨범 탭 `[MVP]`

**목표**: 변환 일러스트를 연·월 폴더로 모아보기 (screens.md 6).

**선행조건**: P8.

**작업**
- 폴더 목록(6.2): 연·월 폴더 최신순, 표지=그 달 첫 장+"YYYY.MM"+총 장수, **기록 있는 달만**.
- 월 그리드(6.3): 가로 3열, 최신순.
- 일러스트 상세(6.4): 크게 보기, 저장(다운로드)·공유, "이 일러스트의 다이어리로 이동".

**산출물**: `app/(tabs)/album.tsx`, `app/album/[month].tsx`, `app/album/photo/[id].tsx`, `hooks/use-album.ts`

**DoD**: 폴더→그리드→상세 이동, 저장/공유, 날짜 상세로 점프.

---

## P10 — 설정 탭 `[MVP]`

**목표**: screens.md 7.1.

**선행조건**: P3.

**작업**
- 가족 그룹: 초대 코드 보기·공유(카톡 등), 멤버 목록, 내 닉네임 변경, 그룹 나가기.
- 반려동물 프로필: 이름·종·생일·입양일·프로필 사진 수정.
- 계정: 로그인 정보 표시, 로그아웃, **회원 탈퇴**(스토어 심사 필수).
- 앱 정보: 버전, 이용약관·개인정보처리방침, 문의하기, 오픈소스 라이선스.

**산출물**: `app/(tabs)/settings.tsx`, `app/settings/*`

**DoD**: 코드 공유, 닉네임 변경, 프로필 수정, 로그아웃·탈퇴 동작.

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
- 월별 일러스트 콜라주/회고, 통계
- 반려동물 여러 마리 전환 UI (데이터는 `pet_id`로 이미 대비)
- 케어 항목 확장(물·약), 산책 시간·거리, 변환 스타일 선택

---

## 미확정 (개발 중 결정 — 결정 전 임의 확정 금지)

- 이미지 변환 구체 모델 (tech-stack.md 4.3) — 품질·비용 보고 P8 중 결정.
- 사진 원본 보관 기간·용량 한도.
- 사진 교체 허용 여부(수정 시 재변환) — P6/P8에서 결정.
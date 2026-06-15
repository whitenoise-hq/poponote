# 포포노트 (PopoNote) — 개발 진행 순서 (flow.md)

> Claude Code 개발 진행용 문서
> v1.0 · 2026-06-15

이 문서는 포포노트를 **어떤 순서로, 무엇을 산출물로** 개발할지 단계별로 정의한다.
기획은 `planning.md`, 기술 스택은 `tech-stack.md`, 화면은 `screens.md` 참고.
세 문서의 결정사항과 충돌하지 않는다. 벗어나는 결정이 필요하면 먼저 확인을 구한다.

## 읽는 법

- 각 Phase는 **목표 / 선행조건 / 작업 / 산출물 / 완료 기준(DoD)** 으로 구성한다.
- `[MVP]`는 1차 출시 필수, `[2차]`는 범위 밖(planning.md 5.2). 2차는 자리만 고려하고 구현하지 않는다.
- 의존성이 큰 순서대로 정렬했다. **데이터·인증 기반(P1~P4)을 먼저 깔고**, 그 위에 화면 기능(P5~P10)을 올린다.

## 전체 흐름 한눈에

```
P0 기반 세팅 ─ P1 Supabase 연동 ─ P2 DB·RLS ─ P3 인증·온보딩 ─ P4 Storage·이미지 압축
   (완료)                                                            │
                                                                     ▼
        P5 홈(케어) ─ P6 메인 기록·다이어리 ─ P7 댓글·반응
                                  │
                                  ▼
        P8 이미지 변환(Edge Function) ─ P9 일러스트 앨범 ─ P10 설정 ─ P11 출시 준비
```

---

## P0 — 프로젝트 기반 세팅 `[MVP]` ✅ 대부분 완료

**목표**: Expo + TS + NativeWind + Expo Router 4탭 골격.

**작업**
- ✅ Expo + TypeScript 프로젝트, Expo Router, NativeWind 세팅.
- ✅ 하단 4탭(홈/다이어리/일러스트 앨범/설정) — `app/(tabs)/_layout.tsx`, 각 탭 placeholder.
- ⬜ 디자인 토큰 정리: 색상·간격·타이포를 `tailwind.config.js`에 정의(현재 화면의 하드코딩 색상 `#111827` 등을 토큰으로 치환).
- ⬜ 공통 UI 컴포넌트 뼈대: `components/` 에 Button, Screen(SafeArea 래퍼), Text 등 최소 셋.

**산출물**: `app/_layout.tsx`, `app/(tabs)/*`, `tailwind.config.js`, `components/ui/*`

**DoD**: 4탭 전환 동작, 토큰 기반 스타일로 placeholder 렌더.

---

## P1 — Supabase 연동 기반 `[MVP]`

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

**선행조건**: P1.

**테이블** (planning.md 7 기준, 모든 기록은 `pet_id` FK 보유)
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
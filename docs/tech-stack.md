# 포포노트 (PopoNote) — 기술 스택 (tech-stack.md)

> Claude Code 개발 참고용 문서
> v1.0 · 2026-06-15

이 문서는 포포노트 개발에 사용할 기술 스택과 아키텍처 결정을 정의한다.
구현 시 이 문서의 결정사항을 기준으로 한다. 기획은 `planning.md` 참고.

---

## 1. 한눈에 보기

| 영역 | 선택 | 비고 |
|------|------|------|
| 프론트엔드 | React Native (Expo 권장) | 크로스플랫폼(iOS/Android) |
| 언어 | TypeScript | |
| 백엔드 | Supabase | DB·인증·스토리지·서버리스 함수 통합 |
| 데이터베이스 | Supabase Postgres | |
| 인증 | Supabase Auth (카카오 OAuth) | 구글은 MVP 범위 밖 |
| 파일 저장 | Supabase Storage | 원본 사진 + 변환 일러스트 |
| 서버 로직 | Supabase Edge Functions | 외부 API 호출 등 보안이 필요한 작업 |
| 이미지 변환 | 외부 이미지 생성 API (모델 추후 결정) | Edge Function 경유 호출 |

> 개발자 배경: 프론트엔드 중심. 백엔드 인프라는 Supabase가 흡수하는 구조로 설계한다.
> self-host(GPU 서버에 모델 직접 운영)는 운영 부담으로 채택하지 않는다.

---

## 2. 프론트엔드

### 2.1 React Native + Expo
- **Expo** 사용을 권장한다. 빌드·배포·네이티브 모듈 관리가 쉬워 프론트엔드 단독 개발에 유리하다.
- 라우팅: **Expo Router** (파일 기반 라우팅). 4탭 구조(홈/다이어리/일러스트 앨범/설정)는 하단 탭 네비게이터로 구성.
- 언어: **TypeScript** 필수.

### 2.2 상태 관리 / 데이터 패칭
- 서버 상태: **TanStack Query (React Query)** — Supabase 데이터 조회·캐싱·동기화에 사용.
- 클라이언트 로컬 상태: React 기본(useState/Context) 또는 경량 라이브러리(Zustand) 중 필요 시 선택.
- Supabase 클라이언트: `@supabase/supabase-js`.

### 2.3 UI
- **스타일링: React Native `style` prop + `StyleSheet.create`** — NativeWind 제거됨.
  - 색상 토큰은 `theme/colors.js`가 단일 출처. `import {colors} from '@/theme/colors'`로 참조.
  - UI 컴포넌트(Text/Card/Button/Screen)는 `style` prop으로 오버라이드.
- 컴포넌트는 직접 구성하되, 필요 시 RN 생태계의 경량 UI 라이브러리 사용 가능.

---

## 3. 백엔드 (Supabase)

Supabase가 전통적 백엔드 역할을 대부분 대신한다. 별도 서버를 직접 구축·운영하지 않는다.

### 3.1 인증 (Auth)
- **카카오 OAuth 간편로그인** 사용 (Supabase Auth provider 설정). 구글은 MVP 범위 밖.
- 로그인한 사용자(`auth.users`)와 앱 내 가족 멤버(닉네임) 개념을 매핑한다.
  - 한 사용자가 로그인 → 가족 그룹에 멤버로 참여(닉네임 지정).
  - 닉네임은 목록 선택 + 직접 입력 (planning.md 2.4 참고).

### 3.2 데이터베이스 (Postgres)
- 테이블 설계는 `planning.md` 7번 데이터 구조 초안을 기준으로 한다.
- **Row Level Security(RLS) 필수**: 사용자는 자신이 속한 가족 그룹의 데이터만 읽고 쓸 수 있어야 한다.
- 권한 규칙(planning.md 2.3): 본인이 작성한 레코드만 수정·삭제 가능 → RLS 정책으로 강제한다.

### 3.3 스토리지 (Storage)
- 버킷 분리: 압축 사진 / 변환된 일러스트 / 프로필 이미지.
- 접근 정책: 가족 그룹 멤버만 해당 그룹의 이미지에 접근 가능하도록 설정.
- **이미지는 DB가 아니라 Storage에 저장**한다. DB(Postgres)에는 이미지 URL·메타데이터만 저장한다.
  - 비용 이슈는 DB가 아니라 Storage 용량·전송량에서 발생 → 아래 최적화 정책으로 관리.

#### 이미지 최적화 정책 (중요)
- **업로드 전 클라이언트 압축**: RN에서 업로드 직전 리사이즈·압축 (`expo-image-manipulator` 등).
  - 가로 약 1080~1440px로 리사이즈. 폰 원본(4000px+, 5~10MB)은 그대로 저장하지 않는다.
  - 결과적으로 한 장당 수백 KB 수준으로 축소.
- **포맷**: JPEG (expo-image-manipulator에서 WebP 미지원, JPEG 80% 품질 사용).
- **썸네일 분리**: 목록/앨범용 작은 이미지(예: 300px)와 상세용 이미지를 구분.
  - 목록 로딩 시 큰 파일을 불러오지 않아 전송량(요금)·체감 속도 모두 개선.
  - Supabase Storage의 이미지 변환(리사이즈) 기능 활용 가능.
- **원본 사진 보관 정책 (확정)**:
  - 일러스트 변환은 **업로드 직후 원본이 살아있을 때 즉시 수행**한다.
  - **변환 완료 즉시 원본을 삭제**하고, 화면 표시용 **압축본만 보관**한다.
  - 트레이드오프: 초고해상도 다운로드·원본 재변환은 불가. 앱 내 열람·추억 용도는 압축본으로 충분.
  - planning.md의 "원본+일러스트 모두 보관"은 본 정책으로 대체한다(압축본+일러스트 보관).

### 3.4 서버 로직 (Edge Functions)
- 외부 API 호출처럼 **비밀 키가 필요하거나 클라이언트에 노출되면 안 되는 작업**은 Edge Function에서 처리한다.
- 대표 사례: 이미지 변환 API 호출(4번 참고).
- 언어: TypeScript (Deno 런타임). 프론트엔드 개발자가 익숙한 JS/TS로 작성 가능.

---

## 4. 이미지 변환 (일러스트화)

### 4.1 방식
- **외부 이미지 생성 API**를 사용한다. (self-host 미채택)
- 사진 → 일러스트는 image-to-image(편집) 작업이므로, 원본 사진을 입력으로 받아 스타일을 입히는 기능이 필요하다.

### 4.2 호출 구조 (중요)
- **API 키는 절대 RN 클라이언트에 두지 않는다.** 반드시 Edge Function을 경유한다.
- 처리 흐름:
  1. RN: 업로드 전 사진을 리사이즈·압축(JPEG) → 압축본+썸네일 업로드, 변환용으로 압축본도 임시 전달
  2. Supabase Storage: 압축본 저장 (+ 변환 입력용 이미지 임시 보관)
  3. Edge Function: 이미지 변환 API 호출 (키는 함수의 환경변수에 보관)
  4. Supabase Storage: 변환된 일러스트 저장
  5. **변환 완료 즉시 원본/임시 입력 이미지 삭제** (압축본만 잔존)
  6. RN: 변환 결과(일러스트 URL) 수신 → 앨범에 표시
- 변환 로직은 **하나의 모듈/함수로 추상화**한다. 모델·제공사 교체 시 이 한 곳만 수정하면 되도록 한다.

### 4.3 모델 선택 (추후 결정)
- 지금 확정하지 않는다. 호출 코드는 모델명만 바꾸면 되는 구조이므로 개발 중 품질·비용을 보고 결정한다.
- 후보 (2026-06 기준):
  - **OpenAI GPT Image 계열**: GPT Image 1 Mini(저비용, 테스트용), GPT Image 1.5, GPT Image 2(최신 플래그십). *GPT Image 1은 deprecate 예정이라 신규 채택 비권장.*
  - **대안: Google Imagen 4** (Fast/Standard/Ultra) — 고품질·저비용 대안.
- 개발·테스트 단계는 무료 크레딧(OpenAI 신규 크레딧, Replicate/fal 등 무료 티어)으로 진행 가능.
- 결정 기준: 실제 반려동물 사진으로 변환 품질(구도·피사체 유지 + 일러스트 스타일)을 비교한 뒤 선택.

### 4.4 비용 관리
- 매일 변환 시 장당 단가가 누적되므로, 사용자/그룹당 변환 횟수 제한 등 비용 제어 로직을 Edge Function에 둔다.
- 변환 실패 시 재시도 가능하게 처리 (planning.md 4.2).

---

## 5. 환경 / 배포

### 5.1 환경 변수 / 비밀 관리
- 클라이언트(RN)에는 Supabase URL과 anon key만 둔다(공개 가능 범위).
- 이미지 변환 API 키 등 민감 정보는 **Edge Function의 환경변수(secrets)**에만 보관한다.

### 5.2 배포
- 앱: Expo 빌드 → App Store / Google Play.
- 백엔드: Supabase 프로젝트(클라우드 관리형).
- Edge Functions: Supabase CLI로 배포.

---

## 6. 미확정 / 추후 결정

- 이미지 변환 구체 모델 (4.3) — 개발 중 결정.
- 사진 원본 보관 기간·용량 한도 (planning.md open questions).
- 푸시 알림 도입 시: Expo Notifications + Supabase 조합 검토 (2차 기능).

---

## 7. 개발 시작 체크리스트 (참고)

1. Expo + TypeScript 프로젝트 초기화, Expo Router로 4탭 구조 잡기
2. Supabase 프로젝트 생성, `@supabase/supabase-js` 연동
3. 카카오 OAuth provider 설정 및 로그인 플로우 구현
4. DB 테이블 생성 + RLS 정책 작성 (planning.md 데이터 구조 기준)
5. Storage 버킷 생성 + 접근 정책
6. 핵심 기능 구현: 가족 그룹/초대 코드 → 메인 기록 → 케어 기록 → 댓글·반응
7. 이미지 변환 Edge Function (모델은 임시로 무료 크레딧 사용, 추상화된 모듈로 작성)
8. 일러스트 앨범 화면

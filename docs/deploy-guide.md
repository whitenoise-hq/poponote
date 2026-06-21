# 포포노트 — 배포 가이드 & 릴리즈 노트

> 앱 수정 후 다시 배포할 때 이 문서를 본다.
> EAS(Expo Application Services)로 빌드 → 스토어 제출하는 전체 절차와, 한 번만 발급/설치한 항목, 버전별 변경 기록을 모아둔다.

---

> ⚠️ 계정·자격증명 식별자(Apple ID, Team/Provider ID, 인증서 Serial 등)는
> **`docs/deploy-credentials.local.md`** 에 따로 두고 git에서 제외했다(`*.local.md`).
> 이 가이드에는 공개해도 되는 절차·명령어만 둔다.

## 0. 기본 정보

| 항목 | 값 |
| --- | --- |
| iOS bundleId | `com.devwoodie.poponote` |
| Android package | `com.devwoodie.poponote` |
| 현재 버전 | `1.0.0` |
| 자격증명/계정 식별자 | `docs/deploy-credentials.local.md` (로컬 전용) · `npx eas credentials`로도 확인 |

빌드 프로파일은 `eas.json`에 정의:
- `production` — 스토어 제출용. iOS는 `autoIncrement: true`로 buildNumber 자동 증가, Android는 `app-bundle`(.aab).
- `preview` — 내부 배포용. Android는 `apk`.
- `development` — dev client 포함 개발용.

---

## 1. 한 번만 한 설정 (재사용됨 — 다시 안 해도 됨)

### 설치한 도구
- **EAS CLI** — `eas-cli/20.3.0` (전역 설치, `/usr/local/bin/eas`)
  - 업데이트: `npm i -g eas-cli`
- 빌드 명령은 `npx eas ...`로 실행 (전역 설치돼 있으면 `eas ...`도 동일)

### EAS 계정
- `eas login` 완료 (계정·이메일은 `deploy-credentials.local.md` 참고)
- 확인: `npx eas whoami`

### iOS — Apple 자격증명 (EAS 서버에 저장됨)
최초 `eas build --platform ios --profile production` 실행 시 자동 생성됨.
- 배포 인증서(Distribution Certificate) + 프로비저닝 프로파일을 EAS가 발급·보관 → 다음 빌드 때 자동 재사용.
- **만료 전까지 재발급 불필요.** 만료되면 빌드 시 EAS가 다시 생성 여부를 물어본다.
- 실제 식별자(Serial/Profile ID/Team/Provider)와 만료일은 `deploy-credentials.local.md` 또는 `npx eas credentials` 참고.

### iOS — App Store Connect API Key (제출용, EAS에 저장됨)
최초 `eas submit --platform ios` 실행 시 생성됨.
- 역할(role): **APP_MANAGER** (최소 권한)
- EAS가 자동 생성·저장 → 다음 제출부터 질문 없이 재사용
- 관리: https://appstoreconnect.apple.com → 사용자 및 액세스 → 통합 → App Store Connect API

### Android — Google Play 자격증명 (아직 미설정)
> 첫 Android 제출 전에 1회 설정 필요.

1. Google Play Console에서 앱 생성 (package `com.devwoodie.poponote`)
2. **서비스 계정 JSON 키** 발급:
   - Play Console → 설정 → API 액세스 → 서비스 계정 생성 (Google Cloud)
   - 역할: "릴리스 관리자" 권한 부여
   - JSON 키 다운로드 → 프로젝트에 두지 말고 안전한 곳에 보관
3. `eas.json`의 `submit.production`에 경로 연결 또는 `eas submit` 실행 시 경로 입력
   ```json
   "submit": { "production": { "android": { "serviceAccountKeyPath": "../path/to/key.json" } } }
   ```
- Android 업로드 키(서명)는 `production` 빌드 시 EAS가 관리(`eas credentials`로 확인).

---

## 2. 매번 배포할 때 (수정 후 재배포 절차)

### 버전 관리 원칙 (중요 — 헷갈리기 쉬움)

버전은 **두 종류**다. 역할이 완전히 다르니 구분해서 다룬다.

| 항목 | 역할 | 다루는 법 |
| --- | --- | --- |
| `expo.version` (`1.0.0`) | **사용자에게 보이는** 마케팅 버전 | iOS·Android **공통**으로 맞춘다. 기능/수정 릴리스 시 **손으로** 올림 (`1.0.0`→`1.0.1`). |
| `expo.ios.buildNumber` | App Store **내부** 빌드 카운터 | production `autoIncrement: true` → **EAS 자동 +1**. 손 안 댐. |
| `expo.android.versionCode` | Play Store **내부** 빌드 카운터 | production `autoIncrement: true` → **EAS 자동 +1**. 손 안 댐. |

**핵심 규칙**
- **`version`만 두 플랫폼 동일하게 유지하면 된다.** 이게 사용자가 보는 버전.
- **`buildNumber`(iOS)와 `versionCode`(Android)는 서로 맞출 필요가 없다.** 각 스토어는 자기 플랫폼 카운터만 보고, 서로 비교하지 않는다. iOS가 3이고 Android가 4여도 정상.
- 두 카운터는 `autoIncrement` 때문에 **자연스럽게 어긋난다** (한 플랫폼만 재빌드하면 그 플랫폼만 +1). 억지로 맞추려고 불필요한 빌드를 하지 않는다.
- 각 카운터는 **자기 스토어 안에서 이전 빌드보다 크기만** 하면 된다 (스토어 업로드 시 필수).
- 같은 버전 내 재빌드(버그픽스 재시도)면 `version`은 안 올려도 되지만, 스토어 업로드용이면 `autoIncrement`가 카운터를 올려준다.

> EAS가 `autoIncrement`로 카운터를 올린 뒤 `app.json`에 그 값을 **다시 써넣는다** (`appVersionSource: "local"`). 빌드 후 `git status`에 `app.json` 변경이 보이면 그 versionCode/buildNumber 증가를 커밋해 리포와 맞춘다.

### 같은 코드를 두 스토어에 동시 출시할 때
숫자를 맞추려는 목적이 아니라 **동일 커밋을 두 스토어에 함께 내려는** 릴리스 위생 차원이라면 한 번에 빌드:
```bash
npx eas build --platform all --profile production
```
(그래도 buildNumber/versionCode는 각자 증가한다.)

### iOS 배포
```bash
# 1. 빌드 (Apple 로그인/인증서 질문 없이 바로 큐 등록)
npx eas build --platform ios --profile production

# 2. 제출 (TestFlight / App Store Connect 업로드)
npx eas submit --platform ios --profile production
#    → "Select a build from EAS" 선택 → 최신 빌드 선택

# 빌드+제출 한 번에:
npx eas build --platform ios --profile production --auto-submit
```
- 빌드 약 10~20분, 제출 후 Apple 처리(processing) 5~30분 → 그 뒤 TestFlight에 표시.
- 터미널 Ctrl+C로 나가도 EAS 서버에서 계속 진행됨. 진행상황은 대시보드에서 확인.
- TestFlight **내부 테스트**는 Apple 심사 없이 즉시 가능. **외부 테스터/실제 출시**는 심사 필요.

### Android 배포
```bash
# 1. 빌드 (.aab 생성)
npx eas build --platform android --profile production

# 2. 제출 (Google Play 업로드 — 서비스 계정 키 설정 후)
npx eas submit --platform android --profile production

# 내부 테스트용 빠른 APK (기기 직접 설치):
npx eas build --platform android --profile preview
```

### 두 플랫폼 동시 빌드
```bash
npx eas build --platform all --profile production
```

---

## 3. 확인 위치

- **EAS 빌드/제출 현황**: https://expo.dev/accounts/devwoodie/projects/poponote (Builds / Submissions 탭)
- **자격증명 확인/관리**: `npx eas credentials`
- **iOS TestFlight**: https://appstoreconnect.apple.com → 앱 → TestFlight
- **Android**: Google Play Console → 테스트/프로덕션 트랙

---

## 4. 릴리즈 노트

> 새 버전 배포할 때마다 맨 위에 한 줄씩 추가한다. 형식: 버전 (빌드) — 날짜 — 변경 요약.

### 1.0.0 (iOS build 3 / Android vc 3) — 2026-06-20
- **iOS build 3 App Store Connect 제출 완료** (커밋 `b0b3bfc`). Apple 처리 후 TestFlight 표시 — https://appstoreconnect.apple.com/apps/6782025922/testflight/ios
- **ASC App ID 확보** → 커밋되는 `eas.json`의 `submit.production.ios`에는 비밀이 아닌 `ascAppId`만 기록(Apple ID/Team ID 같은 식별자는 `deploy-credentials.local.md`에만 둠). 이제 EAS 저장 ASC API 키로 `--non-interactive` 제출 가능(Apple 로그인 프롬프트 불필요).
- Android: production `.aab`(versionCode 3) 빌드 완료. **Play Store 제출은 서비스 계정 키 미설정으로 아직 미진행.**

### 1.0.0 (iOS build 2) — 2026-06-19
- **첫 iOS production 빌드 & TestFlight 제출.**
- iOS 자격증명(배포 인증서·프로비저닝 프로파일) 최초 발급, App Store Connect API Key(APP_MANAGER) 발급.
- 포함 변경: 앨범 캐시 버그 수정, 앱 이름 한글화(포포노트), 4탭 초기 로딩 스피너, 설정 탭(닉네임 변경/약관/개인정보처리방침/문의), 앱 아이콘·스플래시 교체, 수출 규정(`ITSAppUsesNonExemptEncryption: false`)·사진 권한 문구 설정.
- Android: versionCode 2 (production 빌드/제출 미진행).
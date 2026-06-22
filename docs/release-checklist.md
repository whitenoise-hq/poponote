# 포포노트 — 스토어 출시 체크리스트

> 개발자 계정 심사 완료 후 진행

## App Store (iOS)

- [ ] 스크린샷: 6.7" (iPhone 15 Pro Max) + 6.1" (iPhone 15 Pro) 필수. 홈/다이어리/앨범/설정 각 1~2장
- [ ] 앱 이름: 포포노트 / 부제: 가족이 함께 쓰는 반려동물 다이어리
- [ ] 설명: 앱 기능 소개 (AI 일기, 케어 기록, 가족 공유 등)
- [ ] 카테고리: 라이프스타일
- [x] 개인정보처리방침 URL: https://poponote.devwoodie.com/privacy
- [ ] EAS Build: `eas build --platform ios` → App Store Connect 업로드
- [ ] 심사 제출 — **리뷰어 접근은 Sign in with Apple로 안내**. 카카오는 리뷰 환경에서 휴대폰 본인확인을 요구해 막힘(가이드라인 2.1 리젝 원인). Apple 로그인은 폰 인증 없이 전체 기능 접근 가능 → App Store Connect 회신에 "Use Sign in with Apple, then create a family group" 명시.
- [ ] 로그인 옵션 추가(Apple) 반영해 **스크린샷 갱신**

> **배포 플랫폼: iOS(App Store) 전용.** Android(Google Play)는 미진행 — `app.json`/`eas.json`에서 Android 설정 제거됨.

## 공통 준비물

- [x] 개인정보처리방침 웹 URL: https://poponote.devwoodie.com/privacy
- [ ] 스크린샷 캡처 (시뮬레이터에서 홈, AI 일기 작성, 다이어리, 앨범, 설정)
- [ ] EAS Build 설정 (`eas build:configure` → `eas.json` 생성)
- [ ] EAS 계정 연결 (`eas login`)
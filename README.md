# 포포노트 (PopoNote)

가족이 함께 쓰는 반려동물 다이어리. 초대 코드로 들어와 하루 한 장씩 사진·일기를 쌓고 밥·간식·산책을 함께 챙긴다.

## 작업 지침

- **Claude Code 작업 기준**은 [`CLAUDE.md`](./CLAUDE.md)에 정리되어 있다. 작업 시작 전 가장 먼저 읽는다.
- 기획·스택·화면 문서는 [`docs/`](./docs) 폴더에 있다.

## 시작하기

```bash
pnpm install
pnpm start
```

- `pnpm ios` / `pnpm android` / `pnpm web` 으로 플랫폼별 실행.
- 타입 체크: `pnpm typecheck`.

## 스택

- React Native + Expo (SDK 56) · TypeScript · Expo Router
- NativeWind (Tailwind CSS for RN) · TanStack Query · Supabase (예정)
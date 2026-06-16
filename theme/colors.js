/**
 * 색상 디자인 토큰 단일 출처(Single Source of Truth).
 * - `tailwind.config.js`가 이 파일을 require 해 NativeWind 토큰으로 등록한다(className용).
 * - 컴포넌트의 인라인 style에서도 `import {colors} from '@/theme/colors'`로 동일 값을 참조한다.
 * 색상값은 여기에서만 정의하고, 컴포넌트에 hex를 직접 박지 않는다.
 *
 * CommonJS로 작성하는 이유: tailwind.config.js(CJS)에서 require 하기 위함. TS에서는 import 가능.
 */
const colors = {
  // 포인트 (포포 코랄)
  primary: {
    50: '#FFF4EE',
    100: '#FFE3D4',
    200: '#FFC4A8',
    300: '#FF9F73',
    400: '#FB8350',
    500: '#F2724A',
    600: '#D85A35',
    700: '#B4472A',
    DEFAULT: '#F2724A',
  },
  // 웜 뉴트럴 (배경/표면/보더)
  cream: {
    50: '#FDFBF7',
    75: '#FDF8F5',
    100: '#F6EFE4',
    200: '#ECE1D1',
    DEFAULT: '#FBF7F1',
  },
  // 텍스트/뉴트럴 (웜 톤)
  ink: {
    300: '#C4B9AC',
    400: '#9C9186',
    500: '#7A6F64',
    700: '#4A423B',
    DEFAULT: '#2B2520',
  },
  // 시맨틱 (케어 종류 구분 — Figma 참고본 기준)
  meal: { DEFAULT: '#f4846a', bg: '#fff0ec' }, // 밥 (코랄)
  treat: { DEFAULT: '#a8c8a0', bg: '#edf7ec' }, // 간식 (세이지 그린)
  walk: { DEFAULT: '#7eb8e8', bg: '#eaf4fd' }, // 산책 (소프트 블루)
  // Figma 시맨틱 토큰
  secondary: '#fde8e0', // 배지·태그·뒤로가기 배경
  muted: { DEFAULT: '#f5ede8', foreground: '#9e7e76' }, // 옅은 표면, 보조 텍스트
  accent: '#ffd6cc', // 댓글 아바타 배경
  success: '#5FA877',
  danger: '#D45D5D',
  white: '#FFFFFF',
};

module.exports = { colors };
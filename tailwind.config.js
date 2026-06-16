const { colors } = require('./theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // 색상 토큰은 theme/colors.js 단일 출처에서 가져온다(컴포넌트 인라인 style과 공유).
      colors,
      fontFamily: {
        sans: ['Pretendard-Regular'],
        medium: ['Pretendard-Medium'],
        semibold: ['Pretendard-SemiBold'],
        bold: ['Pretendard-Bold'],
        display: ['Jua_400Regular'], // 로고/큰 제목용 둥근 폰트
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(43, 37, 32, 0.06)',
      },
    },
  },
  plugins: [],
};
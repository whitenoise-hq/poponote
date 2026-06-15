/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
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
        // 시맨틱 (케어 종류 구분)
        meal: '#F2A65A', // 밥
        treat: '#E0709A', // 간식
        walk: '#6FA98C', // 산책
        success: '#5FA877',
        danger: '#D45D5D',
      },
      fontFamily: {
        // expo-google-fonts 로드 키와 일치 (app/_layout.tsx 참고)
        sans: ['GothicA1_400Regular'],
        medium: ['GothicA1_500Medium'],
        semibold: ['GothicA1_600SemiBold'],
        bold: ['GothicA1_700Bold'],
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
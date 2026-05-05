module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EAF4FF',
          100: '#D8ECFF',
          200: '#B8D9FF',
          300: '#85B9FF',
          400: '#4F8DFF',
          500: '#2563EB',
          600: '#1D5BFF',
          700: '#1748CC',
          800: '#123A8F',
          900: '#08233F',
        },
        ink: '#10213A',
        muted: '#64748B',
        line: '#E2E8F0',
        eduNavy: '#08233F',
        eduBlue: '#1D5BFF',
        eduSky: '#EAF4FF',
        eduGold: '#F4B63F',
        eduGreen: '#24B47E',
        eduMint: '#E9FBF4',
        eduText: '#172033',
        eduMuted: '#64748B',
        eduSoft: '#F6F9FC',
      },
      boxShadow: {
        soft: '0 14px 38px rgba(8, 35, 63, 0.10)',
        premium: '0 28px 80px rgba(8, 35, 63, 0.16)',
        glow: '0 18px 45px rgba(29, 91, 255, 0.25)',
      },
      borderRadius: {
        '4xl': '1.5rem',
        '5xl': '1.75rem',
      },
    },
  },
  plugins: [],
};

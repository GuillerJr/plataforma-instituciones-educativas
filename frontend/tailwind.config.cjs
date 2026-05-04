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
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

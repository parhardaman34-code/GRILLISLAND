/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#080808',
        surfaceDark: '#111215',
        cardDark: '#17181c',
        accentRed: '#C1121F',
        secondaryOrange: '#FF4500',
        luxuryGold: '#C5A059',
        borderMuted: 'rgba(255, 255, 255, 0.08)',
        borderHover: 'rgba(193, 18, 31, 0.4)',
      },
      fontFamily: {
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widestLuxury: '0.25em',
        ultraLuxury: '0.35em',
      },
    },
  },
  plugins: [],
}

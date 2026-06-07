/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        heading: ['"Barlow"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        n: {
          red: '#E50914',
          redHover: '#F40612',
          dark: '#141414',
          darker: '#0A0A0A',
          card: 'rgba(255,255,255,0.06)',
        }
      },
    },
  },
  plugins: [],
}

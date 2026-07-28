/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17140F',
        surface: '#211D16',
        surface2: '#2A251C',
        paper: '#F5EFE6',
        muted: '#9C948A',
        flow: {
          DEFAULT: '#F0521E',
          soft: '#F0521E1A',
        },
        thread: {
          DEFAULT: '#17B399',
          soft: '#17B3991A',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

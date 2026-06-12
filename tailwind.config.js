/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./instructors.html",
    "./projects.html",
    "./awards.html",
    "./resources.html",
    "./contact.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wu-blue': '#40BDF2',
        'wu-yellow': '#FFD83D',
        'wu-green': '#34D399',
        'wu-black': '#111111',
      },
      fontFamily: {
        'display': ['"Noto Sans TC"', 'sans-serif'],
        'body': ['Inter', '"Noto Sans TC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
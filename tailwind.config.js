/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        socialBg: '#f5f7fb',
        socialBlue: '#218dfa',
      }
    },
  },
  plugins: [],
}
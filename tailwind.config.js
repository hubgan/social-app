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
      },
      transformOrigin: {
        "0": "0%",
      },
      zIndex: {
        "-1": -1
      }
    },
  },
  variants: {
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
  },
  plugins: [],
}
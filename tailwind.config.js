/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bodyFont': ['Poppins', 'sans-serif'],
        'mooli': ['Mooli', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        'header': '50',
        'modal': '100',
        'toast': '9000',
        'spinner': '9999',
      }
    }
  },
  plugins: [],
}
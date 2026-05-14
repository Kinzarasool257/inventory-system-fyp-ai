/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ims: {
          primary: '#5271ff',
          sidebar: '#2b3a4a',
          bg: '#e2eff5',
          border: '#d1e2e8',
          success: '#70d6bc',
          warning: '#ffd08a',
          danger: '#ff8a8a'
        }
      },
      borderRadius: {
        'ims': '1.25rem',
      }
    },
  },
  plugins: [],
}
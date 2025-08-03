/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class', // Mode manuel pour éviter les conflits système
    theme: {
      extend: {},
    },
    plugins: [],
  }
  
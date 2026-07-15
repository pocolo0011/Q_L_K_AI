/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007BFF',
          dark: '#0056b3',
        },
        success: {
          DEFAULT: '#28A745',
          dark: '#1e7e34',
        },
        warning: {
          DEFAULT: '#FD7E14',
          dark: '#e8680a',
        },
        danger: {
          DEFAULT: '#DC3545',
          dark: '#b02a37',
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

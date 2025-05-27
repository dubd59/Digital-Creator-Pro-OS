/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#D6F4F4',
          200: '#AEE9E9',
          300: '#85DDDD',
          400: '#38BEBA', // Main primary color
          500: '#2F9F9B',
          600: '#26807D',
          700: '#1C615E',
          800: '#134240',
          900: '#092120',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
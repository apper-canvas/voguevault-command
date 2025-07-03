/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Bebas Neue', 'Arial Black', 'sans-serif'],
        'body': ['Inter', 'Arial', 'sans-serif'],
      },
      colors: {
        accent: '#FF3366',
        surface: '#F8F8F8',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1)',
      },
      animation: {
        'bounce-cart': 'bounce 0.6s ease-in-out',
      }
    },
  },
  plugins: [],
}
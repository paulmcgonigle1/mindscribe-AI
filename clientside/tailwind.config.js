/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-yellow': '#FFF5EE',
        'warm-orange': '#F9CC48',
        'warm-orange-bright': '#ffbf00', // a brighter orange

        'warm-orange-dark': '#E0B042', 
        'rich-green': '#52B774',
        'deep-blue': '#14467C',
      },
      fontFamily:{
        sans:['Inter', 'sans-serif'],
        
      }
    },
  },
  plugins: [],
}


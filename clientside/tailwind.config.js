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
      'warm-orange-bright': '#ffbf00', // New brighter orange
      'warm-orange-dark': '#E0B042',
      'rich-green': '#52B774',
      'deep-blue': '#14467C',
      'light-blue': '#a8def0', // New lighter blue for secondary buttons/links
      'text-grey': '#333333', // New text color for better readability
      'muted-green': '#98c9a3', // New muted green for active states
      'rich-green-light': '#a4d4ae'
      },
      fontFamily:{
        sans:['Inter', 'sans-serif'],
        
      }
    },
  },
  plugins: [],
}


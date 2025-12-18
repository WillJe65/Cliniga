/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        'cliniga-primary': '#2563EB', 
        'cliniga-text': '#1E293B',    
        'cliniga-grey': '#64748B',    
      }
    },
  },
  plugins: [],
}
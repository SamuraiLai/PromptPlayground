/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        table: { DEFAULT: '#f8f3e3' }, // parchment/scroll background
        mentor: { DEFAULT: '#4338ca' }, // indigo for mentor cards
        method: { DEFAULT: '#047857' }, // emerald for method cards
        modifier: { DEFAULT: '#b45309' }, // amber for modifier cards
        energy: { 
          low: '#f87171', 
          medium: '#fbbf24', 
          high: '#34d399' 
        },
        card: { DEFAULT: '#fffbe6', edge: '#d6d3c9' }
      },
      borderRadius: {
        card: '0.6rem'
      },
      fontFamily: {
        serif: ['Crimson Text', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        parchment: "url('/parchment.png')",
        woodTable: "url('/wood-texture.png')",
      }
    },
  },
  plugins: [],
} 
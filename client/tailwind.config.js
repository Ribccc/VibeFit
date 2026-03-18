/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F6F3',
        brand: {
          pink:   '#FF2D6B',
          black:  '#0F0F13',
          purple: '#7B2FFF',
          violet: '#5C1EE8',
          coral:  '#FF5A2C',
          cream:  '#FFFBF7',
        },
        dark: {
          bg:     '#0D0D12',
          card:   '#13131A',
          border: '#2A2A3A',
        },
        accent: {
          pink: '#FF2D6B',
          mint: '#00E5A0',
          gold: '#FFB800',
        },
      },
      fontFamily: {
        clash:   ['"Clash Display"', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.06)',
        glow: '0 0 40px rgba(123,47,255,0.3)',
        pink: '0 8px 40px rgba(255,45,107,0.3)',
        card: '0 2px 16px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}

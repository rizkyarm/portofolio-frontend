/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#6c5ce7',
          light:  '#a29bfe',
          pale:   '#ede9fe',
          navy:   '#0f172a',
        }
      },
      keyframes: {
        slideInDown: {
          'from': { transform: 'translateY(-100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOutUp: {
          'from': { transform: 'translateY(0)', opacity: '1' },
          'to': { transform: 'translateY(-100%)', opacity: '0' },
        },
        fadeInScale: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        underlineSlide: {
          'from': { width: '0', left: '0' },
          'to': { width: '100%', left: '0' },
        },
        rotateIn: {
          'from': { transform: 'rotate(0deg)', opacity: '0.5' },
          'to': { transform: 'rotate(90deg)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        slideInDown: 'slideInDown 0.3s ease-out',
        slideOutUp: 'slideOutUp 0.3s ease-in',
        fadeInScale: 'fadeInScale 0.3s ease-out',
        underlineSlide: 'underlineSlide 0.4s ease-out',
        rotateIn: 'rotateIn 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
      }
    },
  },
  plugins: [],
}


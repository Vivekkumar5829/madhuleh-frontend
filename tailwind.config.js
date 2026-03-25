/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        honey: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F5A800',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        bark: {
          50:  '#fdf8f0',
          100: '#faefd8',
          200: '#f5dbb0',
          300: '#ecc070',
          400: '#e4a040',
          500: '#3D2000',
          600: '#2d1800',
          700: '#1e1000',
          800: '#140b00',
          900: '#1A0D00',
        },
        cream: {
          50:  '#FFFDF8',
          100: '#FFF8E7',
          200: '#FFF3D0',
        }
      },
      fontFamily: {
        display: ["'Playfair Display'", 'Georgia', 'serif'],
        sans:    ["'Plus Jakarta Sans'", 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':       '0 2px 20px rgba(26,13,0,0.06)',
        'card-hover': '0 8px 40px rgba(26,13,0,0.12)',
        'honey':      '0 4px 20px rgba(245,168,0,0.35)',
        'honey-lg':   '0 8px 40px rgba(245,168,0,0.40)',
        'glow':       '0 0 30px rgba(245,168,0,0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'float':       'float 4s ease-in-out infinite',
        'fade-up':     'fadeUp 0.5s ease forwards',
        'slide-in':    'slideIn 0.3s ease forwards',
        'shimmer':     'shimmer 1.5s infinite',
        'spin-slow':   'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        corn: {
          50:  '#fffde7',
          100: '#fff9c4',
          200: '#fff590',
          300: '#ffed4a',
          400: '#ffe019',
          500: '#ffd000',
          600: '#e6a800',
          700: '#b37d00',
          800: '#8a5f00',
          900: '#6b4a00',
        },
        soil: {
          50:  '#fdf8f3',
          100: '#f5e8d5',
          200: '#e8c9a0',
          300: '#d9a56b',
          400: '#c4833a',
          500: '#a86828',
          600: '#8a5020',
          700: '#6b3c18',
          800: '#4e2c12',
          900: '#2e1a0b',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'shimmer': 'shimmer 1.8s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d8eafc',
          200: '#b8d8f4',
          300: '#86bbe7',
          400: '#5299d3',
          500: '#2778ba',
          600: '#125e9f',
          700: '#0d4a82',
          800: '#0d3d6a',
          900: '#0b3154'
        },
        accent: {
          50: '#fff6ed',
          100: '#ffe7cc',
          200: '#ffd19b',
          300: '#ffb468',
          400: '#ff972a',
          500: '#ff7f0e',
          600: '#e86800',
          700: '#c45300',
          800: '#9f4306',
          900: '#7f3809'
        }
      },
      boxShadow: {
        soft: '0 28px 80px -36px rgba(13, 74, 130, 0.42)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top right, rgba(255,127,14,0.26), transparent 34%), radial-gradient(circle at bottom left, rgba(39,120,186,0.24), transparent 28%), linear-gradient(135deg, #071d38 0%, #0d4a82 54%, #1e77c2 100%)'
      }
    }
  },
  plugins: [typography]
};

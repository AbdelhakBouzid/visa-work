import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f9fb',
          100: '#d9e8ef',
          200: '#b8d4e1',
          300: '#8bb5ca',
          400: '#5d93ae',
          500: '#3f758f',
          600: '#2e5a71',
          700: '#234658',
          800: '#193342',
          900: '#10232e'
        },
        accent: {
          50: '#fff9ef',
          100: '#fcebc3',
          200: '#f8d98b',
          300: '#f2bf46',
          400: '#e7a91f',
          500: '#c88514',
          600: '#a06112',
          700: '#7f4814',
          800: '#683b16',
          900: '#593316'
        }
      },
      boxShadow: {
        soft: '0 24px 60px -24px rgba(15, 23, 42, 0.35)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(242,191,70,0.18), transparent 36%), linear-gradient(135deg, #10232e 0%, #234658 55%, #2e5a71 100%)'
      }
    }
  },
  plugins: [typography]
};

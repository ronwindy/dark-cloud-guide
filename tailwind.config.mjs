/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Dark Cloud palette: deep indigo/violet ink, lavender-silver lights, moon-gold ornaments.
        obsidian: '#07050f',
        void: '#0d0a1f',
        // Slate is re-tinted: lights become lavender-silver, darks become indigo ink.
        slate: {
          100: '#ece9f7',
          200: '#d9d4ee',
          300: '#bdb6dc',
          400: '#9a93bd',
          500: '#766f98',
          600: '#4a4570',
          700: '#353157',
          800: '#262245',
          850: '#1a1736',
          900: '#120f28',
          950: '#0b0919',
        },
        moon: {
          300: '#f6e7b4',
          400: '#e6c872',
          500: '#c49e45',
          600: '#96742c',
          700: '#62491b',
        },
        lavender: {
          200: '#e4def8',
          300: '#cdc3f0',
          400: '#b1a2e6',
          500: '#8f7dd4',
        },
        violet: {
          400: '#8b6fd8',
          500: '#6d4fc2',
          600: '#5338a0',
          700: '#3a2776',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        sans: ['Jost', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Courier Prime"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1.1rem' }],
        'xs': ['0.84rem', { lineHeight: '1.25rem' }],
        'sm': ['0.94rem', { lineHeight: '1.45rem' }],
        'base': ['1.05rem', { lineHeight: '1.65rem' }],
        'lg': ['1.22rem', { lineHeight: '1.75rem' }],
        'xl': ['1.42rem', { lineHeight: '1.9rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.25rem' }],
        '3xl': ['2.15rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.65rem', { lineHeight: '3rem' }],
        '5xl': ['3.25rem', { lineHeight: '3.6rem' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
    },
  },
  plugins: [],
};

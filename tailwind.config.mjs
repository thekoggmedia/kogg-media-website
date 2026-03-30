/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#00B4B4',
          bright:  '#00D4D4',
          dark:    '#007A7A',
          light:   '#EBF7F7',
        },
        navy: {
          DEFAULT: '#0A1628',
          mid:     '#0D2040',
        },
        brand: {
          black:    '#0A0A0A',
          white:    '#FFFFFF',
          offwhite: '#F8FAFB',
          gray:     '#4A5568',
          cyan:     '#00AACC',
        },
      },
      fontFamily: {
        brand: ['Space Grotesk', 'sans-serif'],
        body:  ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.8s ease forwards',
        'fade-in':   'fadeIn 0.6s ease forwards',
        'pulse-teal':'pulse-teal 2s infinite',
        'spin-slow': 'rotate 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-teal': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 180, 180, 0.4)' },
          '50%':       { boxShadow: '0 0 0 15px rgba(0, 180, 180, 0)' },
        },
        rotate: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        color: '#1a75c9',
        'color-light': '#bedbf9',
        'color-dark': '#0f447d',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

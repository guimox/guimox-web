/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        color: 'var(--theme-color, #1a75c9)',
        'color-light': 'var(--theme-color-light, #cfe4fa)',
        'color-dark': 'var(--theme-color-dark, #0f447d)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

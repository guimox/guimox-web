/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '1000px',
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      }),
      colors: {
        color: 'var(--theme-color, #3373c4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addVariant }) {
      addVariant('prose-inline-code', '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))')
    },
  ],
  darkMode: 'class',
}

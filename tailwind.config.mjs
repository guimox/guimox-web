/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            blockquote: {
              borderLeftWidth: '1px',
              borderLeftColor: theme('colors.gray.100'),
              fontStyle: 'normal',
              fontWeight: 'normal',
            },
            maxWidth: '1000px',
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        quoteless: {
          css: {
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
          },
        },
        dark: {
          css: {
            color: theme('colors.zinc.100'),
            blockquote: {
              borderLeftColor: theme('colors.zinc.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addVariant }) {
      addVariant('prose-inline-code', '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))')
    },
  ],
}

import tailwind from '@astrojs/tailwind'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import githubLightTheme from 'tm-themes/themes/github-light.json'
import githubDarkTheme from 'tm-themes/themes/ayu-dark.json'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'

const lightTheme = {
  ...githubLightTheme,
  colors: {
    ...githubLightTheme.colors,
    'editor.background': '#f3f4f6',
  },
}

const darkTheme = {
  ...githubDarkTheme,
  colors: {
    ...githubDarkTheme.colors,
  },
}

export default defineConfig({
  site: 'https://guimox.dev',
  integrations: [
    robotsTxt({
      sitemap: ['https://guimox.dev/sitemap-index.xml'],
    }),
    sitemap(),
    icon(),
    tailwind(),
  ],
  markdown: {
    shikiConfig: {
      wrap: true,
      themes: {
        light: lightTheme,
        dark: 'dark-plus',
      },
    },
    remarkPlugins: [remarkGfm, remarkSmartypants],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
        },
      ],
    ],
  },
})

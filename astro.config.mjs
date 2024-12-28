import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import githubLightTheme from 'tm-themes/themes/github-light.json'
import sitemap from '@astrojs/sitemap'

const theme = {
  ...githubLightTheme,
  colors: {
    ...githubLightTheme.colors,
    'editor.background': '#F4F4F5',
  },
}

export default defineConfig({
  site: 'https://guimox.dev',
  integrations: [
    robotsTxt({
      sitemap: ['https://guimox.dev/sitemap-index.xml'],
    }),
    icon(),
    sitemap(),
    pagefind(),
    tailwind(),
  ],
  markdown: {
    shikiConfig: {
      wrap: true,
      themes: {
        light: theme,
        dark: 'github-dark',
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

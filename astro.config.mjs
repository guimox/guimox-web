import tailwind from '@astrojs/tailwind'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import githubLightTheme from 'tm-themes/themes/github-light.json'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'

const theme = {
  ...githubLightTheme,
  colors: {
    ...githubLightTheme.colors,
    'editor.background': '#f3f4f6',
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
        light: theme,
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

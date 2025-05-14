import { OGImageRoute } from 'astro-og-canvas'
import { getCollection } from 'astro:content'

const staticPagesData = {
  index: {
    frontmatter: {
      title: 'Guilherme Lopes',
      description: 'Software Developer passionate about building things',
    },
  },
  about: {
    frontmatter: {
      title: 'About Me | Guilherme Lopes',
      description: 'Software developer who loves experimenting and learning new things',
    },
  },
  blog: {
    frontmatter: {
      title: 'Blog | Guilherme Lopes',
      description: 'Thoughts and tutorials about web development, coding practices and technology',
    },
  },
  projects: {
    frontmatter: {
      title: 'Projects | Guilherme Lopes',
      description: 'Collection of featured and personal projects built with all kind of technologies',
    },
  },
  gallery: {
    frontmatter: {
      title: 'Gallery | Guilherme Lopes',
      description: 'Collection of photos and memories from various moments',
    },
  },
  vault: {
    frontmatter: {
      title: 'Vault | Guilherme Lopes',
      description: 'Curated collection of useful links and resources about development',
    },
  },
  '404': {
    frontmatter: {
      title: 'Page Not Found | Guilherme Lopes',
      description: 'Oops! The page you were looking for does not exist',
    },
  },
}

const collection = 'posts'
const posts = await getCollection(collection)

const allPages = posts.reduce(
  (acc, post) => {
    const key = `posts/${post.slug}.png`
    acc[key] = { frontmatter: post.data }
    return acc
  },
  { ...staticPagesData } as Record<string, { frontmatter: any }>,
)

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages: allPages,
  getImageOptions: (_path: string, page: { frontmatter: any }) => ({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    border: { color: [63, 63, 70], width: 20, side: 'inline-start' },
    bgGradient: [[255, 255, 255]],
    font: {
      title: {
        color: [63, 63, 70],
        weight: 'ExtraBold',
      },
      description: {
        color: [63, 63, 70],
        weight: 'Normal',
      },
    },
  }),
})

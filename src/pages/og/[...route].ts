import { OGImageRoute } from 'astro-og-canvas'
import { getCollection } from 'astro:content'

const staticPagesData = {
  index: {
    frontmatter: {
      title: 'Your Website Name - Homepage',
      description: 'Welcome to our awesome website!',
    },
  },
  about: {
    frontmatter: {
      title: 'About Us',
      description: 'Learn more about our mission and team.',
    },
  },
  blog: {
    frontmatter: {
      title: 'Our Blog',
      description: 'Latest news, articles, and insights.',
    },
  },
  '404': {
    frontmatter: {
      title: 'Page Not Found (404)',
      description: "Oops! We couldn't find the page you were looking for.",
    },
  },
}

const collection = 'posts' // Your content collection name
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

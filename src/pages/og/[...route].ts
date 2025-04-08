import { OGImageRoute } from 'astro-og-canvas'
import { getCollection } from 'astro:content' // Use astro:content

const collection = 'posts'

const posts = await getCollection(collection)

const pages = posts.reduce(
  (acc, post) => {
    const key = `posts/${post.slug}.png`
    acc[key] = { frontmatter: post.data }

    return acc
  },
  {} as Record<string, { frontmatter: any }>,
)

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages: pages,

  getImageOptions: (_path: string, page: { frontmatter: any }) => ({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  }),
})

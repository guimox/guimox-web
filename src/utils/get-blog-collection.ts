import { getCollection } from 'astro:content'

const collection = 'posts'

export default async () => {
  const posts = await getCollection(collection)

  return posts.map((post: { data: any; slug: any }) => ({
    ...post,
    data: {
      ...post.data,
      ogImage: `https://guimox.dev/og/posts/${post.slug}.png`,
    },
  }))
}

import { getCollection } from 'astro:content'

const collection = 'posts'

export default async () => {
  const posts = await getCollection(collection)

  return posts.map((post) => ({
    ...post,
    data: {
      ...post.data,
    },
  }))
}

import { defineCollection, z } from 'astro:content'

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
})

const linksCollection = defineCollection({})

export const collections = {
  posts: postsCollection,
  links: linksCollection,
}

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

const albumsCollection = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      cover: image(),
    }),
})

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    badges: z.array(z.string()),
    github: z.string().optional(),
    live: z.string().optional(),
    featured: z.boolean().default(false),
  }),
})

export const collections = {
  posts: postsCollection,
  links: linksCollection,
  projects: projectsCollection,
  albums: albumsCollection,
}

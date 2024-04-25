import { z, defineCollection } from "astro:content";

const clients = defineCollection({
  type: "content",
  schema: z.object({
    logos: z.array(
      z.object({
        name: z.string(),
        logo: z.string(),
        website: z.string(),
      })
    ),
  }),
});

const portfolio = defineCollection({
  type: "content", // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    thumbnail: z.string(),
    client: z.string(),
    categories: z.array(z.string()),
    videos: z.array(z.string()),
  }),
});

export const collections = { clients, portfolio };

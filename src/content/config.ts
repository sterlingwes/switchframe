import { z, defineCollection } from "astro:content";

const clients = defineCollection({
  type: "content",
  schema: z.object({
    logos: z
      .array(
        z.object({
          name: z.string(),
          logo: z.string(),
          website: z.string(),
        })
      )
      .optional(),
    order: z.array(z.object({ item: z.string() })).optional(),
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

const settings = defineCollection({
  type: "content",
  schema: z.object({
    id: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    cover: z.string().optional(),
  }),
});

export const collections = { clients, portfolio };

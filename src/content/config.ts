import { z, defineCollection } from "astro:content";

const portfolio = defineCollection({
  type: "content", // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    client: z.string(),
    categories: z.array(z.string()),
    videos: z.array(z.string()),
  }),
});

export const collections = { portfolio };

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    authors: z.string().or(z.array(z.string())).optional(),
    slug: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    github: z.string().optional(),
    customjs: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };

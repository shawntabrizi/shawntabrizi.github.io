import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function getSlug(post: BlogPost): string {
  if (post.data.slug) {
    const parts = post.data.slug.replace(/^\/|\/$/g, "").split("/");
    return parts[parts.length - 1];
  }
  return post.id.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
}

export async function getSortedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

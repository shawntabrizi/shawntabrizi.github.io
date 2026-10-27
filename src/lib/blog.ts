import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function getSlug(post: BlogPost): string {
  return post.id.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
}

export async function getSortedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// Frontmatter description, or the first prose paragraph of the post as plain text.
export function getDescription(post: BlogPost): string {
  if (post.data.description) return post.data.description;
  const paragraph =
    (post.body || "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p && !/^(#|!\[|<|```|>|\||-|\*|\d+\.)/.test(p)) || "";
  const text = paragraph
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // links and images
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, "")}...` : text;
}

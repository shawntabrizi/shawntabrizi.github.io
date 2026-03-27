import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getSortedPosts, getSlug } from "../lib/blog";

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();
  return rss({
    title: "Shawn Tabrizi",
    description: "A site about discovery through experience",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${getSlug(post)}/`,
      categories: post.data.tags || post.data.categories || [],
    })),
  });
}

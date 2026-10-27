import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import { redirects } from "./src/redirects";
import { rehypeHeadingAnchors, rehypeImages } from "./src/lib/rehype";

export default defineConfig({
  site: "https://shawntabrizi.com",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [rehypeHeadingIds, rehypeHeadingAnchors, rehypeImages],
    shikiConfig: {
      theme: "github-dark",
    },
  },
  redirects,
});

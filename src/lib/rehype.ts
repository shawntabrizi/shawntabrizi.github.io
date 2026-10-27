import { readFileSync } from "node:fs";
import { imageSize } from "image-size";
import { visit } from "unist-util-visit";

// Lazy-load post images and set their intrinsic size to avoid layout shift.
export function rehypeImages() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (node.tagName !== "img") return;
      node.properties.loading ??= "lazy";
      node.properties.decoding ??= "async";
      const src = node.properties.src;
      if (typeof src !== "string" || !src.startsWith("/") || node.properties.width) return;
      try {
        const { width, height } = imageSize(readFileSync(`public${decodeURI(src)}`));
        node.properties.width = width;
        node.properties.height = height;
      } catch {
        // Missing or unreadable image: leave it unsized.
      }
    });
  };
}

// Append a "#" link to h2/h3 headings. Requires heading ids to exist.
export function rehypeHeadingAnchors() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (!["h2", "h3"].includes(node.tagName) || !node.properties.id) return;
      node.children.push({
        type: "element",
        tagName: "a",
        properties: {
          href: `#${node.properties.id}`,
          className: ["heading-anchor"],
          ariaLabel: "Link to this section",
        },
        children: [{ type: "text", value: "#" }],
      });
    });
  };
}

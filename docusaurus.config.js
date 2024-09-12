// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Shawn Tabrizi",
  tagline: "A site about discovery through experience",
  favicon: "assets/favicon/favicon-32x32.png",

  // Set the production url of your site here
  url: "https://shawntabrizi.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "shawntabrizi", // Usually your GitHub org/user name.
  projectName: "shawntabrizi.github.io", // Usually your repo name.
  deploymentBranch: "gh-pages",
  trailingSlash: true,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/shawntabrizi/shawntabrizi.github.io/tree/master/",
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
          postsPerPage: 1,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "services-blog",
        routeBasePath: "services",
        path: "./services",
        blogSidebarCount: "ALL",
        blogSidebarTitle: "All Services",
        blogTitle: "Services",
        blogDescription: "Services Rendered",
        feedOptions: {
          description: `Services`,
        },
        postsPerPage: 1,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "assets/images/social-card.png",
      navbar: {
        title: "Shawn Tabrizi",
        logo: {
          alt: "ST",
          src: "assets/images/icon-512.png",
        },
        items: [
          // {
          //   type: "docSidebar",
          //   sidebarId: "tutorialSidebar",
          //   position: "left",
          //   label: "Tutorial",
          // },
          { to: "/blog/", label: "Blog", position: "left" },
          { to: "/portfolio/", label: "Portfolio", position: "left" },
          { to: "/services/", label: "Services", position: "left" },
          { to: "/donate/", label: "Donate", position: "right" },
          {
            href: "https://github.com/shawntabrizi/",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} Shawn Tabrizi`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

  // Simple Analytics
  scripts: [
    {
      src: 'https://scripts.simpleanalyticscdn.com/latest.js',
      async: true,
      defer: true,
    },
  ],

  // Simple Analytics Fallback
  headTags: [
    {
      tagName: 'noscript',
      innerHTML: `<img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt=""/>`,
      attributes: {},
    },
  ],
};

export default config;

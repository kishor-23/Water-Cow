import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Water Cow Docs',
  tagline: 'Developer documentation for the Water Cow hydration reminder app',
  favicon: 'img/favicon.ico',

  url: 'https://watercow-docs.example.com',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Enable Mermaid diagram rendering
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
        },
        blog: false, // No blog needed for developer docs
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Water Cow Docs',
        logo: {
          alt: 'Water Cow Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/docs/development/commands',
            label: 'Commands',
            position: 'left',
          },
          {
            to: '/docs/troubleshooting/common-errors',
            label: 'Troubleshooting',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Getting Started',
            items: [
              { label: 'Installation', to: '/docs/getting-started/installation' },
              { label: 'Running the App', to: '/docs/getting-started/running' },
              { label: 'Building', to: '/docs/getting-started/building' },
            ],
          },
          {
            title: 'Architecture',
            items: [
              { label: 'Overview', to: '/docs/architecture/overview' },
              { label: 'State Management', to: '/docs/architecture/state-management' },
              { label: 'Decisions', to: '/docs/architecture/decisions' },
            ],
          },
          {
            title: 'Development',
            items: [
              { label: 'Adding Features', to: '/docs/development/adding-features' },
              { label: 'Commands', to: '/docs/development/commands' },
              { label: 'Debugging', to: '/docs/development/debugging' },
            ],
          },
        ],
        copyright: `Water Cow v1.0.0 • Expo SDK 57 • React Native 0.86 • Built with Docusaurus`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['kotlin', 'groovy', 'java'],
      },
      mermaid: {
        theme: { light: 'default', dark: 'dark' },
      },
    }),
};

export default config;

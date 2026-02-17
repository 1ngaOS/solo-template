import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '__TEMPLATE_APP_NAME__',
  tagline: '__TEMPLATE_APP_DESCRIPTION__',
  favicon: 'img/favicon.ico',

  url: '__TEMPLATE_DOCS_URL__',
  baseUrl: '/',

  organizationName: '__TEMPLATE_REPO_ORG__',
  projectName: '__TEMPLATE_REPO_NAME__',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/__TEMPLATE_REPO_ORG__/__TEMPLATE_REPO_NAME__/tree/main/apps/docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/__TEMPLATE_REPO_ORG__/__TEMPLATE_REPO_NAME__/tree/main/apps/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: '__TEMPLATE_APP_NAME_SHORT__',
      logo: {
        alt: '__TEMPLATE_LOGO_ALT__',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/__TEMPLATE_REPO_ORG__/__TEMPLATE_REPO_NAME__',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/__TEMPLATE_REPO_ORG__/__TEMPLATE_REPO_NAME__',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} __TEMPLATE_APP_NAME__. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;


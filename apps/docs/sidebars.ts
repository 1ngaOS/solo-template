import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'getting-started',
    {
      type: 'category',
      label: 'Guide',
      items: ['architecture', 'api-reference', 'deployment'],
    },
  ],
};

export default sidebars;


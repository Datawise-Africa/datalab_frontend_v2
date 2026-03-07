export type SitemapNode = {
  path: string;
  title: string;
  description?: string;
  priority?: number;
  children?: SitemapNode[];
  requiresAuth?: boolean;
  roles?: string[];
};

export const sitemap: SitemapNode[] = [
  {
    path: '/',
    title: 'Dataset catalog',
    description:
      'Landing page with dataset search, filtering, and download entry points.',
    priority: 1.0,
    children: [
      {
        path: '/datasets/:id',
        title: 'Single dataset detail',
        description:
          'Dynamic dataset landing pages presenting downloads, metadata, and stats.',
        priority: 0.9,
      },
      {
        path: '/data-dashboards',
        title: 'Sector dashboards',
        description:
          'Interactive dashboards for education, health, and other sectors.',
        priority: 0.8,
      },
      {
        path: '/reports',
        title: 'Insight reports',
        description:
          'Report library with briefings generated from curated datasets.',
        priority: 0.7,
      },
    ],
  },
  {
    path: '/app',
    title: 'Secure workspace',
    description:
      'Authenticated area for dataset creators, administrators, and signed-in users.',
    priority: 0.6,
    requiresAuth: true,
    children: [
      {
        path: '/app/become-dataset-creator',
        title: 'Become a dataset creator',
        description:
          'Application flow for contributors to submit dataset creator requests.',
        priority: 0.5,
      },
      {
        path: '/app/dataset-creator-dashboard',
        title: 'Creator dashboard',
        description:
          'Dataset creator workspace summarizing dataset performance metrics.',
        priority: 0.5,
        roles: ['dataset_creator'],
      },
      {
        path: '/app/dataset-creator-analytics',
        title: 'Creator analytics',
        description:
          'Analytics drilldowns for dataset creators with charts and insights.',
        priority: 0.5,
        roles: ['dataset_creator'],
      },
      {
        path: '/app/dataset-creator-reports',
        title: 'Creator reports',
        description: 'Reports and exports for dataset creators.',
        priority: 0.5,
        roles: ['dataset_creator'],
      },
      {
        path: '/app/applications',
        title: 'Applications',
        description: 'Admin view of dataset creator applications.',
        priority: 0.4,
        roles: ['admin'],
      },
      {
        path: '/app/approved-creators',
        title: 'Approved creators',
        description: 'Admin listing of approved dataset creators.',
        priority: 0.4,
        roles: ['admin'],
      },
      {
        path: '/app/saved-datasets',
        title: 'Saved datasets',
        description: 'Bookmarked datasets curated by authenticated users.',
        priority: 0.5,
        roles: ['user'],
      },
      {
        path: '/app/my-downloads',
        title: 'My downloads',
        description:
          'Download history showing dataset access requests and files.',
        priority: 0.5,
        roles: ['user'],
      },
      {
        path: '/app/account-settings',
        title: 'Account settings',
        description: 'Manage profile, billing, security, and notifications.',
        priority: 0.5,
        roles: ['user'],
      },
    ],
  },
  {
    path: '/404',
    title: 'Not found',
    description: 'Friendly error page for unknown URLs.',
    priority: 0.1,
  },
];

export const flattenSitemap = (nodes: SitemapNode[]): SitemapNode[] => {
  const stack = [...nodes];
  const flat: SitemapNode[] = [];
  while (stack.length) {
    const node = stack.shift()!;
    flat.push(node);
    if (node.children?.length) {
      stack.push(
        ...node.children.map((child) => ({
          ...child,
          // propagate auth values when child doesn't override them
          requiresAuth: child.requiresAuth ?? node.requiresAuth,
        })),
      );
    }
  }
  return flat;
};

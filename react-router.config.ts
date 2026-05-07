import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  // Pre-render static public pages for fast TTFB + better SEO.
  // Dynamic routes (`/datasets/:slug`, `/app/*`) continue to render via SSR.
  prerender: [
    // '/',
    // '/datasets',
    // '/dashboards',
    // '/creators',
    // '/docs',
    // '/research',
    // '/research/reports',
    // '/contact',
    // '/privacy-policy',
    // '/terms-of-service',
    '/robots.txt',
    '/sitemap.xml',
  ],
} satisfies Config;

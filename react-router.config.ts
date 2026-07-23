import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  // Only the two machine-readable routes are prerendered. Every page renders via SSR.
  //
  // The static public pages (`/`, `/datasets`, `/creators`, …) were listed here and
  // commented out without a recorded reason. Prerendering them would improve TTFB and
  // SEO, so it's worth retrying — but do it one route at a time and expect the original
  // breakage to resurface, most likely a loader that needs a live API at build time.
  prerender: ['/robots.txt', '/sitemap.xml'],
} satisfies Config;

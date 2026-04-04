import { generateRemixSitemap } from '@forge42/seo-tools/remix/sitemap';
import type { Route } from './+types/sitemap.xml';
import { href } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { routes } = await import('virtual:react-router/server-build');
  const { origin } = new URL(request.url);
  const sitemap = await generateRemixSitemap({
    domain: origin,
    ignore: [href('/.well-known/appspecific/com.chrome.devtools.json')],
    // https://github.com/forge-42/seo-tools/issues/8
    routes,
    sitemapData: async () => {
      return {
        changefreq: 'weekly',
        priority: 1.0, // url === origin + "/" ? 1.0 : 0.7,
        lastUpdated: new Date(),
      };
    },
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};

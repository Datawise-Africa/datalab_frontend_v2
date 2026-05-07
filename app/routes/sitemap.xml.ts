import { generateRemixSitemap } from '@forge42/seo-tools/remix/sitemap';
import type { Route } from './+types/sitemap.xml';
import { href } from 'react-router';

/**
 * Tune priority + changefreq per URL so Googlebot can allocate crawl budget
 * sensibly. Highest priority goes to landing + browse pages, lowest to legal
 * and auth-adjacent pages.
 */
function sitemapEntry(url: string, origin: string) {
  const path = url.replace(origin, '') || '/';

  if (path === '/') {
    return { priority: 1, changefreq: 'daily' as const };
  }
  if (path.startsWith('/datasets') || path.startsWith('/dashboards')) {
    return { priority: 0.9, changefreq: 'daily' as const };
  }
  if (path.startsWith('/research')) {
    return { priority: 0.8, changefreq: 'weekly' as const };
  }
  if (path === '/creators' || path === '/docs') {
    return { priority: 0.7, changefreq: 'weekly' as const };
  }
  if (path === '/contact') {
    return { priority: 0.5, changefreq: 'monthly' as const };
  }
  if (path === '/privacy-policy' || path === '/terms-of-service') {
    return { priority: 0.3, changefreq: 'yearly' as const };
  }
  return { priority: 0.5, changefreq: 'weekly' as const };
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { routes } = await import('virtual:react-router/server-build');
  const { origin } = new URL(request.url);

  const sitemap = await generateRemixSitemap({
    domain: origin,
    ignore: [
      href('/.well-known/appspecific/com.chrome.devtools.json'),
      // Don't expose authenticated dashboard routes in the sitemap.
      '/app',
      '/app/*',
    ],
    routes,
    sitemapData: async ({ url }: { url: string }) => {
      const { priority, changefreq } = sitemapEntry(url, origin);
      return {
        changefreq,
        priority,
        lastUpdated: new Date(),
      };
    },
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

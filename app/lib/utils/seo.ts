import { env } from '~/lib/env';

/**
 * Configuration object for SEO metadata generation.
 */
export interface SEOConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
  keywords?: string;
}

const SITE_NAME = 'Datalab Africa';
const SITE_DOMAIN = 'https://datalabafrica.com';
const TWITTER_HANDLE = '@datalabafrica';

const baseUrl =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.PUBLIC_URL || SITE_DOMAIN;

const defaultImage = `${baseUrl}/assets/datawise-logo-dark.png`;

/**
 * Generates an array of SEO meta tags for React Router 7 meta functions.
 *
 * Includes basic meta tags, Open Graph tags for social media sharing,
 * and Twitter Card tags. Automatically normalizes relative URLs and images
 * by prepending the base URL.
 *
 * @example
 * ```typescript
 * export function meta() {
 *   return generateSEOTags({
 *     title: 'About Us',
 *     description: 'Learn more about Datalab Africa',
 *     url: '/about',
 *     keywords: 'data, analytics, africa',
 *   });
 * }
 * ```
 */
export function generateSEOTags(config: SEOConfig) {
  const {
    title,
    description,
    url,
    image = defaultImage,
    type = 'website',
    keywords,
  } = config;

  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const fullUrl = url
    ? url.startsWith('http')
      ? url
      : `${baseUrl}${url}`
    : baseUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return [
    // Basic Meta Tags
    { title: fullTitle },
    { name: 'description', content: description },
    ...(keywords ? [{ name: 'keywords', content: keywords }] : []),

    // Open Graph Tags
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: fullUrl },
    { property: 'og:image', content: fullImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: title },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'en_US' },

    // Twitter Card Tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: TWITTER_HANDLE },
    { name: 'twitter:creator', content: TWITTER_HANDLE },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: fullImageUrl },
    { name: 'twitter:image:alt', content: title },

    // Additional SEO
    { name: 'author', content: SITE_NAME },
    {
      name: 'robots',
      content: env.VITE_NOINDEX ? 'noindex, nofollow' : 'index, follow',
    },
    {
      name: 'theme-color',
      content: '#16a34a',
    },
  ];
}

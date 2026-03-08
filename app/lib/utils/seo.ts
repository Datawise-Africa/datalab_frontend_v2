/**
 * Configuration object for SEO metadata generation.
 *
 * @interface SEOConfig
 *
 * @property {string} title - The page title to be used across various meta tags
 * @property {string} description - The page description for search engines and social media
 * @property {string} [url] - Optional relative or absolute URL of the page. If relative, it will be prefixed with the base URL
 * @property {string} [image] - Optional image URL for social media sharing. Defaults to the site's default image if not provided
 * @property {string} [type] - Optional Open Graph type (e.g., 'website', 'article'). Defaults to 'website'
 * @property {string} [keywords] - Optional comma-separated keywords for search engine optimization
 */
export interface SEOConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
  keywords?: string;
}

// Update this with your actual domain when deploying
const baseUrl =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.PUBLIC_URL || 'https://datawiseafrica.com';

const defaultImage = `${baseUrl}/assets/datawise-logo-dark.png`; // Create a 1200x630px image and place it in /public

/**
 * Generates an array of SEO meta tags for page metadata configuration.
 *
 * This function creates comprehensive SEO tags including basic meta tags, Open Graph tags for social media sharing,
 * and Twitter Card tags. It automatically handles URL and image URL normalization by prepending the base URL
 * when relative paths are provided.
 *
 * @param config - The SEO configuration object
 * @param config.title - The page title (used for title tag, og:title, and twitter:title)
 * @param config.description - The page description (used for meta description, og:description, and twitter:description)
 * @param config.url - The relative or absolute URL of the page (will be prefixed with baseUrl if relative)
 * @param config.image - The page's social media image URL (defaults to defaultImage if not provided)
 * @param config.type - The Open Graph type (defaults to 'website')
 * @param config.keywords - Optional comma-separated keywords for the meta keywords tag
 *
 * @returns An array of meta tag objects compatible with Next.js metadata API, containing properties like
 *          `name`, `property`, `content`, and `title` for various SEO and social media platforms
 *
 * @example
 * ```typescript
 * const tags = generateSEOTags({
 *   title: 'About Us',
 *   description: 'Learn more about Datawise Africa',
 *   url: '/about',
 *   keywords: 'data, analytics, africa'
 * });
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

  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return [
    // Basic Meta Tags
    { title },
    { name: 'description', content: description },
    ...(keywords ? [{ name: 'keywords', content: keywords }] : []),

    // Open Graph Tags
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: fullUrl },
    { property: 'og:image', content: fullImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: title },
    { property: 'og:site_name', content: 'Datawise Africa - Website' },

    // Twitter Card Tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: fullImageUrl },
    { name: 'twitter:image:alt', content: title },
    { name: 'twitter:creator', content: '@datawise_AFR' }, // Update with your Twitter handle if you have one

    // Additional SEO
    { name: 'author', content: 'Datawise Africa' },
    { name: 'robots', content: 'index, follow' },
  ];
}

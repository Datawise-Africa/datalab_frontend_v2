/**
 * Schema.org JSON-LD builders. Emit via `generateSEOTags({ jsonLd: ... })`.
 * Reference: https://schema.org, https://developers.google.com/search/docs/appearance/structured-data
 */
import { env } from '~/lib/env';

const SITE_NAME = 'Datalab';
const SITE_URL = env.VITE_SITE_URL;
const LOGO_URL = `${SITE_URL}/assets/datawise-logo-dark.png`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: ['https://www.linkedin.com/company/datawise-africa'],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/datasets?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface DatasetLike {
  id: string;
  name: string;
  slug?: string;
  description: string;
  tags?: string[];
  license?: { name?: string; url?: string } | null;
  owner?: { email?: string; first_name?: string; last_name?: string } | null;
  created_at?: string;
  updated_at?: string;
  dataset_image?: string | null;
}

export function datasetSchema(dataset: DatasetLike) {
  const identifier = dataset.slug ?? dataset.id;
  const creatorName =
    dataset.owner?.first_name || dataset.owner?.last_name
      ? `${dataset.owner?.first_name ?? ''} ${dataset.owner?.last_name ?? ''}`.trim()
      : SITE_NAME;

  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: dataset.name,
    description: dataset.description,
    url: `${SITE_URL}/datasets/${identifier}`,
    identifier,
    ...(dataset.tags?.length ? { keywords: dataset.tags.join(', ') } : {}),
    ...(dataset.license?.url ? { license: dataset.license.url } : {}),
    ...(dataset.dataset_image ? { image: dataset.dataset_image } : {}),
    ...(dataset.updated_at ? { dateModified: dataset.updated_at } : {}),
    ...(dataset.created_at ? { datePublished: dataset.created_at } : {}),
    creator: {
      '@type': 'Organization',
      name: creatorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export interface ArticleLike {
  title: string;
  description: string;
  slug: string;
  author?: string;
  published_at?: string;
  updated_at?: string;
  image?: string;
}

export function articleSchema(article: ArticleLike) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}/research/reports/${article.slug}`,
    ...(article.image ? { image: article.image } : {}),
    ...(article.author
      ? { author: { '@type': 'Person', name: article.author } }
      : {}),
    ...(article.published_at ? { datePublished: article.published_at } : {}),
    ...(article.updated_at ? { dateModified: article.updated_at } : {}),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
  };
}

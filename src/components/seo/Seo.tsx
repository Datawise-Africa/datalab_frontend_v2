import { useEffect, useMemo } from 'react';
import { seoMetadata } from '@/lib/seo-config';

export type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
};

type ComputedSeo = Required<
  Pick<
    SeoProps,
    'title' | 'description' | 'image' | 'url' | 'type' | 'canonical'
  >
> & {
  keywords: string[];
  twitterCard: 'summary' | 'summary_large_image';
  noindex: boolean;
};

const setMetaTag = ({
  attribute,
  key,
  value,
}: {
  attribute: 'name' | 'property';
  key: string;
  value: string;
}) => {
  if (typeof document === 'undefined' || !value) {
    return;
  }
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
};

const setLinkTag = (rel: string, href: string) => {
  if (typeof document === 'undefined' || !href) {
    return;
  }
  const selector = `link[rel="${rel}"]`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const computeSeo = (overrides: SeoProps): ComputedSeo => {
  const title = overrides.title
    ? seoMetadata.titleTemplate.replace('%s', overrides.title)
    : seoMetadata.defaultTitle;

  const mergedKeywords = Array.from(
    new Set([...(overrides.keywords ?? []), ...seoMetadata.keywords]),
  );

  const baseUrl = seoMetadata.baseUrl.replace(/\/$/, '');
  const windowPath =
    typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : '/';
  const relativeUrl = overrides.url ?? windowPath;
  const normalizedPath = relativeUrl.startsWith('http')
    ? relativeUrl
    : `${baseUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;

  const canonical =
    overrides.canonical ??
    (relativeUrl.startsWith('http') ? relativeUrl : normalizedPath);

  return {
    title,
    description: overrides.description ?? seoMetadata.description,
    keywords: mergedKeywords,
    image: overrides.image ?? seoMetadata.image,
    url: normalizedPath,
    type: overrides.type ?? 'website',
    canonical,
    twitterCard: overrides.twitterCard ?? 'summary_large_image',
    noindex: overrides.noindex ?? false,
  };
};

const Seo = (props: SeoProps) => {
  const metadata = useMemo<ComputedSeo>(
    () => computeSeo(props),
    // JSON stringify keeps dependencies stable without referencing window/document
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(props)],
  );

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.title = metadata.title;
    setMetaTag({
      attribute: 'name',
      key: 'description',
      value: metadata.description,
    });
    setMetaTag({
      attribute: 'name',
      key: 'keywords',
      value: metadata.keywords.join(', '),
    });
    setMetaTag({
      attribute: 'name',
      key: 'author',
      value: seoMetadata.siteName,
    });
    setMetaTag({
      attribute: 'name',
      key: 'url',
      value: metadata.url,
    });
    setMetaTag({
      attribute: 'name',
      key: 'theme-color',
      value: seoMetadata.themeColor,
    });
    setMetaTag({
      attribute: 'name',
      key: 'robots',
      value: metadata.noindex ? 'noindex,nofollow' : 'index,follow',
    });

    // Open Graph
    setMetaTag({
      attribute: 'property',
      key: 'og:title',
      value: metadata.title,
    });
    setMetaTag({
      attribute: 'property',
      key: 'og:description',
      value: metadata.description,
    });
    setMetaTag({
      attribute: 'property',
      key: 'og:url',
      value: metadata.url,
    });
    setMetaTag({
      attribute: 'property',
      key: 'og:type',
      value: metadata.type,
    });
    setMetaTag({
      attribute: 'property',
      key: 'og:site_name',
      value: seoMetadata.siteName,
    });
    setMetaTag({
      attribute: 'property',
      key: 'og:image',
      value: metadata.image,
    });

    // Twitter
    setMetaTag({
      attribute: 'name',
      key: 'twitter:card',
      value: metadata.twitterCard,
    });
    setMetaTag({
      attribute: 'name',
      key: 'twitter:title',
      value: metadata.title,
    });
    setMetaTag({
      attribute: 'name',
      key: 'twitter:description',
      value: metadata.description,
    });
    setMetaTag({
      attribute: 'name',
      key: 'twitter:image',
      value: metadata.image,
    });
    setMetaTag({
      attribute: 'name',
      key: 'twitter:creator',
      value: seoMetadata.twitterHandle,
    });
    setMetaTag({
      attribute: 'name',
      key: 'twitter:url',
      value: metadata.url,
    });

    setLinkTag('canonical', metadata.canonical);
  }, [metadata]);

  return null;
};

export default Seo;

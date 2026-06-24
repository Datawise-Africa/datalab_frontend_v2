import { env } from '~/lib/env';

/**
 * Resolves a media path returned by the API into an absolute URL.
 *
 * The backend returns image paths relative to its origin (e.g.
 * `/media/dataset_images/x.jpg`). Rendered raw, the browser resolves them
 * against the frontend origin and 404s. This prefixes relative paths with the
 * backend origin (the API base URL with any trailing `/api` segment removed).
 *
 * Absolute (`http(s):`), `data:`, and `blob:` URLs are returned unchanged.
 */
export function resolveMediaUrl(
  path?: string | null,
  apiBaseUrl: string = env.VITE_API_BASE_URL
): string | null {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  const origin = apiBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${suffix}`;
}

import { toastUtils } from './toast';

interface ShareLinkInput {
  title: string;
  text?: string;
  url: string;
}

/**
 * Share a link via the platform-native share sheet when available, falling
 * back to a clipboard copy + success toast. User cancellations from the
 * share sheet are swallowed silently.
 */
export async function shareLink({
  title,
  text,
  url,
}: ShareLinkInput): Promise<void> {
  if (typeof window === 'undefined') return;

  const data = { title, text, url };
  const canShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    // Some browsers expose `canShare` for additional validation.
    (typeof navigator.canShare !== 'function' || navigator.canShare(data));

  if (canShare) {
    try {
      await navigator.share(data);
      return;
    } catch (err) {
      // User dismissed the share sheet — nothing to do.
      if (err instanceof DOMException && err.name === 'AbortError') return;
      // Any other failure falls through to the clipboard path below.
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    toastUtils.success('Link copied to clipboard');
  } catch {
    toastUtils.error(
      "Couldn't share link",
      'Copy the URL from your address bar.'
    );
  }
}

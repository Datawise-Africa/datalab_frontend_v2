/**
 * Format bytes into a human-readable string (e.g. 1.5 KB, 3.2 MB).
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format a number with compact notation (e.g. 1.2K, 3.5M).
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Format a price value for display (e.g. "Free", "$9.99").
 */
export function formatPrice(price: number | null): string {
  if (price === null || price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

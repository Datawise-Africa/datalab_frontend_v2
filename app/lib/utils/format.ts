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
 * Format a price value for display (e.g. "Free", "KSh 1500").
 */
export function formatPrice(price: number | null): string {
  if (price === null || price === 0) return 'Free';
  return `KSh ${price.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`;
}

/**
 * Shorten a file name by collapsing its middle, preserving the start and the
 * extension/tail so it stays recognizable when constrained by a small width.
 * Example: truncateMiddle('annual-enterprise-survey-2024.csv', 24)
 *       → 'annual-enterp…2024.csv'
 */
export function truncateMiddle(name: string, max = 32): string {
  if (name.length <= max) return name;
  // Keep ~60% on the left, the rest on the right (so file extensions stay
  // visible). Reserve one character for the ellipsis.
  const keep = max - 1;
  const head = Math.ceil(keep * 0.6);
  const tail = Math.max(1, keep - head);
  return `${name.slice(0, head)}…${name.slice(name.length - tail)}`;
}

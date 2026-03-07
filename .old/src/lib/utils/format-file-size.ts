/**
 * Formats a file size in bytes to a human-readable string with appropriate units.
 *
 * @param bytes - The file size in bytes to format
 * @returns A formatted string representing the file size with the appropriate unit (Bytes, KB, MB, or GB)
 *
 * @example
 * // returns "0 Bytes"
 * formatFileSize(0);
 *
 * @example
 * // returns "1.5 KB"
 * formatFileSize(1536);
 *
 * @example
 * // returns "2.25 MB"
 * formatFileSize(2359296);
 */
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  );
};

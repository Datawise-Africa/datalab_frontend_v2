type GeneratePaginationPageNumbersProps = {
  current_page: number;
  total_pages: number;
};
/**
 * Generates an array of page numbers for pagination, including ellipsis
 * where necessary to represent skipped ranges of pages.
 *
 * @param {Object} props - The properties for pagination.
 * @param {number} props.current_page - The current active page number.
 * @param {number} props.total_pages - The total number of pages available.
 * @param {number} [maxVisiblePages=5] - The maximum number of visible pages in the pagination.
 * @returns {(number | 'ellipsis')[]} An array of page numbers and/or 'ellipsis' strings
 * to represent the pagination structure.
 *
 * @example
 * // Example usage:
 * generatePaginationPageNumbers({ current_page: 1, total_pages: 10 });
 * // Output: [1, 2, 3, 'ellipsis', 10]
 *
 * generatePaginationPageNumbers({ current_page: 5, total_pages: 10 });
 * // Output: [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 */
export function generatePaginationPageNumbers(
  { current_page, total_pages }: GeneratePaginationPageNumbersProps,
  maxVisiblePages: number = 5,
) {
  const pages = [];

  if (total_pages <= maxVisiblePages) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= total_pages; i++) {
      pages.push(i);
    }
  } else {
    // Show first page, current page range, and last page with ellipsis
    if (current_page <= 3) {
      // Show first few pages
      for (let i = 1; i <= 3; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(total_pages);
    } else if (current_page >= total_pages - 2) {
      // Show last few pages
      pages.push(1);
      pages.push('ellipsis');
      for (let i = total_pages - 2; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // Show middle pages
      pages.push(1);
      pages.push('ellipsis');
      for (let i = current_page - 1; i <= current_page + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(total_pages);
    }
  }

  return pages;
}

import { describe, it, expect } from 'vitest';
import { generatePaginationPageNumbers } from './generate-pagination-page-numbers';

describe('generatePaginationPageNumbers', () => {
  it('should return all pages when total_pages is less than or equal to maxVisiblePages', () => {
    expect(
      generatePaginationPageNumbers({ current_page: 1, total_pages: 3 }, 5),
    ).toEqual([1, 2, 3]);
  });

  it('should return correct pagination structure when current_page is at the beginning', () => {
    expect(
      generatePaginationPageNumbers({ current_page: 1, total_pages: 10 }, 5),
    ).toEqual([1, 2, 3, 'ellipsis', 10]);
  });

  it('should return correct pagination structure when current_page is at the end', () => {
    expect(
      generatePaginationPageNumbers({ current_page: 10, total_pages: 10 }, 5),
    ).toEqual([1, 'ellipsis', 8, 9, 10]);
  });

  it('should return correct pagination structure when current_page is in the middle', () => {
    expect(
      generatePaginationPageNumbers({ current_page: 5, total_pages: 10 }, 5),
    ).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('should handle edge case where total_pages is 1', () => {
    expect(
      generatePaginationPageNumbers({ current_page: 1, total_pages: 1 }, 5),
    ).toEqual([1]);
  });

  it('should handle edge case where current_page is greater than total_pages', () => {
    expect(
      generatePaginationPageNumbers({ current_page: 12, total_pages: 10 }, 5),
    ).toEqual([1, 'ellipsis', 8, 9, 10]);
  });

  it('should handle edge case where maxVisiblePages is 1', () => {
    expect(
      generatePaginationPageNumbers({ current_page: 5, total_pages: 10 }, 1),
    ).toEqual([1, 'ellipsis', 10]);
  });
});

/**
 * Standard paginated API response shape.
 * Reusable across all paginated endpoints.
 */
export interface PaginationMeta {
  total_docs: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export interface Paginated<T> {
  meta: PaginationMeta;
  data: T[];
}

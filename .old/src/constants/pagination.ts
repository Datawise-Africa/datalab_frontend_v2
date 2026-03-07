export type PaginatedResponse<T = any> = {
  meta: PaginationMetaInterface;
  data: T[];
};
export interface PaginationParamsInterface {
  page: number;
  limit: number;
}

export interface PaginationMetaInterface {
  total_docs: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export const DEFAULT_PAGINATION: PaginationParamsInterface = {
  page: 1,
  limit: 10,
};

export const DEFAULT_PAGINATION_META: PaginatedResponse['meta'] = {
  total_docs: 0,
  total_pages: 0,
  page: 1,
  limit: 10,
  has_next_page: false,
  has_prev_page: false,
  next_page: null,
  prev_page: null,
};

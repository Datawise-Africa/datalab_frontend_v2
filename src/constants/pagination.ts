export type PaginatedResponse<T = any> = {
  meta: PaginationMetaInterface;
  data: T[];
};
export interface PaginationParamsInterface {
  page: number;
  limit: number;
}

export interface PaginationMetaInterface {
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export const DEFAULT_PAGINATION: PaginationParamsInterface = {
  page: 1,
  limit: 10,
};

export const DEFAULT_PAGINATION_META: PaginatedResponse['meta'] = {
  totalDocs: 0,
  totalPages: 0,
  page: 1,
  limit: 10,
  hasNextPage: false,
  hasPrevPage: false,
  nextPage: null,
  prevPage: null,
};

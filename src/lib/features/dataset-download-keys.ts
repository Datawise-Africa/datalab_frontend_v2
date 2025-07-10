import type { PaginationParamsInterface } from '@/constants/pagination';

export const datasetDownloadKeys = {
  all: ['dataset-downloads'] as const,
  lists: (pagination: PaginationParamsInterface) =>
    [...datasetDownloadKeys.all, 'list', pagination] as const,
  list: (pagination: PaginationParamsInterface, params: Record<string, any>) =>
    [...datasetDownloadKeys.lists(pagination), params] as const,
  details: (id: string | number) =>
    [...datasetDownloadKeys.all, 'details', id] as const,
  search: (query: string) =>
    [...datasetDownloadKeys.all, 'search', query] as const,
  userDownloads: (userId: string | number) =>
    [...datasetDownloadKeys.all, 'user', userId] as const,
  userFavorites: (userId: string | number) =>
    [...datasetDownloadKeys.all, 'favorites', userId] as const,
};

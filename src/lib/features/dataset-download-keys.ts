import type { PaginationParamsInterface } from '@/constants/pagination';

export const datasetDownloadKeys = {
  all: ['dataset-downloads'] as const,
  lists: (pagination: PaginationParamsInterface, sessionId: string) =>
    [...datasetDownloadKeys.all, 'list', pagination, sessionId] as const,
  list: (pagination: PaginationParamsInterface, params: Record<string, any>, sessionId: string) =>
    [...datasetDownloadKeys.lists(pagination, sessionId), params] as const,
  details: (id: string | number, sessionId: string) =>
    [...datasetDownloadKeys.all, 'details', id, sessionId] as const,
  search: (query: string, sessionId: string) =>
    [...datasetDownloadKeys.all, 'search', query, sessionId] as const,
  userDownloads: (userId: string | number, sessionId: string) =>
    [...datasetDownloadKeys.all, 'user', userId, sessionId] as const,
  userFavorites: (userId: string | number, sessionId: string) =>
    [...datasetDownloadKeys.all, 'favorites', userId, sessionId] as const,
};

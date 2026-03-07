export const datasetCategoriesKeys = {
  all: ['dataset-categories'],
  lists: (sessionId: string) => [
    ...datasetCategoriesKeys.all,
    'list',
    sessionId,
  ],
  list: (params: Record<string, any>, sessionId: string) => [
    ...datasetCategoriesKeys.lists(sessionId),
    params,
  ],
  details: (id: string | number, sessionId: string) => [
    ...datasetCategoriesKeys.all,
    'details',
    id,
    sessionId,
  ],
  search: (query: string, sessionId: string) => [
    ...datasetCategoriesKeys.all,
    'search',
    query,
    sessionId,
  ],
};

export const datasetCategoriesKeys = {
  all: ['dataset-categories'],
  lists: () => [...datasetCategoriesKeys.all, 'list'],
  list: (params: Record<string, any>) => [
    ...datasetCategoriesKeys.lists(),
    params,
  ],
  details: (id: string | number) => [
    ...datasetCategoriesKeys.all,
    'details',
    id,
  ],
  search: (query: string) => [...datasetCategoriesKeys.all, 'search', query],
};

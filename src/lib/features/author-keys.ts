export const authorKeys = {
  all: ['authors'],
  lists: () => [...authorKeys.all, 'list'],
  list: (params: Record<string, any>) => [...authorKeys.lists(), params],
  details: (id: string | number) => [...authorKeys.all, 'details', id],
  search: (query: string) => [...authorKeys.all, 'search', query],
};

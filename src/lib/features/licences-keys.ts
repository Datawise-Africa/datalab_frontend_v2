export const licenceQueryKeys = {
  all: ['licences'],
  lists: () => [...licenceQueryKeys.all, 'list'],
  list: (params: Record<string, any>) => [...licenceQueryKeys.lists(), params],
  details: (id: string | number) => [...licenceQueryKeys.all, 'details', id],
  search: (query: string) => [...licenceQueryKeys.all, 'search', query],
  userLicences: (userId: string | number) => [
    ...licenceQueryKeys.all,
    'user',
    userId,
  ],
  userFavorites: (userId: string | number) => [
    ...licenceQueryKeys.all,
    'favorites',
    userId,
  ],
};

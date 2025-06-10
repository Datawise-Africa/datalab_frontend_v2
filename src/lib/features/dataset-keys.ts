export const datasetQueryKeys = {
    all: ['datasets'],
    lists: () => [...datasetQueryKeys.all, 'list'],
    list: (params: Record<string, any>) => [
        ...datasetQueryKeys.lists(),
        params,
    ],
    details: (id: string | number) => [...datasetQueryKeys.all, 'details', id],
    search: (query: string) => [...datasetQueryKeys.all, 'search', query],
    userDatasets: (userId: string | number) => [
        ...datasetQueryKeys.all,
        'user',
        userId,
    ],
    userFavorites: (userId: string | number) => [
        ...datasetQueryKeys.all,
        'favorites',
        userId,
    ],
};

export const termsAndConditionsQueryKeys = {
    all: ['terms-and-conditions'],
    lists: () => [...termsAndConditionsQueryKeys.all, 'list'],
    list: (params: Record<string, any>) => [
        ...termsAndConditionsQueryKeys.lists(),
        params,
    ],
    details: (id: string | number) => [
        ...termsAndConditionsQueryKeys.all,
        'details',
        id,
    ],
    search: (query: string) => [
        ...termsAndConditionsQueryKeys.all,
        'search',
        query,
    ],
    userTerms: (userId: string | number) => [
        ...termsAndConditionsQueryKeys.all,
        'user',
        userId,
    ],
    userFavorites: (userId: string | number) => [
        ...termsAndConditionsQueryKeys.all,
        'favorites',
        userId,
    ],
};

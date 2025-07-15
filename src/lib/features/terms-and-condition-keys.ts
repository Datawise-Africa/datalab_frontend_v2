export const termsAndConditionsQueryKeys = {
  all: ['terms-and-conditions'],
  lists: (sessionId: string) => [
    ...termsAndConditionsQueryKeys.all,
    'list',
    sessionId,
  ],
  list: (params: Record<string, any>, sessionId: string) => [
    ...termsAndConditionsQueryKeys.lists(sessionId),
    params,
  ],
  details: (id: string | number, sessionId: string) => [
    ...termsAndConditionsQueryKeys.all,
    'details',
    id,
    sessionId,
  ],
  search: (query: string, sessionId: string) => [
    ...termsAndConditionsQueryKeys.all,
    'search',
    query,
    sessionId,
  ],
  userTerms: (userId: string | number, sessionId: string) => [
    ...termsAndConditionsQueryKeys.all,
    'user',
    userId,
    sessionId,
  ],
  userFavorites: (userId: string | number, sessionId: string) => [
    ...termsAndConditionsQueryKeys.all,
    'favorites',
    userId,
    sessionId,
  ],
};

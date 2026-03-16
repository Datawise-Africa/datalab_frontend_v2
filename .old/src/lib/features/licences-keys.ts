export const licenceQueryKeys = {
  all: ['licences'],
  lists: (sessionId: string) => [...licenceQueryKeys.all, 'list', sessionId],
  list: (params: Record<string, any>, sessionId: string) => [
    ...licenceQueryKeys.lists(sessionId),
    params,
  ],
  details: (id: string | number, sessionId: string) => [
    ...licenceQueryKeys.all,
    'details',
    id,
    sessionId,
  ],
  search: (query: string, sessionId: string) => [
    ...licenceQueryKeys.all,
    'search',
    query,
    sessionId,
  ],
  userLicences: (userId: string | number, sessionId: string) => [
    ...licenceQueryKeys.all,
    'user',
    userId,
    sessionId,
  ],
  userFavorites: (userId: string | number, sessionId: string) => [
    ...licenceQueryKeys.all,
    'favorites',
    userId,
    sessionId,
  ],
};

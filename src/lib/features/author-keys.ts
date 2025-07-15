export const authorKeys = {
  all: ['authors'],
  lists: (sessionId:string) => [...authorKeys.all, 'list', sessionId],
  list: (params: Record<string, any>,sessionId:string) => [...authorKeys.lists(sessionId), params],
  details: (id: string | number, sessionId:string) => [...authorKeys.all, 'details', id, sessionId],
  search: (query: string, sessionId:string) => [...authorKeys.all, 'search', query, sessionId],
};

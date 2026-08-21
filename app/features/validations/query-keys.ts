export const validationKeys = {
  all: ['admin-validations'] as const,
  list: (params?: Record<string, unknown>) =>
    [...validationKeys.all, 'list', params] as const,
};

import { scopedKey } from '~/lib/utils/query-key-scope';

export const licenseKeys = {
  all: () => scopedKey('licenses'),
  lists: () => [...licenseKeys.all(), 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...licenseKeys.lists(), params] as const,
  detail: (id: string) => [...licenseKeys.all(), 'detail', id] as const,
};

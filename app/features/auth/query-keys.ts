import { scopedKey } from '~/lib/utils/query-key-scope';

export const authKeys = {
  all: () => scopedKey('auth'),
  profile: () => [...authKeys.all(), 'profile'] as const,
};

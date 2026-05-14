import { scopedKey } from '~/lib/utils/query-key-scope';

export const invitationKeys = {
  all: () => scopedKey('invitations'),
  lists: () => [...invitationKeys.all(), 'list'] as const,
  detail: (id: string) => [...invitationKeys.all(), 'detail', id] as const,
};

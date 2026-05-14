import { store } from '~/store';

/**
 * Returns the current session ID from the auth store.
 * Used to scope query keys so that switching accounts
 * never serves stale data from a previous session.
 *
 * A session ID always exists — it's generated on app init
 * and regenerated on every login/logout.
 */
export function getSessionId(): string {
  return store.getState().auth.sessionId;
}

/**
 * Creates a session-scoped base key array.
 * All user-specific query key factories should build on top of this
 * instead of a plain string array.
 *
 * Example:
 * ```ts
 * export const bookmarkKeys = {
 *   all: () => scopedKey('bookmarks'),
 *   list: () => [...bookmarkKeys.all(), 'list'] as const,
 * };
 * ```
 */
export function scopedKey(domain: string) {
  return [domain, getSessionId()] as const;
}

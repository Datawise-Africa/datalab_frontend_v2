import { describe, it, expect } from 'vitest';
import { categoryKeys } from './query-keys';
import { getSessionId } from '~/lib/utils/query-key-scope';

describe('categoryKeys', () => {
  const sessionId = getSessionId();

  it('has correct base key with session scope', () => {
    expect(categoryKeys.all()).toEqual(['categories', sessionId]);
  });

  it('builds lists key', () => {
    expect(categoryKeys.lists()).toEqual(['categories', sessionId, 'list']);
  });

  it('builds list key with filters', () => {
    const filters = { search: 'electronics' };
    expect(categoryKeys.list(filters)).toEqual([
      'categories',
      sessionId,
      'list',
      filters,
    ]);
  });

  it('builds list key without filters', () => {
    expect(categoryKeys.list()).toEqual([
      'categories',
      sessionId,
      'list',
      undefined,
    ]);
  });

  it('builds details key', () => {
    expect(categoryKeys.details()).toEqual(['categories', sessionId, 'detail']);
  });

  it('builds detail key with id', () => {
    expect(categoryKeys.detail('cat-1')).toEqual([
      'categories',
      sessionId,
      'detail',
      'cat-1',
    ]);
  });
});

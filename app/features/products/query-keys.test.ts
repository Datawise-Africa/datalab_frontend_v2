import { describe, it, expect } from 'vitest';
import { productKeys } from './query-keys';
import { getSessionId } from '~/lib/utils/query-key-scope';

describe('productKeys', () => {
  const sessionId = getSessionId();

  it('has correct base key with session scope', () => {
    expect(productKeys.all()).toEqual(['products', sessionId]);
  });

  it('builds lists key', () => {
    expect(productKeys.lists()).toEqual(['products', sessionId, 'list']);
  });

  it('builds list key with filters', () => {
    const filters = { search: 'laptop', categoryId: 'cat-1' };
    expect(productKeys.list(filters)).toEqual([
      'products',
      sessionId,
      'list',
      filters,
    ]);
  });

  it('builds list key without filters', () => {
    expect(productKeys.list()).toEqual([
      'products',
      sessionId,
      'list',
      undefined,
    ]);
  });

  it('builds details key', () => {
    expect(productKeys.details()).toEqual(['products', sessionId, 'detail']);
  });

  it('builds detail key with id', () => {
    expect(productKeys.detail('prod-1')).toEqual([
      'products',
      sessionId,
      'detail',
      'prod-1',
    ]);
  });
});

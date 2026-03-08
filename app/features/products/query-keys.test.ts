import { describe, it, expect } from 'vitest';
import { productKeys } from './query-keys';

describe('productKeys', () => {
  it('has correct base key', () => {
    expect(productKeys.all).toEqual(['products']);
  });

  it('builds lists key', () => {
    expect(productKeys.lists()).toEqual(['products', 'list']);
  });

  it('builds list key with filters', () => {
    const filters = { search: 'laptop', categoryId: 'cat-1' };
    expect(productKeys.list(filters)).toEqual(['products', 'list', filters]);
  });

  it('builds list key without filters', () => {
    expect(productKeys.list()).toEqual(['products', 'list', undefined]);
  });

  it('builds details key', () => {
    expect(productKeys.details()).toEqual(['products', 'detail']);
  });

  it('builds detail key with id', () => {
    expect(productKeys.detail('prod-1')).toEqual([
      'products',
      'detail',
      'prod-1',
    ]);
  });
});

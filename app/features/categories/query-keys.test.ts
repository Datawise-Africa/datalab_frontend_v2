import { describe, it, expect } from 'vitest';
import { categoryKeys } from './query-keys';

describe('categoryKeys', () => {
  it('has correct base key', () => {
    expect(categoryKeys.all).toEqual(['categories']);
  });

  it('builds lists key', () => {
    expect(categoryKeys.lists()).toEqual(['categories', 'list']);
  });

  it('builds list key with filters', () => {
    const filters = { search: 'electronics' };
    expect(categoryKeys.list(filters)).toEqual(['categories', 'list', filters]);
  });

  it('builds list key without filters', () => {
    expect(categoryKeys.list()).toEqual(['categories', 'list', undefined]);
  });

  it('builds details key', () => {
    expect(categoryKeys.details()).toEqual(['categories', 'detail']);
  });

  it('builds detail key with id', () => {
    expect(categoryKeys.detail('cat-1')).toEqual([
      'categories',
      'detail',
      'cat-1',
    ]);
  });
});

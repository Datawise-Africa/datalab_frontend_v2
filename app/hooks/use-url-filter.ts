import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useAppFilter, type FilterSet } from '~/store/slices/filter-slice';

/**
 * Wraps `useAppFilter` with bidirectional URL sync.
 * Filter state is the source of truth; URL params are kept in sync for
 * shareability and back/forward navigation.
 *
 * Usage: drop-in replacement for `useAppFilter(key)` on pages where
 * you want the filter state reflected in the URL.
 *
 * @example
 * const filter = useUrlFilter('datasets');
 * // URL: ?q=maize&sort=downloads&accessLevel=free,premium
 */
export function useUrlFilter(key: string) {
  const filter = useAppFilter(key);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialized = useRef(false);

  // On mount: hydrate Redux from URL params (URL wins on first load)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const q = searchParams.get('q');
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');
    const category = searchParams.get('category');

    const patch: Partial<FilterSet> = {};
    if (q) patch.searchQuery = q;
    if (sort) patch.sortBy = sort;
    if (order === 'asc' || order === 'desc') patch.sortOrder = order;
    if (category) patch.categoryFilter = category;

    // Parse tag params (e.g., accessLevel=free,premium)
    const tags: Record<string, string[]> = {};
    for (const [param, value] of searchParams.entries()) {
      if (['q', 'sort', 'order', 'category', 'page'].includes(param)) continue;
      if (value) {
        tags[param] = value.split(',').filter(Boolean);
      }
    }
    if (Object.keys(tags).length > 0) patch.tags = tags;

    if (Object.keys(patch).length > 0) {
      filter.updateFilter(patch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync Redux → URL whenever filter state changes
  useEffect(() => {
    if (!initialized.current) return;

    const params = new URLSearchParams();

    if (filter.searchQuery) params.set('q', filter.searchQuery);
    if (filter.sortBy && filter.sortBy !== 'name')
      params.set('sort', filter.sortBy);
    if (filter.sortOrder !== 'asc') params.set('order', filter.sortOrder);
    if (filter.categoryFilter) params.set('category', filter.categoryFilter);

    // Preserve page param if it exists
    const currentPage = searchParams.get('page');
    if (currentPage) params.set('page', currentPage);

    // Serialize tags
    for (const [tag, values] of Object.entries(filter.tags)) {
      if (values.length > 0) {
        params.set(tag, values.join(','));
      }
    }

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filter.searchQuery,
    filter.sortBy,
    filter.sortOrder,
    filter.categoryFilter,
    filter.tags,
  ]);

  return filter;
}

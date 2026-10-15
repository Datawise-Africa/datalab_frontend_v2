import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '~/lib/api/client';
import { useDatasets, useDataset } from './datasets/queries';
import { useDashboards, useDashboard } from './dashboards/queries';
import { useReports, useReport } from './reports/queries';

vi.mock('~/lib/api/client', () => ({ apiClient: { get: vi.fn() } }));
vi.mock('~/lib/utils/query-key-scope', () => ({
  scopedKey: (name: string) => [name],
}));

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: Readonly<{ children: ReactNode }>) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

describe('public catalog requests', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { meta: {}, data: [] },
    });
  });

  it.each([
    ['datasets', useDatasets],
    ['dashboards', useDashboards],
    ['reports', useReports],
  ] as const)(
    'requests the %s summary and cancels abandoned pages',
    async (endpoint, useCatalog) => {
      vi.mocked(apiClient.get).mockImplementation(() => new Promise(() => {}));
      const { rerender, unmount } = renderHook(
        ({ page }) => ({
          fetching: useCatalog({ page, limit: 12 }).isFetching,
        }),
        { initialProps: { page: 1 }, wrapper: makeWrapper() }
      );
      await waitFor(() => expect(apiClient.get).toHaveBeenCalledTimes(1));
      const first = vi.mocked(apiClient.get).mock.calls[0];
      expect(first[0]).toBe(`/${endpoint}/`);
      expect(first[1]?.params).toEqual({ page: 1, limit: 12, summary: true });
      const firstSignal = first[1]?.signal;
      expect(firstSignal?.aborted).toBe(false);
      rerender({ page: 2 });
      await waitFor(() => expect(apiClient.get).toHaveBeenCalledTimes(2));
      expect(firstSignal?.aborted).toBe(true);
      const secondSignal = vi.mocked(apiClient.get).mock.calls[1][1]?.signal;
      unmount();
      expect(secondSignal?.aborted).toBe(true);
    }
  );

  it.each([
    ['datasets', useDataset],
    ['dashboards', useDashboard],
    ['reports', useReport],
  ] as const)(
    'fetches the full %s detail separately',
    async (endpoint, useDetail) => {
      const { result } = renderHook(
        () => ({ success: useDetail('product-id').isSuccess }),
        { wrapper: makeWrapper() }
      );
      await waitFor(() => expect(result.current.success).toBe(true));
      const [url, config] = vi.mocked(apiClient.get).mock.calls[0];
      expect(url).toBe(`/${endpoint}/product-id/`);
      expect(config?.params).toBeUndefined();
      expect(config?.signal).toBeDefined();
    }
  );
});

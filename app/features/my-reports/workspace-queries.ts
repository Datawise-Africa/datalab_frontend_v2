import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Report } from '~/lib/types/report';
import type { Paginated } from '~/lib/types/pagination';
import { myReportKeys } from './query-keys';

/**
 * Workspace reports go through `/my-reports/?workspace={id}` — there is no
 * `/workspaces/{id}/reports/` endpoint (verified 404). The `workspace` query param is
 * the agreed interface.
 *
 * ponytail: the server does not yet honour `?workspace=` (verified live 2026-07-16 —
 * `?workspace=nonexistent` still returns everything), so we filter client-side by
 * `report.workspace?.id` as a guard. The instant the backend filters, the guard becomes
 * a no-op. Caveat while the guard is load-bearing: pagination totals come from the
 * unfiltered response, so `total` can overcount until the server filters. Acceptable at
 * current report volume; remove the guard once the backend honours the param.
 */
export function useWorkspaceReports(
  workspaceId: string,
  params?: { page?: number; limit?: number }
) {
  return useQuery({
    queryKey: [...myReportKeys.lists(), 'workspace', workspaceId, params],
    queryFn: async (): Promise<Paginated<Report>> => {
      const { data } = await apiClient.get<Paginated<Report>>('/my-reports/', {
        params: { ...params, workspace: workspaceId },
      });
      return {
        ...data,
        data: data.data.filter((r) => r.workspace?.id === workspaceId),
      };
    },
    enabled: !!workspaceId,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
}

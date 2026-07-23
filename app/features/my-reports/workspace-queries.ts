import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Report } from '~/lib/types/report';
import type { Paginated } from '~/lib/types/pagination';
import type {
  CreateReportInput,
  UpdateReportInput,
  UpdateReportStatusInput,
} from '~/lib/schema/report-schema';
import { myReportKeys } from './query-keys';
import { reportKeys } from '~/features/reports/query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

/**
 * Workspace reports live under `/workspaces/{id}/reports/`, mirroring the workspace
 * datasets/dashboards routes. They are NOT reachable via `/my-reports/`, which is
 * scoped to personal (workspace-null) reports — `/my-reports/{id}/` 404s for a
 * workspace report.
 *
 * Versions are the exception: `/my-reports/{reportId}/versions/` works for workspace
 * reports too (there is no workspace-scoped versions route — it 404s), so the shared
 * ReportVersions component needs no workspace variant.
 */

const workspaceReportKeys = {
  list: (workspaceId: string, params?: Record<string, unknown>) =>
    [...myReportKeys.all(), 'workspace', workspaceId, 'list', params] as const,
  detail: (workspaceId: string, reportId: string) =>
    [
      ...myReportKeys.all(),
      'workspace',
      workspaceId,
      'detail',
      reportId,
    ] as const,
};

export function useWorkspaceReports(
  workspaceId: string,
  params?: { page?: number; limit?: number }
) {
  return useQuery({
    queryKey: workspaceReportKeys.list(workspaceId, params),
    queryFn: async (): Promise<Paginated<Report>> => {
      const { data } = await apiClient.get<Paginated<Report>>(
        `/workspaces/${workspaceId}/reports/`,
        { params }
      );
      return data;
    },
    enabled: !!workspaceId,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
}

export function useWorkspaceReport(workspaceId: string, reportId: string) {
  return useQuery({
    queryKey: workspaceReportKeys.detail(workspaceId, reportId),
    queryFn: async (): Promise<Report> => {
      const { data } = await apiClient.get<Report>(
        `/workspaces/${workspaceId}/reports/${reportId}/`
      );
      return data;
    },
    enabled: !!workspaceId && !!reportId,
    staleTime: 2 * 60 * 1000,
  });
}

/** `access_type` collapses into the `access` object the write serializer expects. */
function toWritePayload(input: CreateReportInput | UpdateReportInput) {
  const { access_type, ...rest } = input;
  return { ...rest, ...(access_type ? { access: { access_type } } : {}) };
}

export function useCreateWorkspaceReport(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReportInput): Promise<{ id: string }> => {
      const { data } = await apiClient.post<{ id: string }>(
        `/workspaces/${workspaceId}/reports/`,
        toWritePayload(input)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReportKeys.all() });
    },
    onError: (error) => {
      toastUtils.error('Create failed', extractError(error));
    },
  });
}

export function useUpdateWorkspaceReport(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateReportInput;
    }): Promise<Report> => {
      const { data } = await apiClient.patch<Report>(
        `/workspaces/${workspaceId}/reports/${id}/`,
        toWritePayload(input)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReportKeys.all() });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
}

export function useUpdateWorkspaceReportStatus(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateReportStatusInput;
    }): Promise<Report> => {
      const { data } = await apiClient.patch<Report>(
        `/workspaces/${workspaceId}/reports/${id}/update-status/`,
        input
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReportKeys.all() });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Status change failed', extractError(error));
    },
  });
}

export function useDeleteWorkspaceReport(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/workspaces/${workspaceId}/reports/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReportKeys.all() });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
}

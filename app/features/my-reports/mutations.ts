import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Report, ReportVersion } from '~/lib/types/report';
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
 * POST /my-reports/ returns the *write* serializer, not a full Report: `category`
 * comes back as a bare id and `access` as `{}`. Verified live 2026-07-16. Read the
 * created report back via useMyReport if you need the expanded shape.
 */
export function useCreateMyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReportInput): Promise<{ id: string }> => {
      const { access_type, ...rest } = input;
      const payload = {
        ...rest,
        ...(access_type ? { access: { access_type } } : {}),
      };
      const { data } = await apiClient.post<{ id: string }>(
        '/my-reports/',
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReportKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Create failed', extractError(error));
    },
  });
}

export function useUpdateMyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateReportInput;
    }): Promise<Report> => {
      const { access_type, ...rest } = input;
      const payload = {
        ...rest,
        ...(access_type ? { access: { access_type } } : {}),
      };
      const { data } = await apiClient.patch<Report>(
        `/my-reports/${id}/`,
        payload
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: myReportKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: myReportKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
}

/** PATCH /my-reports/{id}/update-status/ — DF draft, PB published, AR archived. */
export function useUpdateMyReportStatus() {
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
        `/my-reports/${id}/update-status/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: myReportKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: myReportKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Status change failed', extractError(error));
    },
  });
}

export function useDeleteMyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/my-reports/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myReportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
}

export function useCreateMyReportVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reportId,
      input,
    }: {
      reportId: string;
      input: { version: string; description?: string };
    }): Promise<ReportVersion> => {
      const { data } = await apiClient.post<ReportVersion>(
        `/my-reports/${reportId}/versions/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: myReportKeys.versions(variables.reportId),
      });
    },
    onError: (error) => {
      toastUtils.error('Version create failed', extractError(error));
    },
  });
}

export function useDeleteMyReportVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reportId,
      versionId,
    }: {
      reportId: string;
      versionId: string;
    }): Promise<void> => {
      await apiClient.delete(`/my-reports/${reportId}/versions/${versionId}/`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: myReportKeys.versions(variables.reportId),
      });
    },
    onError: (error) => {
      toastUtils.error('Version delete failed', extractError(error));
    },
  });
}

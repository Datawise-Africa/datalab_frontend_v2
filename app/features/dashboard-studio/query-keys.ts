export const dashboardStudioKeys = {
  all: ['dashboard-studio'] as const,
  sources: (base: string, id: string) =>
    [...dashboardStudioKeys.all, base, id, 'sources'] as const,
  datasetOptions: (scope: string) =>
    [...dashboardStudioKeys.all, scope, 'dataset-options'] as const,
  shares: (base: string, id: string) =>
    [...dashboardStudioKeys.all, base, id, 'shares'] as const,
  revisions: (base: string, id: string) =>
    [...dashboardStudioKeys.all, base, id, 'revisions'] as const,
  profile: (base: string, id: string, sourceId: string) =>
    [...dashboardStudioKeys.all, base, id, 'profile', sourceId] as const,
};

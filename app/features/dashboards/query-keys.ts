export const dashboardQueryKeys = {
  all: ['dashboards'] as const,
  eduken: () => [...dashboardQueryKeys.all, 'eduken'] as const,
};

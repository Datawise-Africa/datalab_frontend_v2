export type PreviewContext =
  | { kind: 'personal' }
  | { kind: 'workspace'; workspaceId: string; workspaceName?: string };

export function backHrefFor(context: PreviewContext): string {
  return context.kind === 'workspace'
    ? `/app/workspaces/${context.workspaceId}/datasets`
    : '/app/creator-dashboard';
}

export function editHrefFor(
  context: PreviewContext,
  datasetId: string
): string {
  return context.kind === 'workspace'
    ? `/app/workspaces/${context.workspaceId}/datasets/${datasetId}/edit`
    : `/app/edit-dataset/${datasetId}`;
}

export function previewHrefFor(
  context: PreviewContext,
  datasetId: string
): string {
  return context.kind === 'workspace'
    ? `/app/workspaces/${context.workspaceId}/datasets/${datasetId}`
    : `/app/view-dataset/${datasetId}`;
}

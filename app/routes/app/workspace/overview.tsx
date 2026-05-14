import { Link, useParams } from 'react-router';
import { Users, Database, LayoutGrid, Mail, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useWorkspace } from '~/features/workspaces';

const tiles: {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  to: (id: string) => string;
}[] = [
  {
    label: 'Members',
    description: 'People with access to this workspace',
    icon: Users,
    to: (id) => `/app/workspaces/${id}/members`,
  },
  {
    label: 'Datasets',
    description: 'Datasets scoped to this workspace',
    icon: Database,
    to: (id) => `/app/workspaces/${id}/datasets`,
  },
  {
    label: 'Dashboards',
    description: 'Embedded dashboards shared here',
    icon: LayoutGrid,
    to: (id) => `/app/workspaces/${id}/dashboards`,
  },
  {
    label: 'Analytics',
    description: 'Views, downloads and engagement',
    icon: BarChart3,
    to: (id) => `/app/workspaces/${id}/analytics`,
  },
  {
    label: 'Invitations',
    description: 'Outstanding invites to this workspace',
    icon: Mail,
    to: (id) => `/app/workspaces/${id}/invitations`,
  },
];

export default function WorkspaceOverview() {
  const { id } = useParams<{ id: string }>();
  const { data: workspace } = useWorkspace(id!);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground">
          {workspace?.name
            ? `Quick links for ${workspace.name}`
            : 'Workspace quick links'}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(({ label, description, icon: Icon, to }) => (
          <Link key={label} to={to(id!)} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/60">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

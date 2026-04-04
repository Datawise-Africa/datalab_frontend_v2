import { Link } from 'react-router';
import {
  Database,
  Bookmark,
  Download,
  Upload,
  BarChart3,
  FolderKanban,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { useAppSelector } from '~/store';
import { useBookmarkedDatasets } from '~/features/bookmarks';
import { useDownloadHistory } from '~/features/downloads';
import { AuthPerm } from '~/lib/utils/perm';

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  label,
  description,
  to,
  icon: Icon,
}: {
  label: string;
  description: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="group transition-colors hover:border-primary/30">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
            <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium mb-1">{label}</h3>
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
            <Button asChild variant="ghost" size="sm" className="px-0 h-auto">
              <Link to={to}>
                Go <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview() {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: bookmarks } = useBookmarkedDatasets({}, isAuthenticated);
  const { data: downloads } = useDownloadHistory();

  const perm = AuthPerm.getInstance();
  const isCreator = user && perm.hasPermission('creator', user.user_role);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.first_name ?? 'there'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your activity on DataLab.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Bookmarked Datasets"
          value={bookmarks?.meta?.total_docs ?? 0}
          icon={Bookmark}
        />
        <StatCard
          label="Downloads"
          value={downloads?.data?.length ?? 0}
          icon={Download}
        />
        <StatCard label="Datasets" value="--" icon={Database} />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            label="Browse Datasets"
            description="Explore our catalog of curated datasets."
            to="/datasets"
            icon={Database}
          />
          {isCreator && (
            <QuickAction
              label="Upload Dataset"
              description="Publish a new dataset to the marketplace."
              to="/app/upload-dataset"
              icon={Upload}
            />
          )}
          {isCreator && (
            <QuickAction
              label="View Analytics"
              description="Track views, downloads, and engagement."
              to="/app/analytics"
              icon={BarChart3}
            />
          )}
          <QuickAction
            label="Workspaces"
            description="Collaborate on datasets with your team."
            to="/app/workspaces"
            icon={FolderKanban}
          />
        </div>
      </div>
    </div>
  );
}

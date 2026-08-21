import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { LockKeyhole, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { DashboardRenderer } from '~/components/dashboard-studio/dashboard-renderer';
import { apiClient } from '~/lib/api/client';
import type { Dashboard } from '~/lib/types/dashboard';
import { extractError } from '~/lib/utils/extract-error';

export default function SharedDashboardPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [access, setAccess] = useState<'view' | 'interact'>('interact');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const unlock = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get<{
        access: 'view' | 'interact';
        dashboard: Dashboard;
      }>(`/shared-dashboards/${token}/`, {
        headers: password ? { 'X-Dashboard-Password': password } : undefined,
      });
      setDashboard(response.data.dashboard);
      setAccess(response.data.access);
    } catch (caught) {
      setError(extractError(caught));
    } finally {
      setLoading(false);
    }
  };
  if (dashboard)
    return (
      <main className="min-h-screen bg-muted/30 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Shared via Datalab
              </p>
              <h1 className="mt-1 text-3xl font-bold">{dashboard.title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                {dashboard.description}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboards">Explore Datalab</Link>
            </Button>
          </div>
          <DashboardRenderer
            definition={dashboard.definition}
            interactive={access === 'interact'}
          />
        </div>
      </main>
    );
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <LockKeyhole className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold">Open shared dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Continue to the dashboard. If its creator protected it, enter the
          password they provided.
        </p>
        <Input
          className="mt-5"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password (if required)"
          onKeyDown={(event) => event.key === 'Enter' && unlock()}
        />
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <Button className="mt-4 w-full" onClick={unlock} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Open
          dashboard
        </Button>
      </div>
    </main>
  );
}

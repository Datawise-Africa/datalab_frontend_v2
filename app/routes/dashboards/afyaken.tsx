import { Link } from 'react-router';
import { ArrowLeft, Maximize2, ExternalLink } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { generateSEOTags } from '~/lib/utils/seo';
import type { Route } from './+types/afyaken';

const POWERBI_URL =
  'https://app.powerbi.com/view?r=eyJrIjoiZjBmZDFiMWEtZjEyOS00ODcwLThkNzMtNmJjMTQ1YjUzZmY5IiwidCI6IjRlYjE1NDIwLTNmOWItNDY1NS05MGM0LTZiNmMyYTdkMjFkOCJ9';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'AfyaKen Health Dashboard',
    description:
      'Interactive health dashboard powered by Power BI, showcasing healthcare insights across Kenya.',
  });
}

export default function AfyakenDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboards">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Dashboards
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">AfyaKen Health Dashboard</h1>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Live
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Powered by Power BI &middot; Healthcare insights across Kenya
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <a href={POWERBI_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Power BI
              </Button>
            </a>
            <a href={POWERBI_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Maximize2 className="mr-2 h-4 w-4" />
                Fullscreen
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Dashboard Embed */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <iframe
            className="h-[calc(100vh-200px)] w-full border-0"
            title="AfyaKen Health Dashboard"
            src={POWERBI_URL}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

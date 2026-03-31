import { useState } from 'react';
import { Link } from 'react-router';
import {
  LayoutDashboard,
  Search,
  Eye,
  Calendar,
  User,
  ExternalLink,
  Filter,
  BarChart3,
} from 'lucide-react';
import type { Route } from './+types/dashboards';
import { dashboards, type Dashboard } from '~/data/dashboards';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import { PageHeader } from '~/components/layout/page-header';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Dashboards & Publications',
    description:
      'Explore interactive analytics dashboards powered by Power BI, Tableau, Looker Studio, and more.',
  });
}

const platforms = [
  'All',
  'Power BI',
  'Tableau',
  'Looker Studio',
  'Metabase',
  'Custom',
];

const categories = [
  'All',
  'Climate',
  'Health',
  'Education',
  'Finance',
  'AI/ML',
  'Transportation',
  'Agriculture',
  'IoT',
  'Demographics',
];

function getPlatformBadgeClasses(platform: Dashboard['platform']): string {
  switch (platform) {
    case 'Power BI':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Tableau':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Looker Studio':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Metabase':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Custom':
      return 'bg-primary/10 text-primary border-primary/20';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export default function Dashboards() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const liveDashboardCount = dashboards.filter((d) => d.isLive).length;

  const filteredDashboards = dashboards.filter((dashboard) => {
    const matchesSearch =
      searchQuery === '' ||
      dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dashboard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dashboard.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dashboard.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesPlatform =
      activePlatform === 'All' || dashboard.platform === activePlatform;

    const matchesCategory =
      activeCategory === 'All' || dashboard.category === activeCategory;

    return matchesSearch && matchesPlatform && matchesCategory;
  });

  function resetFilters() {
    setSearchQuery('');
    setActivePlatform('All');
    setActiveCategory('All');
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Dashboards & Publications"
        description="Interactive analytics dashboards powered by Power BI, Tableau, Looker Studio, and more."
      >
        <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm">
          {liveDashboardCount} live
        </Badge>
      </PageHeader>

      {/* Filters Section */}
      <section className="border-b py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Platform Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Platform
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
                    activePlatform === platform
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5'
                  )}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Category
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
                    activeCategory === category
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {filteredDashboards.length}
            </span>{' '}
            dashboards
          </p>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredDashboards.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDashboards.map((dashboard) => (
                <Card
                  key={dashboard.slug}
                  className="group overflow-hidden border transition-shadow hover:shadow-lg"
                >
                  {/* Thumbnail */}
                  <div
                    className={cn(
                      'relative flex h-48 items-center justify-center rounded-t-lg',
                      dashboard.thumbnailColor
                    )}
                  >
                    <BarChart3 className="h-16 w-16 text-white/80" />

                    {/* Live / Coming Soon Badge */}
                    {dashboard.isLive ? (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary/10" />
                        </span>
                        Live
                      </span>
                    ) : (
                      <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 shadow-sm">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        className={cn(
                          'text-xs border',
                          getPlatformBadgeClasses(dashboard.platform)
                        )}
                      >
                        {dashboard.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {dashboard.category}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-1 text-lg font-semibold">
                      {dashboard.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {dashboard.description}
                    </p>

                    {/* Footer Info */}
                    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {dashboard.author}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {dashboard.views.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {dashboard.publishedDate}
                      </span>
                    </div>

                    {/* Action Button */}
                    {dashboard.isLive ? (
                      dashboard.internalRoute ? (
                        <Link to={dashboard.internalRoute}>
                          <Button className="w-full bg-primary text-white hover:bg-primary/90">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Dashboard
                          </Button>
                        </Link>
                      ) : (
                        <a
                          href={dashboard.embedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="w-full bg-primary text-white hover:bg-primary/90">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Dashboard
                          </Button>
                        </a>
                      )
                    ) : (
                      <Button
                        disabled
                        variant="outline"
                        className="w-full cursor-not-allowed"
                      >
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* No Results */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-gray-900">
                No dashboards found matching your criteria
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filter settings.
              </p>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="mt-4 border-primary/30 text-primary hover:bg-primary/5"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Have a Dashboard to Share?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            If you have analytics dashboards built on Data Lab datasets, we'd
            love to feature them.
          </p>
          <div className="mt-8">
            <Link to="/contact">
              <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-3">
                Submit a Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

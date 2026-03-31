import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Search, FileText, ArrowRight, Clock, X } from 'lucide-react';
import type { Route } from './+types/research-reports';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import { PageHeader } from '~/components/layout/page-header';
import { researchReports } from '~/data/research';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Research Reports',
    description:
      'Browse and search published research reports from the Data Lab team.',
  });
}

export default function ResearchReports() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    researchReports.forEach((report) => {
      report.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, []);

  const filteredReports = useMemo(() => {
    return researchReports.filter((report) => {
      const matchesSearch =
        search.trim() === '' ||
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.abstract.toLowerCase().includes(search.toLowerCase()) ||
        report.authors.some((a) =>
          a.toLowerCase().includes(search.toLowerCase())
        );

      const matchesTag = activeTag === null || report.tags.includes(activeTag);

      return matchesSearch && matchesTag;
    });
  }, [search, activeTag]);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Research Reports"
        description="Published findings, methodologies, and insights from our research projects."
      />

      {/* Search & Filter */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, author, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent pl-10 pr-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </div>

          {/* Tag Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-1">
              Filter by tag:
            </span>
            {activeTag !== null && (
              <button
                onClick={() => setActiveTag(null)}
                className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
              >
                Clear <X className="h-3 w-3" />
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-pointer',
                  activeTag === tag
                    ? 'border-primary bg-primary text-white'
                    : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <Separator className="mt-6" />
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground mb-6">
          Showing{' '}
          <span className="font-semibold text-foreground">
            {filteredReports.length}
          </span>{' '}
          {filteredReports.length === 1 ? 'report' : 'reports'}
          {search.trim() !== '' && (
            <span>
              {' '}
              for &ldquo;
              <span className="font-medium">{search.trim()}</span>
              &rdquo;
            </span>
          )}
          {activeTag && (
            <span>
              {' '}
              tagged{' '}
              <Badge variant="outline" className="text-xs ml-1 align-middle">
                {activeTag}
              </Badge>
            </span>
          )}
        </p>

        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No reports found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredReports.map((report) => (
              <Card key={report.slug} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-lg leading-snug">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {report.authors.join(', ')}
                  </CardDescription>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span>
                      {new Date(report.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {report.readTime}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {report.abstract}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {report.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-1">
                    <Link
                      to={`/research/reports/${report.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary transition-colors"
                    >
                      Read Report <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

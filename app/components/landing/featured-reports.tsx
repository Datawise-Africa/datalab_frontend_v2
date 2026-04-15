import { Link } from 'react-router';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { researchReports } from '~/data/research';

const featuredReports = researchReports.slice(0, 4);

export function FeaturedReports() {
  if (featuredReports.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Research Reports
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Published findings and insights from our research projects.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Reports coming soon. Stay tuned for published research.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Research Reports
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Published findings and insights from our research projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredReports.map((report) => (
            <Card key={report.slug} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-base leading-snug">
                  {report.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {report.authors.join(', ')}
                </CardDescription>
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{report.readTime}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {report.abstract}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {report.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-md text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link
                  to={`/research/reports/${report.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read Report <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/research/reports">
              View All Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

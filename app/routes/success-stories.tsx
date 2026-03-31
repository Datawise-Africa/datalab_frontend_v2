import { useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/success-stories';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import { PageHeader } from '~/components/layout/page-header';
import { successStories, type SuccessStory } from '~/data/success-stories';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Success Stories',
    description:
      'See how teams around the world are building with Data Lab datasets.',
  });
}

const industries = [
  'All',
  'Healthcare',
  'Fintech',
  'Climate Tech',
  'Retail',
  'Autonomous Vehicles',
  'AgriTech',
] as const;

export default function SuccessStories() {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredStories =
    activeFilter === 'All'
      ? successStories
      : successStories.filter((s) => s.industry === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Success Stories"
        description="See how teams around the world are building with Data Lab."
      />

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ── Industry Filter ─────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          {industries.map((industry) => (
            <Button
              key={industry}
              variant={activeFilter === industry ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(industry)}
              className={cn(
                'rounded-full',
                activeFilter === industry
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'border-primary/30 text-primary hover:bg-primary/5 hover:text-primary'
              )}
            >
              {industry}
            </Button>
          ))}
        </div>

        {/* ── Result Count ────────────────────────────────────── */}
        <p className="mt-6 text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-semibold text-foreground">
            {filteredStories.length}
          </span>{' '}
          {filteredStories.length === 1 ? 'story' : 'stories'}
        </p>

        <Separator className="my-6" />

        {/* ── Stories Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No stories found for this industry.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Story Card ─────────────────────────────────────────────── */
function StoryCard({ story }: { story: SuccessStory }) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <span className="text-base font-bold text-foreground">
            {story.company}
          </span>
          <Badge
            variant="outline"
            className="shrink-0 border-primary/40 text-primary"
          >
            {story.industry}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg leading-snug">
          {story.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {story.summary}
        </p>

        {/* Dataset badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {story.datasetsUsed.map((ds) => (
            <Badge
              key={ds}
              variant="secondary"
              className="bg-primary/5 text-xs text-primary"
            >
              {ds}
            </Badge>
          ))}
        </div>

        {/* Read link */}
        <div className="mt-auto pt-6">
          <Link
            to={`/success-stories/${story.slug}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary"
          >
            Read Full Story&nbsp;&rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

import { Link } from 'react-router';
import type { Route } from './+types/success-story-detail';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { CheckCircle } from 'lucide-react';
import { successStories } from '~/data/success-stories';
import { generateSEOTags } from '~/lib/utils/seo';

/* ── Loader ─────────────────────────────────────────────────── */
export function loader({ params }: Route.LoaderArgs) {
  const story = successStories.find((s) => s.slug === params.slug);

  if (!story) {
    throw new Response('Story not found', { status: 404 });
  }

  return { story };
}

/* ── Meta ───────────────────────────────────────────────────── */
export function meta({ data }: Route.MetaArgs) {
  if (!data?.story) {
    return generateSEOTags({
      title: 'Story Not Found',
      description: 'The requested success story could not be found.',
    });
  }

  return generateSEOTags({
    title: data.story.title,
    description: data.story.summary,
  });
}

/* ── Component ──────────────────────────────────────────────── */
export default function SuccessStoryDetail({
  loaderData,
}: Route.ComponentProps) {
  const { story } = loaderData;

  // Related stories: prefer same industry, fall back to others, exclude current
  const relatedStories = successStories
    .filter((s) => s.slug !== story.slug)
    .sort((a, b) => {
      if (a.industry === story.industry && b.industry !== story.industry)
        return -1;
      if (a.industry !== story.industry && b.industry === story.industry)
        return 1;
      return 0;
    })
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ── Back Link ───────────────────────────────────────── */}
        <Link
          to="/success-stories"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary"
        >
          &larr;&nbsp;Back to Success Stories
        </Link>

        {/* ── Header ──────────────────────────────────────────── */}
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {story.company}
            </h2>
            <Badge variant="outline" className="border-primary/40 text-primary">
              {story.industry}
            </Badge>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {story.title}
          </h1>
        </header>

        <Separator className="my-10" />

        {/* ── Challenge ───────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-foreground">The Challenge</h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {story.challenge}
          </p>
        </section>

        {/* ── Solution ────────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-foreground">The Solution</h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {story.solution}
          </p>
        </section>

        {/* ── Results ─────────────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-foreground">The Results</h3>
          <ul className="mt-6 space-y-4">
            {story.results.map((result, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="leading-relaxed text-muted-foreground">
                  {result}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Quote ───────────────────────────────────────────── */}
        <section className="mb-12">
          <blockquote className="rounded-r-lg border-l-4 border-primary bg-primary/5/50 py-6 pl-6 pr-4">
            <p className="text-lg italic leading-relaxed text-foreground">
              &ldquo;{story.quote}&rdquo;
            </p>
            <footer className="mt-4">
              <span className="font-semibold text-foreground">
                {story.quotePerson}
              </span>
              <span className="block text-sm text-muted-foreground">
                {story.quoteRole}
              </span>
            </footer>
          </blockquote>
        </section>

        <Separator className="my-10" />

        {/* ── Datasets Used ───────────────────────────────────── */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-foreground">Datasets Used</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {story.datasetsUsed.map((slug) => (
              <Link key={slug} to={`/datasets/${slug}`}>
                <Card className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base text-primary">
                      {slug}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm text-primary hover:text-primary">
                      View Dataset&nbsp;&rarr;
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        {/* ── Related Stories ─────────────────────────────────── */}
        <section>
          <h3 className="text-2xl font-bold text-foreground">
            Related Stories
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {relatedStories.map((related) => (
              <Link key={related.slug} to={`/success-stories/${related.slug}`}>
                <Card className="flex flex-col transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-base font-bold text-foreground">
                        {related.company}
                      </span>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-primary/40 text-primary"
                      >
                        {related.industry}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2 text-lg leading-snug">
                      {related.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {related.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                      Read Full Story&nbsp;&rarr;
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

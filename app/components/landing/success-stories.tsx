import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { successStories } from '~/data/success-stories';

const featuredStories = successStories.slice(0, 3);

export function SuccessStories() {
  if (featuredStories.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            See how teams are building transformative products and research with
            Data Lab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStories.map((story) => (
            <Link
              key={story.slug}
              to={`/success-stories/${story.slug}`}
              className="group"
            >
              <Card className="h-full flex flex-col transition-shadow hover:shadow-md">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">
                    {story.industry}
                  </Badge>
                  <p className="text-sm font-medium text-primary">
                    {story.company}
                  </p>
                  <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
                    {story.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {story.summary}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                    Read Story
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/success-stories">
              View All Stories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

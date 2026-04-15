import type { Route } from './+types/creators';
import { generateSEOTags } from '~/lib/utils/seo';
import { Card, CardContent } from '~/components/ui/card';
import { CreatorApplicationForm } from '~/components/forms';

export function meta(_: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Become a Dataset Creator',
    description:
      "Join Datalab Africa's creator program. Publish datasets, reach thousands of developers, and earn revenue.",
  });
}

export default function Creators() {
  return (
    <div className="min-h-screen bg-background">
      <section id="apply-form" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Apply to Become a Creator
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Fill out the form below and our team will review your application.
            </p>
          </div>

          <Card className="mx-auto mt-12 max-w-2xl shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <CreatorApplicationForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AllTheDataIllustration } from '~/components/illustrations/all-the-data';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/4 via-background to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left — text content */}
          <div>
            {/* <p className="text-sm text-muted-foreground mb-4">
              Trusted by 100+ data professionals
            </p> */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Access, Integrate &amp; Build with{' '}
              <span className="text-primary">World-Class Datasets</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Curated, high-quality datasets with developer-friendly APIs.
              Browse thousands of datasets, integrate in minutes, and build
              data-driven applications at scale.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Button asChild size="lg">
                <Link to="/datasets">
                  Explore Datasets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/creators">Become a creator</Link>
              </Button>
            </div>
          </div>

          {/* Right — hero illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <AllTheDataIllustration className="h-auto w-full max-w-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

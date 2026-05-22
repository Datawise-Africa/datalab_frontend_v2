import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';

const DATALAB_IMAGE_SRC = '/assets/datalab.png';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -inset-2 scale-105 bg-cover bg-no-repeat bg-center blur-[2px]"
        style={{ backgroundImage: `url(${DATALAB_IMAGE_SRC})` }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-background from-30% via-background/90 via-55% to-transparent"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="relative max-w-2xl">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Powering the Full Data Lifecycle for{' '}
              <span className="text-primary">Intelligent Systems</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Build, host, and access structured datasets, generate insights,
              and publish research through a unified platform for scalable data
              and intelligence workflows.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Button asChild size="lg">
                <Link to="/datasets">
                  Explore Datasets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="border border-border shadow-sm"
              >
                <Link to="/contact">Request our services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

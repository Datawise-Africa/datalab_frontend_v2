import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { BookWriterIllustration } from '~/components/illustrations/book-writer';

export function CreatorCTA() {
  return (
    <section className="bg-muted/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center lg:grid-cols-2">
          {/* Left — text content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Become part of the process
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Join the creator program. Publish high-quality datasets, reach
              thousands of developers, and earn revenue from your data.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/creators#apply-form">
                Register as a creator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Right — illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <BookWriterIllustration className="h-auto w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
}

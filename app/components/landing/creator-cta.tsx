import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';

export function CreatorCTA() {
  return (
    <section className="bg-slate-950 text-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center lg:grid-cols-2">
          {/* Left — text content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Become part of the process
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-lg leading-relaxed">
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

          {/* Right — image */}
          <div className="relative hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
              alt="Person writing notes"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

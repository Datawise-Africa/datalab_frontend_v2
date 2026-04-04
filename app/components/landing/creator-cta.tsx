import { Link } from 'react-router';
import {
  ArrowRight,
  Upload,
  DollarSign,
  Shield,
  BarChart3,
} from 'lucide-react';
import { Button } from '~/components/ui/button';

const benefits = [
  {
    icon: Upload,
    title: 'Easy Publishing',
    description: 'Upload datasets in minutes with our guided workflow.',
  },
  {
    icon: DollarSign,
    title: 'Earn Revenue',
    description: 'Set pricing for premium datasets and earn from downloads.',
  },
  {
    icon: Shield,
    title: 'License Control',
    description: 'Choose your license terms. We enforce them on your behalf.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track views, downloads, and engagement on your datasets.',
  },
];

export function CreatorCTA() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 p-8 sm:p-12 lg:p-16 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Share Your Data with the World
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-lg">
                Join the creator program. Publish high-quality datasets, reach
                thousands of developers, and earn revenue from your data.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link to="/creators#apply-form">
                  Apply to Become a Creator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Right - benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {benefits.map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <b.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{b.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

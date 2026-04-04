import { Search, Eye, Download, Users } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description:
      'Search and filter thousands of datasets by category, format, license, or region.',
  },
  {
    icon: Eye,
    title: 'Preview',
    description:
      'Inspect CSV data inline, read metadata, and check quality before committing.',
  },
  {
    icon: Download,
    title: 'Download',
    description:
      'Get data via direct download or our REST API with Python, JS, and R SDKs.',
  },
  {
    icon: Users,
    title: 'Collaborate',
    description:
      'Create workspaces, invite your team, and manage datasets together.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            From discovery to production in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-1/2 hidden h-px w-full bg-border lg:block" />
              )}
              <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

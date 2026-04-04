import { Database, FileText, BarChart3 } from 'lucide-react';

const pillars = [
  {
    icon: Database,
    title: 'Dataset Hub',
    description:
      'Access thousands of curated datasets with CSV preview, version control, multiple formats, and flexible licensing.',
    features: [
      'Inline CSV preview',
      'Semantic versioning',
      'Multiple export formats',
      'Flexible licensing',
    ],
  },
  {
    icon: FileText,
    title: 'Research Publishing',
    description:
      'Publish and discover expert research reports with in-browser reading, PDF downloads, and linked datasets.',
    features: [
      'Expert research reports',
      'In-browser reading',
      'PDF downloads',
      'Linked datasets',
    ],
  },
  {
    icon: BarChart3,
    title: 'Data Intelligence',
    description:
      'Explore curated dashboards, thematic collections, and research labs to derive insights from data.',
    features: [
      'Interactive dashboards',
      'Thematic collections',
      'Research labs',
      'Follow & notifications',
    ],
  },
];

export function ValueProposition() {
  return (
    <section className="border-t py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need for Data
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            A complete platform for discovering, publishing, and analyzing
            datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group rounded-2xl border p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <pillar.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {pillar.description}
              </p>
              <ul className="space-y-1.5">
                {pillar.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

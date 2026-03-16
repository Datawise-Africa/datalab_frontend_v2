import type { Route } from './+types/about';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import {
  Globe,
  Shield,
  Code,
  BookOpen,
  Database,
  Earth,
  Zap,
  FileText,
  ArrowRight,
  Lightbulb,
  Target,
} from 'lucide-react';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'About',
    description:
      "Learn about Data Lab's mission to democratize access to high-quality data for developers and researchers worldwide.",
  });
}

const coreValues = [
  {
    icon: Globe,
    title: 'Openness',
    description:
      'We believe data should be accessible to everyone. Our platform champions open standards, transparent licensing, and community-driven curation to break down barriers that have historically gatekept valuable datasets.',
  },
  {
    icon: Shield,
    title: 'Quality',
    description:
      'Every dataset on our platform undergoes rigorous validation, deduplication, and quality scoring. We maintain strict provenance tracking so you always know where your data comes from and how it was processed.',
  },
  {
    icon: Code,
    title: 'Developer Experience',
    description:
      'From our intuitive REST APIs to our Python and TypeScript SDKs, we obsess over making data integration effortless. Rich documentation, interactive previews, and instant access — no friction, just data.',
  },
  {
    icon: BookOpen,
    title: 'Research Rigor',
    description:
      'Built by researchers, for researchers. We maintain reproducible dataset versioning, detailed metadata schemas, and citation-ready documentation to support the highest standards of academic and industrial research.',
  },
];

const stats = [
  { value: '10,000+', label: 'Datasets', icon: Database },
  { value: '150+', label: 'Countries Served', icon: Earth },
  { value: '50M+', label: 'API Calls Monthly', icon: Zap },
  { value: '500+', label: 'Research Papers', icon: FileText },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 md:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge
            variant="secondary"
            className="mb-6 bg-white/20 text-primary-foreground border-primary/30 hover:bg-white/30"
          >
            Our Story
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            About <span className="text-primary-foreground">Data Lab</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80 sm:text-xl">
            We're on a mission to democratize access to high-quality data,
            empowering developers, researchers, and organizations to build the
            next generation of data-driven solutions.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <Card className="border-primary/20 bg-primary/5 dark:bg-primary/30 dark:border-primary/30">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary dark:text-primary-foreground">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To make the world's most valuable datasets accessible to every
                  developer and researcher. We believe that groundbreaking
                  discoveries and innovations shouldn't be limited by the
                  inability to find, access, or afford quality data. By building
                  the infrastructure that connects data producers with data
                  consumers, we're leveling the playing field for teams of every
                  size.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10 dark:border-primary/20">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary dark:text-primary-foreground">
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A future where data-driven innovation is limited only by
                  imagination, not by access to quality data. We envision a
                  world where a solo researcher in Nairobi has the same access
                  to curated, well-documented datasets as a team at a Fortune
                  500 company — where the tools to explore, analyze, and build
                  with data are universally available and effortless to use.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30"
            >
              How It Started
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Story
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <div className="relative border-l-2 border-primary/30 dark:border-primary pl-8 space-y-12">
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute -left-[calc(2rem+5px)] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10 dark:ring-primary" />
                <p className="text-sm font-semibold text-primary dark:text-primary">
                  2019 — The Spark
                </p>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Data Lab was born out of frustration. Our founders, Dr. Elena
                  Vasquez and Marcus Chen, were building machine learning
                  systems at leading tech companies and repeatedly hit the same
                  wall: finding high-quality, well-documented datasets was
                  unreasonably hard. Valuable data was scattered across
                  government portals, academic repositories, and proprietary
                  silos — each with its own format, licensing ambiguity, and
                  access friction. They set out to build the data platform they
                  wished existed.
                </p>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute -left-[calc(2rem+5px)] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10 dark:ring-primary" />
                <p className="text-sm font-semibold text-primary dark:text-primary">
                  2020 — Building the Foundation
                </p>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  With seed funding and a small team of four, Data Lab launched
                  its first beta with 500 curated datasets spanning climate
                  science, genomics, and urban infrastructure. The early focus
                  was on quality over quantity — every dataset was manually
                  reviewed, standardized, and documented with rich metadata.
                  Word spread quickly in the research community.
                </p>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative">
                <div className="absolute -left-[calc(2rem+5px)] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10 dark:ring-primary" />
                <p className="text-sm font-semibold text-primary dark:text-primary">
                  2022 — Scaling Up
                </p>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  After crossing 2,000 datasets and serving researchers in over
                  80 countries, Data Lab raised its Series A and expanded the
                  team to include dedicated research, engineering, and developer
                  experience functions. The launch of our public API and SDKs
                  opened the floodgates for programmatic data access, and
                  monthly API calls surged past 10 million.
                </p>
              </div>

              {/* Timeline Item 4 */}
              <div className="relative">
                <div className="absolute -left-[calc(2rem+5px)] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10 dark:ring-primary" />
                <p className="text-sm font-semibold text-primary dark:text-primary">
                  2024 — Today & Beyond
                </p>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Today, Data Lab hosts over 10,000 datasets, serves
                  organizations in 150+ countries, and processes 50 million API
                  calls every month. Our research team publishes alongside the
                  world's top institutions, and our platform is cited in over
                  500 academic papers. But we're just getting started — our
                  roadmap includes real-time data streams, federated dataset
                  search, and AI-assisted data discovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30"
            >
              What We Stand For
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Core Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we build
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {coreValues.map((value) => (
              <Card
                key={value.title}
                className="group transition-all duration-300 hover:shadow-lg hover:border-primary/30 dark:hover:border-primary"
              >
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-primary/20 dark:text-primary dark:group-hover:bg-primary dark:group-hover:text-white">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/50/20">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-primary-foreground/70 sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to explore our data?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join thousands of developers and researchers who trust Data Lab for
            their data needs.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link to="/datasets">
                Browse Datasets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/team">Meet the Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

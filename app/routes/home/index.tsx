import { Link } from 'react-router';
import type { Route } from './+types/index';
import {
  Database,
  ArrowRight,
  Code,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Users,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import {
  CardContent as CardContentSlot,
  CardHeader as CardHeaderSlot,
} from '~/components/ui/card';
import { DatasetCard } from '~/components/dataset-card';
import { normalizeApiDataset } from '~/lib/utils/dataset-adapter';
import { useDatasets } from '~/features/datasets';
import { Loader2 } from 'lucide-react';
import { successStories } from '~/data/success-stories';
import { researchReports } from '~/data/research';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Access, Integrate & Build with World-Class Datasets',
    description:
      'Data Lab provides curated, high-quality datasets with developer-friendly APIs. Browse thousands of datasets, integrate in minutes, and build data-driven applications at scale.',
  });
}

const featuredStories = successStories.slice(0, 3);
const latestReport = researchReports.slice(0, 1)[0];

const stats = [
  { label: 'Datasets', value: '10,000+' },
  { label: 'API Calls', value: '50M+' },
  { label: 'Teams', value: '2,000+' },
  { label: 'Uptime', value: '99.9%' },
];

const trustedCompanies = [
  'TechCorp',
  'Meridian Health',
  'QuantEdge',
  'TerraVerde',
  'NovaRetail',
  'AgriSync',
];

const howItWorks = [
  {
    icon: Database,
    title: 'Browse Datasets',
    description:
      'Explore our curated catalog of over 10,000 datasets spanning health, finance, climate, NLP, computer vision, and more. Filter by category, format, size, or license to find the perfect fit for your project.',
  },
  {
    icon: Code,
    title: 'Integrate via API',
    description:
      'Access any dataset through our RESTful API or Python SDK with just a few lines of code. Get paginated results, streaming downloads, and real-time query capabilities out of the box.',
  },
  {
    icon: Zap,
    title: 'Build & Scale',
    description:
      'Ship data-driven features faster with built-in caching, versioning, and webhooks. Scale from prototype to production with enterprise-grade infrastructure that handles billions of requests.',
  },
];

const whyDataLab = [
  {
    icon: Code,
    title: 'API-First Design',
    description:
      'Every dataset is accessible through a consistent, well-documented RESTful API. Our Python and TypeScript SDKs let you integrate data into your applications in minutes, not days.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'SOC 2 Type II certified infrastructure with end-to-end encryption, role-based access controls, and comprehensive audit logging. Your data access meets the strictest compliance requirements.',
  },
  {
    icon: Database,
    title: 'Versioned Datasets',
    description:
      'Every dataset is semantically versioned with full changelog history. Pin your applications to a specific version for reproducibility or subscribe to updates for the latest data.',
  },
  {
    icon: Globe,
    title: 'Open Formats',
    description:
      'All datasets are available in industry-standard formats including CSV, Parquet, JSON, and Arrow. No proprietary lock-in — export your data and use it anywhere.',
  },
  {
    icon: BarChart3,
    title: 'Research-Backed',
    description:
      'Our in-house research team continuously validates dataset quality, publishes methodology papers, and develops new tools for data analysis and machine learning workflows.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'Join a thriving community of 2,000+ teams contributing datasets, sharing analyses, and collaborating on open-source tools. Together, we are building the future of open data infrastructure.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Hero Section                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Zap className="mr-1 h-3 w-3" />
              Trusted by 2,000+ teams worldwide
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Access, Integrate &amp; Build with
              <span className="block text-primary">World-Class Datasets</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Data Lab provides curated, high-quality datasets with
              developer-friendly APIs. Browse thousands of datasets, integrate
              in minutes, and build data-driven applications at scale.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/datasets">
                  Explore Datasets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link to="/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read the Docs
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Trusted By Section                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustedCompanies.map((company) => (
              <span
                key={company}
                className="text-lg font-semibold text-muted-foreground/60 select-none"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. How It Works                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Go from discovery to production in three simple steps. No complex
              setup, no data wrangling — just clean data, fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <Card
                key={step.title}
                className="relative border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold text-primary">
                      Step {index + 1}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Featured Datasets                                                */}
      {/* ------------------------------------------------------------------ */}
      <FeaturedDatasets />

      {/* ------------------------------------------------------------------ */}
      {/* 5. Why Data Lab                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Why Data Lab
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for developers and researchers who demand reliable data
              infrastructure with zero compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyDataLab.map((feature) => (
              <Card
                key={feature.title}
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. Success Stories Preview                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 md:py-24 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Success Stories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See how industry-leading teams are building transformative
              products and research with Data Lab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStories.map((story) => (
              <Link
                key={story.slug}
                to={`/success-stories/${story.slug}`}
                className="group"
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{story.industry}</Badge>
                    </div>
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

      {/* ------------------------------------------------------------------ */}
      {/* 7. Research Spotlight                                                */}
      {/* ------------------------------------------------------------------ */}
      {latestReport && (
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Research Spotlight
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our latest research pushing the boundaries of data science and
                machine learning.
              </p>
            </div>

            <Card className="max-w-3xl mx-auto border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Latest Report
                  </span>
                </div>
                <CardTitle className="text-2xl leading-snug">
                  {latestReport.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  By {latestReport.authors.join(', ')} &middot;{' '}
                  {latestReport.readTime} read
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed line-clamp-4">
                  {latestReport.abstract}
                </p>
                <div className="flex flex-wrap gap-2">
                  {latestReport.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button asChild variant="link" className="px-0">
                  <Link to={`/research/${latestReport.slug}`}>
                    Read Report
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 8. CTA Banner                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Start Building with Data Lab Today
            </h2>
            <p className="mt-4 text-lg text-primary-foreground leading-relaxed">
              Get instant access to thousands of curated datasets. Browse,
              download, and share high-quality data for research and development
              — completely free to get started.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-primary/5"
              >
                <Link to="/creators">
                  Become a Creator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                <Link to="/datasets">Explore Datasets</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedDatasets() {
  const { data: response, isLoading } = useDatasets({
    page: 1,
    limit: 4,
    sort: 'download_count',
    order: 'desc',
  });

  const datasets = response?.data?.map(normalizeApiDataset) ?? [];

  return (
    <section className="py-16 md:py-24 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Featured Datasets
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hand-picked datasets trusted by thousands of researchers, engineers,
            and data scientists around the world.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : datasets.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No featured datasets available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset}>
                <CardHeaderSlot className="flex flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
                  <DatasetCard.Badges />
                </CardHeaderSlot>
                <CardContentSlot className="flex flex-1 flex-col gap-3 px-5 pb-4">
                  <DatasetCard.Title lineClamp={1} />
                  <DatasetCard.Description lineClamp={2} />
                  <DatasetCard.Tags limit={2} />
                  <DatasetCard.Meta />
                </CardContentSlot>
                <DatasetCard.Actions variant="compact" />
              </DatasetCard>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/datasets">
              View All Datasets
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

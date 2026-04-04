import type { Route } from './+types/creators';
import { generateSEOTags } from '~/lib/utils/seo';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { PageHeader } from '~/components/layout/page-header';
import { CreatorApplicationForm } from '~/components/forms';
import {
  Upload,
  DollarSign,
  Users,
  Shield,
  BarChart3,
  Globe,
  ArrowRight,
  Code,
  Star,
} from 'lucide-react';

export function meta(_: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Become a Dataset Creator',
    description:
      "Join Datalab Africa's creator program. Publish datasets, reach thousands of developers, and earn revenue.",
  });
}

const stats = [
  { label: 'Creators', value: '500+' },
  { label: 'Datasets', value: '10,000+' },
  { label: 'Earned', value: '$2M+' },
  { label: 'Countries', value: '150+' },
];

const steps = [
  {
    icon: Upload,
    title: '1. Prepare Your Data',
    description:
      'Clean, document, and format your dataset according to our quality standards',
  },
  {
    icon: Shield,
    title: '2. Submit for Review',
    description:
      'Our team reviews your dataset for quality, accuracy, and licensing compliance',
  },
  {
    icon: Globe,
    title: '3. Publish & Share',
    description:
      'Your dataset goes live on the marketplace, accessible via API and direct download',
  },
  {
    icon: DollarSign,
    title: '4. Earn Revenue',
    description:
      'Get paid based on downloads and API usage. Set your own pricing tier',
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: 'Monetize Your Data',
    description:
      'Earn recurring revenue every time developers access your datasets through our API',
  },
  {
    icon: Users,
    title: 'Reach Global Audience',
    description:
      'Thousands of developers and researchers discover and use datasets on Data Lab daily',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track downloads, API calls, revenue, and user engagement in real-time',
  },
  {
    icon: Shield,
    title: 'IP Protection',
    description:
      'Choose your license terms. We enforce attribution and usage requirements on your behalf',
  },
  {
    icon: Star,
    title: 'Creator Spotlight',
    description:
      'Top creators get featured on our homepage and in our newsletter to 50,000+ subscribers',
  },
  {
    icon: Code,
    title: 'API Distribution',
    description:
      'Your data is automatically served via our high-performance REST API with SDKs',
  },
];

export default function Creators() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Creator Program"
        description="Publish high-quality datasets, reach thousands of developers, and earn revenue from your data."
      >
        <Button asChild>
          <a href="#apply-form">
            Apply to Become a Creator
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Go from raw data to published dataset in four simple steps.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.title}
                  className="text-center border-none shadow-sm bg-gray-50/60"
                >
                  <CardHeader className="pb-2">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* ==================== WHY BECOME A CREATOR ==================== */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Why Become a Creator
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Everything you need to publish, distribute, and monetize your
              datasets.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="border shadow-sm">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-lg">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* ==================== APPLICATION FORM ==================== */}
      <section id="apply-form" className="bg-primary/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
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

import type { Route } from './+types/index';
import { generateSEOTags } from '~/lib/utils/seo';
import { organizationSchema, websiteSchema } from '~/lib/utils/structured-data';
import { Hero } from '~/components/landing/hero';
import { FeaturedDatasets } from '~/components/landing/featured-datasets';
import { FeaturedReports } from '~/components/landing/featured-reports';
import { FeaturedDashboards } from '~/components/landing/featured-dashboards';
import { CreatorCTA } from '~/components/landing/creator-cta';
// import { FAQ } from '~/components/landing/faq';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Access, Integrate & Build with World-Class Datasets',
    description:
      'Data Lab provides curated, high-quality datasets with developer-friendly APIs. Browse thousands of datasets, integrate in minutes, and build data-driven applications at scale.',
    url: '/',
    jsonLd: [organizationSchema(), websiteSchema()],
  });
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedDatasets />
      <FeaturedReports />
      <FeaturedDashboards />
      <CreatorCTA />
      {/* <FAQ /> */}
    </div>
  );
}

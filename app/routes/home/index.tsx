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
    title: 'The data lifecycle for intelligent systems',
    description:
      'Host, share, and access structured datasets, generate insights, and publish research — one platform for scalable data and intelligence workflows.',
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

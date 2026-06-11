import type { Route } from './+types/home';
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
    title: 'Build, Manage, and Publish Data Products',
    description:
      "Africa's home for curated, high-quality datasets — to power data-driven research, products, and decisions.",
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

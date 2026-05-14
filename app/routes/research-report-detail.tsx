import type { Route } from './+types/research-report-detail';
import { generateSEOTags } from '~/lib/utils/seo';

export function loader(_args: Route.LoaderArgs) {
  throw new Response('Not Found', { status: 404 });
}

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Report Not Found',
    description: 'The requested research report could not be found.',
  });
}

export default function ResearchReportDetail() {
  return null;
}

import type { Route } from './+types/become-dataset-creator';
import { Link } from 'react-router';
import { generateSEOTags } from '~/lib/utils/seo';
import { LockKeyhole, ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { CreatorApplicationForm } from '~/components/forms/creator-application-form';
import { useAppSelector } from '~/store';
import { AuthPerm } from '~/lib/utils/perm';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Become a Dataset Creator',
    description: 'Apply to become a dataset creator on Datalab Africa',
  });
}

export default function BecomeDatasetCreator() {
  const user = useAppSelector((s) => s.auth.user);

  // Access check — admins and existing creators shouldn't see this
  if (user) {
    const perm = AuthPerm.getInstance();
    if (
      perm.hasPermission('creator', user.user_role) ||
      perm.hasPermission('admin', user.user_role)
    ) {
      return (
        <div className="container mx-auto max-w-lg px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <LockKeyhole className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You already have dataset creator privileges.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/app/creator-dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Become a Dataset Creator</h1>
        <p className="text-muted-foreground">
          Apply to publish datasets on Datalab Africa. Share your data with
          thousands of researchers and developers.
        </p>
      </div>

      <CreatorApplicationForm />
    </div>
  );
}

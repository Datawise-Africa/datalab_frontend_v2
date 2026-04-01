import { useFormContext } from 'react-hook-form';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import type { UploadFormValues } from './types';

export function StepReview() {
  const { watch } = useFormContext<UploadFormValues>();
  const values = watch();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Review & Create</h2>
      <p className="text-sm text-muted-foreground">
        Review your dataset details. After creation, you&apos;ll be able to add
        a version and upload files.
      </p>

      <div className="rounded-lg border p-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Name</span>
          <span className="text-muted-foreground">
            {values.name || '(untitled)'}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Type</span>
          <Badge variant="secondary" className="capitalize">
            {values.dataset_type}
          </Badge>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Access</span>
          <Badge variant="secondary" className="capitalize">
            {values.access?.access_type}
          </Badge>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Authors</span>
          <span className="text-muted-foreground">
            {values.authors?.length ?? 0} author
            {(values.authors?.length ?? 0) !== 1 ? 's' : ''}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Tags</span>
          <span className="text-muted-foreground">
            {values.tags?.length ? values.tags.join(', ') : '(none)'}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Premium</span>
          <span className="text-muted-foreground">
            {values.is_premium ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Private</span>
          <span className="text-muted-foreground">
            {values.is_private ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
        <p className="font-medium text-primary mb-1">
          Next steps after creation
        </p>
        <p className="text-muted-foreground">
          Once created, go to the dataset page to add a version and upload your
          files using presigned S3 URLs.
        </p>
      </div>
    </div>
  );
}

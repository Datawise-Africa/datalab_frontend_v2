import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Form } from '~/components/ui/form';
import { FormTextField } from '~/components/form-fields';
import {
  reportCategoryResolver,
  type ReportCategoryFormValues,
} from '~/lib/schema/report-schema';
import {
  useCreateReportCategory,
  useUpdateReportCategory,
} from '~/features/report-categories';
import type { ReportCategory } from '~/lib/types/report';
import { toastUtils } from '~/lib/utils/toast';

interface ReportCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ReportCategory | null;
}

const emptyValues: ReportCategoryFormValues = { name: '' };

export function ReportCategoryDialog({
  open,
  onOpenChange,
  category,
}: Readonly<ReportCategoryDialogProps>) {
  const isEdit = !!category;
  const createMutation = useCreateReportCategory();
  const updateMutation = useUpdateReportCategory();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    resolver: reportCategoryResolver,
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(category ? { name: category.name } : emptyValues);
  }, [open, category, form]);

  const onSubmit = (values: ReportCategoryFormValues) => {
    const payload = { name: values.name.trim() };

    const handleSuccess = (action: 'Created' | 'Updated') => {
      toastUtils.success(`${action} category`, payload.name);
      onOpenChange(false);
    };

    if (isEdit && category) {
      updateMutation.mutate(
        { id: category.id, input: payload },
        { onSuccess: () => handleSuccess('Updated') }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => handleSuccess('Created'),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit category' : 'New report category'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Rename this category. Its URL slug stays the same.'
              : 'Group reports under a category for easier discovery.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-1"
          >
            <FormTextField
              control={form.control}
              name="name"
              label="Name"
              placeholder="e.g. Climate, Policy"
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Save changes' : 'Create category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

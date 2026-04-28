import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { FormTextField, FormTextareaField } from '~/components/form-fields';
import {
  dashboardCategorySchema,
  type DashboardCategoryFormValues,
} from '~/lib/schema/dashboard-schema';
import {
  useCreateDashboardCategory,
  useUpdateDashboardCategory,
} from '~/features/dashboard-categories';
import type { DashboardCategory } from '~/lib/types/dashboard';
import { toastUtils } from '~/lib/utils/toast';

interface DashboardCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: DashboardCategory | null;
}

const emptyValues: DashboardCategoryFormValues = {
  name: '',
  description: '',
};

export function DashboardCategoryDialog({
  open,
  onOpenChange,
  category,
}: Readonly<DashboardCategoryDialogProps>) {
  const isEdit = !!category;
  const createMutation = useCreateDashboardCategory();
  const updateMutation = useUpdateDashboardCategory();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<DashboardCategoryFormValues>({
    resolver: zodResolver(dashboardCategorySchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      category
        ? { name: category.name, description: category.description ?? '' }
        : emptyValues
    );
  }, [open, category, form]);

  const onSubmit = (values: DashboardCategoryFormValues) => {
    const payload = {
      name: values.name,
      description: values.description?.trim() || undefined,
    };

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
            {isEdit ? 'Edit category' : 'New dashboard category'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the category name or description.'
              : 'Group dashboards under a category for easier discovery.'}
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
              placeholder="e.g. Health, Education"
              required
            />
            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Short summary of what this category covers"
              rows={3}
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

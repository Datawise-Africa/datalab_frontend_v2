import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AppDialog } from '~/components/ui/app-dialog';
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
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit category' : 'New dashboard category'}
      description={
        isEdit
          ? 'Update the category name or description.'
          : 'Group dashboards under a category for easier discovery.'
      }
      size="sm"
      closeMode="explicit"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="dashboard-category-form"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Save changes' : 'Create category'}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form
          id="dashboard-category-form"
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
        </form>
      </Form>
    </AppDialog>
  );
}

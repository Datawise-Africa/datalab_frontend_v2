import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Save, X } from 'lucide-react';
import { useEffect } from 'react';
import { toastUtils } from '~/lib/utils/toast';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  Category,
} from '~/lib/schema';
import { createCategorySchema, updateCategorySchema } from '~/lib/schema';
import { useCreateCategory, useUpdateCategory } from '~/features/categories';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Form } from '~/components/ui/form';
import { FormTextField, FormTextareaField } from '~/components/form-fields';

interface CategoryFormProps {
  mode: 'create' | 'edit';
  category?: Category;
  onSuccess?: () => void;
}

export function CategoryForm({ mode, category, onSuccess }: CategoryFormProps) {
  const navigate = useNavigate();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isEdit = mode === 'edit';
  const schema = isEdit ? updateCategorySchema : createCategorySchema;

  const form = useForm<CreateCategoryInput | UpdateCategoryInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isEdit && category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      });
    }
  }, [category, isEdit, form]);

  const onSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    try {
      if (isEdit && category) {
        await updateCategory.mutateAsync({ id: category.id, input: data });
        toastUtils.success(
          'Updated!',
          'Category has been updated successfully.'
        );
        navigate(`/categories/${category.id}`);
      } else {
        await createCategory.mutateAsync(data as CreateCategoryInput);
        toastUtils.success(
          'Success!',
          'Category has been created successfully.'
        );
        navigate('/categories');
      }
      onSuccess?.();
    } catch (error) {
      toastUtils.error(
        `${isEdit ? 'Update' : 'Creation'} Failed`,
        `Failed to ${isEdit ? 'update' : 'create'} category. Please try again.`
      );
      console.error(
        `Failed to ${isEdit ? 'update' : 'create'} category:`,
        error
      );
    }
  };

  const isPending = isEdit
    ? updateCategory.isPending
    : createCategory.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? 'Edit Category' : 'Create New Category'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormTextField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Enter category name"
              required
            />

            <FormTextField
              control={form.control}
              name="slug"
              label="Slug"
              placeholder="category-slug"
              required
            />

            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Enter category description (optional)"
              rows={4}
            />

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {form.formState.isSubmitting || isPending
                  ? isEdit
                    ? 'Saving...'
                    : 'Creating...'
                  : isEdit
                    ? 'Save Changes'
                    : 'Create Category'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    isEdit ? `/categories/${category?.id}` : '/categories'
                  )
                }
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Save, X } from 'lucide-react';
import { useEffect } from 'react';
import { toastUtils } from '~/lib/utils/toast';
import type {
  CreateProductInput,
  UpdateProductInput,
  Product,
} from '~/lib/schema';
import { createProductSchema, updateProductSchema } from '~/lib/schema';
import { useCreateProduct, useUpdateProduct } from '~/features/products';
import { useCategories } from '~/features/categories';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Form } from '~/components/ui/form';
import {
  FormTextField,
  FormTextareaField,
  FormNumberField,
  FormSelectField,
} from '~/components/form-fields';

interface ProductFormProps {
  mode: 'create' | 'edit';
  product?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ mode, product, onSuccess }: ProductFormProps) {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categoriesData } = useCategories();

  const isEdit = mode === 'edit';
  const schema = isEdit ? updateProductSchema : createProductSchema;

  const form = useForm<CreateProductInput | UpdateProductInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      stock: 0,
      categoryId: '',
      imageUrl: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isEdit && product) {
      form.reset({
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || '',
        description: product.description || '',
      });
    }
  }, [product, isEdit, form]);

  const onSubmit = async (data: CreateProductInput | UpdateProductInput) => {
    try {
      if (isEdit && product) {
        await updateProduct.mutateAsync({ id: product.id, input: data });
        toastUtils.success(
          'Updated!',
          'Product has been updated successfully.'
        );
        navigate(`/products/${product.id}`);
      } else {
        await createProduct.mutateAsync(data as CreateProductInput);
        toastUtils.success(
          'Success!',
          'Product has been created successfully.'
        );
        navigate('/products');
      }
      onSuccess?.();
    } catch (error) {
      toastUtils.error(
        `${isEdit ? 'Update' : 'Creation'} Failed`,
        `Failed to ${isEdit ? 'update' : 'create'} product. Please try again.`
      );
      console.error(
        `Failed to ${isEdit ? 'update' : 'create'} product:`,
        error
      );
    }
  };

  const isPending = isEdit ? updateProduct.isPending : createProduct.isPending;

  const categoryOptions =
    categoriesData?.data.map((category) => ({
      value: category.id,
      label: category.name,
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Product' : 'Create New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormTextField
              control={form.control}
              name="name"
              label="Product Name"
              placeholder="Enter product name"
              required
            />

            <FormTextField
              control={form.control}
              name="sku"
              label="SKU"
              placeholder="PROD-001"
              required
            />

            {/* Price and Stock Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormNumberField
                control={form.control}
                name="price"
                label="Price"
                placeholder="0.00"
                step={0.01}
                min={0}
                required
              />

              <FormNumberField
                control={form.control}
                name="stock"
                label="Stock"
                placeholder="0"
                min={0}
                required
              />
            </div>

            <FormSelectField
              control={form.control}
              name="categoryId"
              label="Category"
              placeholder="Select a category"
              options={categoryOptions}
              required
            />

            <FormTextField
              control={form.control}
              name="imageUrl"
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              type="url"
            />

            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Enter product description (optional)"
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
                    : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(isEdit ? `/products/${product?.id}` : '/products')
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

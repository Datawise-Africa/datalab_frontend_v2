import { useParams } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useCategory } from '~/features/categories';
import { generateSEOTags } from '~/lib/utils/seo';
import { apiClient } from '~/lib/api/client';
import { categorySchema } from '~/lib/schema/category.schema';
import { CategoryForm } from '~/components/forms';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  if (!id || !/^[\w-]+$/.test(id)) {
    throw new Response('Invalid category ID', { status: 400 });
  }

  try {
    const { data } = await apiClient.get(`/categories/${id}`);
    const category = categorySchema.parse(data);
    return { category };
  } catch (error) {
    if (error instanceof Response) throw error;
    throw new Response('Category not found', { status: 404 });
  }
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  const category = loaderData?.category;

  if (!category) {
    return generateSEOTags({
      title: 'Edit Category - Datawise Africa',
      description: 'Edit category details and information.',
      url: '/categories',
    });
  }

  return generateSEOTags({
    title: `Edit ${category.name} - Category Management`,
    description: `Update information for ${category.name} category.`,
    url: `/categories/${category.id}/edit`,
    keywords: `edit category, ${category.name}, category management`,
  });
};

export default function CategoryEditPage() {
  const { id } = useParams();
  const { data: category, isLoading } = useCategory(id ?? '');

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-destructive">Invalid category ID</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-destructive">Category not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <CategoryForm mode="edit" category={category} />
      </div>
    </div>
  );
}

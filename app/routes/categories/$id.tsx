import { useParams, Link, useNavigate } from 'react-router';
import { useCategory } from '~/features/categories';
import { ArrowLeft, Edit, Calendar, Tag } from 'lucide-react';
import { generateSEOTags } from '~/lib/utils/seo';
import { apiClient } from '~/lib/api/client';
import { categorySchema } from '~/lib/schema/category.schema';
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const category = data?.category;

  if (!category) {
    return generateSEOTags({
      title: 'Category Not Found - Datawise Africa',
      description: 'The requested category could not be found.',
      url: '/categories',
    });
  }

  return generateSEOTags({
    title: `${category.name} - Category Details`,
    description:
      category.description || `View details for ${category.name} category.`,
    url: `/categories/${category.id}`,
    keywords: `${category.name}, ${category.slug}, category`,
  });
};

export default function CategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: category, isLoading, error } = useCategory(id ?? '');

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
        <div className="text-xl">Loading category...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-destructive">
          Error loading category: {error?.message || 'Category not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/categories')}
          className="text-blue-600 hover:underline mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <Link
            to={`/categories/${category.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Slug
            </span>
            <p className="text-lg">{category.slug}</p>
          </div>

          {category.description && (
            <div>
              <span className="text-sm font-semibold text-gray-600">
                Description
              </span>
              <p className="text-lg">{category.description}</p>
            </div>
          )}

          <div>
            <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Created At
            </span>
            <p className="text-lg">
              {new Date(category.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Updated At
            </span>
            <p className="text-lg">
              {new Date(category.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to={`/products?categoryId=${category.id}`}
            className="text-blue-600 hover:underline text-lg"
          >
            View Products in this Category →
          </Link>
        </div>
      </div>
    </div>
  );
}

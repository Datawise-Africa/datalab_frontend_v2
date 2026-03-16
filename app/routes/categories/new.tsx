import { generateSEOTags } from '~/lib/utils/seo';
import { CategoryForm } from '~/components/forms';

export function meta() {
  return generateSEOTags({
    title: 'Create New Category - Datawise Africa',
    description:
      'Create a new product category. Define category name, slug, and description to organize your inventory effectively.',
    url: '/categories/new',
    keywords:
      'create category, new category, add category, category management',
  });
}

export default function CategoryCreatePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <CategoryForm mode="create" />
      </div>
    </div>
  );
}

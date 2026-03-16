import { generateSEOTags } from '~/lib/utils/seo';
import { ProductForm } from '~/components/forms';

export function meta() {
  return generateSEOTags({
    title: 'Create New Product - Datawise Africa',
    description:
      'Add a new product to your inventory. Enter product details including name, SKU, price, stock, category, image, and description.',
    url: '/products/new',
    keywords:
      'create product, new product, add product, product management, inventory',
  });
}

export default function ProductCreatePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}

import { useParams } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useProduct } from '~/features/products';
import { generateSEOTags } from '~/lib/utils/seo';
import { apiClient } from '~/lib/api/client';
import { productSchema } from '~/lib/schema/product.schema';
import { ProductForm } from '~/components/forms';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  if (!id || !/^[\w-]+$/.test(id)) {
    throw new Response('Invalid product ID', { status: 400 });
  }

  try {
    const { data } = await apiClient.get(`/products/${id}`);
    const product = productSchema.parse(data);
    return { product };
  } catch (error) {
    if (error instanceof Response) throw error;
    throw new Response('Product not found', { status: 404 });
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const product = data?.product;

  if (!product) {
    return generateSEOTags({
      title: 'Edit Product - Datawise Africa',
      description: 'Edit product details and information.',
      url: '/products',
    });
  }

  return generateSEOTags({
    title: `Edit ${product.name} - Product Management`,
    description: `Update information for ${product.name}.`,
    url: `/products/${product.id}/edit`,
    image: product.imageUrl,
    keywords: `edit product, ${product.name}, product management`,
  });
};

export default function ProductEditPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id ?? '');

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-destructive">Invalid product ID</div>
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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-destructive">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <ProductForm mode="edit" product={product} />
      </div>
    </div>
  );
}

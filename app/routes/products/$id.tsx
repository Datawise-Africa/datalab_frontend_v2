import { useParams, Link } from 'react-router';
import { useProduct } from '~/features/products';
import {
  ArrowLeft,
  Edit,
  Tag,
  Package,
  DollarSign,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { generateSEOTags } from '~/lib/utils/seo';
import { apiClient } from '~/lib/api/client';
import { productSchema } from '~/lib/schema/product.schema';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
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
      title: 'Product Not Found - Datawise Africa',
      description: 'The requested product could not be found.',
      url: '/products',
    });
  }

  return generateSEOTags({
    title: `${product.name} - Product Details`,
    description:
      product.description ||
      `View details for ${product.name}. Price: $${product.price}, Stock: ${product.stock} units.`,
    url: `/products/${product.id}`,
    image: product.imageUrl,
    keywords: `${product.name}, ${product.sku}, product, inventory`,
  });
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id ?? '');

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
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-destructive">
          Error loading product: {error?.message || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/products" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">
                    No image available
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Button asChild>
                  <Link to={`/products/${product.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-8 h-8 text-primary" />
                <p className="text-3xl font-bold text-primary">
                  {product.price.toFixed(2)}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-1">
                    <Tag className="w-4 h-4" />
                    SKU
                  </div>
                  <p className="text-lg">{product.sku}</p>
                </div>

                {product.categoryName && (
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">
                      Category
                    </div>
                    <p className="text-lg">
                      <Link
                        to={`/categories/${product.categoryId}`}
                        className="text-primary hover:underline"
                      >
                        {product.categoryName}
                      </Link>
                    </p>
                  </div>
                )}

                <div>
                  <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4" />
                    Stock
                  </div>
                  <p className="text-lg flex items-center gap-2">
                    {product.stock} units
                    {product.stock === 0 && (
                      <span className="flex items-center gap-1 text-destructive font-semibold">
                        <AlertCircle className="w-4 h-4" />
                        Out of Stock
                      </span>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                      <span className="flex items-center gap-1 text-orange-600 font-semibold">
                        <AlertCircle className="w-4 h-4" />
                        Low Stock
                      </span>
                    )}
                  </p>
                </div>

                {product.description && (
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">
                      Description
                    </div>
                    <p className="text-lg text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                )}

                <div>
                  <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4" />
                    Created At
                  </div>
                  <p className="text-lg">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4" />
                    Updated At
                  </div>
                  <p className="text-lg">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

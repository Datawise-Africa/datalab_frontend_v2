import { Link } from 'react-router';
import { useProducts, useDeleteProduct } from '~/features/products';
import { useCategories } from '~/features/categories';
import { useAppFilter } from '~/store/slices/filter-slice';
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from '~/components/data-table';
import { useProductColumns } from '~/lib/table-cols';
import { generateSEOTags } from '~/lib/utils/seo';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Alert, AlertDescription } from '~/components/ui/alert';

export function meta() {
  return generateSEOTags({
    title: 'Products - Datawise Africa',
    description:
      'Browse and manage your product inventory. Search, filter by category, sort by various criteria, and organize your products efficiently.',
    url: '/products',
    keywords:
      'products, product management, inventory, stock management, e-commerce',
  });
}

export default function ProductsPage() {
  const {
    searchQuery,
    categoryFilter,
    sortBy,
    sortOrder,
    setSearchQuery,
    setCategoryFilter,
    setSortBy,
    setSortOrder,
  } = useAppFilter('products');

  const { data, isLoading, error, refetch } = useProducts({
    search: searchQuery || undefined,
    categoryId: categoryFilter || undefined,
    sortBy,
    sortOrder,
  });

  const { data: categoriesData } = useCategories();
  const deleteProduct = useDeleteProduct();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(id);
    }
  };

  const columns = useProductColumns(handleDelete, deleteProduct.isPending);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold">Unable to load products</p>
            <p className="text-sm">
              {error.message || 'Please check your connection and try again.'}
            </p>
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select
              value={categoryFilter || ''}
              onValueChange={(value) => setCategoryFilter(value || null)}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categoriesData?.data.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-muted-foreground" />
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as 'name' | 'price' | 'date')
              }
            >
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="date">Sort by Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
          >
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <DataTable columns={columns} data={data?.data || []} />
      </motion.div>
    </motion.div>
  );
}

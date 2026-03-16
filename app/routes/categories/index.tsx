import { Link } from 'react-router';
import { useCategories, useDeleteCategory } from '~/features/categories';
import { useAppFilter } from '~/store/slices/filter-slice';
import { Plus, Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from '~/components/data-table';
import { useCategoryColumns } from '~/lib/table-cols';
import { generateSEOTags } from '~/lib/utils/seo';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Alert, AlertDescription } from '~/components/ui/alert';

export function meta() {
  return generateSEOTags({
    title: 'Categories - Datawise Africa',
    description:
      'Browse and manage product categories. Search, filter, and organize your category hierarchy with advanced sorting and filtering options.',
    url: '/categories',
    keywords:
      'categories, product categories, category management, organization',
  });
}

export default function CategoriesPage() {
  const { searchQuery, setSearchQuery } = useAppFilter('categories');
  const { data, isLoading, error, refetch } = useCategories({
    search: searchQuery || undefined,
  });
  const deleteCategory = useDeleteCategory();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(id);
    }
  };

  const columns = useCategoryColumns(handleDelete, deleteCategory.isPending);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold">Unable to load categories</p>
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
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button asChild>
          <Link to="/categories/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
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

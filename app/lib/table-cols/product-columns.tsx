import { Link } from 'react-router';
import { Eye, Edit, Trash2, DollarSign } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Product } from '~/lib/schema';

export const productColumns = (
  onDelete: (id: string) => void,
  isDeleting: boolean
): ColumnDef<Product>[] => [
  {
    accessorKey: 'name',
    header: 'Product Name',
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => (
      <div className="text-gray-600 font-mono text-sm">{row.original.sku}</div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-gray-900 font-semibold">
        <DollarSign className="w-4 h-4 text-blue-600" />
        {row.original.price.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: 'categoryName',
    header: 'Category',
    cell: ({ row }) => (
      <div className="text-gray-600">
        {row.original.categoryName ? (
          <Link
            to={`/categories/${row.original.categoryId}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.categoryName}
          </Link>
        ) : (
          '-'
        )}
      </div>
    ),
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-gray-900">{row.original.stock}</span>
        {row.original.stock === 0 && (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
            Out of Stock
          </span>
        )}
        {row.original.stock > 0 && row.original.stock < 10 && (
          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
            Low Stock
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link
          to={`/products/${row.original.id}`}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View
        </Link>
        <Link
          to={`/products/${row.original.id}/edit`}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
        <button
          onClick={() => onDelete(row.original.id)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    ),
  },
];

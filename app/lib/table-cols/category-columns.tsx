import { Link } from 'react-router';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Category } from '~/lib/schema';

export const categoryColumns = (
  onDelete: (id: string) => void,
  isDeleting: boolean
): ColumnDef<Category>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => <div className="text-gray-600">{row.original.slug}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="text-gray-600 max-w-md truncate">
        {row.original.description || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <div className="text-gray-600 text-sm">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link
          to={`/categories/${row.original.id}`}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View
        </Link>
        <Link
          to={`/categories/${row.original.id}/edit`}
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

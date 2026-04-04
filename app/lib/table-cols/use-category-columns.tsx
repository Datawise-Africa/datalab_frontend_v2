import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Category } from '~/lib/schema';
import { categoryColumns } from './category-columns';

export const useCategoryColumns = (
  onDelete: (id: string) => void,
  isDeleting: boolean
): ColumnDef<Category>[] => {
  return useMemo(
    () => categoryColumns(onDelete, isDeleting),
    [onDelete, isDeleting]
  );
};

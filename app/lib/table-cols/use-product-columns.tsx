import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Product } from '~/lib/schema';
import { productColumns } from './product-columns';

export const useProductColumns = (
  onDelete: (id: string) => void,
  isDeleting: boolean
): ColumnDef<Product>[] => {
  return useMemo(
    () => productColumns(onDelete, isDeleting),
    [onDelete, isDeleting]
  );
};

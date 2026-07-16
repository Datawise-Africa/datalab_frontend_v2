import type { ReactNode } from 'react';
import { Card } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import type { NormalizedDataset } from '~/lib/utils/dataset-adapter';
import { DatasetCardContext } from './use-dataset-card';

interface DatasetCardRootProps {
  dataset: NormalizedDataset;
  children: ReactNode;
  className?: string;
}

export function DatasetCardRoot({
  dataset,
  children,
  className,
}: Readonly<DatasetCardRootProps>) {
  return (
    <DatasetCardContext.Provider value={{ dataset }}>
      <Card
        className={cn(
          'group relative flex h-full flex-col gap-0 overflow-hidden py-0 transition-all duration-200 hover:shadow-lg hover:border-primary/40',
          className
        )}
      >
        {children}
      </Card>
    </DatasetCardContext.Provider>
  );
}

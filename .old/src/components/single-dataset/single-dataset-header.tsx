import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DatasetActionsMenu } from '@/components/dataset-action-menu';
import { getIntendedAudienceIcon } from '@/lib/get-intended-audience-icon';
import { Eye, Database, Download } from 'lucide-react';
import moment from 'moment';
import type { IDataset } from '@/lib/types/data-set';

interface SingleDatasetHeaderProps {
  dataset: IDataset;
}

export function SingleDatasetHeader({ dataset }: SingleDatasetHeaderProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <Badge
          variant="secondary"
          className="bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
        >
          {dataset.price ? `$${dataset.price}` : 'Free'}
        </Badge>
        <DatasetActionsMenu dataset={dataset} />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="mb-4 text-4xl leading-tight font-bold text-gray-900">
            {dataset.title}
          </h1>
          <p className="text-xl leading-relaxed text-gray-600">
            {dataset.description}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Available to:</h3>
          <div className="flex flex-wrap gap-3">
            {getIntendedAudienceIcon(dataset.intended_audience)}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-wrap items-center gap-8 text-gray-600">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-blue-500" />
            <span className="font-medium">
              Updated {moment(dataset.updated_at).format('MMM DD, YYYY')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-purple-500" />
            <span className="font-medium">{dataset.dataset_size}</span>
          </div>
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-green-500" />
            <span className="font-medium">
              {dataset.download_count} downloads
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

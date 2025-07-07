import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDatasetViewTracker } from '@/hooks/use-dataset-view-tracker';
import useDatasets from '@/hooks/use-datasets';
import { SingleDatasetFileView } from '@/components/single-dataset/single-dataset-files-view';
import { SingleDatasetStats } from '@/components/single-dataset/single-dataset-stats';
import { SingleDatasetHeader } from '@/components/single-dataset/single-dataset-header';
import { SingleDatasetAuthors } from '@/components/single-dataset/single-dataset-authors';
import { SingleDatasetRating } from '@/components/single-dataset/single-dataset-rating';
import useDownloadDataModal from '@/store/use-download-data-modal';
import { useDatasetStore } from '@/store/dataset-store';
import DownloadDataModal from '@/components/data-catalog/DownloadDataModal';

export default function SingleDatasetPage() {
  const { id } = useParams<{ id: string }>();
  const { singleDataset, isSingleDatasetLoading } = useDatasets(id);
  const { isTracking } = useDatasetViewTracker(id!);
  const { downloadDataset } = useDatasetStore();
  const downloadDataModal = useDownloadDataModal();
  const handleRatingSubmit = async (rating: number, comment?: string) => {
    // Implement your rating submission logic here
    console.log('Submitting rating:', { datasetId: id, rating, comment });

    // Example API call:
    // await submitDatasetRating(id!, rating, comment);

    // For now, just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  if (!id || isSingleDatasetLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl p-6">
          <div className="animate-pulse space-y-8">
            <div className="h-64 rounded-xl bg-gray-200"></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-48 rounded-lg bg-gray-200"></div>
              <div className="h-48 rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!singleDataset) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Dataset not found
          </h2>
          <p className="text-gray-600">
            The requested dataset could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-8 p-6">
        {/* Tracking Indicator */}
        {isTracking && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
              📊 Tracking your engagement with this dataset...
            </div>
          </div>
        )}

        {/* Header Section */}
        <SingleDatasetHeader dataset={singleDataset} />

        {/* Stats Section */}
        <SingleDatasetStats
          viewsCount={singleDataset.views_count}
          downloadCount={singleDataset.download_count}
          reviewCount={singleDataset.review_count}
          averageRating={singleDataset.average_review}
        />

        {/* File Information */}
        <SingleDatasetFileView
          dataFiles={singleDataset.data_files}
          metadataFiles={singleDataset.metadata_files}
          datasheetFiles={singleDataset.datasheet_files}
        />

        {/* Sample Data Preview */}

        {/* Dataset Overview */}
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle>Dataset Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Covered Regions
                </h3>
                {singleDataset.covered_regions ? (
                  <div className="flex flex-wrap gap-2">
                    {singleDataset.covered_regions
                      .split(',')
                      .map((region, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          {region.trim()}
                        </Badge>
                      ))}
                  </div>
                ) : (
                  <span className="text-gray-500">No regions specified</span>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                {singleDataset.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {singleDataset.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-blue-200 text-blue-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">No tags available</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Data Collection Methodology
                </h3>
                <p className="leading-relaxed text-gray-600">
                  Data collected through a combination of satellite imagery,
                  ground surveys, and government agricultural census reports.
                  All data points validated by local agricultural extension
                  officers.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Usage License
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {singleDataset.license?.description ||
                    'Creative Commons Attribution 4.0 International (CC BY 4.0). Free to use with attribution for academic and commercial purposes.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author Information */}
        <SingleDatasetAuthors authors={singleDataset.authors} />

        {/* Rating Section */}
        <SingleDatasetRating
          datasetId={id}
          reviewCount={singleDataset.review_count}
          averageRating={singleDataset.average_review}
          onRatingSubmit={handleRatingSubmit}
        />
        {downloadDataset && downloadDataModal.isOpen && (
          <DownloadDataModal
            dataset={downloadDataset}
            // isOpen={downloadDataModal.isOpen}
            // close={downloadDataModal.close}
          />
        )}
      </div>
    </div>
  );
}

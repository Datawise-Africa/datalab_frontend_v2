import { DatasetActionsMenu } from '@/components/dataset-action-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDatasetViewTracker } from '@/hooks/use-dataset-view-tracker';
import useDatasets from '@/hooks/use-datasets';
import {
  Star,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  FileText,
  Database,
  Map,
  User,
  Building,
  Mail,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function SingleDatasetPage() {
  const { id } = useParams<{ id: string }>(); // Extract datasetId from URL parameters
  const { singleDataset } =
    useDatasets(id); // Fetch dataset details using the datasetId
  const { isTracking } = useDatasetViewTracker(id!);
  console.log({ singleDataset });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-8 p-6">
        {/* Header Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800 hover:bg-orange-100"
            >
              $25
            </Badge>
            <DatasetActionsMenu
              datasetId={id!}
              datasetTitle="East African Agricultural Yields (2015-2023)"
            />
          </div>

          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            East African Agricultural Yields (2015-2023)
          </h1>

          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Dr. Sarah Kimani</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.2</span>
              <span className="text-gray-500">(16 reviews)</span>
            </div>
          </div>

          <p className="mb-6 text-lg text-gray-600">
            Comprehensive dataset covering crop yields, farming practices, and
            climate data across Kenya, Tanzania, and Uganda's major agricultural
            regions.
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            <Badge variant="outline">Agriculture</Badge>
            <Badge variant="outline">Climate</Badge>
            <Badge variant="outline">Economic Data</Badge>
          </div>

          <div className="space-y-3">
            <p className="font-medium text-gray-900">Available to:</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-green-100">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm">Non-Profit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-green-100">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm">Company</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-green-100">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm">Student</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-green-100">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                </div>
                <span className="text-sm">Public</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Updated: 2023-12-15</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>CSV, Shapefile, XLSX, PDF (3.1 GB)</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>1.2k downloads</span>
            </div>
          </div>
        </div>

        {isTracking && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            📊 Tracking your engagement with this dataset...
          </div>
        )}

        {/* File Information */}
        <Card>
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">CSV (211 MB)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Map className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">Shapefile (423 MB)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">XLSX (230 MB)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <FileText className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-medium">PDF (336 MB)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Dataset Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Covered Regions</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-600"></div>
                    <span>Kisumu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-600"></div>
                    <span>Arusha</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-600"></div>
                    <span>Mbarara</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold">Key Crops</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-600"></div>
                    <span>Maize</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-600"></div>
                    <span>Coffee</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-600"></div>
                    <span>Tea</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium">Region</th>
                    <th className="p-4 text-left font-medium">Crop</th>
                    <th className="p-4 text-left font-medium">
                      Yield (tons/ha)
                    </th>
                    <th className="p-4 text-left font-medium">
                      Annual Rainfall (mm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Kisumu</td>
                    <td className="p-4">Maize</td>
                    <td className="p-4">3.2</td>
                    <td className="p-4">1200</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Arusha</td>
                    <td className="p-4">Coffee</td>
                    <td className="p-4">0.8</td>
                    <td className="p-4">890</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Mbarara</td>
                    <td className="p-4">Tea</td>
                    <td className="p-4">2.5</td>
                    <td className="p-4">1450</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Data Collection Methodology
                </h3>
                <p className="leading-relaxed text-gray-600">
                  Data collected through a combination of satellite imagery,
                  ground surveys, and government agricultural census reports.
                  All data points validated by local agricultural extension
                  officers.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold">Usage License</h3>
                <p className="leading-relaxed text-gray-600">
                  Creative Commons Attribution 4.0 International (CC BY 4.0).
                  Free to use with attribution for academic and commercial
                  purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author Information */}
        <Card>
          <CardHeader>
            <CardTitle>Author Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-900 underline">
                  Dr. Sarah Kimani
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">University of Nairobi</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600 underline">
                  s.kimani@uonbi.ac.ke
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Dataset Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">Views</p>
                <p className="text-3xl font-bold">3.2K</p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+324%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  +500 in the last 30 days
                </p>
              </div>
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">Downloads</p>
                <p className="text-3xl font-bold">4</p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">-42%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  +1 in the last 30 days
                </p>
              </div>
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold">4.3</p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+0.2%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">out of 5.0</p>
              </div>
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">Total Comments</p>
                <p className="text-3xl font-bold">4</p>
                <p className="mt-4 text-xs text-gray-500">--</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate this dataset */}
        <Card>
          <CardHeader>
            <CardTitle>Rate this dataset</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Download this dataset to leave a rating
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="p-1">
                  <Star className="h-8 w-8 text-gray-300 transition-colors hover:text-yellow-400" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { DatasetActionsMenu } from '@/components/dataset-action-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDatasetViewTracker } from '@/hooks/use-dataset-view-tracker';
import useDatasets from '@/hooks/use-datasets';
import {
  Building,
  Database,
  Download,
  Eye,
  Mail,
  Star,
  User,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { cn } from '@/lib/utils.tsx';
import React, { useCallback, useEffect, useMemo } from 'react';
import { CsvHandler } from '@/lib/utils/csv-handler.ts';
import type { IDataset } from '@/lib/types/data-set.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { useFileUpload } from '@/hooks/use-file-upload.tsx';

export default function SingleDatasetPage() {
  const { id } = useParams<{ id: string }>(); // Extract datasetId from URL parameters

  const { singleDataset, isSingleDatasetLoading } = useDatasets(id); // Fetch dataset details using the datasetId
  const { isTracking } = useDatasetViewTracker(id!);
  const [csvData, setCsvData] = React.useState<any[]>([]);
  const [currentRating, setCurrentRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  // const handleRating = (rating: number) => {
  //   // Implement your rating logic here
  //   console.log(`Rating dataset ${id} with ${rating} stars`);
  //   setCurrentRating(rating);
  // }
  // const runCount = useRef(0)
  const watchCsvFiles = useCallback(async () => {
    // runCount.current++;
    if (
      !singleDataset ||
      !singleDataset.data_files ||
      singleDataset.data_files.length === 0
    ) {
      console.warn('No dataset or data files available to parse.');
      return;
    }
    const files = singleDataset?.data_files || [];
    const filePromises = files.map((file) => {
      return CsvHandler.parseCsvFromUrl(file.s3_url, {
        fileName: file.file_name,
        header: true,
        skipEmptyLines: true,
        delimiter: ',',
      });
    });
    const [firstData] = await Promise.all(filePromises);
    // console.log('Parsed CSV Files:', allFiles);
    setCsvData(firstData.data || []); // Limit to first 10 rows for preview
  }, [singleDataset?.data_files]);

  const dataPreview = useMemo(() => {
    if (!csvData || csvData.length === 0) {
      return {
        headers: [],
        rows: [],
      };
    }
    const headers = csvData.length > 0 ? Object.keys(csvData[0]) : [];
    return {
      headers: headers.sort((a, b) => b.localeCompare(a)), // Sort headers alphabetically
      rows: csvData.slice(0, 10), // Limit to first 10 rows for preview
    };
  }, [csvData]);

  useEffect(() => {
    watchCsvFiles();
  }, [watchCsvFiles]);
  console.log({ dataPreview });
  // console.log({ singleDataset });
  if (!id || isSingleDatasetLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading dataset...</p>
      </div>
    );
  }

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
            {singleDataset?.title}
          </h1>

          {/*<div className="mb-4 flex items-center gap-4">*/}
          {/*  <div className="flex items-center gap-2">*/}
          {/*    <User className="h-4 w-4 text-gray-500" />*/}
          {/*    <span className="text-gray-600">Dr. Sarah Kimani</span>*/}
          {/*  </div>*/}
          {/*  <div className="flex items-center gap-1">*/}
          {/*    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />*/}
          {/*    <span className="font-medium">4.2</span>*/}
          {/*    <span className="text-gray-500">(16 reviews)</span>*/}
          {/*  </div>*/}
          {/*</div>*/}

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
            {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-2">*/}
            {/*  <div className="flex items-center gap-3 rounded-lg border p-4">*/}
            {/*    <FileText className="h-8 w-8 text-green-600" />*/}
            {/*    <div>*/}
            {/*      <p className="font-medium">CSV (211 MB)</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className="flex items-center gap-3 rounded-lg border p-4">*/}
            {/*    <Map className="h-8 w-8 text-blue-600" />*/}
            {/*    <div>*/}
            {/*      <p className="font-medium">Shapefile (423 MB)</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className="flex items-center gap-3 rounded-lg border p-4">*/}
            {/*    <FileText className="h-8 w-8 text-green-600" />*/}
            {/*    <div>*/}
            {/*      <p className="font-medium">XLSX (230 MB)</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className="flex items-center gap-3 rounded-lg border p-4">*/}
            {/*    <FileText className="h-8 w-8 text-red-600" />*/}
            {/*    <div>*/}
            {/*      <p className="font-medium">PDF (336 MB)</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div>
              <DatasetFileView
                files={singleDataset?.data_files || []}
                title="Data Files"
                variant={'list'}
              />
              <DatasetFileView
                files={singleDataset?.metadata_files || []}
                title="Metadata Files"
              />
              <DatasetFileView
                files={singleDataset?.datasheet_files || []}
                title="Metadata Files"
              />
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
        <div className={'w-full border-gray-200 bg-white'}>
          <div>
            <h2>Sample Data Preview</h2>
          </div>
              {/* Table Container */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 w-full">
                <table className="w-full border border-collapse">
                  {/* Table Header */}
                  <thead className={'bg-primary text-white'}>
                  <tr className=" border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold 0 uppercase tracking-wider w-12 border">
                      #
                    </th>
                    {dataPreview.headers.map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-semibold  uppercase tracking-wider border"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="bg-white divide-y divide-gray-200">
                  {dataPreview.rows.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150 border"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 border border-gray-200">
                        {index + 1}
                      </td>
                      {dataPreview.headers.map((header) => (
                        <td key={header} className="px-6 py-4 whitespace-nowrap border border-gray-200">
                          { (
                            <div className="text-sm text-gray-700">{row[header]}</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  </tbody>
                </table>
            </div>
        </div>

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
        <Card className={'w-full border-gray-200 bg-white'}>
          <CardHeader>
            <CardTitle>Author Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {singleDataset?.authors.map((author) => (
                <div className="border-primary/20 flex flex-col gap-3 rounded border p-2 text-sm italic">
                  <div className={'flex items-center gap-2'}>
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900 underline">
                      {author.title} {author.first_name} {author.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600"> {author.affiliation}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <a
                      href={`mailto:${author.email}`}
                      title={`Send an email to Author: ${author.first_name} ${author.last_name}`}
                      aria-label={`${author.first_name} ${author.last_name}`}
                      type={'mail'}
                      className="text-gray-600 underline"
                    >
                      {author.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dataset Insights */}
        <Card className={'w-full border-gray-200 bg-white'}>
          <CardHeader>
            <CardTitle>Dataset Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">Views</p>
                <p className="text-3xl font-bold">
                  {singleDataset?.views_count || 0}
                </p>
                {/*<div className="mt-1 flex items-center justify-center gap-1">*/}
                {/*  <TrendingUp className="h-3 w-3 text-green-600" />*/}
                {/*  <span className="text-xs text-green-600">+324%</span>*/}
                {/*</div>*/}
                {/*<p className="mt-1 text-xs text-gray-500">*/}
                {/*  +500 in the last 30 days*/}
                {/*</p>*/}
              </div>
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">Downloads</p>
                <p className="text-3xl font-bold">
                  {singleDataset?.download_count || 0}
                </p>
                {/*<div className="mt-1 flex items-center justify-center gap-1">*/}
                {/*  <TrendingDown className="h-3 w-3 text-red-600" />*/}
                {/*  <span className="text-xs text-red-600">-42%</span>*/}
                {/*</div>*/}
                {/*<p className="mt-1 text-xs text-gray-500">*/}
                {/*  +1 in the last 30 days*/}
                {/*</p>*/}
              </div>
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-600">Reviews</p>
                <p className="text-3xl font-bold">
                  {singleDataset?.review_count || 0}
                </p>
                {/*<div className="mt-1 flex items-center justify-center gap-1">*/}
                {/*  <TrendingUp className="h-3 w-3 text-green-600" />*/}
                {/*  <span className="text-xs text-green-600">+0.2%</span>*/}
                {/*</div>*/}
                {/*<p className="mt-1 text-xs text-gray-500">out of 5.0</p>*/}
              </div>
              {/*<div className="text-center">*/}
              {/*  <p className="mb-2 text-sm text-gray-600">Total Comments</p>*/}
              {/*  <p className="text-3xl font-bold">4</p>*/}
              {/*  <p className="mt-4 text-xs text-gray-500">--</p>*/}
              {/*</div>*/}
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
                <button
                  key={star}
                  className="p-1"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setCurrentRating(star)}
                >
                  <Star
                    className={cn(
                      'h-8 w-8 cursor-pointer transition-colors ease-in',
                      {
                        'text-yellow-400':
                          star <= (hoverRating || currentRating),
                        'text-gray-300': star > (hoverRating || currentRating),
                      },
                    )}
                  />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type DatasetFileViewProps = {
  files: IDataset['data_files'];
  title: string;
  variant?: 'list' | 'grid';
  maxFileNameLength?: number;
  showFileSize?: boolean;
  showDownloadButton?: boolean;
  className?: string;
};

function DatasetFileView({
  files = [],
  title,
  variant = 'list',
  maxFileNameLength = 50,
  showFileSize = true,
  showDownloadButton = true,
  className = '',
}: DatasetFileViewProps) {
  const { getFileIcon } = useFileUpload();
  const processedFiles = files.map((file) => {
    const extension = file.file_name.split('.').pop() || '';
    const nameWithoutExtension = file.file_name.slice(
      0,
      -(extension.length + 1),
    );
    const truncatedName =
      nameWithoutExtension.length > maxFileNameLength
        ? `${nameWithoutExtension.slice(0, maxFileNameLength)}…`
        : nameWithoutExtension;

    return {
      ...file,
      displayName: `${truncatedName}.${extension}`,
      fileSizeDisplay: file.file_size_display,
      Icon: getFileIcon(file.content_type),
      extension,
    };
  });

  if (!processedFiles.length) {
    return (
      <div className={`rounded-lg bg-gray-50 p-4 ${className}`}>
        <p className="text-center text-gray-500">
          No {title.toLowerCase()} files available
        </p>
      </div>
    );
  }
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

      {variant === 'list' ? (
        <ul className="space-y-2">
          {processedFiles.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
            >
              <div className="flex min-w-0 items-center">
                <span className="mr-2 flex-shrink-0">
                  {<file.Icon className={''} />}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="min-w-0 truncate text-blue-600 hover:underline">
                      {file.displayName}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{file.file_name}</p>
                    {file.file_size && (
                      <p className="text-xs text-gray-500">
                        {file.fileSizeDisplay}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center space-x-2">
                {showFileSize && (
                  <span className="text-sm whitespace-nowrap text-gray-500">
                    {file.fileSizeDisplay}
                  </span>
                )}
                {showDownloadButton && (
                  <span
                    className="text-gray-400 hover:text-blue-500"
                    aria-label={`Download ${file.file_name}`}
                  >
                    <Download className="h-4 w-4" />
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {processedFiles.map((file) => (
            <div
              key={file.id}
              className="rounded-lg border p-3 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {<file.Icon className={''} />}
                </div>
                <div className="min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate font-medium text-blue-600 hover:underline">
                        {file.displayName}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{file.file_name}</p>
                    </TooltipContent>
                  </Tooltip>
                  {showFileSize && (
                    <p className="mt-1 text-sm text-gray-500">
                      {file.fileSizeDisplay}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

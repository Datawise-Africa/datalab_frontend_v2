import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Download, FileText, Eye } from 'lucide-react';
import { useFileUpload } from '@/hooks/use-file-upload';
import type { IDataset } from '@/lib/types/data-set';

interface SingleDatasetFileViewProps {
  dataFiles: IDataset['data_files'];
  metadataFiles: IDataset['metadata_files'];
  datasheetFiles: IDataset['datasheet_files'];
}

export function SingleDatasetFileView({
  dataFiles,
  metadataFiles,
  datasheetFiles,
}: SingleDatasetFileViewProps) {
  const { getFileIcon } = useFileUpload();

  const fileCategories = [
    {
      title: 'Data Files',
      files: dataFiles,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: FileText,
    },
    {
      title: 'Metadata Files',
      files: metadataFiles,
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: Eye,
    },
    {
      title: 'Datasheet Files',
      files: datasheetFiles,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Download,
    },
  ];

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          File Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TooltipProvider>
          {fileCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <div className="flex items-center gap-3">
                <category.icon className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {category.title}
                </h3>
                <Badge variant="secondary" className={category.color}>
                  {category.files.length} files
                </Badge>
              </div>

              {category.files.length > 0 ? (
                <div className="grid gap-3">
                  {category.files.map((file) => {
                    const FileIcon = getFileIcon(file.content_type);
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-sm"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <FileIcon className="h-8 w-8 flex-shrink-0 text-gray-600" />
                          <div className="min-w-0 flex-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="truncate font-medium text-wrap text-gray-900">
                                  {file.file_name}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{file.file_name}</p>
                              </TooltipContent>
                            </Tooltip>
                            <div className="mt-1 flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                {file.file_size_display}
                              </span>
                              <span className="text-sm text-gray-500">
                                {file.content_type}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div> */}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 py-8 text-center text-gray-500">
                  No {category.title.toLowerCase()} available
                </div>
              )}
            </div>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

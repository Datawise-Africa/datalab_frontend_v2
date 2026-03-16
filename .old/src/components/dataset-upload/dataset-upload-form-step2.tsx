import type { UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useFileUpload, type FileUpload } from '@/hooks/use-file-upload';
import { File, UploadCloudIcon, XIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import type { UploadDatasetSchemaType } from '@/lib/schema/upload-dataset-schema';
import type { IDataset } from '@/lib/types/data-set';
import { MultiSelect } from '../ui/multi-select';

type Step2Props = {
  form: UseFormReturn<UploadDatasetSchemaType>;
  files: Pick<IDataset, 'data_files' | 'metadata_files' | 'datasheet_files'>;
};
export default function DatasetUploadFormStep2({
  form,
  files: uploadedFiles,
}: Step2Props) {
  const formatFile = ({ name, base64 }: FileUpload) => ({
    file_name: name,
    base64: base64!,
  });
  const dFiles = useFileUpload({
    mode: 'multiple',
    acceptedFileTypes: ['zip', 'csv', 'json', 'jpeg', 'jpg', 'txt'],
    maximumFileSize:
      /**100MB */
      100 * 1024 * 1024,
    onFilesUploaded: (files) => {
      form.setValue('step_2.data_files', files.map(formatFile));
    },
  });
  const mDataFiles = useFileUpload({
    mode: 'multiple',
    acceptedFileTypes: ['xls', 'json', 'yml', 'yaml', 'txt'],
    maximumFileSize:
      /**10MB */
      10 * 1024 * 1024,
    onFilesUploaded: (files) => {
      form.setValue('step_2.metadata_files', files.map(formatFile));
    },
  });
  const sheetFiles = useFileUpload({
    mode: 'multiple',
    acceptedFileTypes: ['pdf', 'docx', 'doc', 'txt'],
    maximumFileSize:
      /**20MB */
      20 * 1024 * 1024,
    onFilesUploaded: (files) => {
      form.setValue('step_2.datasheet_files', files.map(formatFile));
    },
  });
  const limitString = (str: string, limit: number = 10) => {
    return str.length > limit ? str.substring(0, limit) + '...' : str;
  };

  const UploadedFileItem = ({
    file,
    removeFile,
  }: {
    file: FileUpload;
    removeFile: (id: string) => void;
  }) => {
    return (
      <li
        key={file.name}
        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex shrink-0 items-center justify-center">
            <File
              className={cn(
                'h-5 w-5 transition-colors',
                file.status === 'uploading'
                  ? 'animate-pulse text-blue-500'
                  : '',
                file.status === 'error' ? 'text-red-500' : '',
                file.status === 'completed'
                  ? 'text-green-500'
                  : 'text-gray-400',
              )}
            />
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="truncate font-medium text-gray-900">
                {limitString(file.name, 30)}
              </span>

              <span className="text-xs text-gray-500">
                ({dFiles.formatFileSize(file.size)})
              </span>

              {file.status === 'completed' && (
                <span className="ml-1 text-xs font-medium text-green-600">
                  ✓ Uploaded
                </span>
              )}
              {file.status === 'error' && (
                <span className="ml-1 text-xs font-medium text-red-600">
                  ✗ Failed
                </span>
              )}
              {file.status === 'uploading' && (
                <span className="ml-1 text-xs font-medium text-blue-600">
                  ↻ Uploading...
                </span>
              )}
            </div>

            <Progress
              value={file.progress}
              className={cn(
                'h-1.5',
                file.status === 'completed' ? 'bg-green-100' : '',
                file.status === 'error' ? 'bg-red-100' : '',
              )}

              // indicatorClassName={cn(
              //     file.status === 'completed' ? 'bg-green-500' : '',
              //     file.status === 'error' ? 'bg-red-500' : 'bg-blue-500',
              // )}
            />
          </div>

          <button
            type="button"
            className="text-sm font-medium text-gray-400 transition-all group-hover:opacity-100 hover:text-red-600"
            onClick={() => removeFile(file.id)}
            aria-label="Remove file"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </li>
    );
  };
  return (
    <div>
      {/* Data files */}
      <div className="mb-4 border-b border-gray-200 pb-4">
        <FormField
          control={form.control}
          name="step_2.data_files"
          render={({ field }) => (
            <FormItem>
              <h2>
                Data Files <span className="text-red-500">*</span>
              </h2>
              <FormLabel
                htmlFor={field.name}
                onDrag={dFiles.handleDragOver}
                onDragLeave={dFiles.handleDragLeave}
                onDrop={dFiles.handleDrop}
                className="border-primary flex h-48 cursor-pointer items-center justify-center rounded-md border-[2.5px] border-dotted bg-gray-200"
              >
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <UploadCloudIcon className="h-12 w-12 rounded-full bg-gray-300 p-1 text-gray-500" />
                  </div>
                  <p>
                    {dFiles.isDragActive ? (
                      <span>Drop files here</span>
                    ) : (
                      <span>
                        <strong>Click to upload</strong> or drag and drop
                      </span>
                    )}
                  </p>
                  <div>
                    {dFiles.acceptedFileTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className="mr-2 mb-2 border border-gray-300 bg-white text-xs text-gray-600"
                      >
                        .{type}
                      </Badge>
                    ))}
                  </div>
                  <p>Maximum file size: {dFiles.MAX_FILE_SIZE}</p>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  hidden
                  id={field.name}
                  name={field.name}
                  accept=".zip,.csv,.json,.jpeg,.jpg,.txt"
                  value={undefined} // Reset value to allow re-uploading same file
                  onChange={(e) => {
                    if (e.target.files) {
                      dFiles.handleFiles(e.target.files);
                    }
                  }}
                />
              </FormControl>
              {/* <FormDescription className="text-xs text-gray-500">
                            Upload your dataset files. Supported formats: zip,
                            csv, json, jpeg, jpg, txt.
                        </FormDescription> */}
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <div className="mb-4">
          {/* Uploaded files */}
          {dFiles.uploads.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1">
              {dFiles.uploads.map((file) => (
                <UploadedFileItem
                  key={file.id}
                  file={file}
                  removeFile={dFiles.removeFile}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No files uploaded yet</p>
          )}
          {uploadedFiles.data_files.length > 0 && (
            <div className="border-primary/30 mt-4 flex flex-col gap-2 rounded border border-dotted p-4">
              <h3 className="text-lg font-semibold text-red-500">
                Uploaded Data Files
              </h3>
              <FormField
                control={form.control}
                name={`step_2.removed_data_files`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select files to remove</FormLabel>
                    <FormControl className="">
                      <MultiSelect
                        {...field}
                        options={uploadedFiles.data_files.map((dataFile) => ({
                          value: dataFile.s3_url,
                          label: `${dataFile.file_name} (${dataFile.file_size_display})`,
                        }))}
                        mode="multiple"
                        value={field.value as unknown as string[]}
                        chipVariant="default"
                        onChange={field.onChange}
                        placeholder="Select files to remove"
                        className="border-primary/30 w-full bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </div>
      {/* Metadata files */}
      <div className="mb-4 border-b border-gray-200 pb-4">
        <FormField
          control={form.control}
          name="step_2.metadata_files"
          render={({ field }) => (
            <FormItem>
              <h2>Metadata Files </h2>
              <FormLabel
                htmlFor={field.name}
                onDrag={mDataFiles.handleDragOver}
                onDragLeave={mDataFiles.handleDragLeave}
                onDrop={mDataFiles.handleDrop}
                className="border-primary flex h-48 cursor-pointer items-center justify-center rounded-md border-[2.5px] border-dotted bg-gray-200"
              >
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <UploadCloudIcon className="h-12 w-12 rounded-full bg-gray-300 p-1 text-gray-500" />
                  </div>
                  <p>
                    {mDataFiles.isDragActive ? (
                      <span>Drop files here</span>
                    ) : (
                      <span>
                        <strong>Click to upload</strong> or drag and drop
                      </span>
                    )}
                  </p>
                  <div>
                    {mDataFiles.acceptedFileTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className="mr-2 mb-2 border border-gray-300 bg-white text-xs text-gray-600"
                      >
                        .{type}
                      </Badge>
                    ))}
                  </div>
                  <p>Maximum file size: {mDataFiles.MAX_FILE_SIZE}</p>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  hidden
                  id={field.name}
                  name={field.name}
                  accept={mDataFiles.htmlAllowedMimes}
                  value={undefined} // Reset value to allow re-uploading same file
                  onChange={(e) => {
                    if (e.target.files) {
                      mDataFiles.handleFiles(e.target.files);
                    }
                  }}
                />
              </FormControl>
              {/* <FormDescription className="text-xs text-gray-500">
                            Upload your dataset files. Supported formats: zip,
                            csv, json, jpeg, jpg, txt.
                        </FormDescription> */}
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <div className="mb-4">
          {/* Uploaded files */}
          {mDataFiles.uploads.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1">
              {mDataFiles.uploads.map((file) => (
                <UploadedFileItem
                  key={file.id}
                  file={file}
                  removeFile={mDataFiles.removeFile}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No files uploaded yet</p>
          )}
          {uploadedFiles.metadata_files.length > 0 && (
            <div className="border-primary/30 mt-4 flex flex-col gap-2 rounded border border-dotted p-4">
              <h3 className="text-lg font-semibold text-red-500">
                Uploaded metadata files
              </h3>
              <FormField
                control={form.control}
                name={`step_2.removed_metadata_files`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select files to remove</FormLabel>
                    <FormControl className="">
                      <MultiSelect
                        {...field}
                        options={uploadedFiles.metadata_files.map(
                          (dataFile) => ({
                            value: dataFile.s3_url,
                            label: `${dataFile.file_name} (${dataFile.file_size_display})`,
                          }),
                        )}
                        mode="multiple"
                        value={field.value as unknown as string[]}
                        chipVariant="default"
                        onChange={field.onChange}
                        placeholder="Select files to remove"
                        className="border-primary/30 w-full bg-white"
                      />
                    </FormControl>

                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </div>
      {/* Datasheet files */}
      <div className="mb-4 border-b border-gray-200 pb-4">
        <FormField
          control={form.control}
          name="step_2.datasheet_files"
          render={({ field }) => (
            <FormItem>
              <h2>Datasheet Files </h2>
              <FormLabel
                htmlFor={field.name}
                onDrag={sheetFiles.handleDragOver}
                onDragLeave={sheetFiles.handleDragLeave}
                onDrop={sheetFiles.handleDrop}
                className="border-primary flex h-48 cursor-pointer items-center justify-center rounded-md border-[2.5px] border-dotted bg-gray-200"
              >
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <UploadCloudIcon className="h-12 w-12 rounded-full bg-gray-300 p-1 text-gray-500" />
                  </div>
                  <p>
                    {sheetFiles.isDragActive ? (
                      <span>Drop files here</span>
                    ) : (
                      <span>
                        <strong>Click to upload</strong> or drag and drop
                      </span>
                    )}
                  </p>
                  <div>
                    {sheetFiles.acceptedFileTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className="mr-2 mb-2 border border-gray-300 bg-white text-xs text-gray-600"
                      >
                        .{type}
                      </Badge>
                    ))}
                  </div>
                  <p>Maximum file size: {sheetFiles.MAX_FILE_SIZE}</p>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  hidden
                  id={field.name}
                  name={field.name}
                  accept={sheetFiles.htmlAllowedMimes}
                  value={undefined} // Reset value to allow re-uploading same file
                  onChange={(e) => {
                    if (e.target.files) {
                      sheetFiles.handleFiles(e.target.files);
                    }
                  }}
                />
              </FormControl>
              {/* <FormDescription className="text-xs text-gray-500">
                            Upload your dataset files. Supported formats: zip,
                            csv, json, jpeg, jpg, txt.
                        </FormDescription> */}
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <div className="mb-4">
          {/* Uploaded files */}
          {sheetFiles.uploads.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1">
              {sheetFiles.uploads.map((file) => (
                <UploadedFileItem
                  key={file.id}
                  file={file}
                  removeFile={sheetFiles.removeFile}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No files uploaded yet</p>
          )}
          {uploadedFiles.datasheet_files.length > 0 && (
            <div className="border-primary/30 mt-4 flex flex-col gap-2 rounded border border-dotted p-4">
              <h3 className="text-lg font-semibold text-red-500">
                Uploaded Datasheet Files
              </h3>
              <FormField
                control={form.control}
                name={`step_2.removed_datasheet_files`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select files to remove</FormLabel>
                    <FormControl className="">
                      <MultiSelect
                        {...field}
                        options={uploadedFiles.datasheet_files.map(
                          (dataFile) => ({
                            value: dataFile.s3_url,
                            label: `${dataFile.file_name} (${dataFile.file_size_display})`,
                          }),
                        )}
                        mode="multiple"
                        value={field.value as unknown as string[]}
                        chipVariant="default"
                        onChange={field.onChange}
                        placeholder="Select files to remove"
                        className="border-primary/30 w-full bg-white"
                      />
                    </FormControl>

                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

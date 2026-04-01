import type {
  DatasetType,
  AccessType,
} from '~/lib/schema/upload-dataset-schema';

// Re-export form schema and type from the canonical schema location
export {
  uploadFormSchema,
  type UploadFormValues,
} from '~/lib/schema/upload-dataset-schema';

export const DATASET_TYPES: { value: DatasetType; label: string }[] = [
  { value: 'tabular', label: 'Tabular' },
  { value: 'image', label: 'Image' },
  { value: 'text', label: 'Text' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'geospatial', label: 'Geospatial' },
  { value: 'time_series', label: 'Time Series' },
  { value: 'other', label: 'Other' },
];

export const ACCESS_TYPES: { value: AccessType; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'restricted', label: 'Restricted' },
];

/**
 * Data-source integrations for the studio's Settings → Integrations tab.
 *
 * Adding a connector = one entry here + its zod schema in
 * `lib/schema/dashboard-studio-schema.ts` + a label in
 * `lib/constants/dashboard-studio.ts`. The connect form renders `Fields`,
 * validates with the shared discriminated union, and posts `toPayload()`.
 */
import type { ComponentType } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Database,
  FileSpreadsheet,
  Globe2,
  type LucideIcon,
} from 'lucide-react';
import {
  FormFileField,
  FormPickerField,
  FormTextField,
} from '~/components/form-fields';
import { useDashboardDatasetOptions } from '~/features/dashboard-studio';
import {
  dataSourceFileAccept,
  dataSourceKindOptions,
} from '~/lib/constants/dashboard-studio';
import type {
  ConnectSourceFormValues,
  DataSourceKind,
} from '~/lib/schema/dashboard-studio-schema';

type Values<K extends DataSourceKind> = Extract<
  ConnectSourceFormValues,
  { kind: K }
>;

export type Integration<K extends DataSourceKind = DataSourceKind> = {
  kind: K;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Fresh values when the user switches to this connector. */
  defaults: (name: string) => Values<K>;
  /** Connector-specific fields, rendered inside the shared RHF form. */
  Fields: ComponentType<{ workspaceId?: string }>;
  toPayload: (values: Values<K>) => FormData | Record<string, unknown>;
};

function FileFields() {
  const { control } = useFormContext<Values<'file_upload'>>();
  return (
    <FormFileField
      control={control}
      name="file"
      label="File"
      accept={dataSourceFileAccept}
      hint="CSV, TSV, Excel, JSON or Parquet"
      required
    />
  );
}

function DatalabFields({ workspaceId }: Readonly<{ workspaceId?: string }>) {
  const { control } = useFormContext<Values<'datalab_dataset'>>();
  const {
    data: options = [],
    isLoading,
    isError,
  } = useDashboardDatasetOptions(workspaceId);
  const scopedGroup = workspaceId ? 'Current workspace' : 'My datasets';
  return (
    <>
      <FormPickerField
        control={control}
        name="dataset"
        label="Dataset"
        placeholder="Choose a dataset"
        loading={isLoading}
        loadingText="Loading datasets…"
        emptyMessage="No eligible datasets. Publish and approve one, or create one here."
        options={options.map((item) => ({
          value: item.id,
          label: item.name,
          group:
            item.scope === 'public' ? 'Approved public datasets' : scopedGroup,
        }))}
        required
      />
      {isError && (
        <p className="text-xs text-destructive">
          Dataset options could not be loaded. Paste a dataset ID below instead.
        </p>
      )}
      <FormTextField
        control={control}
        name="dataset"
        label="…or paste a dataset ID"
        placeholder="Dataset ID, not its slug or URL"
      />
    </>
  );
}

function ApiFields() {
  const { control } = useFormContext<Values<'public_api'>>();
  return (
    <>
      <FormTextField
        control={control}
        name="api_url"
        label="Public HTTPS JSON URL"
        placeholder="https://api.example.org/data"
        type="url"
        required
      />
      <FormTextField
        control={control}
        name="records_path"
        label="Records path"
        placeholder="results.items"
      />
    </>
  );
}

const meta = (kind: DataSourceKind) => {
  const option = dataSourceKindOptions.find((item) => item.value === kind)!;
  return { label: option.label, description: option.description };
};

const fileUpload: Integration<'file_upload'> = {
  kind: 'file_upload',
  ...meta('file_upload'),
  icon: FileSpreadsheet,
  defaults: (name) => ({
    kind: 'file_upload',
    name,
    file: undefined as unknown as File,
  }),
  Fields: FileFields,
  toPayload: ({ kind, name, file }) => {
    const form = new FormData();
    form.append('name', name);
    form.append('kind', kind);
    form.append('file', file);
    return form;
  },
};

const datalabDataset: Integration<'datalab_dataset'> = {
  kind: 'datalab_dataset',
  ...meta('datalab_dataset'),
  icon: Database,
  defaults: (name) => ({ kind: 'datalab_dataset', name, dataset: '' }),
  Fields: DatalabFields,
  toPayload: ({ kind, name, dataset }) => ({
    kind,
    name,
    dataset,
    config: {},
  }),
};

const publicApi: Integration<'public_api'> = {
  kind: 'public_api',
  ...meta('public_api'),
  icon: Globe2,
  defaults: (name) => ({
    kind: 'public_api',
    name,
    api_url: '',
    records_path: '',
  }),
  Fields: ApiFields,
  toPayload: ({ kind, name, api_url, records_path }) => ({
    kind,
    name,
    api_url,
    config: { records_path },
  }),
};

export const integrations = [fileUpload, datalabDataset, publicApi] as const;

export function getIntegration(kind: DataSourceKind) {
  return integrations.find((item) => item.kind === kind) as Integration;
}

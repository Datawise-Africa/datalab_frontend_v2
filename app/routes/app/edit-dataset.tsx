import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { Route } from './+types/edit-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import {
  MultiStepForm,
  type StepConfig,
  type StepValidationResult,
} from '~/components/ui/multi-step-form';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';
import { Switch } from '~/components/ui/switch';
import { Separator } from '~/components/ui/separator';
import { AsyncSelect } from '~/components/ui/async-select';
import { DropZone } from '~/components/ui/drop-zone';
import {
  Check as CheckIcon,
  FileText,
  X,
  Plus,
  Info,
  Upload,
  UserPlus,
  Globe,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import {
  useDatasetCategories,
  useLicenses,
  useAuthors,
} from '~/features/metadata';
import { useUpdateDataset } from '~/features/dataset-creator';
import { useDataset } from '~/features/datasets';
import { cn } from '~/lib/utils';
import {
  datasetBasicInfoSchema,
  datasetDiscoverySchema,
  datasetTermsSchema,
  type DatasetBasicInfoInput,
  type DatasetFileInput,
  type DatasetAttributionInput,
  type DatasetDiscoveryInput,
  type DatasetTermsInput,
  type NewAuthorInput,
  type UploadDatasetPayload,
} from '~/lib/schema/upload-dataset-schema';
import { Link } from 'react-router';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Edit Dataset',
    description: 'Edit an existing dataset on Datalab Africa',
  });
}

function zodValidate(
  schema: {
    safeParse: (data: unknown) => {
      success: boolean;
      error?: { issues: { path: PropertyKey[]; message: string }[] };
    };
  },
  data: unknown
): StepValidationResult {
  const result = schema.safeParse(data);
  if (result.success) return { valid: true };
  const errors: Record<string, string> = {};
  for (const issue of result.error!.issues) {
    const key = issue.path.map(String).join('.') || '_form';
    if (!errors[key]) errors[key] = issue.message;
  }
  return { valid: false, errors };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FieldError({
  errors,
  field,
}: {
  errors: Record<string, string>;
  field: string;
}) {
  const msg = errors[field];
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-1">{msg}</p>;
}

const REGIONS = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Global',
];

/** Split a comma-separated string into a trimmed array, filtering empty strings. */
function splitCSV(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function EditDataset() {
  const params = useParams();
  const datasetId = params.id as string;
  const navigate = useNavigate();

  const { data: dataset, isLoading: isLoadingDataset } = useDataset(datasetId);

  // Step 1
  const [basicInfo, setBasicInfo] = useState<DatasetBasicInfoInput>({
    title: '',
    description: '',
    category: 0,
    is_premium: false,
    price: null,
    is_private: false,
  });

  // Step 2 — existing files from the server (read-only display)
  const [existingDataFiles, setExistingDataFiles] = useState<
    { id: number; file_name: string; file_size: number }[]
  >([]);
  const [existingMetadataFiles, setExistingMetadataFiles] = useState<
    { id: number; file_name: string; file_size: number }[]
  >([]);
  // New files added during edit
  const [newDataFiles, setNewDataFiles] = useState<
    (DatasetFileInput & { size: number })[]
  >([]);
  const [newMetadataFiles, setNewMetadataFiles] = useState<
    (DatasetFileInput & { size: number })[]
  >([]);

  // Step 3
  const [attribution, setAttribution] = useState<DatasetAttributionInput>({
    authors: [],
    new_authors: [],
    doi_citation: '',
    license: null,
  });

  // Step 4
  const [discovery, setDiscovery] = useState<DatasetDiscoveryInput>({
    keywords: [],
    tags: [],
    origin_region: '',
    covered_regions: [],
    audience_data: {
      students: false,
      non_profit: false,
      company: false,
      public: false,
    },
  });

  // Step 5
  const [terms, setTerms] = useState<DatasetTermsInput>({
    data_accuracy: false,
    responsible_use: false,
    privacy_compliance: false,
    rights_ownership: false,
  });

  const [initialized, setInitialized] = useState(false);

  // Pre-fill form when dataset loads
  useEffect(() => {
    if (!dataset || initialized) return;

    setBasicInfo({
      title: dataset.title,
      description: dataset.description,
      category: dataset.category?.id ?? 0,
      is_premium: dataset.is_premium,
      price: dataset.price,
      is_private: dataset.is_private,
    });

    setExistingDataFiles(
      dataset.data_files.map((f) => ({
        id: f.id,
        file_name: f.file_name,
        file_size: f.file_size,
      }))
    );
    setExistingMetadataFiles(
      dataset.metadata_files.map((f) => ({
        id: f.id,
        file_name: f.file_name,
        file_size: f.file_size,
      }))
    );

    setAttribution({
      authors: dataset.authors.map((a) => a.id),
      new_authors: [],
      doi_citation: dataset.doi_citation ?? '',
      license: dataset.license?.id ?? null,
    });

    setDiscovery({
      keywords: splitCSV(dataset.keywords),
      tags: dataset.tags ?? [],
      origin_region: dataset.origin_region?.name ?? '',
      covered_regions: splitCSV(dataset.covered_regions),
      audience_data: {
        students: dataset.intended_audience?.students ?? false,
        non_profit: dataset.intended_audience?.non_profit ?? false,
        company: dataset.intended_audience?.company ?? false,
        public: dataset.intended_audience?.public ?? false,
      },
    });

    setTerms({
      data_accuracy: dataset.accepted_terms?.data_accuracy ?? false,
      responsible_use: dataset.accepted_terms?.responsible_use ?? false,
      privacy_compliance: dataset.accepted_terms?.privacy_compliance ?? false,
      rights_ownership: dataset.accepted_terms?.rights_ownership ?? false,
    });

    setInitialized(true);
  }, [dataset, initialized]);

  // Metadata queries
  const { data: categories } = useDatasetCategories();
  const { data: licenses } = useLicenses();
  const { data: existingAuthors } = useAuthors();
  const updateDataset = useUpdateDataset();

  const processFiles = useCallback(
    async (files: FileList, setter: typeof setNewDataFiles) => {
      const results: (DatasetFileInput & { size: number })[] = [];
      for (const file of Array.from(files)) {
        const base64 = await fileToBase64(file);
        results.push({ file_name: file.name, base64, size: file.size });
      }
      setter((prev) => [...prev, ...results]);
    },
    []
  );

  const handleSubmit = () => {
    const payload: UploadDatasetPayload = {
      step_1: basicInfo,
      step_2: {
        data_files: newDataFiles.map(({ file_name, base64 }) => ({
          file_name,
          base64,
        })),
        metadata_files: newMetadataFiles.map(({ file_name, base64 }) => ({
          file_name,
          base64,
        })),
        datasheet_files: [],
      },
      step_3: attribution,
      step_4: discovery,
      step_5: { accepted_terms: terms },
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    updateDataset.mutate(
      { id: datasetId, input: formData },
      {
        onSuccess: () => {
          navigate('/app/creator-dashboard');
        },
      }
    );
  };

  const steps: StepConfig[] = [
    {
      key: 'basic',
      label: 'Basic Info',
      icon: Info,
      validate: () => zodValidate(datasetBasicInfoSchema, basicInfo),
    },
    {
      key: 'files',
      label: 'Files',
      icon: Upload,
      validate: () => {
        // For edit: valid if existing files remain OR new files are added
        const hasFiles =
          existingDataFiles.length > 0 || newDataFiles.length > 0;
        if (!hasFiles)
          return {
            valid: false,
            errors: { data_files: 'At least one data file is required' },
          };
        return { valid: true };
      },
    },
    {
      key: 'attribution',
      label: 'Attribution',
      icon: UserPlus,
    },
    {
      key: 'discovery',
      label: 'Discovery',
      icon: Globe,
      validate: () => zodValidate(datasetDiscoverySchema, discovery),
    },
    {
      key: 'terms',
      label: 'Terms',
      icon: ShieldCheck,
      validate: () => zodValidate(datasetTermsSchema, terms),
    },
  ];

  if (isLoadingDataset) {
    return (
      <Protect roles={['dataset_creator', 'admin']}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading dataset...</span>
        </div>
      </Protect>
    );
  }

  if (!dataset) {
    return (
      <Protect roles={['dataset_creator', 'admin']}>
        <div className="py-20 text-center">
          <p className="text-lg font-semibold">Dataset not found</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/app/creator-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </Protect>
    );
  }

  return (
    <Protect roles={['dataset_creator', 'admin']}>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/creator-dashboard">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Dataset</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6 ml-[72px]">
          Update &ldquo;{dataset.title}&rdquo;
        </p>

        <MultiStepForm
          steps={steps}
          onSubmit={handleSubmit}
          isSubmitting={updateDataset.isPending}
          submitLabel="Save Changes"
          error={
            updateDataset.isError
              ? 'Failed to update dataset. Please try again.'
              : undefined
          }
        >
          {(step, _index, errors) => {
            switch (step.key) {
              case 'basic':
                return (
                  <Step1BasicInfo
                    data={basicInfo}
                    onChange={setBasicInfo}
                    categories={categories}
                    errors={errors}
                  />
                );
              case 'files':
                return (
                  <Step2Files
                    existingDataFiles={existingDataFiles}
                    existingMetadataFiles={existingMetadataFiles}
                    newDataFiles={newDataFiles}
                    newMetadataFiles={newMetadataFiles}
                    onNewDataFiles={(files) =>
                      processFiles(files, setNewDataFiles)
                    }
                    onNewMetadataFiles={(files) =>
                      processFiles(files, setNewMetadataFiles)
                    }
                    onRemoveExistingDataFile={(i) =>
                      setExistingDataFiles((p) =>
                        p.filter((_, idx) => idx !== i)
                      )
                    }
                    onRemoveExistingMetadataFile={(i) =>
                      setExistingMetadataFiles((p) =>
                        p.filter((_, idx) => idx !== i)
                      )
                    }
                    onRemoveNewDataFile={(i) =>
                      setNewDataFiles((p) => p.filter((_, idx) => idx !== i))
                    }
                    onRemoveNewMetadataFile={(i) =>
                      setNewMetadataFiles((p) =>
                        p.filter((_, idx) => idx !== i)
                      )
                    }
                    errors={errors}
                  />
                );
              case 'attribution':
                return (
                  <Step3Attribution
                    data={attribution}
                    onChange={setAttribution}
                    licenses={licenses}
                    existingAuthors={existingAuthors}
                  />
                );
              case 'discovery':
                return (
                  <Step4Discovery
                    data={discovery}
                    onChange={setDiscovery}
                    errors={errors}
                  />
                );
              case 'terms':
                return (
                  <Step5Terms
                    data={terms}
                    onChange={setTerms}
                    basicInfo={basicInfo}
                    existingDataFileCount={existingDataFiles.length}
                    newDataFileCount={newDataFiles.length}
                    discovery={discovery}
                    errors={errors}
                  />
                );
              default:
                return null;
            }
          }}
        </MultiStepForm>
      </div>
    </Protect>
  );
}

// ── Step Components ──

function Step1BasicInfo({
  data,
  onChange,
  categories,
  errors = {},
}: {
  data: DatasetBasicInfoInput;
  onChange: (d: DatasetBasicInfoInput) => void;
  categories?: { id: number; title: string }[];
  errors?: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Basic Information</h2>

      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Enter a descriptive title"
          className={errors.title ? 'border-destructive' : ''}
        />
        <FieldError errors={errors} field="title" />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Describe your dataset..."
          rows={4}
          className={errors.description ? 'border-destructive' : ''}
        />
        <FieldError errors={errors} field="description" />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <AsyncSelect
          value={data.category ? String(data.category) : null}
          onChange={(val) => onChange({ ...data, category: Number(val) || 0 })}
          options={
            categories?.map((c) => ({
              label: c.title,
              value: String(c.id),
            })) ?? []
          }
          placeholder="Select category"
        />
        <FieldError errors={errors} field="category" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label className="font-normal cursor-pointer">Premium dataset</Label>
          <Switch
            checked={data.is_premium}
            onCheckedChange={(v) =>
              onChange({
                ...data,
                is_premium: v,
                price: v ? data.price : null,
              })
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label className="font-normal cursor-pointer">Private</Label>
          <Switch
            checked={data.is_private}
            onCheckedChange={(v) => onChange({ ...data, is_private: v })}
          />
        </div>
      </div>

      {data.is_premium && (
        <div className="space-y-2">
          <Label>Price (USD)</Label>
          <Input
            type="number"
            value={data.price ?? ''}
            onChange={(e) =>
              onChange({ ...data, price: Number(e.target.value) || null })
            }
            placeholder="0.00"
            min={0}
            className={cn('max-w-40', errors.price ? 'border-destructive' : '')}
          />
          <FieldError errors={errors} field="price" />
        </div>
      )}
    </div>
  );
}

function Step2Files({
  existingDataFiles,
  existingMetadataFiles,
  newDataFiles,
  newMetadataFiles,
  onNewDataFiles,
  onNewMetadataFiles,
  onRemoveExistingDataFile,
  onRemoveExistingMetadataFile,
  onRemoveNewDataFile,
  onRemoveNewMetadataFile,
  errors = {},
}: {
  existingDataFiles: { id: number; file_name: string; file_size: number }[];
  existingMetadataFiles: {
    id: number;
    file_name: string;
    file_size: number;
  }[];
  newDataFiles: (DatasetFileInput & { size: number })[];
  newMetadataFiles: (DatasetFileInput & { size: number })[];
  onNewDataFiles: (files: FileList) => void;
  onNewMetadataFiles: (files: FileList) => void;
  onRemoveExistingDataFile: (i: number) => void;
  onRemoveExistingMetadataFile: (i: number) => void;
  onRemoveNewDataFile: (i: number) => void;
  onRemoveNewMetadataFile: (i: number) => void;
  errors?: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Data Files</h2>
        <p className="text-sm text-muted-foreground">
          Existing files are shown below. Add new files or remove existing ones.
        </p>
        <FieldError errors={errors} field="data_files" />
      </div>

      {/* Existing data files */}
      {existingDataFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Existing Files
          </Label>
          {existingDataFiles.map((file, idx) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm truncate">{file.file_name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatFileSize(file.file_size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveExistingDataFile(idx)}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New data files upload */}
      <DropZone
        onFiles={onNewDataFiles}
        accept=".csv,.json,.zip,.txt,.xlsx,.parquet"
        hint="CSV, JSON, ZIP, XLSX, Parquet — max 100 MB per file"
      />
      <FileList files={newDataFiles} onRemove={onRemoveNewDataFile} />

      <Separator />

      <div>
        <h2 className="text-lg font-semibold">Metadata Files (optional)</h2>
        <p className="text-sm text-muted-foreground">
          Documentation, data dictionaries, YAML configs
        </p>
      </div>

      {/* Existing metadata files */}
      {existingMetadataFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Existing Metadata
          </Label>
          {existingMetadataFiles.map((file, idx) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm truncate">{file.file_name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatFileSize(file.file_size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveExistingMetadataFile(idx)}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <DropZone
        onFiles={onNewMetadataFiles}
        accept=".json,.yml,.yaml,.xls,.xlsx,.txt"
        hint="JSON, YAML, Excel, TXT — max 10 MB per file"
      />
      <FileList files={newMetadataFiles} onRemove={onRemoveNewMetadataFile} />
    </div>
  );
}

function FileList({
  files,
  onRemove,
}: {
  files: { file_name: string; size: number }[];
  onRemove: (i: number) => void;
}) {
  if (files.length === 0) return null;
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">New Files</Label>
      {files.map((file, idx) => (
        <div
          key={`${file.file_name}-${idx}`}
          className="flex items-center justify-between rounded-md border px-3 py-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm truncate">{file.file_name}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatFileSize(file.size)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="ml-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function Step3Attribution({
  data,
  onChange,
  licenses,
  existingAuthors,
}: {
  data: DatasetAttributionInput;
  onChange: (d: DatasetAttributionInput) => void;
  licenses?: { id: number; title: string }[];
  existingAuthors?: { id: number; first_name: string; last_name: string }[];
}) {
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState<NewAuthorInput>({
    first_name: '',
    last_name: '',
    email: '',
    affiliation: '',
  });

  const addNewAuthor = () => {
    if (newAuthor.first_name && newAuthor.last_name && newAuthor.email) {
      onChange({
        ...data,
        new_authors: [...data.new_authors, newAuthor],
      });
      setNewAuthor({
        first_name: '',
        last_name: '',
        email: '',
        affiliation: '',
      });
      setShowNewAuthor(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Attribution & Citation</h2>

      <div className="space-y-2">
        <Label>Authors</Label>
        <AsyncSelect
          multiple
          value={data.authors.map(String)}
          onChange={(vals) =>
            onChange({ ...data, authors: (vals ?? []).map(Number) })
          }
          options={
            existingAuthors?.map((a) => ({
              label: `${a.first_name} ${a.last_name}`,
              value: String(a.id),
            })) ?? []
          }
          placeholder="Select existing authors"
        />
      </div>

      {data.new_authors.length > 0 && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">New Authors</Label>
          <div className="flex flex-wrap gap-2">
            {data.new_authors.map((a, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {a.first_name} {a.last_name}
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      new_authors: data.new_authors.filter(
                        (_, idx) => idx !== i
                      ),
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {showNewAuthor ? (
        <Card className="py-0">
          <CardContent className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="First name"
                value={newAuthor.first_name}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, first_name: e.target.value })
                }
              />
              <Input
                placeholder="Last name"
                value={newAuthor.last_name}
                onChange={(e) =>
                  setNewAuthor({ ...newAuthor, last_name: e.target.value })
                }
              />
            </div>
            <Input
              placeholder="Email"
              type="email"
              value={newAuthor.email}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, email: e.target.value })
              }
            />
            <Input
              placeholder="Affiliation"
              value={newAuthor.affiliation}
              onChange={(e) =>
                setNewAuthor({ ...newAuthor, affiliation: e.target.value })
              }
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addNewAuthor}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNewAuthor(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNewAuthor(true)}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add New Author
        </Button>
      )}

      <Separator />

      <div className="space-y-2">
        <Label>License</Label>
        <AsyncSelect
          value={data.license ? String(data.license) : null}
          onChange={(val) =>
            onChange({ ...data, license: val ? Number(val) : null })
          }
          options={
            licenses?.map((l) => ({
              label: l.title,
              value: String(l.id),
            })) ?? []
          }
          placeholder="Select license"
        />
      </div>

      <div className="space-y-2">
        <Label>DOI Citation (optional)</Label>
        <Input
          value={data.doi_citation}
          onChange={(e) => onChange({ ...data, doi_citation: e.target.value })}
          placeholder="e.g. 10.1234/example"
        />
      </div>
    </div>
  );
}

function Step4Discovery({
  data,
  onChange,
  errors = {},
}: {
  data: DatasetDiscoveryInput;
  onChange: (d: DatasetDiscoveryInput) => void;
  errors?: Record<string, string>;
}) {
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const addTag = () => {
    const v = tagInput.trim();
    if (v && !data.tags.includes(v)) {
      onChange({ ...data, tags: [...data.tags, v] });
    }
    setTagInput('');
  };

  const addKeyword = () => {
    const v = keywordInput.trim();
    if (v && !data.keywords.includes(v)) {
      onChange({ ...data, keywords: [...data.keywords, v] });
    }
    setKeywordInput('');
  };

  const toggleRegion = (region: string) => {
    const has = data.covered_regions.includes(region);
    onChange({
      ...data,
      covered_regions: has
        ? data.covered_regions.filter((r) => r !== region)
        : [...data.covered_regions, region],
    });
  };

  const toggleAudience = (key: keyof typeof data.audience_data) => {
    onChange({
      ...data,
      audience_data: {
        ...data.audience_data,
        [key]: !data.audience_data[key],
      },
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Discovery Information</h2>

      <div className="space-y-2">
        <Label>Tags (min 2)</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Type and press Enter"
            className={errors.tags ? 'border-destructive' : ''}
          />
        </div>
        <FieldError errors={errors} field="tags" />
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      tags: data.tags.filter((t) => t !== tag),
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Keywords (min 2)</Label>
        <div className="flex gap-2">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="Type and press Enter"
            className={errors.keywords ? 'border-destructive' : ''}
          />
        </div>
        <FieldError errors={errors} field="keywords" />
        {data.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.keywords.map((kw) => (
              <Badge key={kw} variant="secondary" className="gap-1">
                {kw}
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      keywords: data.keywords.filter((k) => k !== kw),
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Covered Regions</Label>
        <FieldError errors={errors} field="covered_regions" />
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => {
            const isActive = data.covered_regions.includes(region);
            return (
              <button
                key={region}
                type="button"
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-white'
                    : 'border-border hover:bg-muted'
                )}
                onClick={() => toggleRegion(region)}
              >
                {isActive && <CheckIcon className="mr-1 inline h-3 w-3" />}
                {region}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Intended Audience</Label>
        <div className="grid grid-cols-2 gap-2">
          {(
            Object.keys(
              data.audience_data
            ) as (keyof typeof data.audience_data)[]
          ).map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 rounded-md border p-3"
            >
              <Checkbox
                checked={data.audience_data[key]}
                onCheckedChange={() => toggleAudience(key)}
              />
              <span className="text-sm capitalize">
                {key.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step5Terms({
  data,
  onChange,
  basicInfo,
  existingDataFileCount,
  newDataFileCount,
  discovery,
  errors = {},
}: {
  data: DatasetTermsInput;
  onChange: (d: DatasetTermsInput) => void;
  basicInfo: DatasetBasicInfoInput;
  existingDataFileCount: number;
  newDataFileCount: number;
  discovery: DatasetDiscoveryInput;
  errors?: Record<string, string>;
}) {
  const termItems: { key: keyof DatasetTermsInput; label: string }[] = [
    {
      key: 'data_accuracy',
      label:
        'I confirm that the data in this dataset is accurate and has been properly verified.',
    },
    {
      key: 'responsible_use',
      label:
        'I agree that this dataset will be used responsibly and in accordance with ethical guidelines.',
    },
    {
      key: 'privacy_compliance',
      label:
        'I confirm that this dataset complies with relevant privacy laws and all personal data has been appropriately anonymized.',
    },
    {
      key: 'rights_ownership',
      label:
        'I confirm that I own or have the rights to distribute this dataset and its contents.',
    },
  ];

  const totalFiles = existingDataFileCount + newDataFileCount;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Review & Accept Terms</h2>

      <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
        <p>
          <span className="font-medium">Title:</span>{' '}
          {basicInfo.title || '(untitled)'}
        </p>
        <p>
          <span className="font-medium">Files:</span> {totalFiles} data file
          {totalFiles !== 1 ? 's' : ''}
          {newDataFileCount > 0 && (
            <span className="text-muted-foreground">
              {' '}
              ({newDataFileCount} new)
            </span>
          )}
        </p>
        <p>
          <span className="font-medium">Tags:</span>{' '}
          {discovery.tags.join(', ') || '(none)'}
        </p>
        <p>
          <span className="font-medium">Regions:</span>{' '}
          {discovery.covered_regions.join(', ') || '(none)'}
        </p>
      </div>

      <Separator />

      <div className="space-y-3">
        {termItems.map((item) => (
          <div key={item.key}>
            <label
              className={cn(
                'flex items-start gap-3 cursor-pointer rounded-md border p-4',
                errors[item.key] ? 'border-destructive' : ''
              )}
            >
              <Checkbox
                className="mt-0.5"
                checked={data[item.key]}
                onCheckedChange={(v) => onChange({ ...data, [item.key]: !!v })}
              />
              <span className="text-sm leading-relaxed">{item.label}</span>
            </label>
            <FieldError errors={errors} field={item.key} />
          </div>
        ))}
      </div>
    </div>
  );
}

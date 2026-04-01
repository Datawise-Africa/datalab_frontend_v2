import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { Route } from './+types/upload-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import {
  MultiStepForm,
  type StepConfig,
  type StepValidationResult,
} from '~/components/ui/multi-step-form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { Badge } from '~/components/ui/badge';
import { Switch } from '~/components/ui/switch';
import { Separator } from '~/components/ui/separator';
import { AsyncSelect } from '~/components/ui/async-select';
import { Info, UserPlus, Globe, ShieldCheck, X } from 'lucide-react';
import { useDatasetCategories, useLicenses } from '~/features/metadata';
import { useCreateDataset } from '~/features/datasets';
import { useAppSelector } from '~/store';
import {
  createDatasetSchema,
  type CreateDatasetInput,
  type DatasetAuthorInput,
  type DatasetAccessInput,
  type DatasetDatasheetInput,
  type DatasetType,
  type AccessType,
} from '~/lib/schema/upload-dataset-schema';
import type { IDatasetCategory } from '~/lib/types';

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

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Create Dataset',
    description: 'Create a new dataset on Datalab Africa',
  });
}

const DATASET_TYPES: { value: DatasetType; label: string }[] = [
  { value: 'tabular', label: 'Tabular' },
  { value: 'image', label: 'Image' },
  { value: 'text', label: 'Text' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'geospatial', label: 'Geospatial' },
  { value: 'time_series', label: 'Time Series' },
  { value: 'other', label: 'Other' },
];

const ACCESS_TYPES: { value: AccessType; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'restricted', label: 'Restricted' },
];

export default function UploadDataset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get('workspace');
  const user = useAppSelector((s) => s.auth.user);

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    dataset_type: 'tabular' as DatasetType,
    category: 0,
    license: 0,
    is_premium: false,
    is_private: false,
    dataset_image: '',
  });

  // Step 2: Authors & Access
  const [authors, setAuthors] = useState<DatasetAuthorInput[]>(
    user ? [{ user: user.id, role: 'creator' }] : []
  );
  const [access, setAccess] = useState<DatasetAccessInput>({
    access_type: 'public',
    access_instructions: '',
  });

  // Step 3: Tags & Datasheet
  const [tags, setTags] = useState<string[]>([]);
  const [datasheet, setDatasheet] = useState<DatasetDatasheetInput>({
    motivation: '',
    composition: '',
    collection_process: '',
    preprocessing: '',
    uses: '',
    distribution: '',
    maintenance: '',
  });

  const { data: categories } = useDatasetCategories();
  const { data: licenses } = useLicenses();
  const createDataset = useCreateDataset();

  const buildPayload = (): CreateDatasetInput => ({
    ...basicInfo,
    workspace: workspaceId ?? undefined,
    tags,
    authors,
    access,
    datasheet: Object.values(datasheet).some((v) => v.trim())
      ? datasheet
      : undefined,
  });

  const handleSubmit = () => {
    const payload = buildPayload();
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    createDataset.mutate(formData, {
      onSuccess: (result) => {
        navigate(
          workspaceId
            ? `/app/workspaces/${workspaceId}`
            : `/datasets/${result.id}`
        );
      },
    });
  };

  const steps: StepConfig[] = [
    {
      key: 'basic',
      label: 'Basic Info',
      icon: Info,
      validate: () => zodValidate(createDatasetSchema, buildPayload()),
    },
    {
      key: 'authors',
      label: 'Authors & Access',
      icon: UserPlus,
    },
    {
      key: 'discovery',
      label: 'Tags & Docs',
      icon: Globe,
    },
    {
      key: 'review',
      label: 'Review',
      icon: ShieldCheck,
    },
  ];

  return (
    <Protect roles={['dataset_creator', 'admin']}>
      <div>
        <h1 className="text-2xl font-bold mb-1">Create Dataset</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Set up your dataset in {steps.length} steps. You&apos;ll upload files
          after creating a version.
        </p>

        {workspaceId && (
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
            <span className="font-medium text-primary">Workspace upload</span>
            <span className="text-muted-foreground">
              {' '}
              — This dataset will be added to your workspace.
            </span>
          </div>
        )}

        <MultiStepForm
          steps={steps}
          onSubmit={handleSubmit}
          isSubmitting={createDataset.isPending}
          submitLabel="Create Dataset"
          error={
            createDataset.isError
              ? 'Failed to create dataset. Please try again.'
              : undefined
          }
        >
          {(step, _index, errors) => {
            switch (step.key) {
              case 'basic':
                return (
                  <StepBasicInfo
                    data={basicInfo}
                    onChange={setBasicInfo}
                    categories={categories!}
                    licenses={licenses}
                    errors={errors}
                  />
                );
              case 'authors':
                return (
                  <StepAuthorsAccess
                    authors={authors}
                    onAuthorsChange={setAuthors}
                    access={access}
                    onAccessChange={setAccess}
                  />
                );
              case 'discovery':
                return (
                  <StepDiscovery
                    tags={tags}
                    onTagsChange={setTags}
                    datasheet={datasheet}
                    onDatasheetChange={setDatasheet}
                  />
                );
              case 'review':
                return (
                  <StepReview
                    basicInfo={basicInfo}
                    authors={authors}
                    access={access}
                    tags={tags}
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

// ── Shared ──

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

// ── Step 1: Basic Info ──

interface BasicInfoData {
  name: string;
  description: string;
  dataset_type: DatasetType;
  category: number;
  license: number;
  is_premium: boolean;
  is_private: boolean;
  dataset_image: string;
}

function StepBasicInfo({
  data,
  onChange,
  categories,
  licenses,
  errors = {},
}: {
  data: BasicInfoData;
  onChange: (d: BasicInfoData) => void;
  categories?: IDatasetCategory[];
  licenses?: { id: number; name: string }[];
  errors?: Record<string, string>;
}) {
  console.log({ categories });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Basic Information</h2>

      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Enter a descriptive name"
          className={errors.name ? 'border-destructive' : ''}
        />
        <FieldError errors={errors} field="name" />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Dataset Type</Label>
          <AsyncSelect
            value={data.dataset_type}
            onChange={(val) =>
              onChange({
                ...data,
                dataset_type: (val as DatasetType) ?? 'tabular',
              })
            }
            options={DATASET_TYPES.map((t) => ({
              label: t.label,
              value: t.value,
            }))}
            placeholder="Select type"
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <AsyncSelect
            value={data.category ? String(data.category) : null}
            onChange={(val) =>
              onChange({ ...data, category: Number(val) || 0 })
            }
            options={
              categories?.map((c) => ({
                label: c.name,
                value: String(c.id),
              })) ?? []
            }
            placeholder="Select category"
          />
          <FieldError errors={errors} field="category" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>License</Label>
        <AsyncSelect
          value={data.license ? String(data.license) : null}
          onChange={(val) => onChange({ ...data, license: Number(val) || 0 })}
          options={
            licenses?.map((l) => ({
              label: l.name,
              value: String(l.id),
            })) ?? []
          }
          placeholder="Select license"
        />
        <FieldError errors={errors} field="license" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label className="font-normal cursor-pointer">Premium dataset</Label>
          <Switch
            checked={data.is_premium}
            onCheckedChange={(v) => onChange({ ...data, is_premium: v })}
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
    </div>
  );
}

// ── Step 2: Authors & Access ──

function StepAuthorsAccess({
  authors,
  onAuthorsChange,
  access,
  onAccessChange,
}: {
  authors: DatasetAuthorInput[];
  onAuthorsChange: (a: DatasetAuthorInput[]) => void;
  access: DatasetAccessInput;
  onAccessChange: (a: DatasetAccessInput) => void;
}) {
  const [newUserId, setNewUserId] = useState('');

  const addAuthor = () => {
    const id = newUserId.trim();
    if (id && !authors.some((a) => a.user === id)) {
      onAuthorsChange([...authors, { user: id, role: 'contributor' }]);
      setNewUserId('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Authors</h2>
        <p className="text-sm text-muted-foreground">
          Add authors and their roles. You are automatically added as creator.
        </p>
      </div>

      {authors.length > 0 && (
        <div className="space-y-2">
          {authors.map((author, i) => (
            <div
              key={author.user}
              className="flex items-center gap-3 rounded-md border px-3 py-2"
            >
              <span className="text-sm flex-1 truncate font-mono">
                {author.user}
              </span>
              <AsyncSelect
                value={author.role}
                onChange={(val) => {
                  const updated = [...authors];
                  updated[i] = {
                    ...updated[i],
                    role: (val as DatasetAuthorInput['role']) ?? 'contributor',
                  };
                  onAuthorsChange(updated);
                }}
                options={[
                  { label: 'Creator', value: 'creator' },
                  { label: 'Contributor', value: 'contributor' },
                  { label: 'Maintainer', value: 'maintainer' },
                ]}
                placeholder="Role"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    onAuthorsChange(authors.filter((_, idx) => idx !== i))
                  }
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          placeholder="User ID or email"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addAuthor();
            }
          }}
        />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold">Access</h2>
        <p className="text-sm text-muted-foreground">
          Control who can access this dataset.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Access Type</Label>
        <AsyncSelect
          value={access.access_type}
          onChange={(val) =>
            onAccessChange({
              ...access,
              access_type: (val as AccessType) ?? 'public',
            })
          }
          options={ACCESS_TYPES.map((t) => ({
            label: t.label,
            value: t.value,
          }))}
          placeholder="Select access type"
        />
      </div>

      {access.access_type === 'restricted' && (
        <div className="space-y-2">
          <Label>Access Instructions</Label>
          <Textarea
            value={access.access_instructions ?? ''}
            onChange={(e) =>
              onAccessChange({ ...access, access_instructions: e.target.value })
            }
            placeholder="Describe how users can request access..."
            rows={3}
          />
        </div>
      )}
    </div>
  );
}

// ── Step 3: Tags & Datasheet ──

function StepDiscovery({
  tags,
  onTagsChange,
  datasheet,
  onDatasheetChange,
}: {
  tags: string[];
  onTagsChange: (t: string[]) => void;
  datasheet: DatasetDatasheetInput;
  onDatasheetChange: (d: DatasetDatasheetInput) => void;
}) {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) {
      onTagsChange([...tags, v]);
    }
    setTagInput('');
  };

  const datasheetFields: {
    key: keyof DatasetDatasheetInput;
    label: string;
    placeholder: string;
  }[] = [
    {
      key: 'motivation',
      label: 'Motivation',
      placeholder: 'Why was this dataset created?',
    },
    {
      key: 'composition',
      label: 'Composition',
      placeholder: 'What does the dataset contain?',
    },
    {
      key: 'collection_process',
      label: 'Collection Process',
      placeholder: 'How was the data collected?',
    },
    {
      key: 'preprocessing',
      label: 'Preprocessing',
      placeholder: 'What cleaning or transformations were applied?',
    },
    {
      key: 'uses',
      label: 'Uses',
      placeholder: 'What are the intended uses?',
    },
    {
      key: 'distribution',
      label: 'Distribution',
      placeholder: 'How is the dataset distributed?',
    },
    {
      key: 'maintenance',
      label: 'Maintenance',
      placeholder: 'Who maintains this dataset and how?',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Tags</h2>
        <p className="text-sm text-muted-foreground">
          Add tags to help users discover your dataset.
        </p>
      </div>

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
        />
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => onTagsChange(tags.filter((t) => t !== tag))}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      <div>
        <h2 className="text-lg font-semibold">
          Datasheet{' '}
          <span className="text-sm font-normal text-muted-foreground">
            (optional)
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Document your dataset following the Datasheets for Datasets framework.
        </p>
      </div>

      <div className="space-y-4">
        {datasheetFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label>{field.label}</Label>
            <Textarea
              value={datasheet[field.key] ?? ''}
              onChange={(e) =>
                onDatasheetChange({ ...datasheet, [field.key]: e.target.value })
              }
              placeholder={field.placeholder}
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 4: Review ──

function StepReview({
  basicInfo,
  authors,
  access,
  tags,
}: {
  basicInfo: {
    name: string;
    description: string;
    dataset_type: string;
    is_premium: boolean;
    is_private: boolean;
  };
  authors: DatasetAuthorInput[];
  access: DatasetAccessInput;
  tags: string[];
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Review & Create</h2>
      <p className="text-sm text-muted-foreground">
        Review your dataset details. After creation, you&apos;ll be able to add
        a version and upload files.
      </p>

      <div className="rounded-lg border p-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Name</span>
          <span className="text-muted-foreground">
            {basicInfo.name || '(untitled)'}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Type</span>
          <Badge variant="secondary" className="capitalize">
            {basicInfo.dataset_type}
          </Badge>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Access</span>
          <Badge variant="secondary" className="capitalize">
            {access.access_type}
          </Badge>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Authors</span>
          <span className="text-muted-foreground">
            {authors.length} author{authors.length !== 1 ? 's' : ''}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Tags</span>
          <span className="text-muted-foreground">
            {tags.length > 0 ? tags.join(', ') : '(none)'}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Premium</span>
          <span className="text-muted-foreground">
            {basicInfo.is_premium ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Private</span>
          <span className="text-muted-foreground">
            {basicInfo.is_private ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
        <p className="font-medium text-primary mb-1">
          Next steps after creation
        </p>
        <p className="text-muted-foreground">
          Once created, go to the dataset page to add a version and upload your
          files using presigned S3 URLs.
        </p>
      </div>
    </div>
  );
}

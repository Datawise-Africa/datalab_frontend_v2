import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useStepValidator } from '~/components/ui/multi-step-form';
import { Separator } from '~/components/ui/separator';
import { X } from 'lucide-react';
import { AsyncSelect } from '~/components/ui/async-select';
import { FormSelectField, FormTextareaField } from '~/components/form-fields';
import type { UploadDatasetFormValues } from './types';
import { ACCESS_TYPES } from './types';
import { useAuthors } from '~/features/metadata';
import { useAppSelector } from '~/store';

export function StepAuthorsAccess() {
  const { control, watch, trigger, formState } =
    useFormContext<UploadDatasetFormValues>();
  const authUser = useAppSelector((s) => s.auth.user);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'authors',
  });

  const { data: authors = [] } = useAuthors();
  const currentAuthors = watch('authors');

  // Build a lookup for displaying author names
  const authorLookup = useMemo(() => {
    const map = new Map<string, string>();
    // Add server authors
    for (const a of authors) {
      map.set(
        String(a.id),
        `${a.first_name} ${a.last_name}${a.email ? ` (${a.email})` : ''}`
      );
    }
    // Add current user
    if (authUser) {
      map.set(
        String(authUser.id),
        `${authUser.first_name} ${authUser.last_name} (You)`
      );
    }
    return map;
  }, [authors, authUser]);

  // Filter out already-selected authors from the dropdown options
  const authorOptions = useMemo(() => {
    const selectedIds = new Set(currentAuthors.map((a) => a.user));

    const options: { label: string; value: string }[] = [];

    // Add current user first if not already selected
    if (authUser && !selectedIds.has(String(authUser.id))) {
      options.push({
        label: `${authUser.first_name} ${authUser.last_name}${authUser.email ? ` (${authUser.email})` : ''} (You)`,
        value: String(authUser.id),
      });
    }

    // Add server authors
    for (const a of authors) {
      if (!selectedIds.has(String(a.id))) {
        options.push({
          label: `${a.first_name} ${a.last_name}${a.email ? ` (${a.email})` : ''}`,
          value: String(a.id),
        });
      }
    }

    return options;
  }, [authors, authUser, currentAuthors]);

  useStepValidator(async () => {
    const valid = await trigger(['authors', 'access']);
    if (valid) return { valid: true };

    const errors: Record<string, string> = {};
    const authorsErr = formState.errors.authors;
    if (authorsErr?.message) errors.authors = String(authorsErr.message);
    if (authorsErr?.root?.message)
      errors.authors = String(authorsErr.root.message);
    return { valid: false, errors };
  });

  const accessType = watch('access.access_type');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Authors</h2>
        <p className="text-sm text-muted-foreground">
          Add authors for this dataset. You are automatically added as creator.
        </p>
      </div>

      {/* Selected authors list */}
      {fields.length > 0 && (
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div
              key={field.id}
              className="flex items-center gap-3 rounded-md border px-3 py-2"
            >
              <span className="text-sm flex-1 truncate">
                {authorLookup.get(field.user) ?? field.user}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {field.role}
              </span>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Author picker */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Add Author <span className="text-destructive">*</span>
        </p>
        <AsyncSelect
          value={null}
          onChange={(val) => {
            if (val && !currentAuthors.some((a) => a.user === val)) {
              append({ user: val, role: 'creator' });
            }
          }}
          options={authorOptions}
          placeholder="Search for an author..."
          searchPlaceholder="Type to search..."
          emptyText="No authors found."
        />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold">Access</h2>
        <p className="text-sm text-muted-foreground">
          Control who can access this dataset.
        </p>
      </div>

      <FormSelectField
        control={control}
        name="access.access_type"
        label="Access Type"
        placeholder="Select access type"
        options={ACCESS_TYPES.map((t) => ({
          label: t.label,
          value: t.value,
        }))}
      />

      {accessType === 'restricted' && (
        <FormTextareaField
          control={control}
          name="access.access_instructions"
          label="Access Instructions"
          placeholder="Describe how users can request access..."
          rows={3}
        />
      )}
    </div>
  );
}

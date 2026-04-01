import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useStepValidator } from '~/components/ui/multi-step-form';
import { FormControl, FormField, FormItem } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { AsyncSelect } from '~/components/ui/async-select';
import { X } from 'lucide-react';
import { FormSelectField, FormTextareaField } from '~/components/form-fields';
import type { UploadFormValues } from './types';
import { ACCESS_TYPES } from './types';

export function StepAuthorsAccess() {
  const { control, watch, trigger, formState } =
    useFormContext<UploadFormValues>();
  const {
    fields: authorFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'authors',
  });
  const [newUserId, setNewUserId] = useState('');

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

  const addAuthor = () => {
    const id = newUserId.trim();
    const currentAuthors = watch('authors');
    if (id && !currentAuthors.some((a) => a.user === id)) {
      append({ user: id, role: 'contributor' });
      setNewUserId('');
    }
  };

  const accessType = watch('access.access_type');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Authors</h2>
        <p className="text-sm text-muted-foreground">
          Add authors and their roles. You are automatically added as creator.
        </p>
      </div>

      {authorFields.length > 0 && (
        <div className="space-y-2">
          {authorFields.map((authorField, i) => (
            <div
              key={authorField.id}
              className="flex items-center gap-3 rounded-md border px-3 py-2"
            >
              <span className="text-sm flex-1 truncate font-mono">
                {authorField.user}
              </span>
              <FormField
                control={control}
                name={`authors.${i}.role`}
                render={({ field }) => (
                  <FormItem className="w-40">
                    <FormControl>
                      <AsyncSelect
                        value={field.value}
                        onChange={(val) => field.onChange(val ?? 'contributor')}
                        options={[
                          { label: 'Creator', value: 'creator' },
                          { label: 'Contributor', value: 'contributor' },
                          { label: 'Maintainer', value: 'maintainer' },
                        ]}
                        placeholder="Role"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Textarea } from '~/components/ui/textarea';
import { Separator } from '~/components/ui/separator';
import { FormTagInputField } from '~/components/form-fields';
import type { UploadDatasetFormValues } from './types';

const DATA_SHEET_FIELDS: {
  key:
    | 'motivation'
    | 'composition'
    | 'collection_process'
    | 'preprocessing'
    | 'uses'
    | 'distribution'
    | 'maintenance';
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
  { key: 'uses', label: 'Uses', placeholder: 'What are the intended uses?' },
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

export function StepDiscovery() {
  const { control } = useFormContext<UploadDatasetFormValues>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Tags</h2>
        <p className="text-sm text-muted-foreground">
          Add tags to help users discover your dataset.
        </p>
      </div>

      <FormTagInputField
        control={control}
        name="tags"
        label="Tags"
        placeholder="Type and press Enter"
      />

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
        {DATA_SHEET_FIELDS.map((field) => (
          <FormField
            key={field.key}
            control={control}
            name={`datasheet.${field.key}`}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    rows={2}
                    value={formField.value ?? ''}
                    onChange={formField.onChange}
                    onBlur={formField.onBlur}
                    ref={formField.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}

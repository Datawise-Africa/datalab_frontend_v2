import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { ChipInput } from '../ui/chip-input';
import { Globe, Search, Tags } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import type { UploadDatasetSchemaType } from '@/lib/schema/upload-dataset-schema';
type Step4Props = {
  form: UseFormReturn<UploadDatasetSchemaType>;
};
type AudienceKey = keyof UploadDatasetSchemaType['step_4']['audience_data'];

const intendedAudience: Record<AudienceKey, { label: string }> = {
  students: { label: 'Students & Academics' },
  non_profit: { label: 'Non-profit Organizations' },
  company: { label: 'Commercial/Business' },
  public: { label: 'Public Sector' },
};

const regionsOfOrigin = [
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'North America', label: 'North America' },
  { value: 'South America', label: 'South America' },
  { value: 'Oceania', label: 'Oceania' },

]
export default function DatasetUploadFormStep4({ form }: Step4Props) {
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="step_4.keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Keywords <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <ChipInput
                leftIcon={<Search />}
                placeholder="Add keywords..."
                {...field}
                chipVariant="outline"
                splitters={[',']}
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-500">
              <strong>Tip:</strong> Use specific, relevant terms that
              researchers would search for
            </FormDescription>
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step_4.tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Tags <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <ChipInput
                leftIcon={<Tags />}
                placeholder="Add tags..."
                {...field}
                chipVariant="outline"
                splitters={[',']}
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-500">
              These help categorize your dataset (e.g., 'verified',
              'high-resolution')
            </FormDescription>
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'step_4.origin_region'}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Select Region(Origin)
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl className="">
              <Select {...field}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="border-primary/30 w-full">
                  <SelectValue placeholder="Region of origin" />
                </SelectTrigger>
                <SelectContent className="border-primary/30 w-full bg-white">
                  {regionsOfOrigin.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {/* <FormDescription className="text-xs text-gray-500">
                                                  The title or role of the author.
                                              </FormDescription> */}
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step_4.covered_regions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Regions covered <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <ChipInput
                leftIcon={<Globe />}
                placeholder="Add regions..."
                {...field}
                chipVariant="outline"
                splitters={[',']}
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-500">
              These help categorize your dataset (e.g., 'verified',
              'high-resolution')
            </FormDescription>
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        )}
      />
      {/* Intended audience */}
      <div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="step_4.audience_data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intended Audience</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  {Object.entries(intendedAudience).map(([key, value]) => {
                    // Type assertion to ensure key is of type AudienceKey
                    const typedKey = key as AudienceKey;
                    return (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={field.value?.[typedKey] || false}
                          onCheckedChange={(checked) => {
                            const newValue = {
                              ...(field.value || {}),
                              [typedKey]: checked,
                            };
                            field.onChange(newValue);
                          }}
                          className={`focus:ring-primary/50 hover:border-primary/80 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded border border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-white`}
                        />
                        <label htmlFor={key} className="text-sm">
                          {value.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

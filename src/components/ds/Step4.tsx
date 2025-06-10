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
type Step4Props = {
  form: UseFormReturn;
};
const intendedAudience: Record<string, boolean> = {
  students: false,
  non_profit: false,
  company: false,
  public: false,
};
export default function Step4({ form }: Step4Props) {
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="keywords"
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
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
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
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'dataset_region'}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Select Region(Origin)
              <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl className="">
              <Select {...field}>
                <SelectTrigger className="border-primary/30 w-full">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent className="border-primary/30 w-full bg-white">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {/* <FormDescription className="text-xs text-gray-500">
                                                  The title or role of the author.
                                              </FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="regions_covered"
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
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Intended audience */}
      <FormField
        control={form.control}
        name="intended_audience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Intended audience <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              {/* Check boxes */}
              {Object.keys(intendedAudience).map((audience) => (
                <FormItem key={audience}>
                  <FormControl>
                    <Checkbox
                      name={field.name}
                      checked={intendedAudience[audience]}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  {/* <FormLabel>{audience}</FormLabel> */}
                </FormItem>
              ))}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

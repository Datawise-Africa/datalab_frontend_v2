import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { IconInput } from '../ui/icon-input';
import { CircleDollarSignIcon } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { UploadDatasetSchemaType } from '@/lib/schema/upload-dataset-schema';
import { type IDatasetCategory } from '@/hooks/use-dataset-categories';

type Step1Props = {
  form: UseFormReturn<UploadDatasetSchemaType>;
  categories: IDatasetCategory[];
};

export default function DatasetUploadFormStep1({
  form,
  categories,
}: Step1Props) {
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="step_1.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Dataset title <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="E.g 'Global Climate Data 2023'" {...field} />
            </FormControl>
            <FormDescription className="text-xs text-gray-500">
              Choose a clear descriptive title that will help users find your
              dataset
            </FormDescription>
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step_1.category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Category <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl className="">
              <Select
                {...field}
                value={field.value as unknown as string}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="border-primary/30 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-primary/30 w-full bg-white">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id + ''}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {/* <FormDescription className='text-xs text-gray-500'>
                                                        Choose a clear descriptive title that will help users find your dataset
                                                    </FormDescription> */}
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step_1.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Brief Description <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide a brief description of your dataset it's contents and potential usecases."
                {...field}
                className="h-24 resize-none"
              />
            </FormControl>
            <FormDescription className="text-xs text-gray-500">
              <strong>Tip:</strong> Include information about data collection
              methods, time period and key variables.
            </FormDescription>
            <FormMessage className="text-xs text-red-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="step_1.is_premium"
        render={({ field }) => (
          <FormItem className="border-primary/30 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Premium Dataset</FormLabel>
              <FormDescription>
                Charge users for access to this dataset
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      {form.watch('step_1.is_premium') && (
        <FormField
          control={form.control}
          name="step_1.price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Price (USD)
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <IconInput
                  placeholder="E.g 'Global Climate Data 2023'"
                  {...field}
                  leftIcon={<CircleDollarSignIcon />}
                  type="number"
                  min={0}
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Choose a clear descriptive title that will help users find your
                dataset
              </FormDescription>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name="step_1.is_private"
        render={({ field }) => (
          <FormItem className="border-primary/30 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Private Dataset</FormLabel>
              <FormDescription>
                Only you and specified collaborators can view this dataset
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

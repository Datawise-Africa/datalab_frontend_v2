import type { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Info } from 'lucide-react';
type Step5Props = {
  form: UseFormReturn;
};

const options = {
  data_accuracy: {
    label: 'Data Accuracy',
    value: false,
    description: `I confirm that I have made reasonable efforts to ensure the accuracy of this dataset, but I don't guarantee absolute correctness of all data points.`,
  },
  responsible_use: {
    label: 'Responsible Use',
    value: false,
    description: `I acknowledge that this dataset should be used responsibly and ethically, with consideration for potential impacts.`,
  },
  privacy_compliance: {
    label: 'Privacy Compliance',
    value: false,
    description: `I confirm that this dataset has been properly anonymized or all necessary consents have been obtained if it contains any personal or sensitive information.`,
  },
  rights_ownership: {
    label: 'Rights & Ownership',
    value: false,
    description: `I confirm that I have the necessary rights and permissions to share this dataset, and I will provide appropriate attribution to any third-party sources.`,
  },
};
export default function Step5({ form }: Step5Props) {
  return (
    <div>
      <FormField
        control={form.control}
        name="terms_and_conditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Terms and Conditions</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                {Object.entries(options).map(([key, value]) => (
                  <div
                    key={key}
                    className="border-primary/30 flex items-center space-x-2 rounded-lg border p-4 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <Checkbox
                      id={key}
                      checked={field.value?.[key] || false}
                      onCheckedChange={(checked) => {
                        const newValue = {
                          ...(field.value || {}),
                          [key]: checked,
                        };
                        field.onChange(newValue);
                      }}
                      className={`focus:ring-primary/50 hover:border-primary/80 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded border border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-white`}
                    />
                    <label htmlFor={key} className="text-sm">
                      <div className="flex flex-col gap-2">
                        <h2>{value.label}</h2>
                        <p className="text-xs text-gray-500">
                          {value.description}
                        </p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-blue-300 bg-blue-50 p-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Info className="h-4 w-4 text-gray-500" />
          <span>Ready to publish?</span>
        </h2>
        <p>
          After publishing, your dataset will be reviewed for quality and
          compliance before becoming publicly available. This final step helps
          ensure all datasets on our platform meet the highest standards.
        </p>
      </div>
    </div>
  );
}

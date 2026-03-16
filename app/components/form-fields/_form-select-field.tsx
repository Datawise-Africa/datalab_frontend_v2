// import type { Control, FieldPath, FieldValues } from 'react-hook-form';
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '~/components/ui/select';

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface FormSelectFieldProps<TFieldValues extends FieldValues> {
//   control: Control<TFieldValues>;
//   name: FieldPath<TFieldValues>;
//   label: string;
//   placeholder?: string;
//   required?: boolean;
//   disabled?: boolean;
//   options: SelectOption[];
// }

// export function FormSelectField<TFieldValues extends FieldValues>({
//   control,
//   name,
//   label,
//   placeholder = 'Select an option',
//   required = false,
//   disabled = false,
//   options,
// }: FormSelectFieldProps<TFieldValues>) {
//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>
//             {label} {required && <span className="text-destructive">*</span>}
//           </FormLabel>
//           <Select
//             onValueChange={field.onChange}
//             defaultValue={field.value as string}
//             disabled={disabled}
//           >
//             <FormControl>
//               <SelectTrigger>
//                 <SelectValue placeholder={placeholder} />
//               </SelectTrigger>
//             </FormControl>
//             <SelectContent>
//               {options.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }

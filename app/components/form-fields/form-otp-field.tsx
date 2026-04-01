import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '~/components/ui/input-otp';

interface FormOtpFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  /** Number of OTP digits. Defaults to 6. */
  maxLength?: number;
  /** Show a separator after this many slots (e.g. 3 for "xxx - xxx"). Defaults to half of maxLength. */
  separatorAfter?: number;
  required?: boolean;
  disabled?: boolean;
}

export function FormOtpField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  maxLength = 6,
  separatorAfter,
  required = false,
  disabled = false,
}: Readonly<FormOtpFieldProps<TFieldValues>>) {
  const sep = separatorAfter ?? Math.floor(maxLength / 2);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <InputOTP
              maxLength={maxLength}
              value={field.value ?? ''}
              onChange={field.onChange}
              disabled={disabled}
            >
              <InputOTPGroup>
                {Array.from({ length: maxLength }, (_, i) => (
                  <span key={i} className="contents">
                    {i === sep && i > 0 && <InputOTPSeparator />}
                    <InputOTPSlot index={i} />
                  </span>
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

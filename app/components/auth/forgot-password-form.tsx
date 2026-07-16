import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '~/components/ui/form';
import { FormTextField } from '~/components/form-fields';
import { Button } from '~/components/ui/button';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '~/lib/schema/auth-schema';
import { useRequestPasswordReset } from '~/features/auth';

interface ForgotPasswordFormProps {
  onOtpSent: (email: string) => void;
}

export function ForgotPasswordForm({
  onOtpSent,
}: Readonly<ForgotPasswordFormProps>) {
  const requestReset = useRequestPasswordReset();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    requestReset.mutate(data, {
      onSuccess: () => onOtpSent(data.email),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormTextField
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
        />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={requestReset.isPending}
        >
          {requestReset.isPending ? 'Sending code...' : 'Send reset code'}
        </Button>
      </form>
    </Form>
  );
}

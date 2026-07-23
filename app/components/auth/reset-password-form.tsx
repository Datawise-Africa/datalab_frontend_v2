import { useCompletePasswordReset } from '~/features/auth';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '~/lib/schema/auth-schema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '~/components/ui/form';
import { FormOtpField, FormPasswordField } from '~/components/form-fields';
import { Button } from '~/components/ui/button';

interface ResetPasswordFormProps {
  email: string;
  onSuccess: () => void;
}

export function ResetPasswordForm({
  email,
  onSuccess,
}: Readonly<ResetPasswordFormProps>) {
  const [done, setDone] = useState(false);
  const completeReset = useCompletePasswordReset();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp_code: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    completeReset.mutate(data, {
      onSuccess: () => setDone(true),
    });
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <span className="text-xl text-primary">&#10003;</span>
        </div>
        <p className="font-medium">Password reset successfully</p>
        <p className="text-sm text-muted-foreground">
          You can now sign in with your new password.
        </p>
        <Button
          className="mt-2 bg-primary hover:bg-primary/90"
          onClick={onSuccess}
        >
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We sent a code to{' '}
          <span className="font-medium text-foreground">{email}</span>
        </p>
        <FormOtpField
          control={form.control}
          name="otp_code"
          label="Reset code"
        />
        <FormPasswordField
          control={form.control}
          name="new_password"
          label="New password"
          placeholder="••••••"
        />
        <FormPasswordField
          control={form.control}
          name="confirm_password"
          label="Confirm new password"
          placeholder="••••••"
        />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={completeReset.isPending}
        >
          {completeReset.isPending ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>
    </Form>
  );
}

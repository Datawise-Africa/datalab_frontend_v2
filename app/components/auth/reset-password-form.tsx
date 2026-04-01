import { useCompletePasswordReset } from '~/features/auth';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '~/lib/schema/auth-schema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

export function ResetPasswordForm({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) {
  const [done, setDone] = useState(false);
  const completeReset = useCompletePasswordReset();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      otp: '',
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
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reset code</FormLabel>
              <FormControl>
                <Input placeholder="Enter code" maxLength={8} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {completeReset.isError && (
          <p className="text-sm text-destructive">
            Invalid or expired code. Please try again.
          </p>
        )}
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

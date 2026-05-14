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
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '~/lib/schema/auth-schema';
import { useRequestPasswordReset } from '~/features/auth';
export function ForgotPasswordForm({
  onOtpSent,
}: {
  onOtpSent: (email: string) => void;
}) {
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {requestReset.isError && (
          <p className="text-sm text-destructive">
            Failed to send reset code. Please check your email and try again.
          </p>
        )}
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

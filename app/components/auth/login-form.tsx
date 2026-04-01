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
import { loginSchema, type LoginInput } from '~/lib/schema/auth-schema';
import { useLogin } from '~/features/auth';

export function LoginForm({
  onSuccess,
  onForgot,
}: {
  onSuccess: () => void;
  onForgot: () => void;
}) {
  const loginMutation = useLogin();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data, { onSuccess });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={onForgot}
                >
                  Forgot password?
                </button>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {loginMutation.isError && (
          <p className="text-sm text-destructive">
            Invalid email or password. Please try again.
          </p>
        )}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  );
}

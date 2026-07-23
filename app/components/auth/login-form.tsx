import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '~/components/ui/form';
import { FormTextField, FormPasswordField } from '~/components/form-fields';
import { Button } from '~/components/ui/button';
import { loginSchema, type LoginInput } from '~/lib/schema/auth-schema';
import { useLogin } from '~/features/auth';

interface LoginFormProps {
  onSuccess: () => void;
  onForgot: () => void;
}

export function LoginForm({ onSuccess, onForgot }: Readonly<LoginFormProps>) {
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
        <FormTextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <FormPasswordField
          control={form.control}
          name="password"
          label="Password"
          placeholder="••••••"
        />
        <button
          type="button"
          className="text-xs text-primary hover:underline"
          onClick={onForgot}
        >
          Forgot password?
        </button>
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

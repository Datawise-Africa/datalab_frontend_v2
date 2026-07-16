import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '~/components/ui/form';
import { FormTextField, FormPasswordField } from '~/components/form-fields';
import { Button } from '~/components/ui/button';
import { signupSchema, type SignupInput } from '~/lib/schema/auth-schema';
import { useSignup } from '~/features/auth';

interface SignupFormProps {
  onSuccess: () => void;
}

export function SignupForm({ onSuccess }: Readonly<SignupFormProps>) {
  const signupMutation = useSignup();
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = (data: SignupInput) => {
    signupMutation.mutate(data, { onSuccess });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormTextField
            control={form.control}
            name="first_name"
            label="First name"
            placeholder="John"
          />
          <FormTextField
            control={form.control}
            name="last_name"
            label="Last name"
            placeholder="Doe"
          />
        </div>
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
        <FormPasswordField
          control={form.control}
          name="confirm_password"
          label="Confirm password"
          placeholder="••••••"
        />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </Form>
  );
}

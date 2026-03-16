import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
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
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type SignupInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from '~/lib/schema/auth-schema';
import {
  useLogin,
  useSignup,
  useRequestPasswordReset,
  useCompletePasswordReset,
} from '~/features/auth';
import { useAppModal } from '~/store/slices/modal-slice';
import { ArrowLeft } from 'lucide-react';

declare module '~/store/slices/modal-slice' {
  interface ModalRegistry {
    auth: undefined;
  }
}

type AuthTab = 'login' | 'signup' | 'forgot' | 'reset';

export function AuthModal() {
  const { isOpen, close } = useAppModal('auth');
  const [tab, setTab] = useState<AuthTab>('login');
  const [resetEmail, setResetEmail] = useState('');

  const handleClose = () => {
    close();
    setTab('login');
    setResetEmail('');
  };

  const handleOtpSent = (email: string) => {
    setResetEmail(email);
    setTab('reset');
  };

  const handleResetComplete = () => {
    setTab('login');
    setResetEmail('');
  };

  const titles: Record<AuthTab, { title: string; description: string }> = {
    login: {
      title: 'Welcome back',
      description: 'Sign in to your account to continue',
    },
    signup: {
      title: 'Create an account',
      description: 'Sign up to get started with Data Lab',
    },
    forgot: {
      title: 'Forgot password',
      description: "Enter your email and we'll send you a reset code",
    },
    reset: {
      title: 'Reset password',
      description: 'Enter the code sent to your email and your new password',
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md" dismissible={false}>
        <DialogHeader>
          {(tab === 'forgot' || tab === 'reset') && (
            <button
              type="button"
              className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground self-start"
              onClick={() => setTab('login')}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </button>
          )}
          <DialogTitle>{titles[tab].title}</DialogTitle>
          <DialogDescription>{titles[tab].description}</DialogDescription>
        </DialogHeader>

        {tab === 'login' && (
          <LoginForm
            onSuccess={handleClose}
            onForgot={() => setTab('forgot')}
          />
        )}
        {tab === 'signup' && <SignupForm onSuccess={handleClose} />}
        {tab === 'forgot' && <ForgotPasswordForm onOtpSent={handleOtpSent} />}
        {tab === 'reset' && (
          <ResetPasswordForm
            email={resetEmail}
            onSuccess={handleResetComplete}
          />
        )}

        {(tab === 'login' || tab === 'signup') && (
          <div className="text-center text-sm text-muted-foreground">
            {tab === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={() => setTab('signup')}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={() => setTab('login')}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LoginForm({
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

function SignupForm({ onSuccess }: { onSuccess: () => void }) {
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
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
              <FormLabel>Password</FormLabel>
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
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {signupMutation.isError && (
          <p className="text-sm text-destructive">
            Registration failed. Please try again.
          </p>
        )}
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

function ForgotPasswordForm({
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

function ResetPasswordForm({
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

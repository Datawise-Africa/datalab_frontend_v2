import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useAppModal } from '~/store/slices/modal-slice';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from './login-form';
import { ResetPasswordForm } from './reset-password-form';
import { SignupForm } from './signup-form';
import { ForgotPasswordForm } from './forgot-password-form';

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

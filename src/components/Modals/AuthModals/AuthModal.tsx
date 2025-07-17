import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './Modal';
import type { RegisterOrLoginResponse } from '@/lib/types/auth';
import { extractCorrectErrorMessage } from '@/lib/error';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import {
  loginSchema,
  signupSchema,
  type LoginFormValues,
  type SignupFormValues,
} from '@/lib/schema/auth-schema';
import { useAuthStore } from '@/store/auth-store';
import { useAuthContext } from '@/context/AuthProvider';
import { useAxios } from '@/hooks/use-axios';

const AuthModal = () => {
  const axiosClient = useAxios();
  const [isSignUp, setIsSignUp] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const authStore = useAuthStore();
  // const authModal = useAuthModal();
  const {
    setIsAuthModalOpen,
    isAuthModalOpen,
    queue: authQueue,
  } = useAuthContext();

  // Setup React Hook Form for login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLoginForm,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Setup React Hook Form for signup
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
    reset: resetSignupForm,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  });

  // Toggle between login and signup forms
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setServerErrors([]);
    resetLoginForm();
    resetSignupForm();
  };

  // Handle login form submission
  const onLoginSubmit = async (formData: LoginFormValues) => {
    setServerErrors([]);
    try {
      const { data } = await axiosClient.post<RegisterOrLoginResponse>(
        '/auth/login/',
        formData,
      );

      if (data.access_token) {
        // dispatch(
        //   actions.LOGIN({
        //     accessToken: data.access_token,
        //     refreshToken: data.refresh_token,
        //     firstName: data.first_name,
        //     lastName: data.last_name,
        //     userId: data.id,
        //     userRole: data.user_role,
        //     email: data.email,
        //   }),
        // );
        authStore.login({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user_id: data.id,
          user_role: data.user_role,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        });
        // authModal.close();
        // if (navUrl) {
        //   navigate(navUrl);
        // }
        await authQueue.processQueue();
        setIsAuthModalOpen(false);
      } else {
        // setServerErrors(data.errors || ['Login failed. Please try again.']);
      }
    } catch (error) {
      // setServerErrors(['An unexpected error occurred. Please try again.']);
      setServerErrors([extractCorrectErrorMessage(error)]);
      console.error('Login error:', error);
    }
  };

  // Handle signup form submission
  const onSignupSubmit = async (data: SignupFormValues) => {
    setServerErrors([]);
    try {
      const formData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      };

      const { data: respData } =
        await axiosClient.post<RegisterOrLoginResponse>(
          '/auth/register/',
          formData,
        );

      if (respData.access_token) {
        authStore.login({
          access_token: respData.access_token,
          refresh_token: respData.refresh_token,
          user_id: respData.id,
          user_role: respData.user_role,
          first_name: respData.first_name,
          last_name: respData.last_name,
          email: respData.email,
        });
        // authModal.close();
        await authQueue.processQueue();
        setIsAuthModalOpen(false);
        // if (navUrl) {
        //   navigate(navUrl);
        // }
      } else {
        // setServerErrors();
        // respData.errors || ['Registration failed. Please try again.'],
      }
    } catch (error) {
      setServerErrors(
        [extractCorrectErrorMessage(error)],
        // ['An unexpected error occurred. Please try again.']
      );
      console.error('Signup error:', error);
    }
  };

  const content = (
    <>
      {isSignUp ? (
        <form
          onSubmit={handleSignupSubmit(onSignupSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <h5>Hi, Welcome to Datalab</h5>
            <p>
              Create an account or{' '}
              <span
                className="cursor-pointer underline hover:underline"
                onClick={toggleAuthMode}
              >
                login to existing account
              </span>
            </p>
          </div>

          <div className="pb-4">
            <label htmlFor="first_name">First name</label>
            <input
              {...registerSignup('first_name')}
              id="first_name"
              placeholder="Your first name"
              type="text"
              className="h-[54px] w-full rounded-xl border border-gray-300 px-4"
            />
            {signupErrors.first_name && (
              <p className="mt-1 text-sm text-red-500">
                {signupErrors.first_name.message}
              </p>
            )}
          </div>

          <div className="pb-4">
            <label htmlFor="last_name">Last name</label>
            <input
              {...registerSignup('last_name')}
              id="last_name"
              placeholder="Your last name"
              type="text"
              className="h-[54px] w-full rounded-xl border border-gray-300 px-4"
            />
            {signupErrors.last_name && (
              <p className="mt-1 text-sm text-red-500">
                {signupErrors.last_name.message}
              </p>
            )}
          </div>

          <div className="pb-4">
            <label htmlFor="signup_email">Email</label>
            <input
              {...registerSignup('email')}
              id="signup_email"
              placeholder="Your email address"
              type="email"
              className="h-[54px] w-full rounded-xl border border-gray-300 px-4"
            />
            {signupErrors.email && (
              <p className="mt-1 text-sm text-red-500">
                {signupErrors.email.message}
              </p>
            )}
          </div>

          <div className="pb-4">
            <label htmlFor="signup_password">Password</label>
            <input
              {...registerSignup('password')}
              id="signup_password"
              placeholder="Your password"
              type="password"
              className="h-[54px] w-full rounded-xl border border-gray-300 px-4"
            />
            {signupErrors.password && (
              <p className="mt-1 text-sm text-red-500">
                {signupErrors.password.message}
              </p>
            )}
          </div>

          {serverErrors.length > 0 && (
            <div className="space-y-2">
              {serverErrors.map((error: any, index) => (
                <div
                  key={`error_${index}`}
                  className="rounded-lg bg-red-50 p-3 text-red-700"
                >
                  {typeof error === 'object'
                    ? error.message || JSON.stringify(error)
                    : error}
                </div>
              ))}
            </div>
          )}

          {/* <CustomButton label="Sign up" type="submit" />
           */}
          <Button
            type="submit"
            disabled={isSignupSubmitting}
            className="mb-10 w-full transform cursor-pointer rounded bg-gradient-to-b from-[#115443] to-[#26A37E] px-2 py-3 text-[#E5E7EB] transition duration-200 hover:translate-y-[3px] hover:from-[#072720] hover:to-[#072720] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white"
          >
            {isSignupSubmitting && (
              <RotateCcw className="mr-2 animate-spin" size={16} />
            )}
            {isSignupSubmitting ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleLoginSubmit(onLoginSubmit)}
          className="space-y-8 bg-white"
        >
          <div className="space-y-2">
            <h5>Hi, Welcome to Datalab</h5>
            <p>
              Sign in to your account or{' '}
              <span
                className="cursor-pointer underline hover:underline"
                onClick={toggleAuthMode}
              >
                create a new account
              </span>
            </p>
          </div>

          <div>
            <label htmlFor="login_email">Email</label>
            <input
              {...registerLogin('email')}
              id="login_email"
              placeholder="Your email address"
              type="email"
              className="h-[54px] w-full rounded-xl border border-gray-300 px-4"
            />
            {loginErrors.email && (
              <p className="mt-1 text-sm text-red-500">
                {loginErrors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="login_password">Password</label>
            <input
              {...registerLogin('password')}
              id="login_password"
              placeholder="Your password"
              type="password"
              className="h-[54px] w-full rounded-xl border border-gray-300 px-4"
            />
            {loginErrors.password && (
              <p className="mt-1 text-sm text-red-500">
                {loginErrors.password.message}
              </p>
            )}
          </div>

          {serverErrors.length > 0 && (
            <div className="space-y-2">
              {serverErrors.map((error: any, index) => (
                <div
                  key={`error_${index}`}
                  className="rounded-lg bg-red-50 p-3 text-red-700"
                >
                  {typeof error === 'object'
                    ? error.message || JSON.stringify(error)
                    : error}
                </div>
              ))}
            </div>
          )}

          {/* <CustomButton label="Sign in" type="submit" />
           */}
          <Button
            type="submit"
            disabled={isLoginSubmitting}
            className="mb-10 w-full transform cursor-pointer rounded bg-gradient-to-b from-[#115443] to-[#26A37E] px-2 py-3 text-[#E5E7EB] transition duration-200 hover:translate-y-[3px] hover:from-[#072720] hover:to-[#072720] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white"
          >
            {isLoginSubmitting && (
              <RotateCcw className="mr-2 animate-spin" size={16} />
            )}
            {isLoginSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      )}
    </>
  );

  return (
    <Modal
      // className="bg-white"
      isOpen={isAuthModalOpen}
      close={() => setIsAuthModalOpen(false)}
      content={content}
    />
  );
};

export default AuthModal;

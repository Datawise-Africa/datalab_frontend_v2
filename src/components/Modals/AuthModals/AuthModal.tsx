import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from './Modal';
import { useAuth } from '@/context/AuthProvider';
import useApi from '@/hooks/use-api';
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

const AuthModal = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  // const authModal = useAuthModal();
  const {
    dispatch,
    actions,
    setIsAuthModalOpen,
    isAuthModalOpen,
    queue: authQueue,
  } = useAuth();
  const { publicApi } = useApi();

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
      const { data } = await publicApi.post<RegisterOrLoginResponse>(
        '/auth/login/',
        formData,
      );

      if (data.access_token) {
        dispatch(
          actions.LOGIN({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            firstName: data.first_name,
            lastName: data.last_name,
            userId: data.id,
            userRole: data.user_role,
            email: data.email,
          }),
        );
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

      const { data: respData } = await publicApi.post<RegisterOrLoginResponse>(
        '/auth/register/',
        formData,
      );

      if (respData.access_token) {
        dispatch(
          actions.LOGIN({
            accessToken: respData.access_token,
            refreshToken: respData.refresh_token,
            firstName: respData.first_name,
            lastName: respData.last_name,
            userId: respData.id,
            userRole: respData.user_role,
            email: respData.email,
          }),
        );
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
                className="underline cursor-pointer hover:underline"
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
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
            {signupErrors.first_name && (
              <p className="text-red-500 text-sm mt-1">
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
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
            {signupErrors.last_name && (
              <p className="text-red-500 text-sm mt-1">
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
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
            {signupErrors.email && (
              <p className="text-red-500 text-sm mt-1">
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
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
            {signupErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {signupErrors.password.message}
              </p>
            )}
          </div>

          {serverErrors.length > 0 && (
            <div className="space-y-2">
              {serverErrors.map((error: any, index) => (
                <div
                  key={`error_${index}`}
                  className="p-3 bg-red-50 text-red-700 rounded-lg"
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
            className="w-full bg-gradient-to-b from-[#115443] to-[#26A37E] text-[#E5E7EB] rounded px-2 py-3 mb-10 hover:from-[#072720] hover:to-[#072720] cursor-pointer transition transform duration-200 hover:translate-y-[3px] disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed"
          >
            {isSignupSubmitting && (
              <RotateCcw className="animate-spin mr-2" size={16} />
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
                className="underline cursor-pointer hover:underline"
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
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
            {loginErrors.email && (
              <p className="text-red-500 text-sm mt-1">
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
              className="w-full px-4 h-[54px] border border-gray-300 rounded-xl"
            />
            {loginErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {loginErrors.password.message}
              </p>
            )}
          </div>

          {serverErrors.length > 0 && (
            <div className="space-y-2">
              {serverErrors.map((error: any, index) => (
                <div
                  key={`error_${index}`}
                  className="p-3 bg-red-50 text-red-700 rounded-lg"
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
            className="w-full bg-gradient-to-b from-[#115443] to-[#26A37E] text-[#E5E7EB] rounded px-2 py-3 mb-10 hover:from-[#072720] hover:to-[#072720] cursor-pointer transition transform duration-200 hover:translate-y-[3px] disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed"
          >
            {isLoginSubmitting && (
              <RotateCcw className="animate-spin mr-2" size={16} />
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

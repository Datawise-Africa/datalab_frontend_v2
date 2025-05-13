import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useAuthModal } from '@/hooks/useAuthModal';
import CustomButton from './CustomButton';
import apiService from '@/services/apiService';
import { useAuth } from '@/hooks/use-auth';

// Define Zod schemas for form validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
});

// Define types based on the schemas
type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

type AuthModalProps = {
  navUrl?: string;
};

const AuthModal = ({ navUrl }: AuthModalProps) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const authModal = useAuthModal();
  const { dispatch, actions } = useAuth();

  // Setup React Hook Form for login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
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
    formState: { errors: signupErrors },
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
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      const formData = {
        email: data.email,
        password: data.password,
      };

      const response = await apiService.post('/auth/login/', formData);

      if (response.access_token) {
        dispatch(
          actions.LOGIN(
            response.id,
            response.user_role,
            response.access_token,
            response.refresh_token,
            response.first_name,
            response.last_name,
          ),
        );
        authModal.close();
        if (navUrl) {
          navigate(navUrl);
        }
      } else {
        setServerErrors(response.errors || ['Login failed. Please try again.']);
      }
    } catch (error) {
      setServerErrors(['An unexpected error occurred. Please try again.']);
      console.error('Login error:', error);
    }
  };

  // Handle signup form submission
  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      const formData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      };

      const response = await apiService.post('/auth/register/', formData);

      if (response.access_token) {
        dispatch(
          actions.LOGIN(
            response.id,
            response.user_role,
            response.access_token,
            response.refresh_token,
            response.first_name,
            response.last_name,
          ),
        );
        authModal.close();
        if (navUrl) {
          navigate(navUrl);
        }
      } else {
        setServerErrors(
          response.errors || ['Registration failed. Please try again.'],
        );
      }
    } catch (error) {
      setServerErrors(['An unexpected error occurred. Please try again.']);
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

          <CustomButton label="Sign up" type="submit" />
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

          <CustomButton label="Sign in" type="submit" />
        </form>
      )}
    </>
  );

  return (
    <Modal
      className="bg-white"
      isOpen={authModal.isOpen}
      close={authModal.close}
      content={content}
    />
  );
};

export default AuthModal;

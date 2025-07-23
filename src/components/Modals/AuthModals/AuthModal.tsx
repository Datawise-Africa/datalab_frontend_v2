import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Modal from "./Modal"
import type { RegisterOrLoginResponse } from "@/lib/types/auth"
import { extractCorrectErrorMessage } from "@/lib/error"
import { Button } from "@/components/ui/button"
import { RotateCcw, Eye, EyeOff } from "lucide-react"
import { loginSchema, signupSchema, type LoginFormValues, type SignupFormValues } from "@/lib/schema/auth-schema"
import { useAuthStore } from "@/store/auth-store"
import { useAuthContext } from "@/context/AuthProvider"
import { useAxios } from "@/hooks/use-axios"
import { z } from "zod"

// Additional schemas for new features
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

const resetPasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    otp: z.string().min(6, "OTP must be at least 6 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

type AuthView = "login" | "signup" | "forgot-password" | "reset-password"

const AuthModal = () => {
  const axiosClient = useAxios()
  const [currentView, setCurrentView] = useState<AuthView>("login")
  const [serverErrors, setServerErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const authStore = useAuthStore()
  const { setIsAuthModalOpen, isAuthModalOpen, queue: authQueue } = useAuthContext()

  // Setup React Hook Form for login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLoginForm,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Setup React Hook Form for signup
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
    reset: resetSignupForm,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  })

  // Setup React Hook Form for forgot password
  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors, isSubmitting: isForgotPasswordSubmitting },
    reset: resetForgotPasswordForm,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Setup React Hook Form for reset password
  const {
    register: registerResetPassword,
    handleSubmit: handleResetPasswordSubmit,
    formState: { errors: resetPasswordErrors, isSubmitting: isResetPasswordSubmitting },
    reset: resetResetPasswordForm,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Clear errors and messages when switching views
  const switchView = (view: AuthView) => {
    setCurrentView(view)
    setServerErrors([])
    setSuccessMessage("")
    resetLoginForm()
    resetSignupForm()
    resetForgotPasswordForm()
    resetResetPasswordForm()
  }

  // Handle Google OAuth
  const handleGoogleAuth = async (_isSignUp: boolean) => {
    try {
      // Replace this with your Google OAuth implementation
      // This could redirect to your backend Google OAuth endpoint
      // or use a Google OAuth library

      // Example implementation:
      // window.location.href = `/auth/google?mode=${isSignUp ? 'signup' : 'login'}`;

      // For now, showing a placeholder
      setServerErrors(["Google OAuth integration needed - implement with your backend"])
    } catch (error) {
      setServerErrors([extractCorrectErrorMessage(error)])
    }
  }

  // Handle login form submission
  const onLoginSubmit = async (formData: LoginFormValues) => {
    setServerErrors([])
    try {
      const { data } = await axiosClient.post<RegisterOrLoginResponse>("/auth/login/", formData)

      if (data.access_token) {
        authStore.login({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user_id: data.id,
          user_role: data.user_role,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        })

        await authQueue.processQueue()
        setIsAuthModalOpen(false)
      }
    } catch (error) {
      setServerErrors([extractCorrectErrorMessage(error)])
      console.error("Login error:", error)
    }
  }

  // Handle signup form submission
  const onSignupSubmit = async (data: SignupFormValues) => {
    setServerErrors([])
    try {
      const formData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      }

      const { data: respData } = await axiosClient.post<RegisterOrLoginResponse>("/auth/register/", formData)

      if (respData.access_token) {
        authStore.login({
          access_token: respData.access_token,
          refresh_token: respData.refresh_token,
          user_id: respData.id,
          user_role: respData.user_role,
          first_name: respData.first_name,
          last_name: respData.last_name,
          email: respData.email,
        })

        await authQueue.processQueue()
        setIsAuthModalOpen(false)
      }
    } catch (error) {
      setServerErrors([extractCorrectErrorMessage(error)])
      console.error("Signup error:", error)
    }
  }

  // Handle forgot password submission
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormValues) => {
    setServerErrors([])
    try {
      // Replace with your forgot password API endpoint
      await axiosClient.post("/auth/password-reset/", { email: data.email })

      setSuccessMessage("Password reset OTP has been sent to your email")
      // Switch to reset password view and pre-fill email
      setCurrentView("reset-password")
      resetResetPasswordForm({ email: data.email })
    } catch (error) {
      setServerErrors([extractCorrectErrorMessage(error)])
    }
  }

  // Handle reset password submission
  const onResetPasswordSubmit = async (data: ResetPasswordFormValues) => {
    setServerErrors([])
    try {
      // Replace with your reset password API endpoint
      await axiosClient.patch("/auth/password-reset-complete/", {
        // email: data.email,
        otp_code: data.otp,
        new_password: data.newPassword,
      })

      setSuccessMessage("Password has been reset successfully")
      setTimeout(() => {
        switchView("login")
      }, 2000)
    } catch (error) {
      setServerErrors([extractCorrectErrorMessage(error)])
    }
  }

  const renderLoginView = () => (
    <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-6 bg-white">
      <div className="space-y-2">
        <h5 className="text-xl font-semibold">Hi, Welcome to Datalab</h5>
        <p className="text-gray-600">
          Sign in to your account or{" "}
          <span
            className="cursor-pointer text-[#26A37E] underline hover:underline"
            onClick={() => switchView("signup")}
          >
            create a new account
          </span>
        </p>
      </div>

      {/* Google Login Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-[54px] border-gray-300 bg-transparent disabled:cursor-not-allowed disabled:bg-gray-200"
        onClick={() => handleGoogleAuth(false)}
        disabled
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>

      <div>
        <label htmlFor="login_email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...registerLogin("email")}
          id="login_email"
          placeholder="Your email address"
          type="email"
          className="h-[54px] w-full rounded-xl border border-gray-300 px-4 focus:border-[#26A37E] focus:outline-none"
        />
        {loginErrors.email && <p className="mt-1 text-sm text-red-500">{loginErrors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="login_password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            {...registerLogin("password")}
            id="login_password"
            placeholder="Your password"
            type={showLoginPassword ? "text" : "password"}
            className="h-[54px] w-full rounded-xl border border-gray-300 px-4 pr-12 focus:border-[#26A37E] focus:outline-none"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowLoginPassword(!showLoginPassword)}
          >
            {showLoginPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {loginErrors.password && <p className="mt-1 text-sm text-red-500">{loginErrors.password.message}</p>}
      </div>

      <div className="text-right">
        <span
          className="cursor-pointer text-sm text-[#26A37E] hover:underline"
          onClick={() => switchView("forgot-password")}
        >
          Forgot your password?
        </span>
      </div>

      {serverErrors.length > 0 && (
        <div className="space-y-2">
          {serverErrors.map((error: any, index) => (
            <div key={`error_${index}`} className="rounded-lg bg-red-50 p-3 text-red-700">
              {typeof error === "object" ? error.message || JSON.stringify(error) : error}
            </div>
          ))}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoginSubmitting}
        className="w-full h-[54px] transform cursor-pointer rounded bg-gradient-to-b from-[#115443] to-[#26A37E] px-2 py-3 text-[#E5E7EB] transition duration-200 hover:translate-y-[3px] hover:from-[#072720] hover:to-[#072720] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white"
      >
        {isLoginSubmitting && <RotateCcw className="mr-2 animate-spin" size={16} />}
        {isLoginSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )

  const renderSignupView = () => (
    <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4">
      <div className="space-y-2">
        <h5 className="text-xl font-semibold">Hi, Welcome to Datalab</h5>
        <p className="text-gray-600">
          Create an account or{" "}
          <span className="cursor-pointer text-[#26A37E] underline hover:underline" onClick={() => switchView("login")}>
            login to existing account
          </span>
        </p>
      </div>

      {/* Google Signup Button */}
      <Button
        type="button"
        variant="outline"
        disabled
        className="w-full h-[54px] border-gray-300 bg-transparent disabled:cursor-not-allowed disabled:bg-gray-200"
        onClick={() => handleGoogleAuth(true)}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>

      <div className="pb-4">
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
          First name
        </label>
        <input
          {...registerSignup("first_name")}
          id="first_name"
          placeholder="Your first name"
          type="text"
          className="h-[54px] w-full rounded-xl border border-gray-300 px-4 focus:border-[#26A37E] focus:outline-none"
        />
        {signupErrors.first_name && <p className="mt-1 text-sm text-red-500">{signupErrors.first_name.message}</p>}
      </div>

      <div className="pb-4">
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
          Last name
        </label>
        <input
          {...registerSignup("last_name")}
          id="last_name"
          placeholder="Your last name"
          type="text"
          className="h-[54px] w-full rounded-xl border border-gray-300 px-4 focus:border-[#26A37E] focus:outline-none"
        />
        {signupErrors.last_name && <p className="mt-1 text-sm text-red-500">{signupErrors.last_name.message}</p>}
      </div>

      <div className="pb-4">
        <label htmlFor="signup_email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...registerSignup("email")}
          id="signup_email"
          placeholder="Your email address"
          type="email"
          className="h-[54px] w-full rounded-xl border border-gray-300 px-4 focus:border-[#26A37E] focus:outline-none"
        />
        {signupErrors.email && <p className="mt-1 text-sm text-red-500">{signupErrors.email.message}</p>}
      </div>

      <div className="pb-4">
        <label htmlFor="signup_password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            {...registerSignup("password")}
            id="signup_password"
            placeholder="Your password"
            type={showSignupPassword ? "text" : "password"}
            className="h-[54px] w-full rounded-xl border border-gray-300 px-4 pr-12 focus:border-[#26A37E] focus:outline-none"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowSignupPassword(!showSignupPassword)}
          >
            {showSignupPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {signupErrors.password && <p className="mt-1 text-sm text-red-500">{signupErrors.password.message}</p>}
      </div>

      {serverErrors.length > 0 && (
        <div className="space-y-2">
          {serverErrors.map((error: any, index) => (
            <div key={`error_${index}`} className="rounded-lg bg-red-50 p-3 text-red-700">
              {typeof error === "object" ? error.message || JSON.stringify(error) : error}
            </div>
          ))}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSignupSubmitting}
        className="mb-10 w-full h-[54px] transform cursor-pointer rounded bg-gradient-to-b from-[#115443] to-[#26A37E] px-2 py-3 text-[#E5E7EB] transition duration-200 hover:translate-y-[3px] hover:from-[#072720] hover:to-[#072720] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white"
      >
        {isSignupSubmitting && <RotateCcw className="mr-2 animate-spin" size={16} />}
        {isSignupSubmitting ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  )

  const renderForgotPasswordView = () => (
    <form onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h5 className="text-xl font-semibold">Reset your password</h5>
        <p className="text-gray-600">Enter your email address and we'll send you an OTP to reset your password.</p>
      </div>

      <div>
        <label htmlFor="forgot_email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...registerForgotPassword("email")}
          id="forgot_email"
          placeholder="Your email address"
          type="email"
          className="h-[54px] w-full rounded-xl border border-gray-300 px-4 focus:border-[#26A37E] focus:outline-none"
        />
        {forgotPasswordErrors.email && (
          <p className="mt-1 text-sm text-red-500">{forgotPasswordErrors.email.message}</p>
        )}
      </div>

      {serverErrors.length > 0 && (
        <div className="space-y-2">
          {serverErrors.map((error: any, index) => (
            <div key={`error_${index}`} className="rounded-lg bg-red-50 p-3 text-red-700">
              {typeof error === "object" ? error.message || JSON.stringify(error) : error}
            </div>
          ))}
        </div>
      )}

      {successMessage && <div className="rounded-lg bg-green-50 p-3 text-green-700">{successMessage}</div>}

      <Button
        type="submit"
        disabled={isForgotPasswordSubmitting}
        className="w-full h-[54px] transform cursor-pointer rounded bg-gradient-to-b from-[#115443] to-[#26A37E] px-2 py-3 text-[#E5E7EB] transition duration-200 hover:translate-y-[3px] hover:from-[#072720] hover:to-[#072720] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white"
      >
        {isForgotPasswordSubmitting && <RotateCcw className="mr-2 animate-spin" size={16} />}
        {isForgotPasswordSubmitting ? "Sending OTP..." : "Send OTP"}
      </Button>

      <div className="text-center">
        <span className="cursor-pointer text-sm text-[#26A37E] hover:underline" onClick={() => switchView("login")}>
          Back to login
        </span>
      </div>
    </form>
  )

  const renderResetPasswordView = () => (
    <form onSubmit={handleResetPasswordSubmit(onResetPasswordSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h5 className="text-xl font-semibold">Enter new password</h5>
        <p className="text-gray-600">Enter the OTP sent to your email and your new password.</p>
      </div>

      <div>
        <label htmlFor="reset_email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...registerResetPassword("email")}
          id="reset_email"
          placeholder="Your email address"
          type="email"
          className="h-[54px] w-full rounded-xl border border-gray-300 px-4 focus:border-[#26A37E] focus:outline-none"
        />
        {resetPasswordErrors.email && <p className="mt-1 text-sm text-red-500">{resetPasswordErrors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
          OTP
        </label>
        <input
          {...registerResetPassword("otp")}
          id="otp"
          placeholder="Enter 6-digit OTP"
          type="text"
          maxLength={6}
          className="h-[54px] w-full rounded-xl border border-gray-300 px-4 focus:border-[#26A37E] focus:outline-none"
        />
        {resetPasswordErrors.otp && <p className="mt-1 text-sm text-red-500">{resetPasswordErrors.otp.message}</p>}
      </div>

      <div>
        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            {...registerResetPassword("newPassword")}
            id="new_password"
            placeholder="Enter new password"
            type={showNewPassword ? "text" : "password"}
            className="h-[54px] w-full rounded-xl border border-gray-300 px-4 pr-12 focus:border-[#26A37E] focus:outline-none"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
        {resetPasswordErrors.newPassword && (
          <p className="mt-1 text-sm text-red-500">{resetPasswordErrors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            {...registerResetPassword("confirmPassword")}
            id="confirm_password"
            placeholder="Confirm new password"
            type={showConfirmPassword ? "text" : "password"}
            className="h-[54px] w-full rounded-xl border border-gray-300 px-4 pr-12 focus:border-[#26A37E] focus:outline-none"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {resetPasswordErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{resetPasswordErrors.confirmPassword.message}</p>
        )}
      </div>

      {serverErrors.length > 0 && (
        <div className="space-y-2">
          {serverErrors.map((error: any, index) => (
            <div key={`error_${index}`} className="rounded-lg bg-red-50 p-3 text-red-700">
              {typeof error === "object" ? error.message || JSON.stringify(error) : error}
            </div>
          ))}
        </div>
      )}

      {successMessage && <div className="rounded-lg bg-green-50 p-3 text-green-700">{successMessage}</div>}

      <Button
        type="submit"
        disabled={isResetPasswordSubmitting}
        className="w-full h-[54px] transform cursor-pointer rounded bg-gradient-to-b from-[#115443] to-[#26A37E] px-2 py-3 text-[#E5E7EB] transition duration-200 hover:translate-y-[3px] hover:from-[#072720] hover:to-[#072720] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white"
      >
        {isResetPasswordSubmitting && <RotateCcw className="mr-2 animate-spin" size={16} />}
        {isResetPasswordSubmitting ? "Resetting password..." : "Reset password"}
      </Button>

      <div className="text-center">
        <span className="cursor-pointer text-sm text-[#26A37E] hover:underline" onClick={() => switchView("login")}>
          Back to login
        </span>
      </div>
    </form>
  )

  const renderCurrentView = () => {
    switch (currentView) {
      case "login":
        return renderLoginView()
      case "signup":
        return renderSignupView()
      case "forgot-password":
        return renderForgotPasswordView()
      case "reset-password":
        return renderResetPasswordView()
      default:
        return renderLoginView()
    }
  }

  return <Modal isOpen={isAuthModalOpen} close={() => setIsAuthModalOpen(false)} content={renderCurrentView()} />
}

export default AuthModal

// "use client"

// import React from 'react'
// import { toast, Toaster } from 'sonner'
// import { CheckCircle, XCircle, AlertTriangle, Info, X, Loader2, Heart, Star, Gift, Trophy, Rocket } from 'lucide-react'

// // Types for different toast variants
// export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom'
// export type ToastTheme = 'light' | 'dark' | 'glass' | 'neon' | 'gradient'
// export type ToastAnimation = 'slide' | 'bounce' | 'zoom' | 'flip' | 'glow'
// export type ToastPosition =
//   | 'top-left'
//   | 'top-center'
//   | 'top-right'
//   | 'bottom-left'
//   | 'bottom-center'
//   | 'bottom-right'

// interface CustomToastProps {
//   type: ToastType
//   title?: string
//   message: string
//   theme?: ToastTheme
//   animation?: ToastAnimation
//   icon?: React.ReactNode
//   action?: {
//     label: string
//     onClick: () => void
//   }
//   onDismiss?: () => void
//   autoClose?: boolean
//   progress?: number
// }

// interface ToastConfig {
//   theme?: ToastTheme
//   animation?: ToastAnimation
//   position?: ToastPosition
//   duration?: number
//   autoClose?: boolean
//   showProgress?: boolean
// }

// // Custom Toast Component
// const CustomToast: React.FC<CustomToastProps> = ({
//   type,
//   title,
//   message,
//   theme = 'glass',
//   animation = 'slide',
//   icon,
//   action,
//   progress,
// }) => {
//   const getTypeIcon = () => {
//     if (icon) return icon
//     switch (type) {
//       case 'success':
//         return <CheckCircle className="h-5 w-5 text-emerald-500" />
//       case 'error':
//         return <XCircle className="h-5 w-5 text-red-500" />
//       case 'warning':
//         return <AlertTriangle className="h-5 w-5 text-amber-500" />
//       case 'info':
//         return <Info className="h-5 w-5 text-blue-500" />
//       case 'loading':
//         return <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
//       default:
//         return <Info className="h-5 w-5 text-gray-500" />
//     }
//   }

//   const getThemeClasses = () => {
//     const baseClasses = 'relative overflow-hidden rounded-xl shadow-2xl border backdrop-blur-sm'
//     switch (theme) {
//       case 'light':
//         return `${baseClasses} bg-white/95 border-gray-200 text-gray-800`
//       case 'dark':
//         return `${baseClasses} bg-gray-900/95 border-gray-700 text-white`
//       case 'glass':
//         return `${baseClasses} bg-white/10 border-white/20 text-white backdrop-blur-md`
//       case 'neon':
//         return `${baseClasses} bg-black/90 border-cyan-400/50 text-cyan-100 shadow-cyan-400/25`
//       case 'gradient':
//         return `${baseClasses} bg-gradient-to-r from-purple-500/90 to-pink-500/90 border-purple-300/30 text-white`
//       default:
//         return `${baseClasses} bg-white/10 border-white/20 text-white backdrop-blur-md`
//     }
//   }

//   const getAnimationClasses = () => {
//     switch (animation) {
//       case 'bounce':
//         return 'animate-bounce'
//       case 'zoom':
//         return 'animate-pulse'
//       case 'flip':
//         return 'animate-spin'
//       case 'glow':
//         return 'animate-pulse'
//       default:
//         return ''
//     }
//   }

//   return (
//     <div
//       className={`${getThemeClasses()} ${getAnimationClasses()} transform transition-all duration-300 ease-out max-w-md min-w-[320px] p-4`}
//       style={{
//         background:
//           theme === 'neon'
//             ? 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(255,0,255,0.1) 100%)'
//             : undefined,
//       }}
//     >
//       {/* Progress bar */}
//       {progress !== undefined && (
//         <div
//           className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
//           style={{ width: `${progress}%` }}
//         />
//       )}

//       {/* Neon glow effect */}
//       {theme === 'neon' && (
//         <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 blur-xl" />
//       )}

//       <div className="relative flex items-start gap-3">
//         {/* Icon */}
//         <div className="mt-0.5 flex-shrink-0">{getTypeIcon()}</div>

//         {/* Content */}
//         <div className="min-w-0 flex-1">
//           {title && <h4 className="mb-1 truncate text-sm font-semibold">{title}</h4>}
//           <p className="text-sm leading-relaxed opacity-90">{message}</p>

//           {/* Action button */}
//           {action && (
//             <button
//               onClick={action.onClick}
//               className="mt-3 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:bg-white/30"
//             >
//               {action.label}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Decorative elements for special themes */}
//       {theme === 'gradient' && (
//         <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-white/10 blur-xl" />
//       )}
//     </div>
//   )
// }

// // Special Toast Components
// const SuccessToast: React.FC<{ message: string; title?: string }> = ({ message, title }) => (
//   <div className="transform rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white shadow-2xl transition-all duration-300 ease-out max-w-md min-w-[320px]">
//     <div className="flex items-center gap-3">
//       <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
//         <CheckCircle className="h-5 w-5" />
//       </div>
//       <div className="flex-1">
//         {title && <h4 className="mb-1 text-sm font-semibold">{title}</h4>}
//         <p className="text-sm opacity-95">{message}</p>
//       </div>
//     </div>
//     <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-xl" />
//   </div>
// )

// const LoadingToast: React.FC<{ message: string }> = ({ message }) => (
//   <div className="transform rounded-xl border border-white/20 bg-white/10 p-4 text-white shadow-2xl backdrop-blur-md transition-all duration-300 ease-out max-w-md min-w-[320px]">
//     <div className="flex items-center gap-3">
//       <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
//       <p className="text-sm font-medium">{message}</p>
//     </div>
//     <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
//       <div
//         className="h-full animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
//         style={{ width: '60%' }}
//       />
//     </div>
//   </div>
// )

// // Main Toast Class
// export class FancyToast {
//   private static defaultConfig: ToastConfig = {
//     theme: 'glass',
//     animation: 'slide',
//     position: 'top-right',
//     duration: 4000,
//     autoClose: true,
//     showProgress: false,
//   }

//   private static config: ToastConfig = { ...this.defaultConfig }

//   // Configuration methods
//   static configure(config: Partial<ToastConfig>) {
//     this.config = { ...this.config, ...config }
//   }

//   // Reset to default configuration
//   static resetConfig() {
//     this.config = { ...this.defaultConfig }
//   }

//   // Basic toast methods
//   static success(message: string, options?: Partial<CustomToastProps>) {
//     const { title, theme, animation, action, ...restOptions } = options || {}

//     return toast.custom(
//       () => (
//         <CustomToast
//           type="success"
//           message={message}
//           title={title}
//           theme={theme || this.config.theme}
//           animation={animation || this.config.animation}
//           action={action}
//           {...restOptions}
//         />
//       ),
//       {
//         duration: this.config.duration,
//         position: this.config.position,
//       }
//     )
//   }

//   static error(message: string, options?: Partial<CustomToastProps>) {
//     const { title, theme, animation, action, ...restOptions } = options || {}

//     return toast.custom(
//       () => (
//         <CustomToast
//           type="error"
//           message={message}
//           title={title}
//           theme={theme || this.config.theme}
//           animation={animation || this.config.animation}
//           action={action}
//           {...restOptions}
//         />
//       ),
//       {
//         duration: this.config.duration,
//         position: this.config.position,
//       }
//     )
//   }

//   static warning(message: string, options?: Partial<CustomToastProps>) {
//     const { title, theme, animation, action, ...restOptions } = options || {}

//     return toast.custom(
//       () => (
//         <CustomToast
//           type="warning"
//           message={message}
//           title={title}
//           theme={theme || this.config.theme}
//           animation={animation || this.config.animation}
//           action={action}
//           {...restOptions}
//         />
//       ),
//       {
//         duration: this.config.duration,
//         position: this.config.position,
//       }
//     )
//   }

//   static info(message: string, options?: Partial<CustomToastProps>) {
//     const { title, theme, animation, action, ...restOptions } = options || {}

//     return toast.custom(
//       () => (
//         <CustomToast
//           type="info"
//           message={message}
//           title={title}
//           theme={theme || this.config.theme}
//           animation={animation || this.config.animation}
//           action={action}
//           {...restOptions}
//         />
//       ),
//       {
//         duration: this.config.duration,
//         position: this.config.position,
//       }
//     )
//   }

//   static loading(message: string) {
//     return toast.custom(() => <LoadingToast message={message} />, {
//       duration: Infinity,
//       position: this.config.position,
//     })
//   }

//   // Special themed toasts
//   static successGradient(message: string, title?: string) {
//     return toast.custom(() => <SuccessToast message={message} title={title} />, {
//       duration: this.config.duration,
//       position: this.config.position,
//     })
//   }

//   static neonSuccess(message: string, title?: string) {
//     return this.success(message, {
//       title,
//       theme: 'neon',
//       animation: 'glow',
//     })
//   }

//   static glassError(message: string, title?: string) {
//     return this.error(message, {
//       title,
//       theme: 'glass',
//       animation: 'slide',
//     })
//   }

//   // Fun celebration toasts
//   static celebrate(message: string, options?: { icon?: React.ReactNode }) {
//     const icons = [<Trophy key="trophy" />, <Star key="star" />, <Heart key="heart" />, <Gift key="gift" />, <Rocket key="rocket" />]
//     const randomIcon = icons[Math.floor(Math.random() * icons.length)]

//     return toast.custom(
//       () => (
//         <CustomToast
//           type="custom"
//           message={message}
//           title="🎉 Awesome!"
//           theme="gradient"
//           animation="bounce"
//           icon={options?.icon || randomIcon}
//         />
//       ),
//       {
//         duration: 6000,
//         position: this.config.position,
//       }
//     )
//   }

//   // Promise-based toasts
//   static promise<T>(
//     promise: Promise<T>,
//     messages: {
//       loading: string
//       success: string | ((data: T) => string)
//       error: string | ((error: any) => string)
//     }
//   ) {
//     return toast.promise(promise, {
//       loading: () => <LoadingToast message={messages.loading} />,
//       success: (data) => {
//         const successMessage = typeof messages.success === 'function' ? messages.success(data) : messages.success
//         return <SuccessToast message={successMessage} />
//       },
//       error: (error) => {
//         const errorMessage = typeof messages.error === 'function' ? messages.error(error) : messages.error
//         return (
//           <CustomToast
//             type="error"
//             message={errorMessage}
//             theme="glass"
//             animation="slide"
//           />
//         )
//       },
//     })
//   }

//   // Utility methods
//   static dismiss(toastId?: string | number) {
//     return toast.dismiss(toastId)
//   }

//   static custom(render: () => React.ReactNode, options?: { duration?: number; position?: ToastPosition }) {
//     return toast.custom(render, {
//       position: options?.position || this.config.position,
//       duration: options?.duration || this.config.duration,
//     })
//   }

//   // Sonner's built-in methods with custom styling
//   static message(message: string, options?: { description?: string; action?: { label: string; onClick: () => void } }) {
//     return toast.message(message, {
//       description: options?.description,
//       action: options?.action,
//       className: 'bg-white/10 border-white/20 text-white backdrop-blur-md',
//     })
//   }
// }

// // Enhanced Toaster Component
// export const FancyToaster: React.FC<{
//   position?: ToastPosition
//   theme?: 'light' | 'dark'
//   className?: string
// }> = ({ position = 'top-right', theme = 'dark', className = '' }) => {
//   return (
//     <Toaster
//       position={position}
//       theme={theme}
//       className={className}
//       toastOptions={{
//         className: 'bg-transparent border-none shadow-none p-0',
//         style: {
//           background: 'transparent',
//           border: 'none',
//           boxShadow: 'none',
//           padding: 0,
//         },
//       }}
//       offset={16}
//       gap={12}
//       visibleToasts={5}
//       expand={true}
//       richColors={false}
//     />
//   )
// }

// // Export default toast for convenience
// export { toast }
// export default FancyToast

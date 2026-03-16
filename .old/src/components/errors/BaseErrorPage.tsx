import { motion, easeInOut, easeOut } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link, useRouteError } from 'react-router-dom';

export default function BaseErrorPage() {
  const error = useRouteError() as {
    status: number;
    statusText: string;
    message: string;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      rotate: 15,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: easeInOut,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <motion.div
        className="w-full max-w-2xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating Background Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 h-20 w-20 rounded-full bg-blue-100 opacity-20"
            animate={floatingVariants.floating}
          />
          <motion.div
            className="absolute top-40 right-20 h-16 w-16 rounded-full bg-indigo-100 opacity-20"
            animate={{
              ...floatingVariants.floating,
              transition: { ...floatingVariants.floating.transition, delay: 1 },
            }}
          />
          <motion.div
            className="absolute bottom-32 left-20 h-12 w-12 rounded-full bg-purple-100 opacity-20"
            animate={{
              ...floatingVariants.floating,
              transition: { ...floatingVariants.floating.transition, delay: 2 },
            }}
          />
        </div>

        {/* Error Icon */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={iconVariants}
          whileHover="hover"
          transition={{
            type: 'spring',
            stiffness: 100,
            duration: 0.8,
            ease: easeOut,
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-100 opacity-50 blur-xl" />
            <AlertTriangle
              size={120}
              className="relative z-10 text-red-500 drop-shadow-lg"
            />
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className="mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-8xl font-bold text-transparent">
            {error?.status || '500'}
          </h1>
        </motion.div>

        {/* Error Title */}
        <motion.div variants={itemVariants} className="mb-4">
          <h2 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
            Oops! Something went wrong
          </h2>
        </motion.div>

        {/* Error Description */}
        <motion.div variants={itemVariants} className="mb-8">
          <p className="mx-auto max-w-lg text-lg leading-relaxed text-gray-600">
            {error?.statusText ||
              error?.message ||
              "We're experiencing some technical difficulties. Don't worry, our team has been notified and is working on it."}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/"
              className="inline-flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
            >
              <Home size={20} />
              Go Home
            </Link>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <button
              onClick={() => window.location.reload()}
              className="inline-flex transform items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-700 shadow-lg transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-xl"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
          </motion.div>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          variants={itemVariants}
          className="mt-12 border-t border-gray-200 pt-8"
        >
          <div className="flex flex-col items-center justify-center gap-6 text-sm text-gray-500 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
              System Status: Monitoring
            </div>
            <div className="flex items-center gap-2">
              <span>Need help?</span>
              <a
                href="mailto:support@example.com"
                className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              >
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>

        {/* Back Navigation */}
        <motion.div variants={itemVariants} className="mt-8">
          <motion.button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-gray-500 transition-colors duration-200 hover:text-gray-700"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} />
            Go back to previous page
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

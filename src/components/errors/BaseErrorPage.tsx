import { motion } from 'framer-motion';
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
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 15,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
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
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20"
            animate={floatingVariants.floating}
          />
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 bg-indigo-100 rounded-full opacity-20"
            animate={{
              ...floatingVariants.floating,
              transition: { ...floatingVariants.floating.transition, delay: 1 },
            }}
          />
          <motion.div
            className="absolute bottom-32 left-20 w-12 h-12 bg-purple-100 rounded-full opacity-20"
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
        >
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50" />
            <AlertTriangle
              size={120}
              className="text-red-500 relative z-10 drop-shadow-lg"
            />
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">
            {error?.status || '500'}
          </h1>
        </motion.div>

        {/* Error Title */}
        <motion.div variants={itemVariants} className="mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
        </motion.div>

        {/* Error Description */}
        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
            {error?.statusText ||
              error?.message ||
              "We're experiencing some technical difficulties. Don't worry, our team has been notified and is working on it."}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
          </motion.div>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              System Status: Monitoring
            </div>
            <div className="flex items-center gap-2">
              <span>Need help?</span>
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
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
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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

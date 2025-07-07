import { motion, easeInOut, easeOut } from 'framer-motion';
import { Home, ArrowLeft, Compass, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Error404() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: easeInOut,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const iconVariants = {
    hover: {
      rotate: 360,
      transition: {
        duration: 0.6,
        ease: easeInOut,
      },
    },
  };

  // Floating animation keyframes and transitions
  const floatingKeyframes = {
    y: [-15, 15, -15],
    x: [-5, 5, -5],
    rotate: [-5, 5, -5],
  };
  const floatingTransition = (delay = 0) => ({
    duration: 4,
    repeat: Infinity,
    ease: easeInOut,
    delay,
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 h-32 w-32 rounded-full bg-indigo-100 opacity-30"
          animate={floatingKeyframes}
          transition={floatingTransition()}
        />
        <motion.div
          className="absolute top-40 right-32 h-24 w-24 rounded-full bg-purple-100 opacity-30"
          animate={floatingKeyframes}
          transition={floatingTransition(1)}
        />
        <motion.div
          className="absolute bottom-32 left-32 h-20 w-20 rounded-full bg-blue-100 opacity-30"
          animate={floatingKeyframes}
          transition={floatingTransition(2)}
        />
        <motion.div
          className="absolute right-20 bottom-20 h-16 w-16 rounded-full bg-pink-100 opacity-30"
          animate={floatingKeyframes}
          transition={floatingTransition(0.5)}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number Display */}
        <motion.div
          className="relative mb-8"
          variants={numberVariants}
          transition={{ type: 'spring', stiffness: 100, duration: 1 }}
        >
          <div className="relative inline-block">
            {/* Glowing background effect */}
            <div className="absolute inset-0 scale-110 rounded-3xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-3xl" />

            {/* Main 404 text */}
            <h1 className="relative z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-5xl leading-none font-black text-transparent md:text-[8rem]">
              404
            </h1>

            {/* Floating compass icon */}
            <motion.div
              className="absolute -top-4 -right-4 md:-top-8 md:-right-8"
              animate={floatingKeyframes}
              transition={floatingTransition()}
            >
              <Compass size={48} className="text-indigo-400 opacity-60" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 md:text-4xl">
            Oops! Page Not Found
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
            The page you're looking for seems to have wandered off into the
            digital void. Don't worry though – we'll help you find your way back
            home.
          </p>
        </motion.div>

        {/* Illustration Area */}
        <motion.div
          variants={itemVariants}
          className="mb-10 flex justify-center"
        >
          <div className="relative">
            <motion.div
              className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100"
              whileHover={iconVariants.hover}
            >
              <MapPin size={48} className="text-indigo-600" />
            </motion.div>

            {/* Animated search rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-indigo-300"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: easeInOut,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-300"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: easeInOut,
                delay: 0.5,
              }}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
            >
              <Home size={20} />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-6 py-2 font-semibold text-gray-700 shadow-lg transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-xl"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </motion.div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-sm text-gray-500"
        >
          <p>
            Still can't find what you're looking for?
            <a
              href="mailto:support@example.com"
              className="ml-1 font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}

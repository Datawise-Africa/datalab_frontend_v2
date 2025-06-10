import { motion } from 'framer-motion';
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
        ease: 'easeOut',
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const floatingVariants = {
    floating: {
      y: [-15, 15, -15],
      x: [-5, 5, -5],
      rotate: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
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
        ease: 'easeInOut',
      },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-indigo-100 rounded-full opacity-30"
          animate={floatingVariants.floating}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-100 rounded-full opacity-30"
          animate={{
            ...floatingVariants.floating,
            transition: { ...floatingVariants.floating.transition, delay: 1 },
          }}
        />
        <motion.div
          className="absolute bottom-32 left-32 w-20 h-20 bg-blue-100 rounded-full opacity-30"
          animate={{
            ...floatingVariants.floating,
            transition: { ...floatingVariants.floating.transition, delay: 2 },
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-16 h-16 bg-pink-100 rounded-full opacity-30"
          animate={{
            ...floatingVariants.floating,
            transition: { ...floatingVariants.floating.transition, delay: 0.5 },
          }}
        />
      </div>

      <motion.div
        className="text-center max-w-4xl w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number Display */}
        <motion.div className="mb-8 relative" variants={numberVariants}>
          <div className="relative inline-block">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur-3xl opacity-20 scale-110" />

            {/* Main 404 text */}
            <h1 className="text-5xl md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative z-10 leading-none">
              404
            </h1>

            {/* Floating compass icon */}
            <motion.div
              className="absolute -top-4 -right-4 md:-top-8 md:-right-8"
              animate={floatingVariants.floating}
            >
              <Compass size={48} className="text-indigo-400 opacity-60" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
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
              className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center"
              whileHover={iconVariants.hover}
            >
              <MapPin size={48} className="text-indigo-600" />
            </motion.div>

            {/* Animated search rings */}
            <motion.div
              className="absolute inset-0 border-2 border-indigo-300 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-0 border-2 border-purple-300 rounded-full"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
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
              className="inline-flex items-center gap-3 px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </motion.div>
        </motion.div>

        {/* Search Suggestion */}
        {/* <motion.div
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search size={24} className="text-indigo-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              Looking for something specific?
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {['Dashboard', 'Profile', 'Settings', 'Help Center', 'Contact'].map(
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                >
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors duration-200 hover:scale-105 transform"
                  >
                    {item}
                  </Link>
                </motion.div>
              ),
            )}
          </div>
        </motion.div> */}

        {/* Footer Message */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-sm text-gray-500"
        >
          <p>
            Still can't find what you're looking for?
            <a
              href="mailto:support@example.com"
              className="text-indigo-600 hover:text-indigo-700 font-medium ml-1 hover:underline transition-colors"
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}

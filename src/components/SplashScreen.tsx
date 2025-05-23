import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0  flex items-center justify-center overflow-hidden">
      {/* Background SVG Elements */}

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}

        {/* App Name */}
        <div className="mb-8">
          <div className="text-blue-200 text-lg font-light tracking-wider flex items-center justify-center">
            <img
              src={'/assets/Datawise.svg'}
              alt="Datawise logo"
              loading="lazy"
              width={144}
              height={16}
            />
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          {/* Animated Dots */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>

          <p className="text-primary text-sm mt-3 font-medium">
            {isLoading ? 'Loading your data...' : 'Ready!'}
          </p>
        </div>

        {/* Tagline */}
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black from-10% to-transparent opacity-20"></div>
    </div>
  );
}

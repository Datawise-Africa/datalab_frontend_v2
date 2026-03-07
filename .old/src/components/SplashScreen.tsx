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
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Background SVG Elements */}

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}

        {/* App Name */}
        <div className="mb-8">
          <div className="flex items-center justify-center text-lg font-light tracking-wider text-blue-200">
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
          <div className="mb-4 flex justify-center space-x-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-blue-400"></div>
            <div
              className="h-3 w-3 animate-bounce rounded-full bg-purple-400"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="h-3 w-3 animate-bounce rounded-full bg-indigo-400"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>

          {/* Progress Bar */}
          <div className="bg-opacity-20 mx-auto h-2 w-64 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>

          <p className="text-primary mt-3 text-sm font-medium">
            {isLoading ? 'Loading your data...' : 'Ready!'}
          </p>
        </div>

        {/* Tagline */}
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black from-10% to-transparent opacity-20"></div>
    </div>
  );
}

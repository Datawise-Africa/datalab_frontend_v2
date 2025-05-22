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
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      {/* Background SVG Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Data Nodes */}
        <svg
          className="absolute top-10 left-10 w-20 h-20 text-blue-300 opacity-20 animate-pulse"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle cx="50" cy="20" r="8" />
          <circle cx="20" cy="50" r="6" />
          <circle cx="80" cy="50" r="6" />
          <circle cx="50" cy="80" r="8" />
          <line
            x1="50"
            y1="20"
            x2="20"
            y2="50"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="50"
            y1="20"
            x2="80"
            y2="50"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="20"
            y1="50"
            x2="50"
            y2="80"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="80"
            y1="50"
            x2="50"
            y2="80"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        {/* Chart Lines */}
        <svg
          className="absolute top-20 right-20 w-32 h-24 text-primary opacity-15 animate-bounce"
          viewBox="0 0 120 80"
          fill="none"
        >
          <path
            d="M10 60 L30 40 L50 45 L70 25 L90 30 L110 15"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 70 L30 55 L50 60 L70 45 L90 50 L110 35"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Database Icon */}
        <svg
          className="absolute bottom-20 left-20 w-16 h-16 text-indigo-300 opacity-20 animate-pulse"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <ellipse cx="50" cy="25" rx="35" ry="10" />
          <path
            d="M15 25 v20 c0 5.5 15.7 10 35 10 s35 -4.5 35 -10 v-20"
            fill="currentColor"
          />
          <path
            d="M15 45 v20 c0 5.5 15.7 10 35 10 s35 -4.5 35 -10 v-20"
            fill="currentColor"
          />
          <path
            d="M15 65 v10 c0 5.5 15.7 10 35 10 s35 -4.5 35 -10 v-10"
            fill="currentColor"
          />
        </svg>

        {/* Analytics Bars */}
        <svg
          className="absolute bottom-10 right-10 w-24 h-20 text-blue-300 opacity-15 animate-pulse"
          viewBox="0 0 100 80"
          fill="currentColor"
        >
          <rect x="10" y="60" width="12" height="20" rx="2" />
          <rect x="30" y="40" width="12" height="40" rx="2" />
          <rect x="50" y="30" width="12" height="50" rx="2" />
          <rect x="70" y="50" width="12" height="30" rx="2" />
        </svg>

        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 opacity-30 rounded-full animate-ping"></div>
        <div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-400 opacity-40 rounded-full animate-ping"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-indigo-400 opacity-25 rounded-full animate-ping"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Main Logo Background */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              {/* Data Icon */}
              <svg
                className="w-12 h-12 text-white"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M20 30 Q20 20 30 20 L70 20 Q80 20 80 30 L80 70 Q80 80 70 80 L30 80 Q20 80 20 70 Z" />
                <circle cx="35" cy="40" r="3" fill="rgba(255,255,255,0.8)" />
                <circle cx="50" cy="35" r="3" fill="rgba(255,255,255,0.8)" />
                <circle cx="65" cy="45" r="3" fill="rgba(255,255,255,0.8)" />
                <circle cx="40" cy="60" r="3" fill="rgba(255,255,255,0.8)" />
                <circle cx="60" cy="65" r="3" fill="rgba(255,255,255,0.8)" />
                <path
                  d="M35 40 L50 35 M50 35 L65 45 M35 40 L40 60 M65 45 L60 65 M40 60 L60 65"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>

            {/* Floating Ring */}
            <div
              className="absolute inset-0 w-24 h-24 border-2 border-blue-300 rounded-2xl animate-spin opacity-30"
              style={{ animationDuration: '8s' }}
            ></div>
          </div>
        </div>

        {/* App Name */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-wide">
            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Datawise
            </span>
          </h1>
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
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>

          <p className="text-blue-200 text-sm mt-3 font-medium">
            {isLoading ? 'Loading your data...' : 'Ready!'}
          </p>
        </div>

        {/* Tagline */}
        <div className="text-center">
          <p className="text-blue-100 text-sm opacity-80 max-w-md mx-auto leading-relaxed">
            Transforming data into actionable insights for smarter business
            decisions
          </p>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black from-10% to-transparent opacity-20"></div>
    </div>
  );
}

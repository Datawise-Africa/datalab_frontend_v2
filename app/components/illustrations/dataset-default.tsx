import { cn } from '~/lib/utils';

interface DatasetDefaultIllustrationProps {
  className?: string;
}

/**
 * Decorative fallback artwork for dataset cards / detail pages when a
 * creator hasn't uploaded a cover image. Themable via `currentColor` —
 * pass a Tailwind text color class (e.g. `text-primary`) to tint it.
 */
export function DatasetDefaultIllustration({
  className,
}: Readonly<DatasetDefaultIllustrationProps>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 450"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={cn('h-full w-full text-primary', className)}
    >
      <defs>
        <linearGradient id="dataset-default-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.16" />
        </linearGradient>
        <pattern
          id="dataset-default-grid"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="800" height="450" fill="url(#dataset-default-bg)" />
      <rect width="800" height="450" fill="url(#dataset-default-grid)" />

      <circle cx="660" cy="90" r="60" fill="currentColor" fillOpacity="0.08" />
      <circle cx="120" cy="380" r="40" fill="currentColor" fillOpacity="0.1" />

      <g transform="translate(220 110)">
        <rect
          width="360"
          height="230"
          rx="12"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1.5"
        />

        <rect
          x="0"
          y="0"
          width="360"
          height="44"
          rx="12"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <rect
          x="0"
          y="32"
          width="360"
          height="12"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <circle cx="22" cy="22" r="5" fill="currentColor" fillOpacity="0.45" />
        <circle cx="40" cy="22" r="5" fill="currentColor" fillOpacity="0.3" />
        <circle cx="58" cy="22" r="5" fill="currentColor" fillOpacity="0.3" />

        <g transform="translate(28 70)" fill="currentColor">
          <rect width="60" height="8" rx="2" fillOpacity="0.35" />
          <rect x="80" width="80" height="8" rx="2" fillOpacity="0.35" />
          <rect x="180" width="50" height="8" rx="2" fillOpacity="0.35" />
          <rect x="250" width="70" height="8" rx="2" fillOpacity="0.35" />

          <rect y="28" width="60" height="8" rx="2" fillOpacity="0.18" />
          <rect x="80" y="28" width="80" height="8" rx="2" fillOpacity="0.18" />
          <rect
            x="180"
            y="28"
            width="50"
            height="8"
            rx="2"
            fillOpacity="0.18"
          />
          <rect
            x="250"
            y="28"
            width="70"
            height="8"
            rx="2"
            fillOpacity="0.18"
          />

          <rect y="56" width="60" height="8" rx="2" fillOpacity="0.18" />
          <rect x="80" y="56" width="80" height="8" rx="2" fillOpacity="0.18" />
          <rect
            x="180"
            y="56"
            width="50"
            height="8"
            rx="2"
            fillOpacity="0.18"
          />
          <rect
            x="250"
            y="56"
            width="70"
            height="8"
            rx="2"
            fillOpacity="0.18"
          />
        </g>

        <g transform="translate(28 162)">
          <rect
            x="0"
            y="30"
            width="22"
            height="32"
            rx="3"
            fill="currentColor"
            fillOpacity="0.55"
          />
          <rect
            x="32"
            y="14"
            width="22"
            height="48"
            rx="3"
            fill="currentColor"
            fillOpacity="0.7"
          />
          <rect
            x="64"
            y="0"
            width="22"
            height="62"
            rx="3"
            fill="currentColor"
          />
          <rect
            x="96"
            y="22"
            width="22"
            height="40"
            rx="3"
            fill="currentColor"
            fillOpacity="0.55"
          />
          <rect
            x="128"
            y="8"
            width="22"
            height="54"
            rx="3"
            fill="currentColor"
            fillOpacity="0.85"
          />

          <path
            d="M 170 50 L 200 30 L 230 38 L 260 18 L 304 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
          />
          <circle cx="170" cy="50" r="3.5" fill="currentColor" />
          <circle cx="200" cy="30" r="3.5" fill="currentColor" />
          <circle cx="230" cy="38" r="3.5" fill="currentColor" />
          <circle cx="260" cy="18" r="3.5" fill="currentColor" />
          <circle cx="304" cy="8" r="3.5" fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}

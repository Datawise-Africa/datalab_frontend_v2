import { cn } from '~/lib/utils';

interface ReportDefaultIllustrationProps {
  className?: string;
}

/**
 * Decorative fallback artwork for report cards / detail pages when an author
 * hasn't uploaded a cover image. Themable via `currentColor` — pass a Tailwind
 * text color class (e.g. `text-primary`) to tint it.
 *
 * Sibling of `DatasetDefaultIllustration`; same visual language (gradient wash,
 * patterned ground, `currentColor` at layered opacities) with a document motif
 * rather than a table.
 */
export function ReportDefaultIllustration({
  className,
}: Readonly<ReportDefaultIllustrationProps>) {
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
        <linearGradient id="report-default-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.16" />
        </linearGradient>
        <pattern
          id="report-default-dots"
          x="0"
          y="0"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="4"
            cy="4"
            r="1.5"
            fill="currentColor"
            fillOpacity="0.12"
          />
        </pattern>
      </defs>

      <rect width="800" height="450" fill="url(#report-default-bg)" />
      <rect width="800" height="450" fill="url(#report-default-dots)" />

      <circle cx="120" cy="70" r="52" fill="currentColor" fillOpacity="0.08" />
      <circle cx="700" cy="390" r="44" fill="currentColor" fillOpacity="0.1" />

      {/* Back sheet — offset and tilted for depth */}
      <g transform="translate(300 92) rotate(-6 115 145)">
        <rect
          width="230"
          height="290"
          rx="12"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="1.5"
        />
      </g>

      {/* Front sheet — folded top-right corner */}
      <g transform="translate(285 80)">
        <path
          d="M 12 0 L 190 0 L 230 40 L 230 278 Q 230 290 218 290 L 12 290 Q 0 290 0 278 L 0 12 Q 0 0 12 0 Z"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
        <path
          d="M 190 0 L 230 40 L 202 40 Q 190 40 190 28 Z"
          fill="currentColor"
          fillOpacity="0.22"
        />

        {/* Title block */}
        <g transform="translate(28 44)" fill="currentColor">
          <rect width="118" height="11" rx="3" fillOpacity="0.4" />
          <rect y="21" width="86" height="11" rx="3" fillOpacity="0.4" />
        </g>
        <rect
          x="28"
          y="92"
          width="174"
          height="1.5"
          fill="currentColor"
          fillOpacity="0.18"
        />

        {/* Abstract lines */}
        <g transform="translate(28 106)" fill="currentColor">
          <rect width="174" height="7" rx="2" fillOpacity="0.18" />
          <rect y="16" width="174" height="7" rx="2" fillOpacity="0.18" />
          <rect y="32" width="120" height="7" rx="2" fillOpacity="0.18" />
        </g>

        {/* Findings — bar chart */}
        <g transform="translate(28 170)" fill="currentColor">
          <rect y="46" width="18" height="34" rx="3" fillOpacity="0.5" />
          <rect x="30" y="28" width="18" height="52" rx="3" fillOpacity="0.7" />
          <rect x="60" y="10" width="18" height="70" rx="3" />
          <rect x="90" y="36" width="18" height="44" rx="3" fillOpacity="0.5" />
          <rect
            x="120"
            y="18"
            width="18"
            height="62"
            rx="3"
            fillOpacity="0.85"
          />
          <rect x="150" y="0" width="18" height="80" rx="3" fillOpacity="0.6" />
        </g>
        <rect
          x="28"
          y="252"
          width="174"
          height="1.5"
          fill="currentColor"
          fillOpacity="0.2"
        />

        {/* Byline */}
        <g transform="translate(28 266)" fill="currentColor">
          <circle cx="7" cy="7" r="7" fillOpacity="0.3" />
          <rect x="22" y="3" width="72" height="8" rx="2" fillOpacity="0.22" />
        </g>
      </g>

      {/* Floating stat card — donut breakdown */}
      <g transform="translate(560 132)">
        <rect
          width="170"
          height="126"
          rx="14"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1.5"
        />
        <g
          transform="translate(58 63) rotate(-90)"
          fill="none"
          strokeWidth="14"
        >
          <circle
            r="34"
            stroke="currentColor"
            strokeOpacity="0.9"
            strokeDasharray="96 118"
          />
          <circle
            r="34"
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeDasharray="60 154"
            strokeDashoffset="-96"
          />
          <circle
            r="34"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeDasharray="56 158"
            strokeDashoffset="-156"
          />
        </g>
        <g transform="translate(104 40)" fill="currentColor">
          <rect width="44" height="7" rx="2" fillOpacity="0.45" />
          <rect y="18" width="34" height="7" rx="2" fillOpacity="0.28" />
          <rect y="36" width="40" height="7" rx="2" fillOpacity="0.18" />
        </g>
      </g>

      {/* Floating trend chip */}
      <g transform="translate(70 268)">
        <rect
          width="168"
          height="96"
          rx="14"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="1.5"
        />
        <path
          d="M 24 66 L 56 44 L 88 52 L 120 26 L 144 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.9"
        />
        <circle cx="24" cy="66" r="3.5" fill="currentColor" />
        <circle cx="56" cy="44" r="3.5" fill="currentColor" />
        <circle cx="88" cy="52" r="3.5" fill="currentColor" />
        <circle cx="120" cy="26" r="3.5" fill="currentColor" />
        <circle cx="144" cy="18" r="3.5" fill="currentColor" />
      </g>
    </svg>
  );
}

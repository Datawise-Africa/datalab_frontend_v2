import type { SVGProps } from 'react';

export function LineMdDocumentReport(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path
          strokeDasharray={64}
          strokeDashoffset={64}
          d="M13 3l6 6v12h-14v-18h8"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.6s"
            values="64;0"
          ></animate>
        </path>
        <path
          strokeDasharray={14}
          strokeDashoffset={14}
          strokeWidth={1}
          d="M12.5 3v5.5h6.5"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.7s"
            dur="0.2s"
            values="14;0"
          ></animate>
        </path>
        <path strokeDasharray={4} strokeDashoffset={4} d="M9 17v-3">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.9s"
            dur="0.2s"
            values="4;0"
          ></animate>
        </path>
        <path strokeDasharray={6} strokeDashoffset={6} d="M12 17v-4">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="1.1s"
            dur="0.2s"
            values="6;0"
          ></animate>
        </path>
        <path strokeDasharray={6} strokeDashoffset={6} d="M15 17v-5">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="1.3s"
            dur="0.2s"
            values="6;0"
          ></animate>
        </path>
      </g>
    </svg>
  );
}

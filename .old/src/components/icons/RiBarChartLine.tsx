import type { SVGProps } from 'react';

export function RiBarChartLine(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 12h2v9H3zm16-4h2v13h-2zm-8-6h2v19h-2z"
      ></path>
    </svg>
  );
}

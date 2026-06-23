import { cn } from '~/lib/utils';

type LogoProps = Readonly<{
  className?: string;
  /** `wordmark` shows the full icon + "datalab" lockup; `icon` shows just the mark. */
  variant?: 'wordmark' | 'icon';
}>;

const SOURCES = {
  wordmark: {
    light: '/brand/datalab-wordmark-light.svg',
    dark: '/brand/datalab-wordmark-dark.svg',
  },
  icon: {
    light: '/brand/datalab-icon.svg',
    dark: '/brand/datalab-icon-white.svg',
  },
} as const;

/**
 * Datalab brand lockup. Renders both the light- and dark-theme artwork and
 * swaps them with the `dark:` variant so it stays correct after hydration with
 * no flash. Pass a height via `className` (e.g. `h-8 w-auto`).
 */
export function Logo({ className, variant = 'wordmark' }: LogoProps) {
  const src = SOURCES[variant];
  return (
    <>
      <img
        src={src.light}
        alt="Datalab"
        className={cn('block w-auto dark:hidden', className)}
      />
      <img
        src={src.dark}
        alt="Datalab"
        className={cn('hidden w-auto dark:block', className)}
      />
    </>
  );
}

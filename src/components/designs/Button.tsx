import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ className = '', children = 'Button', ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'cursor-pointer rounded bg-gradient-to-b from-[#115443] to-[#26A37E] px-2 py-2 text-[#fcfcfc]',

        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;

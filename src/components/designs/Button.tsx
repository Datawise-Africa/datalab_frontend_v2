import { cn } from '../../lib/utils/cn';

function Button({ className = '', children = 'Button', ...rest }) {
  return (
    <button
      className={cn(
        'bg-gradient-to-b from-[#115443] to-[#26A37E] text-[#fcfcfc] cursor-pointer px-2 py-2 rounded',

        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;

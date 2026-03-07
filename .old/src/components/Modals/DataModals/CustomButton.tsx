// import PropTypes from 'prop-types';

type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const CustomButton = ({
  disabled,
  label,
  className,
  onClick,
}: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#ddeeff] px-2 py-3 text-[#0E0C15] hover:bg-[#FFC876] ${className} disabled:bg-gray-400 disabled:text-white`}
    >
      {label}
    </button>
  );
};

export default CustomButton;

// import PropTypes from 'prop-types';
import type React from 'react';

type CustomButtonProps = {
  label: string;
}&React.ButtonHTMLAttributes<HTMLButtonElement>;

const CustomButton = ({ disabled, label, className, onClick }: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center w-full bg-[#ddeeff] text-[#0E0C15] rounded-xl px-2 py-3 cursor-pointer hover:bg-[#FFC876] ${className} disabled:bg-gray-400 disabled:text-white`}
    >
      {label}
    </button>
  );
};

// CustomButton.propTypes = {
//   disabled: PropTypes.bool,
//   label: PropTypes.string.isRequired,
//   className: PropTypes.string,
//   onClick: PropTypes.func.isRequired,
// };

export default CustomButton;

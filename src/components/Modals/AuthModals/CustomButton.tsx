// import PropTypes from 'prop-types';

import type React from 'react';

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
      className={`flex items-center justify-center w-full bg-gradient-to-b from-[#115443] to-[#26A37E] text-[#E5E7EB] rounded px-2 py-3 mb-10 cursor-pointer hover:from-[#072720] hover:to-[#072720] transition transform duration-200 hover:translate-y-[3px] ${className} disabled:bg-gray-400 disabled:text-white`}
    >
      {label}
    </button>
  );
};

export default CustomButton;

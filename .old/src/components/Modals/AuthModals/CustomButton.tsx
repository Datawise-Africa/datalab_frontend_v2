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
      className={`mb-10 flex w-full transform cursor-pointer items-center justify-center rounded bg-gradient-to-b from-[#115443] to-[#26A37E] px-2 py-3 text-[#E5E7EB] transition duration-200 hover:translate-y-[3px] hover:from-[#072720] hover:to-[#072720] ${className} disabled:bg-gray-400 disabled:text-white`}
    >
      {label}
    </button>
  );
};

export default CustomButton;

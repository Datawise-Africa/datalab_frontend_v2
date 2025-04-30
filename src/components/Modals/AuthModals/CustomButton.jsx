import PropTypes from 'prop-types';

const CustomButton = ({ disabled, label, className, onClick}) => {
    return (
        <button
           
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center w-full bg-[#474060] text-[#E5E7EB] rounded-xl px-2 py-3 cursor-pointer hover:bg-[#1B1B2E] ${className} disabled:bg-gray-400 disabled:text-white`}
        >
            {label}
           
        </button>
    )
}

CustomButton.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired
}

export default CustomButton;
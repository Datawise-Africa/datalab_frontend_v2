import { useCallback, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';

type ModalProps = {
  content: React.ReactNode;
  isOpen: boolean;
  close: () => void;
  className?: string;
};
const Modal = ({ content, isOpen, close }: ModalProps) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);

    setTimeout(() => {
      close();
    }, 300);
  }, [close]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex items-center justify-center fixed inset-0 z-50 bg-[rgba(48,53,61,0.5)]">
      <div className="relative w-[90%] md:w-[80%] lg:w-[700px] my-6 mx-auto h-auto">
        <div
          className={`translate duration-600 h-full ${
            showModal
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-10'
          }`}
        >
          <div className="w-full h-auto rounded-xl relative flex flex-col bg-white">
            <header className="h-[60px] flex p-6 rounded-t justify-between relative">
              <div className="flex items-center space-x-1">
                <img src={ '/assets/datalab-logo-dark.svg'} alt="Datalab Logo" className="w-6 h-8" />
                <h2 className="h4 text-n-14">Datalab</h2>
              </div>
              <div
                onClick={handleClose}
                className="absolute right-3 hover:bg-n-2 rounded-full cursor-pointer"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </header>

            <section className="p-6">{content}</section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal.propTypes = {
//   content: PropTypes.node.isRequired,
//   isOpen: PropTypes.bool.isRequired,
//   close: PropTypes.func.isRequired,
// };

export default Modal;

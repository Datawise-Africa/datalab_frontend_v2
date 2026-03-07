import { useCallback, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';

type ModalProps = {
  content: React.ReactNode;
  isOpen: boolean;
  close: () => void;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(48,53,61,0.5)]">
      <div className="relative mx-auto my-6 h-auto w-[90%] md:w-[80%] lg:w-[700px]">
        <div
          className={`translate h-full duration-600 ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-10'}`}
        >
          {/* Apply max height and scroll */}
          <div className="relative flex max-h-[80vh] w-full flex-col overflow-y-auto rounded-xl bg-white">
            <header className="relative flex justify-between rounded-t p-2">
              <div
                onClick={handleClose}
                className="hover:bg-n-2 absolute right-3 cursor-pointer rounded-full pt-0"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </header>

            {/* Scrollable content area */}
            <section className="overflow-y-auto p-4">{content}</section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

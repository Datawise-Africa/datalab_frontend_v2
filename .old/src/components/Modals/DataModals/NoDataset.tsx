import { useState, useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';

type NoDatasetProps = {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
};

const NoDataset = ({ isOpen, onClose, message }: NoDatasetProps) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);

    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#E5E7EB]/90">
      <div className="relative mx-auto my-6 h-auto w-[90%] md:w-[80%] lg:w-[700px]">
        <div
          className={`translate h-full duration-600 ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-10'}`}
        >
          <div className="relative flex h-auto w-full flex-col rounded-xl bg-gray-900 shadow-lg">
            <header className="relative flex h-[60px] justify-between rounded-t p-6">
              <h2 className="text-xl font-semibold text-white">
                No dataset found
              </h2>
              <div
                onClick={handleClose}
                className="absolute right-3 cursor-pointer rounded-full p-1 hover:bg-gray-200"
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

            <section className="p-6 text-center">
              <p className="text-lg text-gray-700">{message}</p>
            </section>

            <footer className="flex justify-center p-4">
              <button
                onClick={handleClose}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition hover:bg-blue-700"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoDataset;

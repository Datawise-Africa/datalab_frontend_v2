import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const NoDataset = ({ isOpen, onClose, message }) => {
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
    <div className="flex items-center justify-center fixed inset-0 z-50 bg-[#E5E7EB]/90">
      <div className="relative w-[90%] md:w-[80%] lg:w-[700px] my-6 mx-auto h-auto">
        <div className={`translate duration-600 h-full ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-10'}`}>
          <div className="w-full h-auto rounded-xl relative flex flex-col bg-gray-900 shadow-lg">
            <header className="h-[60px] flex p-6 rounded-t justify-between relative border-b border-gray-200">
              <h2 className="text-xl font-semibold text-white">No dataset found</h2>
              <div onClick={handleClose} className="absolute right-3 hover:bg-gray-200 rounded-full cursor-pointer p-1">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </header>

            <section className="p-6 text-center">
              <p className="text-gray-700 text-lg">{message}</p>
            </section>

            <footer className="p-4 flex justify-center border-t border-gray-200">
              <button onClick={handleClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                Close
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

NoDataset.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string,
}

export default NoDataset;

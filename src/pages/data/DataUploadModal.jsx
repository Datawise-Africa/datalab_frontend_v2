// src/components/DataUploadModal.jsx
import React, { useState } from "react";

export default function DataUploadModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const nextStep = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      onClose();
      setStep(1); // Reset steps when closed
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            {/* Form elements */}
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded" onClick={nextStep}>
              Continue
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dataset Files</h2>
            {/* File Upload UI */}
            <div className="flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-green-600 text-white rounded">Continue</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Attribution & Citation</h2>
            {/* Attribution form */}
            <div className="flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-green-600 text-white rounded">Continue</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Discovery Information</h2>
            {/* Keywords/tags */}
            <div className="flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-green-600 text-white rounded">Continue</button>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review & Finalize</h2>
            {/* Review checklist */}
            <div className="flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Previous</button>
              <button onClick={nextStep} className="px-4 py-2 bg-green-600 text-white rounded">Publish Dataset</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  );
}

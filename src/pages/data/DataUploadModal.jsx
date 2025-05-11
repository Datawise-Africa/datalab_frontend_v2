// src/components/DataUploadModal.jsx
import React, { useState } from 'react';

const DataUploadModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [authors, setAuthors] = useState([{ id: Date.now() }]);
  const [doi, setDoi] = useState('');

  const addAuthor = () => {
    setAuthors([...authors, { id: Date.now() }]);
  };

  const removeAuthor = (id) => {
    setAuthors(authors.filter((author) => author.id !== id));
  };

  if (!isOpen) return null;

  const nextStep = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      onClose();
      setStep(1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    onClose();
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            {/* Step Indicators */}
            <div className="flex justify-between mb-6">
              {['Basic Info', 'Files', 'Attribution', 'Discovery', 'Terms'].map(
                (label, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center ${
                      idx === 0 ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full border  border-[#E5E7EB] ${
                        idx === 0
                          ? 'bg-blue-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-xs mt-1">{label}</span>
                  </div>
                )
              )}
            </div>

            <form className="space-y-5">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <p className="text-sm text-gray-600">
                Provide essential information about your dataset.
              </p>

              {/* Dataset Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Dataset Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="E.g., Global Climate Data 2000–2020"
                  maxLength={100}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value="">Select a category</option>
                  <option>Climate & Environment</option>
                  <option>Economic & Financial</option>
                  <option>Social & Demographic</option>
                  <option>Healthcare & Medical</option>
                  <option>Geospatial</option>
                  <option>Transportation</option>
                  <option>Other (specify)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <textarea
                  placeholder="Provide a brief overview of your dataset, its contents, and potential use cases"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Include information about data collection methods, time
                  period, and key variables
                </p>
              </div>

              {/* Premium Dataset Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Premium Dataset</label>
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={() => setIsPremium(!isPremium)}
                  className="toggle toggle-primary"
                />
              </div>

              {/* Price Field */}
              {isPremium && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="0"
                  />
                </div>
              )}

              {/* Private Dataset Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Private Dataset</label>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                  className="toggle toggle-primary"
                />
              </div>

              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                onClick={nextStep}
              >
                Continue
              </button>
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dataset Files</h2>

            {/* Data Files Upload */}
            <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a1 1 0 001 1h14a1 1 0 001-1v-1M12 12v8m0-8l-3 3m3-3l3 3m6-9a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">
                Upload Your Dataset Files
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Click to upload or drag and drop
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
                {['ZIP', 'CSV', 'JSON', 'MP3', 'PNG,JPG,GIF', 'TXT'].map(
                  (type) => (
                    <span
                      key={type}
                      className="px-2 py-1 border rounded bg-gray-100"
                    >
                      {type}
                    </span>
                  )
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Maximum file size: 100MB
              </p>
            </div>

            {/* Metadata File Upload */}
            <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a1 1 0 001 1h14a1 1 0 001-1v-1M12 12v8m0-8l-3 3m3-3l3 3m6-9a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">
                Upload Your Metadata File
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Recommended for better discoverability
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
                {['XLS', 'JSON', 'YAML', 'YML', 'TXT'].map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 border rounded bg-gray-100"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Datasheet File Upload */}
            <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a1 1 0 001 1h14a1 1 0 001-1v-1M12 12v8m0-8l-3 3m3-3l3 3m6-9a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">
                Upload Your Datasheet Documentation
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Documentation describing your dataset (optional)
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
                {['PDF', 'DOCX', 'DOC', 'TXT'].map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 border rounded bg-gray-100"
                  >
                    {type}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Maximum file size: 20MB
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Attribution & Citation
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Add authors and choose an appropriate license.
            </p>

            <div className="border border-[#E5E7EB] p-4 rounded-md mb-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <label className="font-semibold text-gray-700">
                  Dataset Authors <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={addAuthor}
                  className="text-md text-[#136954] font-semibold hover:underline"
                >
                  + Add Author
                </button>
              </div>

              {authors.map((author, index) => (
                <div
                  key={author.id}
                  className="border border-[#E5E7EB] rounded-md p-4 mb-4 bg-gray-50 relative"
                >
                  <p className="font-medium mb-4 text-gray-800">
                    Author {index + 1}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <select className="w-full mt-1 border border-[#E5E7EB] rounded p-2">
                        <option value="">Select title</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="First name"
                        className="w-full mt-1 border border-[#E5E7EB] rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Last name"
                        className="w-full mt-1 border border-[#E5E7EB] rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full mt-1 border border-[#E5E7EB] rounded p-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">
                        Affiliation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="University, organization, or company"
                        className="w-full mt-1 border border-[#E5E7EB] rounded p-2"
                      />
                    </div>
                  </div>

                  {authors.length > 1 && (
                    <button
                      onClick={() => removeAuthor(author.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* DOI Citation */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-1">
                DOI Citation
              </label>
              <input
                type="text"
                placeholder="e.g., https://doi.org/10.1000/xyz123"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Add a DOI if your dataset has already been published
                elsewhere
              </p>
            </div>

            <div className="space-y-6">
              <label className="text-md font-semibold">
                License <span className="text-red-500">*</span>
              </label>

              {/* Creative Commons Attribution 4.0 */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="license"
                      id="cc-by-4.0"
                      className="mr-2"
                    />
                    <label htmlFor="cc-by-4.0" className="font-semibold">
                      Creative Commons Attribution 4.0
                    </label>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Users must give credit, but can otherwise use freely
                </p>
                <div className="flex space-x-2 mb-4">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Commercial Use
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Modification Allowed
                  </span>
                  <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-sky-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Attribution Required
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  This license allows reusers to distribute, remix, adapt, and
                  build upon the material in any medium or format, so long as
                  attribution is given to the creator. The license allows for
                  commercial use.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <div className="font-semibold mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline mr-1 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Advantages
                    </div>
                    <ul className="list-disc pl-5">
                      <li>Maximizes distribution & use</li>
                      <li>Widely recognized standard</li>
                      <li>Easy for users to understand</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline mr-1 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Considerations
                    </div>
                    <ul className="list-disc pl-5">
                      <li>Cannot restrict commercial use</li>
                      <li>Cannot control modifications</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CC0 1.0 Universal (Public Domain) */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="license"
                      id="cc0-1.0"
                      className="mr-2"
                    />
                    <label htmlFor="cc0-1.0" className="font-semibold">
                      CC0 1.0 Universal (Public Domain)
                    </label>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  No restrictions, public domain dedication
                </p>
                <div className="flex space-x-2 mb-4">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    No Restrictions
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    No Attribution Required
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  The person who associated a work with this deed has dedicated
                  the work to the public domain by waiving all of their rights
                  to the work worldwide under copyright law, including all
                  related and neighboring rights, to the extent allowed by law.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <div className="font-semibold mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline mr-1 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Advantages
                    </div>
                    <ul className="list-disc pl-5">
                      <li>Maximum freedom for users</li>
                      <li>Simplest license to understand</li>
                      <li>Ideal for public datasets</li>
                      <li>Best for data integration projects</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline mr-1 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Considerations
                    </div>
                    <ul className="list-disc pl-5">
                      <li>No attribution requirement</li>
                      <li>No control over usage</li>
                      <li>Cannot track dataset impact easily</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* MIT License */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="license"
                      id="mit"
                      className="mr-2"
                    />
                    <label htmlFor="mit" className="font-semibold">
                      MIT License
                    </label>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  A permissive license with minimal restrictions
                </p>
                <div className="flex space-x-2 mb-4">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Commercial Use
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Modification Allowed
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Private Use
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  A short and simple permissive license with conditions only
                  requiring preservation of copyright and license notices.
                  Licensed works, modifications, and larger works may be
                  distributed under different terms and without source code.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <div className="font-semibold mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline mr-1 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Advantages
                    </div>
                    <ul className="list-disc pl-5">
                      <li>Very permissive and flexible</li>
                      <li>Widely used and understood</li>
                      <li>Compatible with many other licenses</li>
                      <li>
                        Encourages use in both open and closed source projects
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 inline mr-1 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Considerations
                    </div>
                    <ul className="list-disc pl-5">
                      <li>Limited protection for the author</li>
                      <li>Does not require sharing modifications</li>
                      <li>May be too permissive for some purposes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white rounded-md p-6 shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Discovery Information
                </h2>
                <p className="text-sm text-gray-500">
                  Make your dataset discoverable with keywords and regions.
                </p>
              </div>
              <button className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md py-2 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h6a3 3 0 003-3v-1m3-4h-6m-2-2h6m-2-2H6m-2-2h6"
                  />
                </svg>
                Save Draft
              </button>
            </div>

            {/* Keywords */}
            <div className="mb-4">
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-700"
              >
                Keywords <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="keywords"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Add keywords..."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Tip: Use specific, relevant terms that researchers would search
                for
              </p>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                Tags <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 ">
                <input
                  type="text"
                  id="tags"
                  className="shadow-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="Add tags..."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                These help categorize your dataset (e.g., 'verified',
                'high-resolution')
              </p>
            </div>

            {/* Dataset Region (Origin) */}
            <div className="mb-6">
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700"
              >
                Dataset Region (Origin) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <select
                  id="region"
                  className="shadow-sm focus:ring-[#26A37E] focus:border-[#26A37E] block w-full sm:text-md border border-gray-300 rounded-md appearance-none p-2"
                >
                  <option>Select region of origin</option>
                  <option value="Africa">Africa</option>
                  <option value="Asia" selected>
                    Asia
                  </option>
                  <option value="Europe">Europe</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="mb-6 mt-4 border border-gray-300 p-4 rounded-md shadow-sm">
                <label className="block text-sm font-medium text-gray-700">
                  Intended Audience <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="audience-academic"
                      type="checkbox"
                      className="focus:ring-[#26A37E] h-4 w-4 text-[#26A37E] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="audience-academic"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Students & Academic
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="audience-nonprofit"
                      type="checkbox"
                      className="focus:ring-[#26A37E] h-4 w-4 text-[#26A37E] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="audience-nonprofit"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Non-Profit Organizations
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="audience-commercial"
                      type="checkbox"
                      className="focus:ring-[#26A37E] h-4 w-4 text-[#26A37E] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="audience-commercial"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Commercial/Business
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="audience-public"
                      type="checkbox"
                      className="focus:ring-[#26A37E] h-4 w-4 text-[#26A37E] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="audience-public"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Public Sector
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Selecting this will include all audiences
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review & Finalize</h2>
            {/* Review checklist */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Publish Dataset
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(48,53,61,0.5)]">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-4xl"
        >
          &times;
        </button>

        {renderStep()}
      </div>
    </div>
  );
};

export default DataUploadModal;

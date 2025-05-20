import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/Modals/DataModals/Modal';
import useDownloadDataModal from '../../hooks/useDownloadDataModal';
import CustomButton from '../../components/Modals/DataModals/CustomButton';
import { getAccessToken } from '../../lib/auth/actions';
import { REACT_PUBLIC_API_HOST } from '../../constants';
import { Toaster, toast } from 'react-hot-toast';

import {
  FaUserGraduate,
  FaUsers,
  FaHandsHelping,
  FaCheck,
  FaBuilding,
  FaTimes,
} from 'react-icons/fa';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import non_profit_icon from '/assets/datalab/non-profit-icon-dark.svg';
import company_icon from '/assets/datalab/company-icon-dark.svg';
import student_icon from '/assets/datalab/student-icon-dark.svg';
import public_icon from '/assets/datalab/public2-icon-dark.svg';

const DownloadDataModal = ({ dataset }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const downloadDataModal = useDownloadDataModal();
  const [agreed, setAgreed] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [downloading] = useState(false);

  const [selectedCard, setSelectedCard] = useState('');
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  // const [emailVerified, setEmailVerified] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    intended_use: '',
    project_description: false,
  });

  const [formData, setFormData] = useState({
    dataset: dataset.id,
    intended_use: '', // For the select box
    project_description: '', // For the textarea
    profiteer: '',
    email_address: '', // For the email input
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target; // Destructure name and value

    if (name === 'email_address') {
      // Check if it's the email input
      setEmail(value);
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setFormFields((prevFields) => ({
      ...prevFields,
      intended_use: event.target.value,
      project_description: event.target.value.length > 0,
    }));
  };

  const handleCardClick = (profiteer) => {
    setSelectedCard(profiteer);

    setFormData({ ...formData, profiteer: profiteer });
  };

  const areAllFieldsFilled =
    formFields.intended_use !== '' && formFields.project_description;

  const downloadStep = [
    'Overview',
    'Verification',
    'License',
    'Payment',
    'Download',
  ];

  const displayStep = dataset?.is_premium
    ? downloadStep
    : downloadStep.filter((step) => step !== 'Payment');

  const profiteerIcons = {
    non_profit: non_profit_icon,
    company: company_icon,
    students: student_icon,
    public: public_icon,
  };

  const handleNextStep = () => {
    if (currentStep < displayStep.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const [availableFormats] = useState([
    { name: 'CSV', size: '...', value: 'csv' },
    //  { name: "XLSX", size: "...", value: "xlsx" },
    //  { name: "PDF", size: "...", value: "pdf" },
  ]);

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  const handleDownload = async (dataset) => {
    if (
      !dataset ||
      !dataset.data_files ||
      !dataset.data_files[0] ||
      !dataset.data_files[0].file_url
    ) {
      console.error('Invalid dataset object:', dataset);
      alert('Invalid dataset selected.');
      return;
    }
    console.log(formData);
    const accessToken = await getAccessToken();
    if (!accessToken) {
      setErrorMessage('Failed to retrieve access token.');
      return;
    }

    try {
      const response = await fetch(
        `${REACT_PUBLIC_API_HOST}/data/dataset_downloads/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `JWT ${accessToken}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        console.log('Data sent successfully!');
        downloadDataModal.close();
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Retrieve the URL where the file can be downloaded
      const fileUrl = dataset.data_files[0].file_url;

      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', ''); // This helps with download behavior

      // Append to the document, trigger the click, and remove the element
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(formData);
      console.log('Access Token:', accessToken);

      console.error('Error downloading data:', error);
      alert('Failed to download data. Please try again.');
      console.log(formData);
    }
  };

  const validateEmail = () => {
    const emailTypeValidation = {
      Company: /@([a-zA-Z0-9-]+\.)+com$/.test(email),
      'Non-Profit': email.endsWith('.org'),
      Student: email.endsWith('.edu'),
      Public: true,
    };
    return emailTypeValidation[selectedCard];
  };

  const handleAction = async () => {
    if (!email) {
      setErrorMessage('Please enter your email.');
      return;
    }

    if (!validateEmail()) {
      setErrorMessage('Invalid email for selected category.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const accessToken = await getAccessToken();
      console.log({ accessToken });

      if (!accessToken) {
        setErrorMessage('Failed to retrieve access token.');
        console.log(' Error: Access token not available');
        return;
      }

      if (!codeSent) {
        console.log('📨 Sending OTP to:', email);

        try {
          const response = await fetch(
            `${REACT_PUBLIC_API_HOST}/data/generate-otp/`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${accessToken}`,
              },
              body: JSON.stringify({ email }),
            },
          );

          console.log(' OTP Request Response:', response.status);
          const data = await response.json();
          console.log(' Response Body:', data);

          if (!response.ok)
            throw new Error(data?.detail || 'Failed to send OTP.');

          setCodeSent(true);
          toast.success(`Verification code sent to ${email}`);
          setIsResendEnabled(false);
          setTimeout(() => setIsResendEnabled(true), 60000);
        } catch (error) {
          setErrorMessage(error.message);
          toast.error('Failed to send OTP. Try again.');
          console.error(' Error Sending OTP:', error);
        }
      } else {
        console.log('✅ Verifying OTP:', verificationCode);

        try {
          const response = await fetch(
            `${REACT_PUBLIC_API_HOST}/data/verify-otp/`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, code: verificationCode }),
            },
          );

          console.log('📡 OTP Verification Response:', response.status);
          const data = await response.json();
          console.log('📡 Verification Response Body:', data);

          if (
            response.ok &&
            data.message.toLowerCase().includes('otp validated successfully')
          ) {
            console.log(' OTP Verified Successfully');
            setIsVerified(true);
            toast.success('OTP Validated Successfully');
          } else {
            setErrorMessage('Incorrect OTP. Try again.');
            toast.error('Incorrect OTP. Try again.');
          }
        } catch (error) {
          setErrorMessage('An error occurred. Please try again.');
          toast.error('An error occurred. Please try again.');
          console.error(' Error Verifying OTP:', error);
        }
      }
    } catch (error) {
      console.error('❌ General Error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred.');
      toast.error('An unexpected error occurred.');
    }

    setLoading(false);
    console.log('🔄 handleAction completed');
  };

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState(''); // For success/error messages

  const handleStarClick = async (value) => {
    if (!dataset?.id) {
      setMessage('Error: Dataset ID is missing.');
      return;
    }

    setRating(value);
    setMessage('Submitting...'); // Show loading state

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        setMessage('Error: Authentication required.');
        return;
      }

      const response = await fetch(`${REACT_PUBLIC_API_HOST}/data/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        },
        body: JSON.stringify({
          dataset: dataset.id, // Ensure it's a valid integer
          rating: value,
        }),
      });

      const data = await response.json(); // Read response body
      console.log('Response:', response.status, data); // Log details

      if (response.ok) {
        setMessage('Thank you for your rating!');
      } else {
        setMessage(
          `Failed to submit rating: ${data.detail || 'Unknown error'}`,
        );
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Error submitting rating.');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const contentMap = {
    Overview: {
      title: 'Overview',
      details: (
        <>
          <div className="p-4 rounded-md shadow bg-white">
            <div className="flex justify-between">
              <h3 className="font-semibold text-[#0E0C15] text-xl">
                {dataset?.title}
              </h3>
              <div>
                <p className="bg-[#ddeeff] text-[#0E0C15] px-2 rounded-md">
                  {dataset?.is_premium ? `$${dataset?.price}` : 'Free'}
                </p>
              </div>
            </div>

            {/* Profiteers Section */}
            <div className="pt-2 flex flex-wrap gap-2">
              {Object.entries(dataset?.profiteers || {}).map(
                ([profiteer, status], Pindex) => (
                  <div
                    key={Pindex}
                    className="border border-gray-800 text-gray-800 rounded-lg px-2 py-1 text-xs  flex items-center gap-1"
                  >
                    <img
                      src={profiteerIcons[profiteer]}
                      alt={`${profiteer} icon`}
                      className="w-3 h-3"
                    />
                    <span>
                      {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
                    </span>
                    {status ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </div>
                ),
              )}
            </div>

            {/* Intended Use Section */}
            <div className="pt-4">
              <h4 className="font-semibold text-gray-800">Intended Use</h4>
              <div className="mt-2">
                <select
                  id="intended_use"
                  name="intended_use"
                  value={formData.intended_use}
                  onChange={handleInputChange}
                  className="w-full border border-[#ADA8C3] bg-gray-100 text-gray-800 rounded-md p-2"
                >
                  <option value="">
                    How do you intend to use this dataset? Select one option
                  </option>
                  <option className="text-[#4B5563]" value="academic-research">
                    Academic Research
                  </option>
                  <option
                    className="text-[#4B5563]"
                    value="commercial-analysis"
                  >
                    Commercial Analysis
                  </option>
                  <option className="text-[#4B5563]" value="government-policy">
                    Government Policy
                  </option>
                </select>
              </div>
            </div>

            {/* Project Description */}
            <div className="pt-6">
              <h4 className="font-semibold text-gray-800">
                Project Description
              </h4>
              <div className="mt-2">
                <textarea
                  className="w-full border border-[#ADA8C3] bg-gray-100 text-gray-800 rounded-md p-2"
                  placeholder="What is your project about ..."
                  id="project_description"
                  name="project_description"
                  value={formData.project_description}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* License Summary & Creator Control */}
            <div className="pt-4 p-4">
              <p className="text-lg text-[#4B5563]">License Summary</p>
              <div className="flex items-center mt-4 space-x-2">
                <AiOutlineInfoCircle className="text-xl text-[#4B5563]" />
                <span className="text-[#4B5563]">
                  Non-commercial use for research and educational purposes only.
                </span>
              </div>

              <p className="mt-4 text-lg text-[#4B5563]">
                Creator Control Notice
              </p>
              <div className="flex items-center mt-4 space-x-2 p-2 text-[#4B5563] rounded-md">
                <AiOutlineInfoCircle className="text-xl text-[#4B5563]" />
                <span className="text-[#4B5563]">
                  Dataset Creators can restrict access if terms are abused.
                </span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4 gap-16">
              {currentStep > 1 && (
                <CustomButton
                  label="Previous"
                  onClick={handlePreviousStep}
                  className="bg-[#87CEEB] text-[#4B5563]"
                />
              )}
              {currentStep < displayStep.length && (
                <CustomButton
                  disabled={!areAllFieldsFilled}
                  className={`py-2 px-3 rounded-lg ${
                    agreed
                      ? 'bg-[#ddeeff] text-[#0E0C15]'
                      : 'bg-gray-400 text-[#0E0C15] cursor-not-allowed'
                  }`}
                  label="Next"
                  onClick={handleNextStep}
                />
              )}
            </div>
          </div>
        </>
      ),
    },

    Verification: {
      title: 'Verification',
      details: (
        <>
          <Toaster />
          <div className="bg-white p-4 rounded-md shadow">
            <div className="flex justify-between bg-white">
              <h3 className="font-semibold text-xl text-[#4B5563]">
                {dataset?.title}
              </h3>
              <div>
                <p className="bg-[#ddeeff] text-[#0E0C15] px-2 rounded-md">
                  {dataset?.is_premium ? `$${dataset?.price}` : 'Free'}
                </p>
              </div>
            </div>

            {/* Profiteers Section */}
            <div className="pt-2 flex flex-wrap gap-2">
              {Object.entries(dataset?.profiteers || {}).map(
                ([profiteer, status], Pindex) => (
                  <div
                    key={Pindex}
                    className="border border-gray-800 text-gray-800 rounded-lg px-2 py-1 text-xs flex items-center gap-1"
                  >
                    <img
                      src={profiteerIcons[profiteer]}
                      alt={`${profiteer} icon`}
                      className="w-3 h-3"
                    />
                    <span>
                      {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
                    </span>
                    {status ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </div>
                ),
              )}
            </div>

            {/* Verification Section */}
            <div className="verification-section bg-white mt-6 p-4 rounded-md">
              <h3 className="font-semibold text-xl text-[#4B5563] mb-4">
                Please Verify your Details Here
              </h3>
              <h2 className="text-lg text-[#4B5563] font-semibold">Steps</h2>
              <p className="text-[#4B5563]">
                1. Click the institution type with which you want to download
                the dataset.
              </p>
              <p className="text-[#4B5563]">
                2. Enter your email that matches the institution you chose in
                step 1.
              </p>
              <p className="text-[#4B5563]">
                3. Verify your Email, then click &apos;Verification Code&apos;
                to receive your OTP.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  {
                    type: 'Company',
                    icon: <FaBuilding />,
                    description: 'Business Email Required.',
                  },
                  {
                    type: 'Non-Profit',
                    icon: <FaHandsHelping />,
                    description: 'NGO or .org Email Required.',
                  },
                  {
                    type: 'Student',
                    icon: <FaUserGraduate />,
                    description: 'University/Educational Email Required.',
                  },
                  {
                    type: 'Public',
                    icon: <FaUsers />,
                    description: 'Personal Email Required.',
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(card.type)}
                    className={`p-4 border ${
                      selectedCard === card.type ? 'bg-blue-300' : 'bg-gray-100'
                    } border-[#ADA8C3] rounded-md text-center cursor-pointer`}
                  >
                    <div className="text-2xl mb-2 text-[#4B5563]">
                      {card.icon}
                    </div>
                    <h4 className="font-semibold text-lg text-[#4B5563]">
                      {card.type}
                    </h4>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>

              {/* Email Input */}
              <div className="pt-4">
                <h4 className="font-semibold text-[#4B5563]">
                  Enter your Email Address
                </h4>
                <input
                  name="email_address"
                  type="email"
                  value={formData.email_address}
                  onChange={handleInputChange}
                  className="w-full border border-[#ADA8C3] bg-gray-100 text-[#4B5563] rounded-md p-2"
                  placeholder="Enter your institutional email address here"
                  disabled={isVerified}
                />
              </div>

              {/* OTP Verification */}
              {codeSent && (
                <div className="pt-4">
                  <h4 className="font-semibold text-[#4B5563]">
                    Enter Verification Code
                  </h4>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full border border-[#ADA8C3] bg-gray-100 text-[#4B5563] rounded-md p-2"
                    placeholder="Enter OTP"
                  />
                </div>
              )}

              {errorMessage && (
                <p className="text-red-500 pt-2">{errorMessage}</p>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={handleAction}
                  disabled={loading}
                  className="px-4 py-2 bg-[#ddeeff] text-[#0E0C15] rounded-md"
                >
                  {loading
                    ? 'Processing...'
                    : codeSent
                      ? 'Verify OTP'
                      : 'Send OTP'}
                </button>

                {codeSent && !isVerified && (
                  <button
                    onClick={handleAction}
                    disabled={!isResendEnabled}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4 gap-16">
              {currentStep > 1 && (
                <CustomButton
                  label="Previous"
                  onClick={handlePreviousStep}
                  className="bg-[#87CEEB] text-[#4B5563]"
                />
              )}
              {currentStep < displayStep.length && (
                <CustomButton
                  disabled={!isVerified}
                  className={`py-2 px-3 rounded-lg ${
                    isVerified
                      ? 'bg-[#ddeeff] text-[#0E0C15] hover:bg-[#FFC876]'
                      : 'bg-gray-400 text-[#0E0C15] cursor-not-allowed'
                  }`}
                  label="Next"
                  onClick={handleNextStep}
                />
              )}
            </div>
          </div>
        </>
      ),
    },

    License: {
      title: 'License',
      details: (
        <>
          <div className="bg-white p-4 rounded-md shadow">
            {/* Title & Price Section */}
            <div className="flex justify-between bg-white">
              <h3 className="font-semibold text-xl text-[#4B5563]">
                {dataset?.title}
              </h3>
              <div>
                <p className="bg-[#ddeeff] text-[#0E0C15] px-2 rounded-md">
                  {dataset?.is_premium ? `$${dataset?.price}` : 'Free'}
                </p>
              </div>
            </div>

            {/* Profiteers Section */}
            <div className="pt-2 flex flex-wrap gap-2">
              {Object.entries(dataset?.profiteers || {}).map(
                ([profiteer, status], Pindex) => (
                  <div
                    key={Pindex}
                    className="border border-gray-800 text-gray-800 rounded-lg px-2 py-1 text-xs flex items-center gap-1"
                  >
                    <img
                      src={profiteerIcons[profiteer]}
                      alt={`${profiteer} icon`}
                      className="w-3 h-3"
                    />
                    <span>
                      {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
                    </span>
                    {status ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </div>
                ),
              )}
            </div>

            {/* License Agreement Section */}
            <div className="pt-4">
              <h4 className="font-semibold text-[#4B5563]">
                License Agreement
              </h4>
              <div className="mt-4">
                {/* Allowed Uses (Green) */}
                <div className="bg-green-100 p-4 rounded-md">
                  <h5 className="font-semibold text-green-700 flex items-center">
                    ✅ Allowed Uses
                  </h5>
                  <ul className="mt-2 text-sm text-green-700 space-y-1">
                    <li className="flex items-center">
                      ✔ Research and Analysis
                    </li>
                    <li className="flex items-center">
                      ✔ Educational Projects
                    </li>
                    <li className="flex items-center">
                      ✔ Social Good Initiatives
                    </li>
                    <li className="flex items-center">
                      ✔ Academic Publications
                    </li>
                  </ul>
                </div>

                {/* Restricted Uses (Red) */}
                <div className="bg-red-100 p-4 rounded-md mt-4">
                  <h5 className="font-semibold text-red-700 flex items-center">
                    ❌ Restricted Uses
                  </h5>
                  <ul className="mt-2 text-sm text-red-700 space-y-1">
                    <li className="flex items-center">
                      ✖ Commercial Products
                    </li>
                    <li className="flex items-center">
                      ✖ Data Redistribution
                    </li>
                    <li className="flex items-center">
                      ✖ Derivative Databases
                    </li>
                    <li className="flex items-center">
                      ✖ Resale or Licensing
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="mt-4">
              <label className="flex items-center text-sm text-[#4B5563]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={agreed}
                  onChange={() => {
                    setAgreed(!agreed);
                    console.log('Agreed state:', !agreed);
                  }}
                />
                I understand and agree to these terms, and acknowledge that
                dataset access may be revoked if terms are breached.
              </label>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4 gap-16">
              {currentStep > 1 && (
                <CustomButton
                  label="Previous"
                  onClick={handlePreviousStep}
                  className="bg-[#87CEEB] text-[#4B5563]"
                />
              )}
              {currentStep < displayStep.length && (
                <CustomButton
                  disabled={!agreed}
                  className={`py-2 px-3 rounded-lg ${
                    agreed
                      ? 'bg-[#ddeeff] text-[#0E0C15] hover:bg-[#FFC876]'
                      : 'bg-gray-400 text-[#0E0C15] cursor-not-allowed'
                  }`}
                  label="Next"
                  onClick={handleNextStep}
                />
              )}
            </div>
          </div>
        </>
      ),
    },

    Payment: {
      title: 'Payment',
      details: (
        <div>
          <p>Please make your payment</p>
        </div>
      ),
    },

    Download: {
      title: 'Download',
      details: (
        <>
          <div className="bg-white p-4 rounded-md shadow">
            {/* Title & Price Section */}
            <div className="flex justify-between">
              <h3 className="font-semibold text-xl text-[#4B5563]">
                {dataset?.title}
              </h3>
              <div>
                <p className="bg-[#ddeeff] text-[#0E0C15] px-2 rounded-md">
                  {dataset?.is_premium ? `$${dataset?.price}` : 'Free'}
                </p>
              </div>
            </div>

            {/* Profiteers Section */}
            <div className="pt-2 flex flex-wrap gap-2">
              {Object.entries(dataset?.profiteers || {}).map(
                ([profiteer, status], Pindex) => (
                  <div
                    key={Pindex}
                    className="border border-gray-800 text-gray-800 rounded-lg px-2 py-1 text-xs flex items-center gap-1"
                  >
                    <img
                      src={profiteerIcons[profiteer]}
                      alt={`${profiteer} icon`}
                      className="w-3 h-3"
                    />
                    <span>
                      {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
                    </span>
                    {status ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </div>
                ),
              )}
            </div>

            {/* Approval Section */}
            <div className="flex flex-col items-center p-4 bg-gray-100 max-w-full mx-auto mt-4 rounded-md shadow">
              <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#4B5563]">
                You are Approved!
              </h2>
              <p className="text-gray-700 text-center">
                Thank you! You are approved to download this dataset.
              </p>
              <p className="text-sm text-gray-700 bg-gray-200 p-2 rounded-md mt-4 text-center">
                Remember: This dataset is for non-commercial, educational use
                only. By downloading, you agree to notify the creator if you use
                it in publications or derivative works.
              </p>
            </div>

            {/* Available Formats */}
            <div className="justify-self-center p-4 mb-4">
              <h3 className="text-lg font-semibold text-center text-[#4B5563]">
                Available Formats
              </h3>
              <div className="flex flex-row gap-4 mt-2 text-[#4B5563]">
                {availableFormats.map((format) => (
                  <label
                    key={format.value}
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      selectedFormat === format.value
                        ? 'bg-gray-200'
                        : 'bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={selectedFormat === format.value}
                      onChange={() => handleFormatChange(format.value)}
                      className="appearance-none rounded-full w-3 h-3 border mr-4 border-gray-300 checked:bg-gray-500 checked:border-transparent"
                    />
                    {format.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Rate This Dataset */}
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-[#4B5563]">
                Rate This Dataset
              </h3>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`h-8 w-8 cursor-pointer ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27l6.18 3.73-1.64-7.03 5.46-4.73-7.19-.61L12 2 9.19 8.63l-7.19.61 5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              {message && (
                <p className="text-sm text-green-500 mt-2">{message}</p>
              )}
            </div>

            {/* Navigation & Download Buttons */}
            <div className="flex justify-between mt-4 mb-4 gap-16 w-full">
              {currentStep > 1 && (
                <CustomButton
                  label="Back"
                  onClick={handlePreviousStep}
                  className="bg-gray-300 text-[#4B5563]"
                />
              )}

              <CustomButton
                label="Download"
                onClick={() => handleDownload(dataset)}
                disabled={downloading}
                className={`py-2 px-4 rounded-lg ${
                  downloading
                    ? 'bg-[#0E0C15] text-gray-200 cursor-not-allowed'
                    : 'bg-[#ddeeff] text-[#0E0C15] hover:bg-[#FFC876]'
                }`}
              >
                {downloading ? 'Downloading...' : '⬇ Download'}
              </CustomButton>

              {currentStep < displayStep.length && (
                <CustomButton
                  disabled={!agreed}
                  className={`py-2 px-3 rounded-lg ${
                    agreed
                      ? 'bg-[#ddeeff] text-[#0E0C15] hover:bg-[#FFC876]'
                      : 'bg-gray-400 text-[#0E0C15]cursor-not-allowed'
                  }`}
                  label="Next"
                  onClick={handleNextStep}
                />
              )}
            </div>
          </div>
        </>
      ),
    },
  };

  const renderStepContent = () => {
    const step = displayStep[currentStep - 1];
    const stepContent = contentMap[step];

    return (
      <>
        <div>{stepContent.details}</div>
      </>
    );
  };

  const renderProgress = () => (
    <div className="flex items-center justify-between pl-5 pr-5">
      {displayStep.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex flex-col items-center ${
              index + 1 === currentStep ? 'text-[#0E0C15]' : 'text-[#0E0C15]'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index + 1 === currentStep
                  ? 'text-[#0E0C15] border-[#004176]'
                  : 'text-[#0E0C15] border-[#0E0C15]'
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-xs font-medium">{step}</span>
          </div>
          {index < displayStep.length - 1 && (
            <div className="flex-1 h-px bg-slate-400 mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );

  const content = (
    <>
      <div>
        {/* Step Indicator */}
        <div>{renderProgress()}</div>

        <div className="pt-6">
          {/* Step Content */}
          <div className="border border-[#757185] shadow-sm p-2 rounded-md">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={downloadDataModal.isOpen}
      close={downloadDataModal.close}
      content={content}
    />
  );
};

DownloadDataModal.propTypes = {
  dataset: PropTypes.object.isRequired,
};

export default DownloadDataModal;

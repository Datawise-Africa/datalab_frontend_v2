import React, { useState } from 'react';
import Modal from '@/components/Modals/DataModals/Modal';
import useDownloadDataModal from '@/store/use-download-data-modal';
import CustomButton from '@/components/Modals/DataModals/CustomButton';
import non_profit_icon from '/assets/datalab/non-profit-icon-dark.svg';
import company_icon from '/assets/datalab/company-icon-dark.svg';
import student_icon from '/assets/datalab/student-icon-dark.svg';
import public_icon from '/assets/datalab/public2-icon-dark.svg';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import type { IDataset } from '@/lib/types/data-set';
import {
  Building,
  Check,
  GraduationCap,
  Handshake,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/auth-store';
import { extractCorrectErrorMessage } from '@/lib/error';
import { useAxios } from '@/hooks/use-axios';

type DownloadDataModalProps = {
  dataset: IDataset;
};

const DownloadDataModal = ({ dataset }: DownloadDataModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const downloadDataModal = useDownloadDataModal();
  const [agreed, setAgreed] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [downloading] = useState(false);
  const auth = useAuth();
  const axiosClient = useAxios();
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
  type FormDataType = {
    dataset: string; // Assuming dataset.id is a string
    intended_use: string;
    project_description: string;
    intended_audience: string;
    email_address: string;
  };
  const [formData, setFormData] = useState<FormDataType>({
    dataset: dataset.id,
    intended_use: '', // For the select box
    project_description: '', // For the textarea
    intended_audience: '',
    email_address: '', // For the email input
  });

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
    >,
  ) => {
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

  const handleCardClick = (profiteer: string) => {
    setSelectedCard(profiteer);

    setFormData({ ...formData, intended_audience: profiteer });
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

  const profiteerIcons: Record<string, string> = {
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

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
  };

  const handleDownload = async (dataset: IDataset) => {
    if (
      !dataset ||
      !dataset.data_files ||
      !dataset.data_files[0] ||
      !dataset.data_files[0].s3_url
    ) {
      console.error('Invalid dataset object:', dataset);
      alert('Invalid dataset selected.');
      return;
    }
    console.log(formData);
    // const accessToken = await getAccessToken();
    if (!auth.access_token) {
      setErrorMessage('Failed to retrieve access token.');
      return;
    }

    try {
      await axiosClient.post(`/data/dataset_downloads/`, formData);

      // if (response.ok) {
      console.log('Data sent successfully!');

        // Retrieve the URL where the file can be downloaded
        const fileUrl = dataset.data_files[0].s3_url;

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', ''); // This helps with download behavior

      // Append to the document, trigger the click, and remove the element
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Data downloaded successfully!');
      downloadDataModal.close();
      // } else {
      //   console.error(`Error: ${response.status} - ${response.statusText}`);
      // }
    } catch (error) {
      console.log(formData);
      console.log('Access Token:', auth.access_token);

      console.error('Error downloading data:', error);
      alert('Failed to download data. Please try again.');
      console.log(formData);
    }
  };

  const validateEmail = () => {
    const emailTypeValidation: Record<string, boolean> = {
      company: /@([a-zA-Z0-9-]+\.)+com$/.test(email),
      non_profit: email.endsWith('.org'),
      students: email.endsWith('.edu'),
      public: true,
    };
    return emailTypeValidation[selectedCard];
  };
  // Helper functions
  const handleSendOtp = async () => {
    console.log('📨 Sending OTP to:', email);
    await axiosClient.post(`/data/generate-otp/`, { email });

    setCodeSent(true);
    toast.success(`Verification code sent to ${email}`);
    setIsResendEnabled(false);
    setTimeout(() => setIsResendEnabled(true), 60000);
  };

  const handleVerifyOtp = async () => {
    try {
      setIsResendEnabled(false);
      console.log('✅ Verifying OTP:', verificationCode);
      const { data, status } = await axiosClient.post(`/data/verify-otp/`, {
        email,
        code: verificationCode,
      });

      console.log('📡 OTP Verification Response:', { status, data });

      if (
        status === 200 &&
        data.message.toLowerCase().includes('otp validated successfully')
      ) {
        setIsVerified(true);
        toast.success('OTP Validated Successfully');
      } else {
        setIsResendEnabled(false);
        throw new Error('Incorrect OTP. Try again.');
      }
    } catch (error) {
      setIsResendEnabled(true);
      throw new Error(
        extractCorrectErrorMessage(
          error,
          'Failed to verify OTP. Please try again.',
        ),
      );
    }
  };
  const handleAction =
    (action: 'sendOtp' | 'verifyOtp' | 'resendOtp') => async () => {
      // Validate inputs
      if (!email) return setErrorMessage('Please enter your email.');
      if (!validateEmail())
        return setErrorMessage('Invalid email for selected category.');
      if (!auth.access_token) {
        setErrorMessage('Failed to retrieve access token.');
        return console.log('Error: Access token not available');
      }

      setLoading(true);
      setErrorMessage('');

      try {
        if (action === 'sendOtp') {
          await handleSendOtp();
        } else if (action === 'resendOtp') {
          await handleSendOtp();
        } else {
          await handleVerifyOtp();
        }
      } catch (error: any) {
        const message = extractCorrectErrorMessage(
          error,
          'An unexpected error occurred.',
        );
        setErrorMessage(message);
        toast.error(message);
        console.error(`❌ ${action} Error:`, error);
      } finally {
        setLoading(false);
      }
    };

  // const [rating, setRating] = useState(0);
  const [message, _setMessage] = useState(''); // For success/error messages

  // const handleStarClick = async (value: number) => {
  //   if (!dataset?.id) {
  //     setMessage('Error: Dataset ID is missing.');
  //     return;
  //   }

  //   setRating(value);
  //   setMessage('Submitting...'); // Show loading state

  //   try {
  //     if (!auth.state.accessToken) {
  //       setMessage('Error: Authentication required.');
  //       return;
  //     }

  //     const response = await fetch(`${REACT_PUBLIC_API_HOST}/data/reviews/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `JWT ${auth.state.accessToken}`,
  //       },
  //       body: JSON.stringify({
  //         dataset: dataset.id, // Ensure it's a valid integer
  //         rating: value,
  //       }),
  //     });

  //     const data = await response.json(); // Read response body
  //     console.log('Response:', response.status, data); // Log details

  //     if (response.ok) {
  //       setMessage('Thank you for your rating!');
  //     } else {
  //       setMessage(
  //         `Failed to submit rating: ${data.detail || 'Unknown error'}`,
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //     setMessage('Error submitting rating.');
  //   }

  //   setTimeout(() => setMessage(''), 3000);
  // };

  const contentMap: Record<
    string,
    { title: string; details: React.JSX.Element }
  > = {
    Overview: {
      title: 'Overview',
      details: (
        <>
          <div className="rounded-md bg-white p-4 shadow">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold text-[#0E0C15]">
                {dataset?.title}
              </h3>
              <div>
                <p className="rounded-md bg-[#ddeeff] px-2 text-[#0E0C15]">
                  {dataset?.is_premium ? `$${dataset?.price}` : 'Free'}
                </p>
              </div>
            </div>

            {/* Profiteers Section */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(dataset?.intended_audience || {}).map(
                ([profiteer, status], Pindex) => (
                  <div
                    key={Pindex}
                    className="flex items-center gap-1 rounded-lg border border-gray-800 px-2 py-1 text-xs text-gray-800"
                  >
                    <img
                      src={profiteerIcons[profiteer]}
                      alt={`${profiteer} icon`}
                      className="h-3 w-3"
                    />
                    <span>
                      {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
                    </span>
                    {status ? (
                      <Check className="text-green-500" size={16} />
                    ) : (
                      <X className="text-red-500" size={16} />
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
                  className="w-full rounded-md border border-[#ADA8C3] bg-gray-100 p-2 text-gray-800"
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
                  className="w-full rounded-md border border-[#ADA8C3] bg-gray-100 p-2 text-gray-800"
                  placeholder="What is your project about ..."
                  id="project_description"
                  name="project_description"
                  value={formData.project_description}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* License Summary & Creator Control */}
            <div className="p-4 pt-4">
              <p className="text-lg text-[#4B5563]">License Summary</p>
              <div className="mt-4 flex items-center space-x-2">
                <AiOutlineInfoCircle className="text-xl text-[#4B5563]" />
                <span className="text-[#4B5563]">
                  Non-commercial use for research and educational purposes only.
                </span>
              </div>

              <p className="mt-4 text-lg text-[#4B5563]">
                Creator Control Notice
              </p>
              <div className="mt-4 flex items-center space-x-2 rounded-md p-2 text-[#4B5563]">
                <AiOutlineInfoCircle className="text-xl text-[#4B5563]" />
                <span className="text-[#4B5563]">
                  Dataset Creators can restrict access if terms are abused.
                </span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-4 flex justify-between gap-16">
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
                  className={`rounded-lg px-3 py-2 ${
                    agreed
                      ? 'bg-[#ddeeff] text-[#0E0C15]'
                      : 'cursor-not-allowed bg-gray-400 text-[#0E0C15]'
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
          {/* <Toaster /> */}
          <div className="rounded-md bg-white p-4 shadow">
            <div className="flex justify-between bg-white">
              <h3 className="text-xl font-semibold text-[#4B5563]">
                {dataset?.title}
              </h3>
              <div>
                <p className="rounded-md bg-[#ddeeff] px-2 text-[#0E0C15]">
                  {dataset?.is_premium ? `$${dataset?.price}` : 'Free'}
                </p>
              </div>
            </div>

            {/* Profiteers Section */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(dataset?.intended_audience || {}).map(
                ([profiteer, status], Pindex) => (
                  <div
                    key={Pindex}
                    className="flex items-center gap-1 rounded-lg border border-gray-800 px-2 py-1 text-xs text-gray-800"
                  >
                    <img
                      src={profiteerIcons[profiteer]}
                      alt={`${profiteer} icon`}
                      className="h-3 w-3"
                    />
                    <span>
                      {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
                    </span>
                    {status ? (
                      <Check className="text-green-500" size={16} />
                    ) : (
                      <X className="text-red-500" size={16} />
                    )}
                  </div>
                ),
              )}
            </div>

            {/* Verification Section */}
            <div className="verification-section mt-6 rounded-md bg-white p-4">
              <h3 className="mb-4 text-xl font-semibold text-[#4B5563]">
                Please Verify your Details Here
              </h3>
              <h2 className="text-lg font-semibold text-[#4B5563]">Steps</h2>
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

              <div className="mt-4 grid grid-cols-2 gap-4">
                {[
                  {
                    type: 'company',
                    icon: <Building />,
                    description: 'Business Email Required.',
                  },
                  {
                    type: 'non_profit',
                    icon: <Handshake />,
                    description: 'NGO or .org Email Required.',
                  },
                  {
                    type: 'students',
                    icon: <GraduationCap />,
                    description: 'University/Educational Email Required.',
                  },
                  {
                    type: 'public',
                    icon: <Users />,
                    description: 'Personal Email Required.',
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(card.type)}
                    className={`border p-4 ${
                      selectedCard === card.type ? 'bg-blue-300' : 'bg-gray-100'
                    } cursor-pointer rounded-md border-[#ADA8C3] text-center`}
                  >
                    <div className="mb-2 text-2xl text-[#4B5563]">
                      {card.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-[#4B5563]">
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
                  className="w-full rounded-md border border-[#ADA8C3] bg-gray-100 p-2 text-[#4B5563]"
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
                    className="w-full rounded-md border border-[#ADA8C3] bg-gray-100 p-2 text-[#4B5563]"
                    placeholder="Enter OTP"
                  />
                </div>
              )}

              {errorMessage && (
                <p className="pt-2 text-red-500">{errorMessage}</p>
              )}

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap gap-4">
                {codeSent ? (
                  <button
                    onClick={handleAction('verifyOtp')}
                    disabled={loading}
                    className="rounded-md bg-[#ddeeff] px-4 py-2 text-[#0E0C15]"
                  >
                    {loading ? 'Processing...' : 'Verify OTP'}
                  </button>
                ) : (
                  <button
                    onClick={handleAction('sendOtp')}
                    disabled={loading}
                    className="rounded-md bg-[#ddeeff] px-4 py-2 text-[#0E0C15]"
                  >
                    {loading ? 'Processing...' : 'Send OTP'}
                  </button>
                )}

                {codeSent && !isVerified && (
                  <button
                    type="button"
                    onClick={handleAction('sendOtp')}
                    disabled={!isResendEnabled}
                    className="rounded-md bg-gray-500 px-4 py-2 text-white"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-4 flex justify-between gap-16">
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
                  className={`rounded-lg px-3 py-2 ${
                    isVerified
                      ? 'bg-[#ddeeff] text-[#0E0C15] hover:bg-[#FFC876]'
                      : 'cursor-not-allowed bg-gray-400 text-[#0E0C15]'
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
          <div className="rounded-md bg-white p-4 shadow">
            {/* Title & Price Section */}
            <div className="flex justify-between bg-white">
              <h3 className="text-xl font-semibold text-[#4B5563]">
                {dataset?.title}
              </h3>
              <div>
                <p className="rounded-md bg-[#ddeeff] px-2 text-[#0E0C15]">
                  {dataset?.is_premium ? `$${dataset?.price}` : 'Free'}
                </p>
              </div>
            </div>

            {/* Profiteers Section */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(dataset?.intended_audience || {}).map(
                ([profiteer, status], Pindex) => (
                  <div
                    key={Pindex}
                    className="flex items-center gap-1 rounded-lg border border-gray-800 px-2 py-1 text-xs text-gray-800"
                  >
                    <img
                      src={profiteerIcons[profiteer]}
                      alt={`${profiteer} icon`}
                      className="h-3 w-3"
                    />
                    <span>
                      {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
                    </span>
                    {status ? (
                      <Check className="text-green-500" size={16} />
                    ) : (
                      <X className="text-red-500" size={16} />
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
                <div className="rounded-md bg-green-100 p-4">
                  <h5 className="flex items-center font-semibold text-green-700">
                    ✅ Allowed Uses
                  </h5>
                  <ul className="mt-2 space-y-1 text-sm text-green-700">
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
                <div className="mt-4 rounded-md bg-red-100 p-4">
                  <h5 className="flex items-center font-semibold text-red-700">
                    ❌ Restricted Uses
                  </h5>
                  <ul className="mt-2 space-y-1 text-sm text-red-700">
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
            <div className="mt-4 flex justify-between gap-16">
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
                  className={`rounded-lg px-3 py-2 ${
                    agreed
                      ? 'bg-[#ddeeff] text-[#0E0C15] hover:bg-[#FFC876]'
                      : 'cursor-not-allowed bg-gray-400 text-[#0E0C15]'
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
          <div className="rounded-md bg-white p-4 shadow">
            {/* Title & Price Section */}
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold text-[#4B5563]">
                {dataset?.title}
              </h3>
              <div>
                <p className="rounded-md bg-[#ddeeff] px-2 text-[#0E0C15]">
                  {dataset?.is_premium ? `$${dataset?.price}` : 'Free'}
                </p>
              </div>
            </div>

            {/* Profiteers Section */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(dataset?.intended_audience || {}).map(
                ([profiteer, status], Pindex) => (
                  <div
                    key={Pindex}
                    className="flex items-center gap-1 rounded-lg border border-gray-800 px-2 py-1 text-xs text-gray-800"
                  >
                    <img
                      src={profiteerIcons[profiteer]}
                      alt={`${profiteer} icon`}
                      className="h-3 w-3"
                    />
                    <span>
                      {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
                    </span>
                    {status ? (
                      <Check className="text-green-500" size={16} />
                    ) : (
                      <X className="text-red-500" size={16} />
                    )}
                  </div>
                ),
              )}
            </div>

            {/* Approval Section */}
            <div className="mx-auto mt-4 flex max-w-full flex-col items-center rounded-md bg-gray-100 p-4 shadow">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
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
              <p className="text-center text-gray-700">
                Thank you! You are approved to download this dataset.
              </p>
              <p className="mt-4 rounded-md bg-gray-200 p-2 text-center text-sm text-gray-700">
                Remember: This dataset is for non-commercial, educational use
                only. By downloading, you agree to notify the creator if you use
                it in publications or derivative works.
              </p>
            </div>

            {/* Available Formats */}
            <div className="mb-4 justify-self-center p-4">
              <h3 className="text-center text-lg font-semibold text-[#4B5563]">
                Available Formats
              </h3>
              <div className="mt-2 flex flex-row gap-4 text-[#4B5563]">
                {availableFormats.map((format) => (
                  <label
                    key={format.value}
                    className={`flex cursor-pointer items-center rounded-md border p-3 ${
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
                      className="mr-4 h-3 w-3 appearance-none rounded-full border border-gray-300 checked:border-transparent checked:bg-gray-500"
                    />
                    {format.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Rate This Dataset */}
            <div className="mt-6 text-center">
              {/* <h3 className="text-lg font-semibold text-[#4B5563]">
                Rate This Dataset
              </h3>
              <div className="mt-2 flex justify-center">
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
              </div> */}
              {message && (
                <p className="mt-2 text-sm text-green-500">{message}</p>
              )}
            </div>

            {/* Navigation & Download Buttons */}
            <div className="mt-4 mb-4 flex w-full justify-between gap-16">
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
                className={`rounded-lg px-4 py-2 ${
                  downloading
                    ? 'cursor-not-allowed bg-[#0E0C15] text-gray-200'
                    : 'bg-[#ddeeff] text-[#0E0C15] hover:bg-[#FFC876]'
                }`}
              >
                {downloading ? 'Downloading...' : '⬇ Download'}
              </CustomButton>

              {currentStep < displayStep.length && (
                <CustomButton
                  disabled={!agreed}
                  className={`rounded-lg px-3 py-2 ${
                    agreed
                      ? 'bg-[#ddeeff] text-[#0E0C15] hover:bg-[#FFC876]'
                      : 'text-[#0E0C15]cursor-not-allowed bg-gray-400'
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
    <div className="flex items-center justify-between pr-5 pl-5">
      {displayStep.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex flex-col items-center ${
              index + 1 === currentStep ? 'text-[#0E0C15]' : 'text-[#0E0C15]'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                index + 1 === currentStep
                  ? 'border-[#004176] text-[#0E0C15]'
                  : 'border-[#0E0C15] text-[#0E0C15]'
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-xs font-medium">{step}</span>
          </div>
          {index < displayStep.length - 1 && (
            <div className="mx-2 h-px flex-1 bg-slate-400"></div>
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
          <div className="rounded-md border border-[#757185] p-2 shadow-sm">
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

export default DownloadDataModal;

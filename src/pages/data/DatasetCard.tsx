import PropTypes from 'prop-types';
import { FaRegUser, FaCheck, FaTimes, FaStar, FaRegSave } from 'react-icons/fa';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

// Importing icons
import non_profit_icon from '/assets/datalab/non-profit-icon.svg';
import company_icon from '/assets/datalab/company-icon.svg';
import student_icon from '/assets/datalab/student-icon.svg';
import public_icon from '/assets/datalab/public2-icon.svg';
import spinning_timer_icon from '/assets/datalab/spinning-timer.svg';
import database_icon from '/assets/datalab/db-icon.svg';
import download_icon from '/assets/datalab/download-icon.svg';
import download_arrow_icon from '/assets/datalab/download-arrow-icon.svg';
import view_icon from '/assets/datalab/view-icon.svg';

import save_icon from '/assets/datalab/save_icon.svg';
import copy_link_icon from '/assets/datalab/copy_link_icon.svg';

const DatasetCard = ({
  dataset,
  handleSingleDataModal,
  handleDownloadDataClick,
}) => {
  const profiteerIcons = {
    non_profit: non_profit_icon,
    company: company_icon,
    students: student_icon,
    public: public_icon,
  };
  const renderStars = (rating) => {
    if (rating === null || rating === 0) {
      return <span className="text-gray-500">No ratings yet</span>;
    }

    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'text-[#757185]' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="border border-[#ddeeff] p-4 rounded-lg w-86 hover:shadow-2xl transition transform  duration-300 hover:translate-y-[-10px]">
      <div className="flex justify-between">
        <p className="bg-[#ddeeff] text-md font-bold text-[#188366] px-2 rounded mt-2">
          {dataset.is_premium ? `$${dataset.price}` : 'Free'}
        </p>

        {/* Dropdown menu */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#188366]">
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </Menu.Button>

          <Menu.Items className="absolute left-0 z-10 mt-2 w-30 origin-top-right rounded-md bg-white shadow-lg  focus:outline-none divide-y divide-gray-100 border border-gray-200">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => console.log('Save')}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}
                  >
                    <img
                      src={save_icon}
                      alt="Download"
                      className="w-3 h-3 mr-2 "
                    />
                    Save
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(window.location.href)
                    }
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}
                  >
                    <img
                      src={copy_link_icon}
                      alt="Download"
                      className="w-4 h-4 mr-2 "
                    />
                    Copy Link
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>

      <div className="flex justify-between mt-2">
        <h3 className="font-semibold text-lg">{dataset.title}</h3>
      </div>

      <div className="flex flex-wrap items-center space-x-2 mt-2">
        <FaRegUser className="text-[#757185] w-4 h-4 " />
        {dataset.dataset_author.map((author, index) => (
          <small key={index} className="text-[#4B5563] text-xs font-bold">
            {author?.first_name} {author?.last_name}
          </small>
        ))}
      </div>

      <p className="pt-2 text-sm text-[#4B5563] mt-1">
        {dataset.description.split(' ').slice(0, 10).join(' ')}
        {dataset.description.split(' ').length > 10 ? '...' : ''}
      </p>

      <div className="pt-2 flex flex-wrap gap-2">
        {dataset.tags.map((tag, index) => (
          <div
            key={index}
            className="bg-[#ffffff] text-[#101827] font-bold rounded px-3 py-1 text-xs border border-[#E5E7EB] border-2"
          >
            {tag}
          </div>
        ))}
      </div>

      <div>
        <p className="text-[#333333] font-semibold text-xs mt-2">
          Available to:
        </p>
      </div>

      <div className="pt-2 flex flex-wrap gap-2">
        {Object.entries(dataset?.profiteers || {}).map(
          ([profiteer, status], index) => (
            <div
              key={index}
              className="bg-[#EFFDF4] rounded px-2 py-1 text-xs font-bold text-[#101827] flex items-center gap-1"
            >
              <img
                src={profiteerIcons[profiteer]}
                alt={`${profiteer} icon`}
                className="w-1 h-1 "
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

      <div className="pt-5 flex flex-col space-y-2">
        <div className="flex items-center">
          <img src={spinning_timer_icon} alt="timer" className="w-4 h-4" />
          <span className="ml-1 text-[#101827] text-xs">
            Created: {dataset.created_at}
          </span>
        </div>
        <div className="flex items-center">
          <img src={database_icon} alt="database" className="w-4 h-4" />
          <span className="ml-1 text-[#101827] text-xs">
            CSV ({dataset.size_bytes})
          </span>
        </div>

        <div className="flex items-center">
          <img src={download_icon} alt="download" className="w-4 h-4 " />
          <span className="ml-1 text-[#101827] text-xs">
            {dataset.download_count} downloads
          </span>
        </div>

        <div className="mt-1 flex flex-row items-center justify-between">
          <h4 className="text-xs">
            Dataset Review:{' '}
            {dataset.review_count > 0 ? (
              <span className="flex items-center space-x-1">
                <span className="flex">
                  {renderStars(Math.round(dataset.average_review) || 0)}
                </span>
                {/* <p className="text-[#4B5563] text-md">
              ( {dataset.review_count} ratings)
            </p> */}
              </span>
            ) : (
              <p className="text-gray-500 text-xs">No ratings yet</p>
            )}
          </h4>
        </div>
      </div>

      <hr className=" mt-2 border-t border-[#ddeeff] -mx-6" />

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handleSingleDataModal(dataset)}
          className=" py-2 px-3 h-10 rounded border border-[#D9D9D9] border-2 bg-[#ffffff] transition transform hover:translate-y-[3px] hover:shadow-outer hover:bg-[#b1e9d1] text-[#0F4539]  flex items-center space-x-1"
        >
          <img src={view_icon} alt="View" className="w-4 h-4" />
          <span className="font-bold">View Details</span>
        </button>

        <button
          onClick={() => handleDownloadDataClick(dataset)}
          className="py-1 px-2 h-10 rounded bg-gradient-to-b from-[#115443] to-[#26A37E] text-[#ffffff] flex items-center space-x-1 transition transform hover:translate-y-[3px] hover:shadow-outer"
        >
          <img
            src={download_arrow_icon}
            alt="Download"
            className="w-4 h-4 invert "
          />
          <span className="font-bold">Download</span>
        </button>
      </div>
    </div>
  );
};

// Adding PropTypes for validation
DatasetCard.propTypes = {
  dataset: PropTypes.shape({
    title: PropTypes.string.isRequired,
    is_premium: PropTypes.bool.isRequired,
    price: PropTypes.number,
    dataset_author: PropTypes.arrayOf(
      PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
      }),
    ).isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    profiteers: PropTypes.object.isRequired,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    size_bytes: PropTypes.string.isRequired,
    download_count: PropTypes.number.isRequired,
    review_count: PropTypes.number,
    average_review: PropTypes.number,
  }).isRequired,
  handleSingleDataModal: PropTypes.func.isRequired,
  handleDownloadDataClick: PropTypes.func.isRequired,
};

export default DatasetCard;

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
import type { IDataset } from '@/lib/types/data-set';
import { CheckIcon, Star, User, X } from 'lucide-react';

type DatasetCardProps = {
  dataset: IDataset;
  handleSingleDataModal: (dataset: IDataset) => void;
  handleDownloadDataClick: (dataset: IDataset) => void;
};

const DatasetCard = ({
  dataset,
  handleSingleDataModal,
  handleDownloadDataClick,
}: DatasetCardProps) => {
  const intendedAudienceIcons = {
    non_profit: non_profit_icon,
    company: company_icon,
    students: student_icon,
    public: public_icon,
  };
  const renderStars = (rating: number | null) => {
    if (rating === null || rating === 0) {
      return <span className="text-gray-500">No ratings yet</span>;
    }

    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={index < rating ? 'text-[#757185]' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="border w-full border-subtle bg-white p-4 rounded-lg  hover:shadow-2xl transition transform  duration-300 hover:translate-y-[-10px]">
      <div className="flex justify-between">
        <p className="bg-subtle text-md font-bold text-[#188366] px-2 rounded">
          {dataset.is_premium ? `$${dataset.price}` : 'Free'}
        </p>
      </div>

      <div className="flex justify-between mt-2">
        <h3 className="font-semibold text-lg">{dataset.title}</h3>
      </div>

      <div className="flex flex-wrap items-center space-x-2 mt-2">
        <User className="text-[#757185] w-4 h-4 " />
        {dataset.authors.map((author, index) => (
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
            className="bg-[#ffffff] text-[#101827] font-bold rounded px-3 py-1 text-xs border border-[#E5E7EB]"
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
        {Object.entries(dataset?.intended_audience || {}).map(
          ([profiteer, status], index) => (
            <div
              key={index}
              className="bg-[#EFFDF4] rounded px-2 py-1 text-xs font-bold text-[#101827] flex items-center gap-1"
            >
              <img
                src={
                  intendedAudienceIcons[
                    profiteer as keyof typeof intendedAudienceIcons
                  ]
                }
                alt={`${profiteer} icon`}
                className="w-1 h-1 "
              />
              <span>
                {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
              </span>
              {status ? (
                <CheckIcon className="text-green-500" size={16} />
              ) : (
                <X className="text-red-500" size={16} />
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
          className=" py-2 px-3 h-10 rounded border border-[#D9D9D9]  bg-[#ffffff] transition transform hover:translate-y-[3px] hover:shadow-outer hover:bg-[#b1e9d1] text-[#0F4539]  flex items-center space-x-1"
        >
          <img src={view_icon} alt="View" className="w-4 h-4" />
          <span className="font-semibold text-sm">View Details</span>
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
          <span className="font-bold text-sm">Download</span>
        </button>
      </div>
    </div>
  );
};

export default DatasetCard;

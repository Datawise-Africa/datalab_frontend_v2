import PropTypes from "prop-types";
import { FaUser, FaCheck, FaTimes,FaStar } from "react-icons/fa";

// Importing icons
import non_profit_icon from "/assets/datalab/non-profit-icon.svg";
import company_icon from "/assets/datalab/company-icon.svg";
import student_icon from "/assets/datalab/student-icon.svg";
import public_icon from "/assets/datalab/public2-icon.svg";
import spinning_timer_icon from "/assets/datalab/spinning-timer.svg";
import database_icon from "/assets/datalab/db-icon.svg";
import download_icon from "/assets/datalab/download-icon.svg";
import download_arrow_icon from "/assets/datalab/download-arrow-icon.svg";
import view_icon from "/assets/datalab/view-icon.svg";

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
        className={index < rating ? "text-yellow-500" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="border border-[#ADA8C3] p-6 rounded-xl shadow-md">
      <div className="flex justify-between">
        <h3 className="font-semibold text-xl">{dataset.title}</h3>
        <div>
          <p className="bg-[#ddeeff] text-[#0E0C15] px-2 rounded-md">
            {dataset.is_premium ? `$${dataset.price}` : "Free"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center space-x-2">
        <FaUser className="text-[#757185] w-4 h-4" />
        {dataset.dataset_author.map((author, index) => (
          <small key={index} className="text-[#757185] text-xs">
            {author?.first_name} {author?.last_name}
          </small>
        ))}
      </div>

      <p className="pt-2">{dataset.description}</p>

      <div className="pt-2 flex flex-wrap gap-2">
        {dataset.tags.map((tag, index) => (
          <div
            key={index}
            className="bg-[#EFFDF4] text-[#101827] font-bold rounded-lg px-3 py-1 text-xs"
          >
            {tag}
          </div>
        ))}
      </div>

      <div className="pt-2 flex flex-wrap gap-2">
        {Object.entries(dataset?.profiteers || {}).map(
          ([profiteer, status], index) => (
            <div
              key={index}
              className="bg-[#EFFDF4] rounded-lg px-2 py-1 text-sm font-bold text-[#101827] flex items-center gap-1"
            >
              <img
                src={profiteerIcons[profiteer]}
                alt={`${profiteer} icon`}
                className="w-3 h-3 "
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
          )
        )}
      </div>
{/* ⭐ Star Rating Display */}
<div className="mt-4">
  <h4 className="text-lg font-semibold">Dataset Rating:</h4>
  {dataset.review_count > 0 ? (
    <div className="flex items-center space-x-2">
      <div className="flex">{renderStars(Math.round(dataset.average_review) || 0)}</div>
      <p className="text-yellow-500 text-md">
        ( {dataset.review_count} ratings)
      </p>
    </div>
  ) : (
    <p className="text-gray-500">No ratings yet</p>
  )}
</div>
      <div className="pt-5 flex flex-wrap space-x-3">
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
          <img src={download_icon} alt="download" className="w-4 h-4 "  />
          <span className="ml-1 text-[#101827] text-xs">
            {dataset.download_count} downloads
          </span>
        </div>
      </div>

      <hr className="mt-8 border-t border-[#ddeeff] -mx-6" />

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handleSingleDataModal(dataset)}
          className=" py-2 px-3 rounded-xl bg-[#0E0C15] hover:bg-[#252134] text-[#ddeeff] flex items-center space-x-1"
        >
          <img src={view_icon} alt="View" className="w-6 h-6" />
          <span>View Details</span>
        </button>

        <button
          onClick={() => handleDownloadDataClick(dataset)}
          className=" py-2 px-3 rounded-xl bg-[#ddeeff] hover:bg-[#FFC876] text-[#0E0C15] flex items-center space-x-1"
        >
          <img src={download_arrow_icon} alt="Download" className="w-6 h-6" />
          <span>Download</span>
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
      })
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

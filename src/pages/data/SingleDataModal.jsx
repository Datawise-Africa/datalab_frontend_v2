import PropTypes from "prop-types";
import { FaUser, FaCheck, FaTimes, FaStar } from "react-icons/fa";
import Modal from "../../components/Modals/DataModals/Modal";
import useDataModal from "../../hooks/useDataModal";
import non_profit_icon from "/assets/datalab/non-profit-icon.svg";
import company_icon from "/assets/datalab/company-icon.svg";
import student_icon from "/assets/datalab/student-icon.svg";
import public_icon from "/assets/datalab/public2-icon.svg";
import spinning_timer_icon from "/assets/datalab/spinning-timer.svg";
import database_icon from "/assets/datalab/db-icon.svg";
import download_icon from "/assets/datalab/download-icon.svg";
import DatasetPreview from "./DatasetPreview";

const profiteerIcons = {
  non_profit: non_profit_icon,
  company: company_icon,
  students: student_icon,
  public: public_icon,
};

const renderStars = (rating) => {
  if (rating === null || rating === 0) {
    return <span className="text-gray-500">No ratings yet</span>; // Show a message instead of stars
  }

  return [...Array(5)].map((_, index) => (
    <FaStar
      key={index}
      className={index < rating ? "text-yellow-500" : "text-gray-300"}
    />
  ));
};

const SingleDataModal = ({ dataset }) => {
  const dataModal = useDataModal();
  const {
    title,
    is_premium,
    price,
    dataset_author,
    description,
    tags,
    profiteers,
    updated_at,
    size_bytes,
    download_count,
    covered_regions,
    keywords,
    data_files,
    review_count,
    average_review,
  } = dataset;
  return (
    <Modal
      isOpen={dataModal.isOpen}
      close={dataModal.close}
      content={
        <div className=" p-6 rounded-xl  bg-[#FFFFFF] ">
          <div className="flex justify-between mb-2 ">
          <p className="bg-[#EEFBF5] text-md font-bold text-[#188366] px-4 rounded ">
            {is_premium ? `$${price}` : "Free"}
          </p>
          </div>
          {/* Title */}
          <div className="flex justify-between">
            <h3 className="font-bold text-black text-2xl mb-2">{title}</h3>
          </div>

          {/* Author Details */}
          <div className="flex flex-wrap items-center space-x-2">
            <FaUser className="text-[#757185] w-2 h-4" />
            {dataset_author.map(({ first_name, last_name }, index) => (
              <small key={index} className="text-[#757185] text-xs">
                {first_name} {last_name}
              </small>
            ))}
          </div>

          {/* Description */}
          <p className="pt-2 text-[#4B5563]">{description}</p>

          {/* Tags */}
          <div className="pt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className=" text-[#0F2542] rounded-lg px-3 py-1 text-xs"
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Profiteers */}
          <div className="pt-2 flex flex-wrap gap-2">
            {Object.entries(profiteers || {}).map(
              ([profiteer, status], index) => (
                <div
                  key={index}
                  className="bg-[#EFFDF4] rounded-lg px-1 py-1 text-xs text-[#101827] flex items-center gap-1"
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
              )
            )}
          </div>
          {/* ⭐ Star Rating Display */}
          <div className="mt-4">
            <h4 className="text-lg text-[#0F2542] font-semibold">
              Dataset Rating:
            </h4>
            {review_count > 0 ? (
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {renderStars(Math.round(average_review) || 0)}
                </div>
                <p className="text-yellow-500 text-md">
                  ( {review_count} ratings)
                </p>
              </div>
            ) : (
              <p className="text-[#0F2542]">No ratings yet</p>
            )}
          </div>

          {/* Dataset Metadata */}
          <div className="pt-5 flex flex-wrap space-x-3">
            <MetadataItem
              icon={spinning_timer_icon}
              label={`Updated: ${updated_at}`}
            />
            <MetadataItem icon={database_icon} label={`CSV (${size_bytes})`} />
            <MetadataItem
              icon={download_icon}
              label={`${download_count} downloads`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg text-[#0F2542] font-semibold">
                Covered Regions
              </h4>
              <p className="pt-2 text-[#0F2542]">
                {covered_regions
                  .map((regionObj) => regionObj.region)
                  .join(", ")}
              </p>
            </div>
            <div>
              <h4 className="text-lg  text-[#0F2542] font-semibold">
                Keywords
              </h4>
              <p className="text-[#0F2542]">
                {" "}
                {keywords
                  .map((keywordObj) => keywordObj.keyword)
                  .join(", ")}{" "}
              </p>
            </div>
          </div>

          {/* Dataset Preview */}
          <Section>
            <h4 className="text-lg text-[#0F2542] font-semibold">
              Dataset Review
            </h4>
            <DatasetPreview dataFiles={data_files} />
          </Section>
        </div>
      }
    />
  );
};

const MetadataItem = ({ icon, label }) => (
  <div className="flex text-[#0F2542]">
    <img src={icon} alt={label} className="w-4 h-4" />
    <span className="ml-1  text-xs">{label}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="pt-4">
    <h4 className="font-semibold text-xl text-[#ddeeff]">{title}</h4>
    <div className="pt-2">{children}</div>
  </div>
);

SingleDataModal.propTypes = {
  dataset: PropTypes.shape({
    title: PropTypes.string.isRequired,
    is_premium: PropTypes.bool.isRequired,
    price: PropTypes.number,
    dataset_author: PropTypes.arrayOf(
      PropTypes.shape({
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
      })
    ).isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    profiteers: PropTypes.object,
    updated_at: PropTypes.string.isRequired,
    size_bytes: PropTypes.string.isRequired,
    download_count: PropTypes.number.isRequired,
    covered_regions: PropTypes.arrayOf(
      PropTypes.shape({ region: PropTypes.string.isRequired })
    ).isRequired,
    keywords: PropTypes.arrayOf(
      PropTypes.shape({ keyword: PropTypes.string.isRequired })
    ).isRequired,
    data_files: PropTypes.array.isRequired,
    review_count: PropTypes.number.isRequired,
    average_review: PropTypes.number.isRequired,
  }).isRequired,
};
MetadataItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default SingleDataModal;

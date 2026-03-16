import Modal from '@/components/Modals/DataModals/Modal';
import useDataModal from '@/store/use-data-modal';
import DatasetPreview from './DatasetPreview';
import type { IDataset } from '@/lib/types/data-set';
import { Check, Star, User, X } from 'lucide-react';

const profiteerIcons: Record<string, any> = {
  non_profit: '/assets/datalab/non-profit-icon.svg',
  company: '/assets/datalab/company-icon.svg',
  students: '/assets/datalab/student-icon.svg',
  public: '/assets/datalab/public2-icon.svg',
};

const renderStars = (rating: number | null) => {
  if (rating === null || rating === 0) {
    return <span className="text-gray-500">No ratings yet</span>; // Show a message instead of stars
  }

  return [...Array(5)].map((_, index) => (
    <Star
      key={index}
      className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
    />
  ));
};

type SingleDataModalProps = {
  dataset: IDataset;
};
const SingleDataModal = ({ dataset }: SingleDataModalProps) => {
  const dataModal = useDataModal();
  const {
    title,
    is_premium,
    price,
    authors: dataset_author,
    description,
    tags,
    intended_audience: profiteers,
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
        <div className="rounded-xl bg-[#FFFFFF] p-6">
          <div className="mb-2 flex justify-between">
            <p className="text-md rounded bg-[#EEFBF5] px-4 font-bold text-[#188366]">
              {is_premium ? `$${price}` : 'Free'}
            </p>
          </div>
          {/* Title */}
          <div className="flex justify-between">
            <h3 className="mb-2 text-2xl font-bold text-black">{title}</h3>
          </div>

          {/* Author Details */}
          <div className="flex flex-wrap items-center space-x-2">
            <User className="h-4 w-2 text-[#757185]" />
            {dataset_author?.map(({ first_name, last_name }, index) => (
              <small key={index} className="text-xs text-[#757185]">
                {first_name} {last_name}
              </small>
            ))}
          </div>

          {/* Description */}
          <p className="pt-2 text-[#4B5563]">{description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="rounded-lg px-3 py-1 text-xs text-[#0F2542]"
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Profiteers */}
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(profiteers || {}).map(
              ([profiteer, status], index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-lg bg-[#EFFDF4] px-1 py-1 text-xs text-[#101827]"
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
          {/* ⭐ Star Rating Display */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-[#0F2542]">
              Dataset Rating:
            </h4>
            {review_count > 0 ? (
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {renderStars(Math.round(average_review) || 0)}
                </div>
                <p className="text-md text-yellow-500">
                  ( {review_count} ratings)
                </p>
              </div>
            ) : (
              <p className="text-[#0F2542]">No ratings yet</p>
            )}
          </div>

          {/* Dataset Metadata */}
          <div className="flex flex-wrap space-x-3 pt-5">
            <MetadataItem
              icon={'/assets/datalab/spinning-timer.svg'}
              label={`Updated: ${updated_at}`}
            />
            <MetadataItem
              icon={'/assets/datalab/db-icon.svg'}
              label={`CSV (${size_bytes})`}
            />
            <MetadataItem
              icon={'/assets/datalab/download-icon.svg'}
              label={`${download_count} downloads`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-semibold text-[#0F2542]">
                Covered Regions
              </h4>
              <p className="pt-2 text-[#0F2542]">
                {(Array.isArray(covered_regions) ? covered_regions : [])
                  .map((regionObj) => regionObj.region)
                  .join(', ')}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#0F2542]">Keywords</h4>
              <p className="text-[#0F2542]">
                {' '}
                {(Array.isArray(keywords) ? keywords : [])
                  .map((keywordObj) => keywordObj.keyword)
                  .join(', ')}{' '}
              </p>
            </div>
          </div>

          {/* Dataset Preview */}
          <Section>
            <h4 className="text-lg font-semibold text-[#0F2542]">
              Dataset Review
            </h4>
            <DatasetPreview dataFiles={data_files} />
          </Section>
        </div>
      }
    />
  );
};

type MetadataItemProps = {
  icon: string;
  label: string;
};
const MetadataItem = ({ icon, label }: MetadataItemProps) => (
  <div className="flex text-[#0F2542]">
    <img src={icon} alt={label} className="h-4 w-4" />
    <span className="ml-1 text-xs">{label}</span>
  </div>
);
type SectionProps = {
  title?: string;
  children: React.ReactNode;
};
const Section = ({ title, children }: SectionProps) => (
  <div className="pt-4">
    <h4 className="text-xl font-semibold text-[#ddeeff]">{title}</h4>
    <div className="pt-2">{children}</div>
  </div>
);

export default SingleDataModal;

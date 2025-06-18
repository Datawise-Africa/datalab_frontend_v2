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
import { Button } from '../ui/button';
import { useState } from 'react';
import {
  CheckIcon,
  Star,
  User,
  X,
  MoreVertical,
  Download,
  Eye,
  Bookmark,
  Link,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import moment from 'moment';
type DatasetCardProps = {
  dataset: IDataset;
  handleSingleDataModal: (dataset: IDataset) => void;
  handleDownloadDataClick: (dataset: IDataset) => void;
  handleShareDataset?: (dataset: IDataset) => void;
  handleBookmarkDataset?: (dataset: IDataset) => void;
  handleQuickDownload?: (dataset: IDataset) => void;
  isDatasetBookmarked?: (dataset: IDataset | number) => boolean;
  isBookmarksLoading?: boolean;
  isBookmarked?: boolean; // ✅ NEW
  onBookmarkToggle?: () => void; // ✅ NEW
};

const DatasetCard = ({
  dataset,
  handleSingleDataModal,
  handleDownloadDataClick,
  handleBookmarkDataset,
  handleShareDataset,
  isBookmarked,
}: DatasetCardProps) => {
  const intendedAudienceIcons = {
    non_profit: non_profit_icon,
    company: company_icon,
    students: student_icon,
    public: public_icon,
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

//   return (
//     <div className="relative">
//   {isMenuOpen && (
//     <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-10 rounded-lg pointer-events-none" />
//   )}

//   <div
//     className={`relative z-20 w-full bg-white p-4 rounded-xl transition-all duration-300 ${
//       isMenuOpen
//         ? 'shadow-[0_10px_50px_rgba(0,0,0,0.4)] scale-[1.03] border-[#188366]'
//         : 'hover:shadow-2xl hover:translate-y-[-10px] border-subtle'
//     }`}
//   >

//         <div className="flex justify-between">
//         <p className="bg-subtle text-md font-bold text-[#188366] px-2 rounded">
//           {dataset.is_premium ? `$${dataset.price}` : 'Free'}
//         </p>
//         <DropdownMenu     onOpenChange={(open) => setIsMenuOpen(open)}
//    >
//           <DropdownMenuTrigger asChild>
//             <Button className="p-1 bg-white hover:bg-white  transition-colors">
//               <MoreVertical className="w-5 h-5 text-gray-600 " />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-40">
//             <DropdownMenuItem
//               className="cursor-pointer"
//               onClick={() => handleBookmarkDataset?.(dataset)}
//             >
//               <Bookmark
//                 className={`w-4 h-4 mr-2 ${
//                   isBookmarked ? 'text-yellow-500 fill-yellow-500' : ''
//                 }`}
//               />
//               {isBookmarked ? 'Remove Bookmark' : 'Save'}
//             </DropdownMenuItem>

//             <DropdownMenuItem
//               onClick={() => handleShareDataset?.(dataset)}
//               className="cursor-pointer"
//             >
//               <Link className="w-4 h-4 mr-2" />
//               Copy Link
//             </DropdownMenuItem>

//             <DropdownMenuItem
//               onClick={() => handleSingleDataModal(dataset)}
//               className="cursor-pointer"
//             >
//               <Eye className="w-4 h-4 mr-2" />
//               View Details
//             </DropdownMenuItem>

//             <DropdownMenuItem
//               onClick={() => handleDownloadDataClick?.(dataset)}
//               className="cursor-pointer"
//             >
//               <Download className="w-4 h-4 mr-2" />
//               Download
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <div className="flex justify-between mt-2">
//         <h3 className="font-semibold text-lg">{dataset.title}</h3>
//       </div>

//       <div className="flex flex-wrap items-center space-x-2 mt-2">
//         <User className="text-[#757185] w-4 h-4 " />
//         {dataset.authors.map((author, index) => (
//           <small key={index} className="text-[#4B5563] text-xs font-bold">
//             {author?.first_name} {author?.last_name}
//           </small>
//         ))}
//       </div>

//       <p className="pt-2 text-sm text-[#4B5563] mt-1">
//         {dataset.description.split(' ').slice(0, 10).join(' ')}
//         {dataset.description.split(' ').length > 10 ? '...' : ''}
//       </p>

//       <div className="pt-2 flex flex-wrap gap-2">
//         {dataset.tags.map((tag, index) => (
//           // <div
//           //   key={index}
//           //   className="bg-[#ffffff] text-[#101827] font-bold rounded px-3 py-1 text-xs border border-[#E5E7EB]"
//           // >
//           //   {tag}
//           // </div>
//           <Badge
//             key={index}
//             variant="outline"
//             className="text-[#0F2542] rounded-lg px-3 py-1 text-xs border-gray-300"
//           >
//             {tag}
//           </Badge>
//         ))}
//       </div>

//       <div>
//         <p className="text-[#333333] font-semibold text-xs mt-2">
//           Available to:
//         </p>
//       </div>

//       <div className="pt-2 flex flex-wrap gap-2">
//         {Object.entries(dataset?.intended_audience || {}).map(
//           ([profiteer, status], index) => (
//             <div
//               key={index}
//               className="bg-[#EFFDF4] rounded px-2 py-1 text-xs font-bold text-[#101827] flex items-center gap-1"
//             >
//               <img
//                 src={
//                   intendedAudienceIcons[
//                     profiteer as keyof typeof intendedAudienceIcons
//                   ]
//                 }
//                 alt={`${profiteer} icon`}
//                 className="w-1 h-1 "
//               />
//               <span>
//                 {profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}
//               </span>
//               {status ? (
//                 <CheckIcon className="text-green-500" size={16} />
//               ) : (
//                 <X className="text-red-500" size={16} />
//               )}
//             </div>
//           ),
//         )}
//       </div>

//       <div className="pt-5 flex flex-col space-y-2">
//         <div className="flex items-center">
//           <img src={spinning_timer_icon} alt="timer" className="w-4 h-4" />
//           <span className="ml-1 text-[#101827] text-xs">
//             Created: {moment(dataset.created_at).format('MMMM Do YYYY')}
//           </span>
//         </div>
//         <div className="flex items-center">
//           <img src={database_icon} alt="database" className="w-4 h-4" />
//           <span className="ml-1 text-[#101827] text-xs">
//             CSV ({dataset.size_bytes})
//           </span>
//         </div>

//         <div className="flex items-center">
//           <img src={download_icon} alt="download" className="w-4 h-4 " />
//           <span className="ml-1 text-[#101827] text-xs">
//             {dataset.download_count} downloads
//           </span>
//         </div>

//         <div className="mt-1 flex flex-row items-center justify-between">
//           <h4 className="text-xs">
//             Dataset Review:{' '}
//             {dataset.review_count > 0 ? (
//               <span className="flex items-center space-x-1">
//                 <span className="flex">
//                   {renderStars(Math.round(dataset.average_review) || 0)}
//                 </span>
//                 {/* <p className="text-[#4B5563] text-md">
//               ( {dataset.review_count} ratings)
//             </p> */}
//               </span>
//             ) : (
//               <p className="text-gray-500 text-xs">No ratings yet</p>
//             )}
//           </h4>
//         </div>
//       </div>

//       <hr className=" mt-2 border-t border-[#ddeeff]" />

//       <div className="mt-4 flex justify-between">
//         <button
//           onClick={() => handleSingleDataModal(dataset)}
//           className=" py-2 px-3 h-10 rounded border border-[#D9D9D9]  bg-[#ffffff] transition transform hover:translate-y-[3px] hover:shadow-outer hover:bg-[#b1e9d1] text-[#0F4539]  flex items-center space-x-1"
//         >
//           <img src={view_icon} alt="View" className="w-4 h-4" />
//           <span className="font-semibold text-sm">View Details</span>
//         </button>

//         <button
//           onClick={() => handleDownloadDataClick(dataset)}
//           className="py-1 px-2 h-10 rounded bg-gradient-to-b from-[#115443] to-[#26A37E] text-[#ffffff] flex items-center space-x-1 transition transform hover:translate-y-[3px] hover:shadow-outer"
//         >
//           <img
//             src={download_arrow_icon}
//             alt="Download"
//             className="w-4 h-4 invert "
//           />
//           <span className="font-bold text-sm">Download</span>
//         </button>
//       </div>
//     </div>
//     </div>
//   );
// };
return (
  <div className="relative">
    {isMenuOpen && (
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-10 rounded-xl pointer-events-none" />
    )}

    <div
      className={`relative z-20 w-full bg-white p-4 rounded-xl border transition-all duration-200 ${
        isMenuOpen ? "shadow-xl border-gray-300 backdrop-blur-sm" : "hover:shadow-md border-gray-100"
      }`}
    >
      <div className="flex justify-between">
        <p className="bg-subtle text-md font-bold text-[#188366] px-2 rounded">
          {dataset.is_premium ? `$${dataset.price}` : "Free"}
        </p>
        <DropdownMenu onOpenChange={(open) => setIsMenuOpen(open)}>
          <DropdownMenuTrigger asChild>
            <Button className="p-1 bg-transparent hover:bg-gray-50 border-0 shadow-none">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="right"
            sideOffset={-120}
            alignOffset={5}
            className="w-56 shadow-xl border-gray-200 z-50"
            avoidCollisions={false}
          >
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleBookmarkDataset?.(dataset)}>
              <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "text-yellow-500 fill-yellow-500" : ""}`} />
              {isBookmarked ? "Remove Bookmark" : "Save"}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleShareDataset?.(dataset)} className="cursor-pointer">
              <Link className="w-4 h-4 mr-2" />
              Copy Link
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleSingleDataModal(dataset)} className="cursor-pointer">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleDownloadDataClick?.(dataset)} className="cursor-pointer">
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        {dataset.description.split(" ").slice(0, 10).join(" ")}
        {dataset.description.split(" ").length > 10 ? "..." : ""}
      </p>

      <div className="pt-2 flex flex-wrap gap-2">
        {dataset.tags.map((tag, index) => (
          // <div
          //   key={index}
          //   className="bg-[#ffffff] text-[#101827] font-bold rounded px-3 py-1 text-xs border border-[#E5E7EB]"
          // >
          //   {tag}
          // </div>
          <Badge
            key={index}
            variant="outline"
            className="text-[#0F2542] rounded-lg px-3 py-1 text-xs border-gray-300"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div>
        <p className="text-[#333333] font-semibold text-xs mt-2">Available to:</p>
      </div>

      <div className="pt-2 flex flex-wrap gap-2">
        {Object.entries(dataset?.intended_audience || {}).map(([profiteer, status], index) => (
          <div
            key={index}
            className="bg-[#EFFDF4] rounded px-2 py-1 text-xs font-bold text-[#101827] flex items-center gap-1"
          >
            <img
              src={intendedAudienceIcons[profiteer as keyof typeof intendedAudienceIcons] || "/placeholder.svg"}
              alt={`${profiteer} icon`}
              className="w-1 h-1 "
            />
            <span>{profiteer.charAt(0).toUpperCase() + profiteer.slice(1)}</span>
            {status ? <CheckIcon className="text-green-500" size={16} /> : <X className="text-red-500" size={16} />}
          </div>
        ))}
      </div>

      <div className="pt-5 flex flex-col space-y-2">
        <div className="flex items-center">
          <img src={spinning_timer_icon || "/placeholder.svg"} alt="timer" className="w-4 h-4" />
          <span className="ml-1 text-[#101827] text-xs">
            Created: {moment(dataset.created_at).format("MMMM Do YYYY")}
          </span>
        </div>
        <div className="flex items-center">
          <img src={database_icon || "/placeholder.svg"} alt="database" className="w-4 h-4" />
          <span className="ml-1 text-[#101827] text-xs">CSV ({dataset.size_bytes})</span>
        </div>

        <div className="flex items-center">
          <img src={download_icon || "/placeholder.svg"} alt="download" className="w-4 h-4 " />
          <span className="ml-1 text-[#101827] text-xs">{dataset.download_count} downloads</span>
        </div>

        <div className="mt-1 flex flex-row items-center justify-between">
          <h4 className="text-xs">
            Dataset Review:{" "}
            {dataset.review_count > 0 ? (
              <span className="flex items-center space-x-1">
                <span className="flex">{renderStars(Math.round(dataset.average_review) || 0)}</span>
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

      <hr className=" mt-2 border-t border-[#ddeeff]" />

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handleSingleDataModal(dataset)}
          className=" py-2 px-3 h-10 rounded border border-[#D9D9D9]  bg-[#ffffff] transition transform hover:translate-y-[3px] hover:shadow-outer hover:bg-[#b1e9d1] text-[#0F4539]  flex items-center space-x-1"
        >
          <img src={view_icon || "/placeholder.svg"} alt="View" className="w-4 h-4" />
          <span className="font-semibold text-sm">View Details</span>
        </button>

        <button
          onClick={() => handleDownloadDataClick(dataset)}
          className="py-1 px-2 h-10 rounded bg-gradient-to-b from-[#115443] to-[#26A37E] text-[#ffffff] flex items-center space-x-1 transition transform hover:translate-y-[3px] hover:shadow-outer"
        >
          <img src={download_arrow_icon || "/placeholder.svg"} alt="Download" className="w-4 h-4 invert " />
          <span className="font-bold text-sm">Download</span>
        </button>
      </div>
    </div>
  </div>
)
}


export default DatasetCard;

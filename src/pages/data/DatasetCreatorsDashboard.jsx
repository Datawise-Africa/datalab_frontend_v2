import React , {useState} from 'react';
import Sidebar from './Sidebar';

import datasetIllustration from '/assets/datalab/datasetcreatorsimage.svg';
import { useAuth } from '../../storage/AuthProvider';
import DatasetUploadModal from "./DataUploadModal";

const DatasetCreatorsDashboard = () => {
  const { state } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex mt-10 lg:mt-10">
      <Sidebar />
      <div className="p-6 w-3/4 lg:w-[calc(95%-150px)]  max-h-screen border-l">
        {/* Top Section */}
        <div className="mb-6 mt-20 ">
          <h1 className="text-xl font-semibold mb-1">
            Welcome, {state.firstName}{' '}
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Jump back in, or start something new.
          </p>

          <div className="flex gap-3">
            <button className="px-4 py-2 border border-[#115443] text-[#115443] transition transform hover:translate-y-[3px]  rounded font-medium hover:bg-green-50 duration-300 transition">
              Explore Datasets
            </button>
            <button className="px-4 py-2 bg-gradient-to-b from-[#115443] to-[#26A37E] transition transform hover:translate-y-[3px] text-[#ffffff]  rounded font-medium transition"
              onClick={() => setModalOpen(true)} >
              
              + Add Dataset
            </button>

            <DatasetUploadModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>

        {/* Center Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm   mt-20">
          <img
            src={datasetIllustration}
            alt="No datasets"
            className="mx-auto mb-6 max-h-48 object-contain"
          />

          <h2 className="text-lg font-semibold mb-2">No datasets yet</h2>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            Start by uploading your first dataset. Once uploaded, you’ll be able
            to manage, license, and share it from your dashboard.
          </p>

          {/* <button className="px-5 py-2 bg-gradient-to-b from-[#115443] to-[#26A37E] text-[#ffffff]  rounded font-medium hover:bg-green-700 transition">
            + Add Dataset
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default DatasetCreatorsDashboard;

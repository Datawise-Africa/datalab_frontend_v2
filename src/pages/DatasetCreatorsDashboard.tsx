// import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
// import DatasetUploadModal from '../components/data-catalog/DataUploadModal';
import DatasetUploadForm from '@/components/dataset-upload/dataset-upload-form.tsx';
import { Button } from '@/components/ui/button';

const DatasetCreatorsDashboard = () => {
  const { state } = useAuth();
  // const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="mt-10 flex lg:mt-10">
      {/* <Sidebar /> */}
      <div className="max-h-screen w-3/4 border-l p-6 lg:w-[calc(95%-150px)]">
        {/* Top Section */}
        <div className="mt-20 mb-6">
          <h1 className="mb-1 text-xl font-semibold">
            Welcome, {state.firstName}{' '}
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            Jump back in, or start something new.
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant={'outline'}
              className="transform cursor-pointer rounded border-[#115443] px-6 py-4 whitespace-nowrap text-[#115443] transition duration-300 hover:bg-green-50"
            >
              Explore Datasets
            </Button>
            {/* <button
              className="px-4 py-2 bg-gradient-to-b from-[#115443] to-[#26A37E] transition transform hover:translate-y-[3px] text-[#ffffff]  rounded font-medium"
              onClick={() => setModalOpen(true)}
            >
              + Add Dataset
            </button> */}

            {/* <DatasetUploadModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
            /> */}
            <DatasetUploadForm />
          </div>
        </div>

        {/* Center Card */}
        <div className="mt-20 rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
          <img
            src={'/assets/datalab/datasetcreatorsimage.svg'}
            alt="No datasets"
            className="mx-auto mb-6 max-h-48 object-contain"
          />

          <h2 className="mb-2 text-lg font-semibold">No datasets yet</h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-gray-600">
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

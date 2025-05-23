import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import Papa from 'papaparse';

import apiService from '../../services/apiService';
import type { IDatasetDataFile } from '@/lib/types/data-set';

type DatasetPreviewProps = {
  dataFiles: IDatasetDataFile[];
};

const DatasetPreview = ({ dataFiles }: DatasetPreviewProps) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dataFiles.length > 0) {
      const csvFileUrl = dataFiles[0]?.file_url;

      if (csvFileUrl) {
        const getDataFile = async () => {
          try {
            const response = await apiService.getDataFile(csvFileUrl);
            const csvText = await (response as any).text();
            const parsed = Papa.parse(csvText, {
              header: true,
              skipEmptyLines: true,
              delimiter: ',',
              transform: (value) => value.trim(),
            });

            if (parsed.errors.length > 0) {
              console.error('CSV Parsing Errors:', parsed.errors);
              // throw new Error(
              //     `Error parsing CSV: ${parsed.errors.map(e => e.message).join(', ')}`
              // );
            }
            setCsvData(parsed.data);
          } catch (error: any) {
            setError(error.message);
            console.error('Error fetching the data file:', error);
          }
        };
        getDataFile();
      }
    }
  }, [dataFiles]);

  return (
    <div>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      {csvData.length > 0 ? (
        <div className="overflow-auto max-h-96 relative">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr>
                {Object.keys(csvData[0]).map((header, index) => (
                  <th
                    key={index}
                    className="bg-[#188366] font-bold text-left border border-[#CAC6DD] border-r border-l text-[#ddeeff] px-4 py-1 last:border-r-0"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.slice(0, 20).map((row, rowIndex) => (
                <tr key={rowIndex} className="">
                  {Object.values(row).map((value, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-[#CAC6DD] text-black border-r border-l px-4 py-2 last:border-r-0"
                    >
                      {value as any}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-[#ddeeff] text-center">
          No data available for preview
        </p>
      )}
    </div>
  );
};

export default DatasetPreview;

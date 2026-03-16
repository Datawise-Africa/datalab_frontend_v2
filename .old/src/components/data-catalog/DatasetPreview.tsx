import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import Papa from 'papaparse';

// import apiService from '../../services/apiService';
import type { IDatasetDataFile } from '@/lib/types/data-set';
import { useAxios } from '@/hooks/use-axios';
import { extractCorrectErrorMessage } from '@/lib/error';

type DatasetPreviewProps = {
  dataFiles: IDatasetDataFile[];
};

const DatasetPreview = ({ dataFiles }: DatasetPreviewProps) => {
  const axiosClient = useAxios();
  const [csvData, setCsvData] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const getDataFile = async (url: string) => {
    try {
      const response = await axiosClient.get(url, {
        headers: {
          Accept: 'text/csv',
          'Content-Type': 'text/csv',
          responseType: 'text/plain; charset=UTF-8',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data file:', error);
      throw Error(
        extractCorrectErrorMessage(error, 'Failed to fetch data file'),
      );
    }
  };
  useEffect(() => {
    if (dataFiles.length > 0) {
      const csvFileUrl = dataFiles[0]?.s3_url;

      if (csvFileUrl) {
        const getDataFile_ = async () => {
          try {
            const response = await getDataFile(csvFileUrl);
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
        getDataFile_();
      }
    }
  }, [dataFiles]);

  return (
    <div>
      {error && <p className="mt-2 text-red-500">Error: {error}</p>}
      {csvData.length > 0 ? (
        <div className="relative max-h-96 overflow-auto">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr>
                {Object.keys(csvData[0]).map((header, index) => (
                  <th
                    key={index}
                    className="border border-r border-l border-[#CAC6DD] bg-[#188366] px-4 py-1 text-left font-bold text-[#ddeeff] last:border-r-0"
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
                      className="border border-r border-l border-[#CAC6DD] px-4 py-2 text-black last:border-r-0"
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
        <p className="text-center text-[#ddeeff]">
          No data available for preview
        </p>
      )}
    </div>
  );
};

export default DatasetPreview;

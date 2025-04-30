import {useState, useEffect} from 'react';
import PropTypes from 'prop-types'; 
import Papa from 'papaparse';

import apiService from '../../services/apiService';

const DatasetPreview = ({ dataFiles }) => {
    const [csvData, setCsvData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (dataFiles.length > 0) {
            const csvFileUrl = dataFiles[0]?.file_url;

            if (csvFileUrl) {
                const getDataFile = async () => {
                    try {
                        const response = await apiService.getDataFile(csvFileUrl);
                        const csvText = await response.text();
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
                        setCsvData(parsed.data)
                    } catch (error) {
                        setError(error.message);
                        console.error('Error fetching the data file:', error);
                    }
                }
                getDataFile();
            }
        }
    }, [dataFiles]);

    return (
        <div>
            {error && (
                <p className='text-red-500 mt-2'>Error: {error}</p>
            )}
            {csvData.length > 0 ? (
                <div className='overflow-auto max-h-96 relative'>
                    <table className='min-w-full border-collapse'>
                        <thead className='sticky top-0 z-10'>
                            <tr>
                                {Object.keys(csvData[0]).map((header, index) => (
                                    <th key={index} className='bg-[#0E0C15] font-bold text-left border border-[#CAC6DD] border-r border-l text-[#ddeeff] px-4 py-1 last:border-r-0'>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.slice(0, 20).map((row, rowIndex) => (
                                <tr key={rowIndex} className=''>
                                    {Object.values(row).map((value, cellIndex) => (
                                        <td key={cellIndex} className='border border-[#CAC6DD] text-black border-r border-l px-4 py-2 last:border-r-0'>
                                            {value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className='text-[#ddeeff] text-center'>No data available for preview</p>
            )}
        </div>
    )
}

DatasetPreview.propTypes = {
    dataFiles: PropTypes.arrayOf(
        PropTypes.shape({
            file_url: PropTypes.string.isRequired, 
        })
    ).isRequired,
};

export default DatasetPreview

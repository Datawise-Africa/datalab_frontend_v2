import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CsvData {
  headers: string[];
  data: Record<string, any>[];
}

interface BeautifulCsvTableProps {
  csvDataOverall: CsvData;
}

export default function BeautifulCsvTable({
  csvDataOverall,
}: BeautifulCsvTableProps) {
  return (
    <>
      {csvDataOverall.data.length > 0 && (
        <Card className="mx-2 border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg sm:mx-4 lg:mx-0">
          <CardHeader className="px-4 pb-3 sm:px-6 sm:pb-4">
            <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-lg leading-tight font-bold text-transparent sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
              Sample Data Preview
            </CardTitle>
            <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm md:text-base">
              Showing {csvDataOverall.data.length} rows of data
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-900 to-gray-800 hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800">
                    {csvDataOverall.headers.map((header, index) => (
                      <TableHead
                        key={index}
                        className="h-10 border-r border-gray-700 px-2 text-xs font-semibold tracking-wider text-white uppercase last:border-r-0 sm:h-12 sm:px-4 sm:text-sm md:h-14 md:px-6 md:text-base"
                      >
                        <div className="truncate" title={header}>
                          {header}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvDataOverall.data.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className={`transition-colors duration-200 hover:bg-gray-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} `}
                    >
                      {Object.values(row).map((value, colIndex) => (
                        <TableCell
                          key={colIndex}
                          className="border-r border-gray-100 px-2 py-2 text-xs font-medium text-gray-800 last:border-r-0 sm:px-4 sm:py-3 sm:text-sm md:px-6 md:py-4 md:text-base lg:text-lg"
                        >
                          <div
                            className="max-w-[80px] truncate sm:max-w-[120px] md:max-w-xs lg:max-w-sm xl:max-w-md"
                            title={value as string}
                          >
                            {value as string}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Responsive footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-3 py-2 sm:px-4 sm:py-3 md:px-6">
              <p className="text-center text-xs text-gray-500 sm:text-sm">
                <span className="hidden sm:inline">Data preview • </span>
                <span className="sm:hidden">Preview • </span>
                {csvDataOverall.headers.length} columns
                <span className="hidden md:inline">
                  {' '}
                  • {csvDataOverall.data.length} rows
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

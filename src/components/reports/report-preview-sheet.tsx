import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ReportPreviewSheet() {
  return (
    <SheetContent
      side="right"
      className="w-full overflow-y-auto bg-white p-4 sm:max-w-2xl sm:rounded-l-sm sm:border sm:border-gray-200 md:p-6"
    >
      <SheetHeader>
        <SheetTitle>Report Preview</SheetTitle>
        <SheetDescription>
          A summary of your generated report based on current selections.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">9,118</div>
            <div className="text-sm text-gray-500">Total Views</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">3,788</div>
            <div className="text-sm text-gray-500">Downloads</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500">3.5</div>
            <div className="text-sm text-gray-500">Avg Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">167</div>
            <div className="text-sm text-gray-500">Comments</div>
          </div>
        </div>

        <div className="grid gap-2 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold">Datasets Included (1)</h3>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              East African Agricultural Yields (2015-2023)
            </span>
            <Badge variant="secondary">Agriculture</Badge>
          </div>
        </div>

        <div className="grid gap-2 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold">Report Sections</h3>
          <ul className="grid list-inside list-disc grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
            <li>Executive Summary</li>
            <li>Dataset Overview</li>
            <li>Usage Analytics</li>
            <li>Recommendations</li>
            <li>Detailed Tables</li>
          </ul>
        </div>

        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Filters Applied</h3>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-gray-700">
            <div className="font-medium">Date Range:</div>
            <div>Past Month</div>
            <div className="font-medium">Report Type:</div>
            <div>Summary</div>
            <div className="font-medium">Regions:</div>
            <div>All regions</div>
            <div className="font-medium">User Types:</div>
            <div>All user types</div>
          </div>
        </div>
      </div>
      <div className="mt-auto border-t pt-4">
        <Button
          variant="outline"
          className="w-full border-green-600 text-green-600 hover:bg-green-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          Close Preview
        </Button>
      </div>
    </SheetContent>
  );
}

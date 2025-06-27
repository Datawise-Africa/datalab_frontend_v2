import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, Star, MessageSquare, Download, FileText, X } from 'lucide-react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { ReportPreviewSheet } from '@/components/reports/report-preview-sheet';
import { MultiSelect } from '@/components/ui/multi-select';
import { cn } from '@/lib/utils';

export default function DatasetCreatorReportsPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-500">
          Generate custom reports based on your dataset insights
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-6">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Select Datasets</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <MultiSelect
                className="focus:border-primary/40 focus:ring-primary/40 w-full border border-gray-300 bg-white text-gray-800"
                options={[
                  {
                    value: 'dataset1',
                    label: 'East African Agricultural Yields (2015-2023)',
                  },
                  {
                    value: 'dataset2',
                    label: 'Urban Transportation Patterns - Nairobi',
                  },
                  {
                    value: 'dataset3',
                    label: 'West African Healthcare Access Indicators',
                  },
                  {
                    value: 'dataset4',
                    label: 'Global Climate Data (1900-2020)',
                  },
                ]}
              />
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  East African Agricultural Yields (2015-2023)
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  Urban Transportation Patterns - Nairobi
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  West African Healthcare Access Indicators
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select defaultValue="past-month">
                  <SelectTrigger
                    id="date-range"
                    className="w-full border border-gray-300 bg-white text-gray-800"
                  >
                    <SelectValue placeholder="Past Month" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 border border-gray-300 bg-white">
                    <SelectItem
                      value="past-month"
                      className={cn(
                        'selection:bg-primary/20 hover:bg-primary/30',
                      )}
                    >
                      Past Month
                    </SelectItem>
                    <SelectItem
                      value="past-quarter"
                      className={cn(
                        'selection:bg-primary/20 hover:bg-primary/30',
                      )}
                    >
                      Past Quarter
                    </SelectItem>
                    <SelectItem
                      value="past-year"
                      className={cn(
                        'selection:bg-primary/20 hover:bg-primary/30',
                      )}
                    >
                      Past Year
                    </SelectItem>
                    <SelectItem
                      value="custom"
                      className={cn(
                        'selection:bg-primary/20 hover:bg-primary/30',
                      )}
                    >
                      Custom Range
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="report-type">Report</Label>
                <Select defaultValue="summary">
                  <SelectTrigger
                    id="report-type"
                    className="w-full border border-gray-300 bg-white text-gray-800"
                  >
                    <SelectValue placeholder="Summary Report" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 border border-gray-300 bg-white">
                    <SelectItem
                      value="summary"
                      className={cn(
                        'selection:bg-primary/20 hover:bg-primary/30',
                      )}
                    >
                      Summary Report
                    </SelectItem>
                    <SelectItem
                      value="detailed"
                      className={cn(
                        'selection:bg-primary/20 hover:bg-primary/30',
                      )}
                    >
                      Detailed Report
                    </SelectItem>
                    <SelectItem
                      value="custom"
                      className={cn(
                        'selection:bg-primary/20 hover:bg-primary/30',
                      )}
                    >
                      Custom Report
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="geographic">Geographic</Label>
                <Select>
                  <SelectTrigger
                    id="geographic"
                    className="w-full border border-gray-300 bg-white text-gray-800"
                  >
                    <SelectValue placeholder="3 zone(s) selected" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 border border-gray-300 bg-white">
                    <SelectItem
                      value="kenya"
                      className="selection:bg-primary/20 hover:bg-primary/30"
                    >
                      Kenya
                    </SelectItem>
                    <SelectItem
                      value="uganda"
                      className="selection:bg-primary/20 hover:bg-primary/30"
                    >
                      Uganda
                    </SelectItem>
                    <SelectItem
                      value="tanzania"
                      className="selection:bg-primary/20 hover:bg-primary/30"
                    >
                      Tanzania
                    </SelectItem>
                    <SelectItem
                      value="rwanda"
                      className="selection:bg-primary/20 hover:bg-primary/30"
                    >
                      Rwanda
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    Kenya
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    Uganda
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    Tanzania
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-type">User Type</Label>
                <Select>
                  <SelectTrigger
                    id="user-type"
                    className="w-full border border-gray-300 bg-white text-gray-800"
                  >
                    <SelectValue placeholder="2 user type(s) selected" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 border border-gray-300 bg-white">
                    <SelectItem
                      value="non-profit"
                      className="selection:bg-primary/20 hover:bg-primary/30"
                    >
                      Non-Profit
                    </SelectItem>
                    <SelectItem
                      value="public-sector"
                      className="selection:bg-primary/20 hover:bg-primary/30"
                    >
                      Public Sector
                    </SelectItem>
                    <SelectItem
                      value="private-sector"
                      className="selection:bg-primary/20 hover:bg-primary/30"
                    >
                      Private Sector
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    Non-Profit
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    Public Sector
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Metrics to include</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <Checkbox id="views" defaultChecked />
                <Label htmlFor="views" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Views
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="ratings" />
                <Label htmlFor="ratings" className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Ratings
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="comments" />
                <Label htmlFor="comments" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="downloads" />
                <Label htmlFor="downloads" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Downloads
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="sticky top-6 h-fit border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <div className="font-medium">Datasets:</div>
              <div>2 selected</div>
              <div className="font-medium">Date Range:</div>
              <div>Past Month</div>
              <div className="font-medium">Metrics:</div>
              <div>2 selected</div>
              <div className="font-medium">Regions:</div>
              <div>All</div>
              <div className="font-medium">User Types:</div>
              <div>All</div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </SheetTrigger>
              <ReportPreviewSheet />
            </Sheet>
            <Button className="w-full bg-green-600 text-white hover:bg-green-700">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

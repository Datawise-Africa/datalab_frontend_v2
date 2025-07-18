import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { ReportPreviewSheet } from '@/components/reports/report-preview-sheet';
import { useDatasetCreatorReportFiltersStore } from '@/store/dataset-creator-report-filters';
import useDatasetCreatorReport from '@/hooks/use-dataset-creator-report';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import MultiSelect2 from '@/components/ui/MultiSelect2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useDownloadReportsPdf from '@/hooks/use-download-pdf';

// const

export default function DatasetCreatorReportsPage() {
  const { dateRangeOptions, metricsOptions, filters } =
    useDatasetCreatorReportFiltersStore();
  const {
    isReportsLoading,
    isReportsError,
    datasets,
    form,
    selectedDatasets,
    reports,
    refreshReports,
  } = useDatasetCreatorReport();

  const { generateReportAndDownloadPDF, isDownloading: isDownloadingPDF } =
    useDownloadReportsPdf();
  const downloadReport = async () => {
    form.trigger();
    await refreshReports();
    await generateReportAndDownloadPDF({
      reportsData: reports!,
      selectedDatasets: selectedDatasets,
      filters: filters,
    });
  };


  return (
    <div className="mx-auto grid max-w-6xl gap-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-500">
          Generate custom reports based on your dataset insights
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <Form {...form}>
          <form className="grid gap-6">
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Select Datasets</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* <MultiSelect2
                  multiple
                  options={datasets.map((dataset) => ({
                    label: dataset.title,
                    value: dataset.id,
                  }))}
                /> */}
                <FormField
                  control={form.control}
                  name="dataset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Datasets</FormLabel>
                      <FormControl>
                        <MultiSelect2
                          {...field}
                          options={datasets.map((dataset) => ({
                            label: dataset.title,
                            value: dataset.id,
                          }))}
                          onSelectionChange={(selected) => {
                            field.onChange(selected);
                          }}
                          // value={field.value}
                          className="focus:border-primary/40 focus:ring-primary/40 w-full border border-gray-300 bg-white text-gray-800"
                        />
                      </FormControl>
                      <FormDescription>
                        Select datasets to include in the report
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                {/* <div className="flex flex-wrap gap-2">
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
              </div> */}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  {/* <Label htmlFor="date-range">Date Range</Label> */}
                  {/* <Select
                    defaultValue="past-month"
                    value={filters.date_range}
                    onValueChange={handleDateRangeChange}
                  >
                    <SelectTrigger
                      id="date-range"
                      className="w-full border border-gray-300 bg-white text-gray-800"
                    >
                      <SelectValue placeholder="Past Month" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 border border-gray-300 bg-white">
                      {dateRangeOptions!.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className={cn(
                            'selection:bg-primary/20 hover:bg-primary/30',
                          )}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  {/* <FormBuilder.SelectFormField
                    control={form.control}
                    name="date_range"
                    label="Date Range"
                    placeholder="Select date range"
                    options={dateRangeOptions!.map((option) => ({
                      label: option.label,
                      value: option.value,
                    }))}
                    isClearable={false}
                    isSearchable={false}
                  /> */}
                  <FormField
                    control={form.control}
                    name="date_range"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel />
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            defaultValue="past_month"
                          >
                            <SelectTrigger className="focus:border-primary/40 focus:ring-primary/40 w-full border border-gray-300 bg-white text-gray-800">
                              <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 border border-gray-300 bg-white">
                              {dateRangeOptions!.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription />
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                {/* <div className="grid gap-2">
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
              </div> */}
              </CardContent>
            </Card>

            {/* <Card className="border border-gray-200 bg-white shadow-sm">
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
          </Card> */}

            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Metrics to include</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {/* {metricsOptions?.map(({ Icon, label, value }) => (
                  <div className="flex items-center gap-2" key={value}>
                    <Checkbox
                      id={value}
                      value={filters.metrics}
                      key={value}
                      onCheckedChange={() => handleMetricChange(value)}
                    />
                    <Label htmlFor={value} className="flex items-center gap-1">
                      <Icon className="h-4 w-4" />
                      {label}
                    </Label>
                  </div>
                ))} */}
                <FormField
                  control={form.control}
                  name="metrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel />
                      <FormControl>
                        <div className="flex flex-wrap gap-4">
                          {metricsOptions?.map(({ Icon, label, value }) => (
                            <div
                              className="flex items-center gap-2"
                              key={value}
                            >
                              <Checkbox
                                {...field}
                                id={value}
                                value={field.value}
                                onCheckedChange={(checked) => {
                                  const newMetrics = checked
                                    ? [...field.value, value]
                                    : field.value.filter((m) => m !== value);
                                  field.onChange(newMetrics);
                                }}
                                className="focus:ring-primary/40 focus:border-primary/40 checked:bg-primary/600 checked:border-primary/600 hover:bg-primary/50 border-gray-300 bg-white text-gray-800 checked:text-white"
                              />
                              <Label
                                htmlFor={value}
                                className="flex items-center gap-1"
                              >
                                <Icon className="h-4 w-4" />
                                {label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select metrics to include in the report
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </form>
        </Form>

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
                  disabled={isReportsLoading || isReportsError}
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </SheetTrigger>
              <ReportPreviewSheet />
            </Sheet>
            <Button
              onClick={downloadReport}
              disabled={isDownloadingPDF || isReportsLoading || isReportsError}
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

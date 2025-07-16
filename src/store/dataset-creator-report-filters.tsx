import {
  DownloadIcon,
  EyeIcon,
  MessageCircleIcon,
  StarIcon,
  type LucideIcon,
} from 'lucide-react';
import { create } from 'zustand';
// data/reports/?dataset_ids=7zpm2mBGaNXt&dataset_ids=TnB2VTzuRkfj&date_range=past_month&metrics=views&metrics=downloads

const dateRangeOptions = [
  { label: 'Past Month', value: 'past_month' },
  { label: 'Past Quarter ', value: 'past_quarter' },
  { label: 'Past Year', value: 'past_year' },
  // { label: 'All Time', value: 'all_time' },
];

const metricsOptions = [
  { label: 'Views', value: 'views', Icon: EyeIcon },
  { label: 'Downloads', value: 'downloads', Icon: DownloadIcon },
  { label: 'Ratings', value: 'ratings', Icon: StarIcon },
  { label: 'Comments', value: 'comments', Icon: MessageCircleIcon },
];

export type DatasetCreatorReportFilters = {
  dataset: string[];
  date_range: string;
  metrics: string[];
};

type DatasetCreatorReportFiltersStore = {
  metricsOptions?: { label: string; value: string; Icon: LucideIcon }[];
  dateRangeOptions?: { label: string; value: string }[];
  filters: DatasetCreatorReportFilters;
  setFilters: (filters: Partial<DatasetCreatorReportFilters>) => void;
  getEncodedURLParams: () => string;
};

export const useDatasetCreatorReportFiltersStore =
  create<DatasetCreatorReportFiltersStore>((set, get) => ({
    filters: {
      dataset: [],
      date_range: 'past_month',
      metrics: [],
    },
    dateRangeOptions: dateRangeOptions,
    metricsOptions: metricsOptions,

    setFilters: (filters) =>
      set((state) => ({
        filters: { ...state.filters, ...filters },
      })),
    getEncodedURLParams: () => {
      const { dataset, date_range, metrics } = get().filters;
      const urlParams = new URLSearchParams();
      if (dataset.length > 0) {
        urlParams.append('dataset_id', dataset.join('&dataset_id='));
      }
      urlParams.append('date_range', date_range);
      if (metrics.length > 0) {
        urlParams.append('metrics', metrics.join('&metrics='));
      }
      return urlParams.toString();
    },
  }));

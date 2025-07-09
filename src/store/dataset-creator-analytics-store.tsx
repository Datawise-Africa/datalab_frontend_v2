import type { SingleDatasetViewsAnalyticsType } from '@/api/dataset-creator-analytics/query';
import { create } from 'zustand';

const dateRangeOptions = [
  { label: 'Last Week', value: '1w' },
  { label: 'Last 1 Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last 1 Year', value: '1y' },
] as const;

export type DatasetCreateorAnalyticsFilter = {
  range: (typeof dateRangeOptions)[number]['value'];
};

const getDateRangeLabels = (mode: DatasetCreateorAnalyticsFilter['range']) => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ] as const;

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

  switch (mode) {
    case '1w':
      return [...weekDays];
    case '1m':
      return ['1st', '5th', '10th', '15th', '20th', '25th', '30th'];
    case '3m': {
      const currentMonthIndex = new Date().getMonth();
      const startMonthIndex = (currentMonthIndex - 2 + 12) % 12;
      const monthsToShow = 3;

      let xAxisLabels = monthNames.slice(
        startMonthIndex,
        startMonthIndex + monthsToShow,
      );

      if (xAxisLabels.length < monthsToShow) {
        const additionalMonths = monthNames.slice(
          0,
          monthsToShow - xAxisLabels.length,
        );
        xAxisLabels = [...xAxisLabels, ...additionalMonths];
      }

      return xAxisLabels.map((_month, index) => {
        const monthIndex = (startMonthIndex + index) % 12;
        return monthNames[monthIndex];
      });
    }
    case '6m':
    case '1y':
      return [...monthNames];
    default:
      return [];
  }
};

export interface DatasetCreatorAnalyticsStore {
  selectedDatasetId: string | null;
  setSelectedDatasetId: (id: string | null) => void;
  filters: DatasetCreateorAnalyticsFilter;
  setFilters: (filters: DatasetCreateorAnalyticsFilter) => void;
  dateRangeOptions: typeof dateRangeOptions;
  labels: string[];
  analyticsData: {
    daily_views: SingleDatasetViewsAnalyticsType['daily_views'];
    daily_downloads: SingleDatasetViewsAnalyticsType['daily_downloads'];
  };
  setAnalyticsData: (
    data: Pick<
      SingleDatasetViewsAnalyticsType,
      'daily_views' | 'daily_downloads'
    >,
  ) => void;
  getViewsChartsData: () => {
    xDataKey: string;
    yDataKey: string;
    chartData: {
      xLabel: string;
      views: number;
    }[];
  };
  getDownloadsChartsData: () => {
    xDataKey: string;
    yDataKey: string;
    chartData: {
      xLabel: string;
      downloads: number;
    }[];
  };
}

export const useDatasetCreatorAnalyticsStore =
  create<DatasetCreatorAnalyticsStore>((set, get) => ({
    selectedDatasetId: null,
    setSelectedDatasetId: (id: string | null) => set({ selectedDatasetId: id }),
    filters: { range: '1m' },
    setFilters: (filters: DatasetCreateorAnalyticsFilter) =>
      set({
        filters,
        labels: getDateRangeLabels(filters.range),
      }),
    dateRangeOptions,
    labels: getDateRangeLabels('1m'),
    analyticsData: {
      daily_views: [],
      daily_downloads: [],
    },
    setAnalyticsData: (data) =>
      set({
        analyticsData: {
          daily_views: data.daily_views,
          daily_downloads: data.daily_downloads,
        },
      }),
    getViewsChartsData: () => {
      const { filters, labels, analyticsData } = get();
      // const { daily_views } = analyticsData;

      const chartData = processAreaChartData(
        analyticsData,
        filters.range,
        labels,
        'views',
      ) as { xLabel: string; views: number }[];

      return {
        xDataKey: 'xLabel',
        yDataKey: 'views',
        chartData,
      };
    },
    getDownloadsChartsData: () => {
      const { filters, labels, analyticsData } = get();

      const chartData = processAreaChartData(
        analyticsData,
        filters.range,
        labels,
        'downloads',
      ) as { xLabel: string; downloads: number }[];

      return {
        xDataKey: 'xLabel',
        yDataKey: 'downloads',
        chartData,
      };
    },
  }));
type ProcessDataAnalyticsReturn =
  | {
      xLabel: string;
      views: number;
    }
  | {
      xLabel: string;
      downloads: number;
    };

type ProcessDataMode = 'views' | 'downloads';
const processAreaChartData = <T extends ProcessDataMode>(
  {
    daily_downloads,
    daily_views,
  }: Pick<SingleDatasetViewsAnalyticsType, 'daily_views' | 'daily_downloads'>,
  range: DatasetCreateorAnalyticsFilter['range'],
  labels: string[],
  mode: T,
): T extends 'downloads'
  ? ProcessDataAnalyticsReturn[]
  : ProcessDataAnalyticsReturn[] => {
  if (mode === 'downloads' && !daily_downloads) {
    return labels.map((label) => ({ xLabel: label, downloads: 0 }));
  } else if (mode === 'views' && !daily_views) {
    return labels.map((label) => ({ xLabel: label, views: 0 }));
  }

  if (mode === 'views') {
    switch (range) {
      case '1w': {
        const weekData = Array(7).fill(0);

        daily_views.forEach((view) => {
          const date = new Date(view.view_date);
          const dayOfWeek = date.getDay();
          const adjustedIndex = (dayOfWeek + 6) % 7;
          weekData[adjustedIndex] = view.views_count;
        });

        return labels.map((label, index) => ({
          xLabel: label,
          views: weekData[index],
        }));
      }

      case '1m': {
        const dayMarkers = [1, 5, 10, 15, 20, 25, 30];
        const monthData = Array(dayMarkers.length).fill(0);

        daily_views.forEach((view) => {
          const date = new Date(view.view_date);
          const dayOfMonth = date.getDate();
          const closestMarker = dayMarkers.reduce((prev, curr) =>
            Math.abs(curr - dayOfMonth) < Math.abs(prev - dayOfMonth)
              ? curr
              : prev,
          );
          const markerIndex = dayMarkers.indexOf(closestMarker);
          monthData[markerIndex] += view.views_count;
        });

        return labels.map((label, index) => ({
          xLabel: label,
          views: monthData[index],
        }));
      }

      case '3m': {
        const monthlyData = Array(3).fill(0);

        daily_views.forEach((view) => {
          const date = new Date(view.view_date);
          const monthIndex = date.getMonth();
          const currentMonth = new Date().getMonth();
          let monthOffset = (monthIndex - currentMonth + 12) % 12;
          if (monthOffset > 2) monthOffset = 2;
          monthlyData[2 - monthOffset] += view.views_count;
        });

        return labels.map((label, index) => ({
          xLabel: label,
          views: monthlyData[index],
        }));
      }

      case '6m': {
        const monthlyData = Array(12).fill(0);
        const currentMonth = new Date().getMonth();

        daily_views.forEach((view) => {
          const date = new Date(view.view_date);
          const monthIndex = date.getMonth();
          monthlyData[monthIndex] += view.views_count;
        });

        const last6Months = [
          ...monthlyData.slice(currentMonth - 5),
          ...monthlyData.slice(0, currentMonth + 1),
        ].slice(0, 6);

        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        const last6MonthNames = [
          ...monthNames.slice(currentMonth - 5),
          ...monthNames.slice(0, currentMonth + 1),
        ].slice(0, 6);

        return last6MonthNames.map((month, index) => ({
          xLabel: month,
          views: last6Months[index],
        }));
      }

      case '1y': {
        const monthlyData = Array(12).fill(0);

        daily_views.forEach((view) => {
          const date = new Date(view.view_date);
          const monthIndex = date.getMonth();
          monthlyData[monthIndex] += view.views_count;
        });

        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        return monthNames.map((month, index) => ({
          xLabel: month,
          views: monthlyData[index],
        }));
      }

      default:
        return labels.map((label) => ({ xLabel: label, views: 0 }));
    }
  } else {
    switch (range) {
      case '1w': {
        const weekData = Array(7).fill(0);

        daily_downloads.forEach((download) => {
          const date = new Date(download.download_date);
          const dayOfWeek = date.getDay();
          const adjustedIndex = (dayOfWeek + 6) % 7;
          weekData[adjustedIndex] = download.downloads_count;
        });

        return labels.map((label, index) => ({
          xLabel: label,
          downloads: weekData[index],
        }));
      }

      case '1m': {
        const dayMarkers = [1, 5, 10, 15, 20, 25, 30];
        const monthData = Array(dayMarkers.length).fill(0);

        daily_downloads.forEach((download) => {
          const date = new Date(download.download_date);
          const dayOfMonth = date.getDate();
          const closestMarker = dayMarkers.reduce((prev, curr) =>
            Math.abs(curr - dayOfMonth) < Math.abs(prev - dayOfMonth)
              ? curr
              : prev,
          );
          const markerIndex = dayMarkers.indexOf(closestMarker);
          monthData[markerIndex] += download.downloads_count;
        });

        return labels.map((label, index) => ({
          xLabel: label,
          downloads: monthData[index],
        }));
      }

      case '3m': {
        const monthlyData = Array(3).fill(0);

        daily_downloads.forEach((download) => {
          const date = new Date(download.download_date);
          const monthIndex = date.getMonth();
          const currentMonth = new Date().getMonth();
          let monthOffset = (monthIndex - currentMonth + 12) % 12;
          if (monthOffset > 2) monthOffset = 2;
          monthlyData[2 - monthOffset] += download.downloads_count;
        });

        return labels.map((label, index) => ({
          xLabel: label,
          downloads: monthlyData[index],
        }));
      }

      case '6m': {
        const monthlyData = Array(12).fill(0);
        const currentMonth = new Date().getMonth();

        daily_downloads.forEach((download) => {
          const date = new Date(download.download_date);
          const monthIndex = date.getMonth();
          monthlyData[monthIndex] += download.downloads_count;
        });

        const last6Months = [
          ...monthlyData.slice(currentMonth - 5),
          ...monthlyData.slice(0, currentMonth + 1),
        ].slice(0, 6);

        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        const last6MonthNames = [
          ...monthNames.slice(currentMonth - 5),
          ...monthNames.slice(0, currentMonth + 1),
        ].slice(0, 6);

        return last6MonthNames.map((month, index) => ({
          xLabel: month,
          downloads: last6Months[index],
        }));
      }

      case '1y': {
        const monthlyData = Array(12).fill(0);

        daily_downloads.forEach((download) => {
          const date = new Date(download.download_date);
          const monthIndex = date.getMonth();
          monthlyData[monthIndex] += download.downloads_count;
        });

        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        return monthNames.map((month, index) => ({
          xLabel: month,
          downloads: monthlyData[index],
        }));
      }

      default:
        return labels.map((label) => ({ xLabel: label, downloads: 0 }));
    }
  }
};

// Helper hooks for easier consumption
export const useSelectedDatasetId = () => {
  const { selectedDatasetId, setSelectedDatasetId } =
    useDatasetCreatorAnalyticsStore();
  return {
    selectedDatasetId,
    setSelectedDatasetId,
  };
};

export const useDatasetCreatorAnalyticsFilters = () => {
  const { filters, setFilters, dateRangeOptions, labels } =
    useDatasetCreatorAnalyticsStore();
  return {
    filters,
    setFilters,
    dateRangeOptions,
    labels,
  };
};

export const useDatasetAnalyticsData = () => {
  const {
    analyticsData,
    setAnalyticsData,
    getViewsChartsData,
    getDownloadsChartsData,
  } = useDatasetCreatorAnalyticsStore();
  return {
    analyticsData,
    setAnalyticsData,
    getViewsChartsData,
    getDownloadsChartsData,
  };
};

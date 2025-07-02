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
  analyticsData: {daily_views:SingleDatasetViewsAnalyticsType['daily_views']}
  setAnalyticsData: (data:SingleDatasetViewsAnalyticsType['daily_views']) => void;
  getAreaChartData: () => {
    xDataKey: string;
    yDataKey: string;
    chartData: {
      xLabel: string;
      yValue: number;
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
    },
    setAnalyticsData: (data) => set({ analyticsData: {
      daily_views: data,
    } }),
    getAreaChartData: () => {
      const { filters, labels, analyticsData } = get();
      const { daily_views } = analyticsData;

      const chartData = processAreaChartData(
        daily_views,
        filters.range,
        labels,
      );

      return {
        xDataKey: 'xLabel',
        yDataKey: 'yValue',
        chartData,
      };
    },
  }));

const processAreaChartData = (
  dailyViews: SingleDatasetViewsAnalyticsType['daily_views'],
  range: DatasetCreateorAnalyticsFilter['range'],
  labels: string[],
): { xLabel: string; yValue: number }[] => {
  if (!dailyViews || dailyViews.length === 0) {
    return labels.map((label) => ({ xLabel: label, yValue: 0 }));
  }

  switch (range) {
    case '1w': {
      const weekData = Array(7).fill(0);

      dailyViews.forEach((view) => {
        const date = new Date(view.view_date);
        const dayOfWeek = date.getDay();
        const adjustedIndex = (dayOfWeek + 6) % 7;
        weekData[adjustedIndex] = view.views_count;
      });

      return labels.map((label, index) => ({
        xLabel: label,
        yValue: weekData[index],
      }));
    }

    case '1m': {
      const dayMarkers = [1, 5, 10, 15, 20, 25, 30];
      const monthData = Array(dayMarkers.length).fill(0);

      dailyViews.forEach((view) => {
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
        yValue: monthData[index],
      }));
    }

    case '3m': {
      const monthlyData = Array(3).fill(0);

      dailyViews.forEach((view) => {
        const date = new Date(view.view_date);
        const monthIndex = date.getMonth();
        const currentMonth = new Date().getMonth();
        let monthOffset = (monthIndex - currentMonth + 12) % 12;
        if (monthOffset > 2) monthOffset = 2;
        monthlyData[2 - monthOffset] += view.views_count;
      });

      return labels.map((label, index) => ({
        xLabel: label,
        yValue: monthlyData[index],
      }));
    }

    case '6m': {
      const monthlyData = Array(12).fill(0);
      const currentMonth = new Date().getMonth();

      dailyViews.forEach((view) => {
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
        yValue: last6Months[index],
      }));
    }

    case '1y': {
      const monthlyData = Array(12).fill(0);

      dailyViews.forEach((view) => {
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
        yValue: monthlyData[index],
      }));
    }

    default:
      return labels.map((label) => ({ xLabel: label, yValue: 0 }));
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
  const { analyticsData, setAnalyticsData, getAreaChartData } =
    useDatasetCreatorAnalyticsStore();
  return {
    analyticsData,
    setAnalyticsData,
    getAreaChartData,
  };
};

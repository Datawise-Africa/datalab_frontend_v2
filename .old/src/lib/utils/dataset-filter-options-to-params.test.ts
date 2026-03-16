import { describe, it, expect } from 'vitest';
import { datasetFiltersToSearchParams } from './dataset-filter-options-to-params';
import type { DatasetFilterOptions } from '../types/data-set';

describe('datasetFiltersToSearchParams', () => {
  it('should return empty URLSearchParams for empty filters', () => {
    const filters: Partial<DatasetFilterOptions> = {};
    const result = datasetFiltersToSearchParams(
      filters as DatasetFilterOptions,
    );
    expect(result.toString()).toBe('');
  });

  it('should convert a single filter with a single value', () => {
    const filters: Partial<DatasetFilterOptions> = {
      accessLevel: ['public'],
    };
    const result = datasetFiltersToSearchParams(
      filters as DatasetFilterOptions,
    );
    expect(result.toString()).toBe('access_level=public');
  });

  it('should convert a single filter with multiple values', () => {
    const filters: Partial<DatasetFilterOptions> = {
      region: ['europe', 'asia'],
    };
    const result = datasetFiltersToSearchParams(
      filters as DatasetFilterOptions,
    );
    expect(result.toString()).toBe('region=europe&region=asia');
  });

  it('should convert multiple filters with values', () => {
    const filters: Partial<DatasetFilterOptions> = {
      accessLevel: ['public', 'private'],
      dataType: ['csv'],
      region: ['europe'],
    };
    const result = datasetFiltersToSearchParams(
      filters as DatasetFilterOptions,
    );

    expect(result.getAll('access_level')).toEqual(['public', 'private']);
    expect(result.getAll('datatype')).toEqual(['csv']);
    expect(result.getAll('region')).toEqual(['europe']);
  });

  it('should skip filters with empty arrays', () => {
    const filters: Partial<DatasetFilterOptions> = {
      accessLevel: ['public'],
      dataType: [],
      region: ['europe'],
    };
    const result = datasetFiltersToSearchParams(
      filters as DatasetFilterOptions,
    );

    expect(result.has('datatype')).toBe(false);
    expect(result.getAll('access_level')).toEqual(['public']);
    expect(result.getAll('region')).toEqual(['europe']);
  });

  it('should handle filters with undefined values', () => {
    const filters: Partial<DatasetFilterOptions> = {
      accessLevel: ['public'],
      dataType: undefined,
      region: ['europe'],
    };
    const result = datasetFiltersToSearchParams(
      filters as DatasetFilterOptions,
    );

    expect(result.has('datatype')).toBe(false);
    expect(result.getAll('access_level')).toEqual(['public']);
    expect(result.getAll('region')).toEqual(['europe']);
  });

  it('should handle all filter types', () => {
    const filters: DatasetFilterOptions = {
      accessLevel: ['public'],
      dataType: ['csv', 'json'],
      region: ['europe', 'asia', 'america'],
      timeframe: ['2020', '2021'],
    };
    const result = datasetFiltersToSearchParams(filters);

    expect(result.getAll('access_level')).toEqual(['public']);
    expect(result.getAll('datatype')).toEqual(['csv', 'json']);
    expect(result.getAll('region')).toEqual(['europe', 'asia', 'america']);
    expect(result.getAll('timeframe')).toEqual(['2020', '2021']);
  });
});

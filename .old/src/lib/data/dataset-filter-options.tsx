// Mapping of original option values to user-friendly names
/**
 *
 *
 */
/**
 * Filter options for datasets used in the application interface.
 *
 * @remarks
 * This constant provides standardized options for filtering datasets across the application.
 * The object is type-asserted with `as const` to maintain literal types for the values.
 *
 * @property accessLevel - Options for dataset access permissions
 * @property accessLevel.public - Datasets available for public access
 * @property accessLevel.non_profit - Datasets restricted to non-profit use
 * @property accessLevel.commercial - Datasets available for commercial purposes
 * @property accessLevel.students - Datasets specifically for student use
 *
 * @property dataType - Options for categorizing datasets by domain
 * @property dataType.education - Educational datasets
 * @property dataType.healthcare - Healthcare-related datasets
 * @property dataType.agriculture - Agricultural datasets
 * @property dataType.environmental - Environmental datasets
 *
 * @property region - Options for filtering datasets by African regions
 * @property region.East\ Africa - Datasets from East African countries
 * @property region.West\ Africa - Datasets from West African countries
 * @property region.North\ Africa - Datasets from North African countries
 * @property region.Southern\ Africa - Datasets from Southern African countries
 *
 * @property timeframe - Options for filtering datasets by age
 * @property timeframe.Last\ Year - Datasets from the past year
 * @property timeframe.Last\ 5\ Years - Datasets from the past five years
 * @property timeframe.5+\ Years - Datasets older than five years
 */
export const datasetFilterOptions = {
  accessLevel: {
    // public: 'Public Access',
    // non_profit: 'Non-Profit',
    // commercial: 'Commercial',
    // students: 'Student',
    public: {
      label: 'Public Access',
      value: 'public',
    },
    non_profit: {
      label: 'Non-Profit',
      value: 'non_profit',
    },
    commercial: {
      label: 'Commercial',
      value: 'company',
    },
    students: {
      label: 'Student',
      value: 'students',
    },
  },
  dataType: {
    // education: 'Education',
    // healthcare: 'Healthcare',
    // agriculture: 'Agricultural',
    // environmental: 'Environmental',
    education: {
      label: 'Education',
      value: 'Education',
    },
    healthcare: {
      label: 'Healthcare',
      value: 'Healthcare',
    },
    agriculture: {
      label: 'Agriculture',
      value: 'Agriculture',
    },
    environmental: {
      label: 'Environmental',
      value: 'Environmental',
    },
  },
  region: {
    'East Africa': 'East African ',
    'West Africa': 'West African ',
    'North Africa': 'North African ',
    'Southern Africa': 'Southern African ',
  },
  timeframe: {
    'Last Year': 'Past Year',
    'Last 5 Years': 'Past 5 Years',
    '5+ Years': 'More than 5 Years',
  },
} as const;

import { describe, expect, it } from 'vitest';
import { uploadDatasetFormSchema } from './upload-dataset-schema';

const validDataset = {
  name: 'Health sample',
  description: 'A sufficiently detailed health sample dataset.',
  dataset_type: 'tabular' as const,
  category: 'category-id',
  license: 'license-id',
  is_premium: false,
  is_private: false,
  price: 0,
  origin_region: [],
  tags: [],
  authors: [{ user: 'user-id', role: 'creator' as const }],
  access: { access_type: 'public' as const, access_instructions: '' },
  doi_option: 'none' as const,
};

describe('uploadDatasetFormSchema DOI validation', () => {
  it.each([
    '10.1234/example.dataset',
    'doi:10.1234/example.dataset',
    'https://doi.org/10.1234/example.dataset',
  ])('accepts %s', (doi) => {
    expect(
      uploadDatasetFormSchema.safeParse({
        ...validDataset,
        doi_option: 'existing',
        doi,
      }).success
    ).toBe(true);
  });

  it('allows DOI to be omitted', () => {
    expect(uploadDatasetFormSchema.safeParse(validDataset).success).toBe(true);
  });

  it('rejects arbitrary URLs', () => {
    expect(
      uploadDatasetFormSchema.safeParse({
        ...validDataset,
        doi_option: 'existing',
        doi: 'https://example.com/not-a-doi',
      }).success
    ).toBe(false);
  });
});

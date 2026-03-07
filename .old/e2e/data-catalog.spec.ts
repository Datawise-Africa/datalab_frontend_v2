import { test, expect } from '@playwright/test';
import { DataCatalogPage } from './pages/DataCatalogPage';

test.describe('Dataset Catalog Page', () => {
  test('displays dataset catalog and allows filtering', async ({ page }) => {
    const catalogPage = new DataCatalogPage(page);
    await catalogPage.goto();

    // Check if the page title contains DataLab
    await expect(page).toHaveTitle(/DataLab/);

    // Check if dataset cards are displayed
    await catalogPage.isLoaded();
    const initialCount = await catalogPage.getDatasetCount();
    expect(initialCount).toBeGreaterThan(0);

    // Test filtering functionality
    await catalogPage.filterByCategory('Health');

    // Filtered results might be fewer than initial results
    const filteredCount = await catalogPage.getDatasetCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('allows searching for datasets', async ({ page }) => {
    const catalogPage = new DataCatalogPage(page);
    await catalogPage.goto();
    await catalogPage.isLoaded();

    const initialCount = await catalogPage.getDatasetCount();

    // Search for datasets
    await catalogPage.search('health');

    // Search results might be fewer than initial results
    const searchResultsCount = await catalogPage.getDatasetCount();
    expect(searchResultsCount).toBeLessThanOrEqual(initialCount);
  });

  test('opens dataset preview when clicking on View', async ({ page }) => {
    const catalogPage = new DataCatalogPage(page);
    await catalogPage.goto();
    await catalogPage.isLoaded();

    // Open the preview for the first dataset
    const previewModal = await catalogPage.openDatasetPreview(0);

    // Verify some content in the preview modal
    await expect(previewModal.getByRole('heading')).toBeVisible();
  });
});

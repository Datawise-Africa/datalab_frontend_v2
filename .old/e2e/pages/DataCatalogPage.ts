import { Page, Locator, expect } from '@playwright/test';

/**
 * DataCatalogPage Page Object Model for E2E testing
 */
export class DataCatalogPage {
  readonly page: Page;
  readonly datasetCards: Locator;
  readonly filterButton: Locator;
  readonly searchInput: Locator;
  readonly filterPanel: Locator;
  readonly applyFilterButton: Locator;
  readonly resetFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.datasetCards = page.locator('.dataset-card');
    this.filterButton = page.getByRole('button', { name: /filter/i });
    this.searchInput = page.getByPlaceholder(/search/i);
    this.filterPanel = page.locator('.filter-panel');
    this.applyFilterButton = page.getByRole('button', { name: /apply/i });
    this.resetFilterButton = page.getByRole('button', { name: /reset/i });
  }

  /**
   * Navigate to the data catalog page
   */
  async goto() {
    await this.page.goto('/data');
  }

  /**
   * Check if the page is loaded correctly
   */
  async isLoaded() {
    await expect(this.datasetCards.first()).toBeVisible();
  }

  /**
   * Open the filter panel
   */
  async openFilterPanel() {
    await this.filterButton.click();
    await expect(this.filterPanel).toBeVisible();
  }

  /**
   * Apply a category filter
   * @param category The category to filter by
   */
  async filterByCategory(category: string) {
    await this.openFilterPanel();
    const categoryCheckbox = this.page.getByLabel(category);
    await categoryCheckbox.check();
    await this.applyFilterButton.click();
  }

  /**
   * Search for datasets
   * @param query The search query
   */
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Open the preview for a dataset
   * @param index The index of the dataset to preview (0-based)
   */
  async openDatasetPreview(index = 0) {
    await this.datasetCards.nth(index).getByText('View').click();
    const previewModal = this.page.locator('[role="dialog"]');
    await expect(previewModal).toBeVisible();
    return previewModal;
  }

  /**
   * Get the total number of datasets displayed
   */
  async getDatasetCount() {
    return await this.datasetCards.count();
  }
}

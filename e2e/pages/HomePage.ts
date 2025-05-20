import { Page, Locator, expect } from '@playwright/test';

/**
 * HomePage Page Object Model for E2E testing
 */
export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly footer: Locator;
  readonly loginButton: Locator;
  readonly navigationLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /datalab/i, level: 1 });
    this.footer = page.locator('footer');
    this.loginButton = page.getByRole('button', { name: /login/i });
    this.navigationLinks = page.locator('nav a');
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Check if the page is loaded correctly
   */
  async isLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.footer).toBeVisible();
  }

  /**
   * Open the login modal
   */
  async openLoginModal() {
    await this.loginButton.click();
    const modal = this.page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    return modal;
  }

  /**
   * Navigate to a specific section using the navigation menu
   * @param linkText The text of the link to click
   */
  async navigateTo(linkText: string) {
    await this.page.getByRole('link', { name: new RegExp(linkText, 'i') }).click();
  }
}

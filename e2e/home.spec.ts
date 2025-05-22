import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Home Page', () => {
  test('homepage has title and footer', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Expect the page title to contain DataLab
    await expect(page).toHaveTitle(/DataLab/);

    // Check if the main elements are loaded
    await homePage.isLoaded();
  });

  test('navigation works correctly', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Navigate to About page
    await homePage.navigateTo('about');

    // Expect the URL to have changed
    await expect(page).toHaveURL(/.*about/);
  });

  test('authentication modal can be opened', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Open the login modal
    const modal = await homePage.openLoginModal();

    // Verify modal content
    await expect(modal.getByText(/sign in/i)).toBeVisible();
  });
});

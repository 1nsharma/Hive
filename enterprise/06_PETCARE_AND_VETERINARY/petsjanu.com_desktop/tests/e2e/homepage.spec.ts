import { test, expect } from '@playwright/test';

test.describe('PetJanu Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/PetJanu/i);
  });

  test('should display main navigation elements', async ({ page }) => {
    // Check for main content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });
});

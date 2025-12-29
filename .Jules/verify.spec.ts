import { test, expect } from '@playwright/test';

test('homepage should load without crashing', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.locator('h1')).toBeVisible();
  await page.screenshot({ path: '.Jules/screenshot.png' });
});

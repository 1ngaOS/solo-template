import { test, expect } from './helpers/setup';

test('landing page loads correctly', async ({ page }) => {
	await page.goto('/');

	// Check page title
	await expect(page).toHaveTitle(/Solo Monorepo Template/);

	// Check main heading
	await expect(page.locator('h2')).toContainText('Solo Monorepo Template');

	// Check features section
	await expect(page.locator('#features')).toBeVisible();
	await expect(page.locator('text=Fast Backend')).toBeVisible();
	await expect(page.locator('text=Modern Frontend')).toBeVisible();
	await expect(page.locator('text=Comprehensive Docs')).toBeVisible();
});

test('navigation links work', async ({ page }) => {
	await page.goto('/');

	// Check navigation links are visible
	await expect(page.locator('a[href="/"]')).toBeVisible();
	await expect(page.locator('a[href="#features"]')).toBeVisible();
	await expect(page.locator('a[href="#docs"]')).toBeVisible();
});


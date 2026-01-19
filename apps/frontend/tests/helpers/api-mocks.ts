import type { Page } from '@playwright/test';

const defaultResponse = {
	success: true,
	data: {
		message: 'Mock response'
	}
};

export async function mockApiRoutes(page: Page): Promise<void> {
	await page.route('**/api/**', async (route) => {
		if (route.request().method() === 'OPTIONS') {
			return route.fulfill({
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization'
				}
			});
		}

		return route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(defaultResponse)
		});
	});
}

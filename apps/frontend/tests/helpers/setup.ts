import { test as base, expect } from '@playwright/test';
import { mockApiRoutes } from './api-mocks';

const test = base.extend({
	page: async ({ page }, use) => {
		if (process.env.CI || process.env.MOCK_API === 'true') {
			await mockApiRoutes(page);
		}

		await use(page);
	}
});

export { test, expect };

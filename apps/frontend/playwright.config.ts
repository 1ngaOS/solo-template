import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	workers: isCI ? 4 : undefined,
	reporter: 'html',
	timeout: 30_000,
	expect: {
		timeout: 10_000
	},
	use: {
		baseURL: isCI ? 'http://localhost:3000' : 'http://localhost:5173',
		actionTimeout: 10_000,
		navigationTimeout: 15_000,
		trace: 'on-first-retry'
	},
	projects: isCI
		? [
				{
					name: 'chromium',
					use: { ...devices['Desktop Chrome'] }
				}
			]
		: [
				{
					name: 'chromium',
					use: { ...devices['Desktop Chrome'] }
				},
				{
					name: 'firefox',
					use: { ...devices['Desktop Firefox'] }
				},
				{
					name: 'webkit',
					use: { ...devices['Desktop Safari'] }
				},
				{
					name: 'mobile-chrome',
					use: { ...devices['Pixel 5'] }
				},
				{
					name: 'mobile-safari',
					use: { ...devices['iPhone 12'] }
				}
			],
	webServer: {
		command: isCI ? 'pnpm build && node build' : 'pnpm dev',
		url: isCI ? 'http://localhost:3000' : 'http://localhost:5173',
		reuseExistingServer: !isCI,
		timeout: 180_000
	}
});


import { describe, it, expect } from 'vitest';
import { formatDate, generateRandomString, isValidEmail, debounce, sleep } from './index';

describe('formatDate', () => {
	it('should format a Date object', () => {
		const date = new Date('2024-01-01');
		const formatted = formatDate(date);
		expect(formatted).toContain('2024');
	});

	it('should format a date string', () => {
		const formatted = formatDate('2024-01-01');
		expect(formatted).toContain('2024');
	});
});

describe('generateRandomString', () => {
	it('should generate a string of specified length', () => {
		const str = generateRandomString(10);
		expect(str.length).toBe(10);
	});

	it('should generate different strings', () => {
		const str1 = generateRandomString(10);
		const str2 = generateRandomString(10);
		expect(str1).not.toBe(str2);
	});
});

describe('isValidEmail', () => {
	it('should validate correct email addresses', () => {
		expect(isValidEmail('test@example.com')).toBe(true);
		expect(isValidEmail('user.name@example.co.uk')).toBe(true);
	});

	it('should reject invalid email addresses', () => {
		expect(isValidEmail('invalid')).toBe(false);
		expect(isValidEmail('invalid@')).toBe(false);
		expect(isValidEmail('@invalid.com')).toBe(false);
	});
});

describe('debounce', () => {
	it('should debounce function calls', async () => {
		let callCount = 0;
		const debounced = debounce(() => {
			callCount++;
		}, 100);

		debounced();
		debounced();
		debounced();

		expect(callCount).toBe(0);

		await sleep(150);
		expect(callCount).toBe(1);
	});
});

describe('sleep', () => {
	it('should wait for specified time', async () => {
		const start = Date.now();
		await sleep(100);
		const end = Date.now();
		expect(end - start).toBeGreaterThanOrEqual(90);
	});
});


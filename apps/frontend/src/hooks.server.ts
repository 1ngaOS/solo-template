import type { HandleFetch } from '@sveltejs/kit';

/**
 * Proxy server-side fetch('/api/...') to the backend in the same environment.
 * BACKEND_API_URL (or PUBLIC_API_URL) is set per env (staging/production) on the VM.
 */
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const url = new URL(request.url);
	if (url.pathname.startsWith('/api')) {
		const backend =
			process.env.BACKEND_API_URL || process.env.PUBLIC_API_URL || 'http://127.0.0.1:6100';
		const base = backend.replace(/\/$/, '');
		const newUrl = `${base}${url.pathname}${url.search}`;
		return fetch(newUrl, {
			...request,
			headers: new Headers(request.headers)
		});
	}
	return fetch(request);
};

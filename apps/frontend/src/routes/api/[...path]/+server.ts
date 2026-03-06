import type { RequestHandler } from './$types';

const BACKEND =
	process.env.BACKEND_API_URL || process.env.PUBLIC_API_URL || 'http://127.0.0.1:6100';

/**
 * Proxy /api/* to the backend so the frontend (SSR) never talks to the backend directly from the client.
 * All API calls go through this route and are forwarded to the backend in the same env (staging/production).
 */
export const GET: RequestHandler = async ({ params, url, request }) => {
	const path = params.path || '';
	const backendUrl = `${BACKEND.replace(/\/$/, '')}/api/${path}${url.search}`;
	const res = await fetch(backendUrl, {
		method: 'GET',
		headers: request.headers
	});
	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers: res.headers
	});
};

export const POST: RequestHandler = async ({ params, url, request }) => {
	const path = params.path || '';
	const backendUrl = `${BACKEND.replace(/\/$/, '')}/api/${path}${url.search}`;
	const res = await fetch(backendUrl, {
		method: 'POST',
		headers: request.headers,
		body: request.body
	});
	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers: res.headers
	});
};

export const PUT: RequestHandler = async ({ params, url, request }) => {
	const path = params.path || '';
	const backendUrl = `${BACKEND.replace(/\/$/, '')}/api/${path}${url.search}`;
	const res = await fetch(backendUrl, {
		method: 'PUT',
		headers: request.headers,
		body: request.body
	});
	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers: res.headers
	});
};

export const PATCH: RequestHandler = async ({ params, url, request }) => {
	const path = params.path || '';
	const backendUrl = `${BACKEND.replace(/\/$/, '')}/api/${path}${url.search}`;
	const res = await fetch(backendUrl, {
		method: 'PATCH',
		headers: request.headers,
		body: request.body
	});
	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers: res.headers
	});
};

export const DELETE: RequestHandler = async ({ params, url, request }) => {
	const path = params.path || '';
	const backendUrl = `${BACKEND.replace(/\/$/, '')}/api/${path}${url.search}`;
	const res = await fetch(backendUrl, {
		method: 'DELETE',
		headers: request.headers
	});
	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers: res.headers
	});
};
